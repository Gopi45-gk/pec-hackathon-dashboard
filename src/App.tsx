import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { KpiCards } from './components/KpiCards';
import { MinimalCharts } from './components/MinimalCharts';
import { UpcomingHackathons } from './components/UpcomingHackathons';
import { WinningTeamsSection } from './components/WinningTeamsSection';
import { ParticipationTable } from './components/ParticipationTable';
import { ConnectionSettingsModal } from './components/ConnectionSettingsModal';
import { SplashScreen } from './components/SplashScreen';
import { 
  syncGoogleSheetData, 
  fetchGoogleSheetViaGviz,
  fetchGoogleSheetViaCsv 
} from './services/googleSheets';
import { 
  ParticipationRecord, 
  StudentWinnerRecord, 
  TeamAwardRecord, 
  DashboardMetrics, 
  SheetConnectionConfig 
} from './types';
import { ChevronDown, ChevronUp, FileText, ShieldCheck } from 'lucide-react';

const STORAGE_KEY_CONFIG = 'pec_hackathon_connection_config_v1';

export const App: React.FC = () => {
  // Splash screen state (shows once per session, does not repeat on background refresh)
  const [showSplash, setShowSplash] = useState<boolean>(() => {
    try {
      return !sessionStorage.getItem('pec_splash_shown_v1');
    } catch {
      return true;
    }
  });

  // Connection config state (loads from localStorage or vite env defaults)
  const [connectionConfig, setConnectionConfig] = useState<SheetConnectionConfig>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_CONFIG);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      spreadsheetId: import.meta.env.VITE_GOOGLE_SHEETS_ID || '',
      participationTabName: import.meta.env.VITE_PARTICIPATION_SHEET_NAME || 'overall report',
      winnersTabName: import.meta.env.VITE_WINNERS_SHEET_NAME || 'Winners',
      connectionMode: (import.meta.env.VITE_CONNECTION_MODE as any) || 'csv',
      gasWebAppUrl: import.meta.env.VITE_GAS_WEBAPP_URL || '',
      autoRefreshInterval: Number(import.meta.env.VITE_AUTO_REFRESH_INTERVAL || 60),
      isCustomConfigured: !!import.meta.env.VITE_GOOGLE_SHEETS_ID
    };
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [showAllRegister, setShowAllRegister] = useState<boolean>(false);

  // Data state
  const [participation, setParticipation] = useState<ParticipationRecord[]>([]);
  const [studentWinners, setStudentWinners] = useState<StudentWinnerRecord[]>([]);
  const [teamAwards, setTeamAwards] = useState<TeamAwardRecord[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalHackathons: 0,
    totalExpectedTeams: 0,
    totalRegisteredTeams: 0,
    totalExpectedStudents: 0,
    totalParticipatingStudents: 0,
    studentParticipationPercentage: 0,
    registeredPendingHackathons: 0,
    completedHackathons: 0,
    shortlistedHackathons: 0,
    hackathonsWithAwards: 0,
    totalAwardRecords: 0,
    totalFirstPrizes: 0,
    totalSecondPrizes: 0,
    totalThirdPrizes: 0,
    totalPrizeMoney: 0,
    uniqueWinningStudents: 0,
    hackathonsWithWinningTeams: 0,
    uniqueWinningTeams: 0,
    departmentsCount: 0,
    departmentList: [],
    yetToParticipateHackathons: 0
  });

  const [syncStatus, setSyncStatus] = useState<'connected' | 'refreshing' | 'error' | 'idle'>('idle');
  const [dataSourceType, setDataSourceType] = useState<'live-sheets' | 'fallback-data'>('live-sheets');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load and synchronize data from Google Sheets
  const loadData = useCallback(async (isSilent = false) => {
    if (!isSilent) setSyncStatus('refreshing');
    
    try {
      const result = await syncGoogleSheetData(connectionConfig);
      
      setParticipation(result.participation);
      setStudentWinners(result.studentWinners);
      setTeamAwards(result.teamAwards);
      setMetrics(result.metrics);
      setDataSourceType(result.source);
      setLastUpdated(result.timestamp);
      setSyncStatus('connected');
      setErrorMessage(null);
    } catch (err: any) {
      console.error('Google Sheets sync error:', err);
      setSyncStatus('error');
      setErrorMessage(err.message || 'Failed to sync with Google Sheets.');
    }
  }, [connectionConfig]);

  // Initial fetch on mount
  useEffect(() => {
    loadData(false);
  }, [loadData]);

  // Auto-refresh timer (60 seconds, respects tab visibility)
  useEffect(() => {
    if (connectionConfig.autoRefreshInterval <= 0) return;

    const intervalMs = connectionConfig.autoRefreshInterval * 1000;
    const intervalId = setInterval(() => {
      if (document.visibilityState === 'visible') {
        loadData(true);
      }
    }, intervalMs);

    return () => clearInterval(intervalId);
  }, [connectionConfig.autoRefreshInterval, loadData]);

  // Save updated config
  const handleSaveConfig = (newConfig: SheetConnectionConfig) => {
    setConnectionConfig(newConfig);
    localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(newConfig));
    setTimeout(() => {
      loadData(false);
    }, 100);
  };

  // Test connection utility for modal
  const handleTestConnection = async (testConfig: SheetConnectionConfig) => {
    try {
      if (testConfig.connectionMode === 'csv') {
        const rows = await fetchGoogleSheetViaCsv(testConfig.spreadsheetId, testConfig.participationTabName);
        return {
          success: true,
          message: `Connected successfully! Found ${rows.length} rows in "${testConfig.participationTabName}".`,
          rowCount: rows.length
        };
      } else {
        const rows = await fetchGoogleSheetViaGviz(testConfig.spreadsheetId, testConfig.participationTabName);
        return {
          success: true,
          message: `Connected successfully via Google Visualization API! Found ${rows.length} rows in "${testConfig.participationTabName}".`,
          rowCount: rows.length
        };
      }
    } catch (e: any) {
      return {
        success: false,
        message: e.message || 'Unable to read data from Google Sheet. Check permissions and tab names.'
      };
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans text-slate-800">
      
      {/* 1. College-Branded Splash Screen (Initial Entry Only) */}
      {showSplash && (
        <SplashScreen 
          onComplete={() => {
            setShowSplash(false);
            try {
              sessionStorage.setItem('pec_splash_shown_v1', 'true');
            } catch {}
          }} 
        />
      )}

      {/* 2. Header */}
      <Header
        lastUpdated={lastUpdated}
        syncStatus={syncStatus}
        dataSourceType={dataSourceType}
        errorMessage={errorMessage}
        onRefresh={() => loadData(false)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        connectionConfig={connectionConfig}
      />

      {/* 3. Main Dashboard Body (Only Essential Information) */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-6 w-full flex-1 space-y-6">
        
        {/* Six Main KPI Cards */}
        <section aria-label="Essential Performance Indicators">
          <KpiCards metrics={metrics} />
        </section>

        {/* Minimal Charts (Only Two Charts) */}
        <section aria-label="Visual Analytics">
          <MinimalCharts 
            participation={participation} 
            teamAwards={teamAwards} 
          />
        </section>

        {/* Compact Section: Upcoming Hackathons (Registered / Pending Participation) */}
        <section aria-label="Upcoming Hackathons">
          <UpcomingHackathons participation={participation} />
        </section>

        {/* Compact Section: Winning Teams & Achievements */}
        <section aria-label="Winning Teams and Achievements">
          <WinningTeamsSection teamAwards={teamAwards} />
        </section>

        {/* Optional Collapsible Register: Full Institutional Hackathon Log (63 Records) */}
        <section className="bg-white border border-slate-200/90 rounded-xl shadow-subtle overflow-hidden">
          <button
            onClick={() => setShowAllRegister(!showAllRegister)}
            className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-slate-50/60 transition-colors focus:outline-none"
          >
            <div className="flex items-center gap-2.5">
              <FileText className="w-4 h-4 text-blue-700" />
              <div>
                <h4 className="text-sm font-bold text-navy-950">
                  Complete Institutional Hackathon Register ({participation.length} Events)
                </h4>
                <p className="text-xs text-slate-500">
                  Detailed institutional log of all expected vs registered teams, actual students, and review milestones
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-700">
              <span>{showAllRegister ? 'Hide Full Register' : 'View Full Register'}</span>
              {showAllRegister ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </button>

          {showAllRegister && (
            <div className="border-t border-slate-200/90 p-4 sm:p-5">
              <ParticipationTable
                participation={participation}
                searchQuery=""
                statusFilter="All"
              />
            </div>
          )}
        </section>

      </main>

      {/* 4. Institutional Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-navy-950">Prathyusha Engineering College</span>
            <span className="text-slate-400">•</span>
            <span>Autonomous Institution</span>
            <span className="text-slate-400">•</span>
            <span>Academic Year 2026–2027</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400 font-mono text-[11px]">
            <span className="inline-flex items-center gap-1 text-emerald-700 font-sans font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              Live Google Sheets Source
            </span>
            <span>•</span>
            <span>Auto-Refresh: {connectionConfig.autoRefreshInterval}s</span>
          </div>
        </div>
      </footer>

      {/* 5. Connection Settings Modal */}
      <ConnectionSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={connectionConfig}
        onSave={handleSaveConfig}
        onTestConnection={handleTestConnection}
      />

    </div>
  );
};

export default App;
