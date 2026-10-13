import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Header 
} from './components/Header';
import { 
  KpiCards 
} from './components/KpiCards';
import { 
  GlobalFilters 
} from './components/GlobalFilters';
import { 
  ChartsSection 
} from './components/ChartsSection';
import { 
  WinnersTable 
} from './components/WinnersTable';
import { 
  ParticipationTable 
} from './components/ParticipationTable';
import { 
  DataQualityAudit 
} from './components/DataQualityAudit';
import { 
  ConnectionSettingsModal 
} from './components/ConnectionSettingsModal';
import { 
  SplashScreen 
} from './components/SplashScreen';
import { 
  WinnersView 
} from './components/WinnersView';
import { 
  syncGoogleSheetData, 
  fetchGoogleSheetViaGviz,
  fetchGoogleSheetViaCsv,
  calculateDashboardMetrics 
} from './services/googleSheets';
import { 
  ParticipationRecord, 
  StudentWinnerRecord, 
  TeamAwardRecord, 
  DashboardMetrics, 
  DataAuditReport, 
  SheetConnectionConfig, 
  GlobalFilterState 
} from './types';
import { 
  LayoutDashboard, 
  Layers, 
  Trophy, 
  BarChart3, 
  ShieldCheck, 
  RefreshCw,
  ExternalLink,
  Info
} from 'lucide-react';

const STORAGE_KEY_CONFIG = 'pec_hackathon_connection_config_v1';

export const App: React.FC = () => {
  // Navigation active tab: 1. Overview, 2. Participation, 3. Winners & Awards, 4. Analytics, 5. Data Quality
  const [activeTab, setActiveTab] = useState<'overview' | 'participation' | 'winners' | 'analytics' | 'audit'>('overview');

  // Initial visit college branded splash screen (1.8-2.5s duration, session-persisted)
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
      participationTabName: import.meta.env.VITE_PARTICIPATION_SHEET_NAME || 'Participation',
      winnersTabName: import.meta.env.VITE_WINNERS_SHEET_NAME || 'Winners',
      connectionMode: (import.meta.env.VITE_CONNECTION_MODE as any) || 'gviz',
      gasWebAppUrl: import.meta.env.VITE_GAS_WEBAPP_URL || '',
      autoRefreshInterval: Number(import.meta.env.VITE_AUTO_REFRESH_INTERVAL || 30),
      isCustomConfigured: !!import.meta.env.VITE_GOOGLE_SHEETS_ID
    };
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

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
    uniqueWinningTeams: 0
  });

  const [auditReport, setAuditReport] = useState<DataAuditReport>({
    hasParticipationTotalRow: false,
    calculatedParticipationExpectedTeams: 0,
    calculatedParticipationRegisteredTeams: 0,
    calculatedParticipationExpectedStudents: 0,
    calculatedParticipationActualStudents: 0,
    hasWinnersTotalRow: false,
    calculatedPrizeMoney: 0,
    participationDiscrepancies: [],
    winnerDiscrepancies: [],
    dataQualityWarnings: []
  });

  const [syncStatus, setSyncStatus] = useState<'connected' | 'refreshing' | 'error' | 'idle'>('idle');
  const [dataSourceType, setDataSourceType] = useState<'live-sheets' | 'fallback-data'>('fallback-data');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Global filters state
  const [filters, setFilters] = useState<GlobalFilterState>({
    searchQuery: '',
    hackathon: 'All',
    status: 'All',
    department: 'All',
    academicYear: 'All',
    awardPosition: 'All',
    dateRange: 'All'
  });

  // Load and synchronize data from Google Sheets
  const loadData = useCallback(async (isSilent = false) => {
    if (!isSilent) setSyncStatus('refreshing');
    
    try {
      const result = await syncGoogleSheetData(connectionConfig);
      
      setParticipation(result.participation);
      setStudentWinners(result.studentWinners);
      setTeamAwards(result.teamAwards);
      setMetrics(result.metrics);
      setAuditReport(result.audit);
      setDataSourceType(result.source);
      setLastUpdated(result.timestamp);
      setSyncStatus('connected');
      setErrorMessage(null);
    } catch (err: any) {
      console.error('Google Sheets sync error:', err);
      setSyncStatus('error');
      setErrorMessage(err.message || 'Failed to sync with Google Sheets.');
      // Important: Retain last successfully loaded data per Section 3
    }
  }, [connectionConfig]);

  // Initial fetch on mount
  useEffect(() => {
    loadData(false);
  }, [loadData]);

  // Auto-refresh timer (respects tab visibility to avoid redundant network traffic)
  useEffect(() => {
    if (connectionConfig.autoRefreshInterval <= 0) return;

    const intervalMs = connectionConfig.autoRefreshInterval * 1000;
    const intervalId = setInterval(() => {
      // Avoid excessive requests when tab is inactive
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
    // Trigger immediate reload
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

  // Filter options derived dynamically from dataset
  const hackathonOptions = useMemo(() => {
    const set = new Set<string>();
    participation.forEach(p => set.add(p.title));
    studentWinners.forEach(s => set.add(s.hackathonName));
    return Array.from(set).sort();
  }, [participation, studentWinners]);

  const departmentOptions = useMemo(() => {
    const set = new Set<string>();
    studentWinners.forEach(s => {
      if (s.department && s.department !== 'General') set.add(s.department);
    });
    return Array.from(set).sort();
  }, [studentWinners]);

  const yearOptions = useMemo(() => {
    const set = new Set<string>();
    studentWinners.forEach(s => {
      if (s.academicYear && s.academicYear !== 'N/A') set.add(s.academicYear);
    });
    return Array.from(set).sort();
  }, [studentWinners]);

  // Filtered datasets for active view
  const filteredParticipation = useMemo(() => {
    return participation.filter(item => {
      const q = filters.searchQuery.toLowerCase().trim();
      const matchesSearch = !q || item.title.toLowerCase().includes(q) || item.statusWon.toLowerCase().includes(q);
      const matchesHackathon = filters.hackathon === 'All' || item.title === filters.hackathon;
      const matchesStatus = filters.status === 'All' || item.derivedStatus === filters.status;
      return matchesSearch && matchesHackathon && matchesStatus;
    });
  }, [participation, filters]);

  const filteredStudentWinners = useMemo(() => {
    return studentWinners.filter(item => {
      const q = filters.searchQuery.toLowerCase().trim();
      const matchesSearch = !q || item.studentName.toLowerCase().includes(q) || item.hackathonName.toLowerCase().includes(q);
      const matchesHackathon = filters.hackathon === 'All' || item.hackathonName === filters.hackathon;
      const matchesDept = filters.department === 'All' || item.department.toUpperCase() === filters.department.toUpperCase();
      const matchesYear = filters.academicYear === 'All' || item.academicYear === filters.academicYear;
      const matchesAward = filters.awardPosition === 'All' || item.awardPosition === filters.awardPosition;
      return matchesSearch && matchesHackathon && matchesDept && matchesYear && matchesAward;
    });
  }, [studentWinners, filters]);

  const filteredTeamAwards = useMemo(() => {
    return teamAwards.filter(item => {
      const q = filters.searchQuery.toLowerCase().trim();
      const matchesSearch = !q || item.hackathonName.toLowerCase().includes(q) || item.members.some(m => m.name.toLowerCase().includes(q));
      const matchesHackathon = filters.hackathon === 'All' || item.hackathonName === filters.hackathon;
      const matchesDept = filters.department === 'All' || item.members.some(m => m.department.toUpperCase() === filters.department.toUpperCase());
      const matchesYear = filters.academicYear === 'All' || item.members.some(m => m.academicYear === filters.academicYear);
      const matchesAward = filters.awardPosition === 'All' || item.awardPosition === filters.awardPosition;
      return matchesSearch && matchesHackathon && matchesDept && matchesYear && matchesAward;
    });
  }, [teamAwards, filters]);

  // Dynamically recalculated KPIs for filtered dataset
  const activeMetrics = useMemo(() => {
    return calculateDashboardMetrics(filteredParticipation, filteredStudentWinners, filteredTeamAwards);
  }, [filteredParticipation, filteredStudentWinners, filteredTeamAwards]);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      
      {/* 0. College-Branded Splash Screen (Initial Entry Only) */}
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

      {/* 1. Header */}
      <Header
        lastUpdated={lastUpdated}
        syncStatus={syncStatus}
        dataSourceType={dataSourceType}
        errorMessage={errorMessage}
        onRefresh={() => loadData(false)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        connectionConfig={connectionConfig}
      />

      {/* 2. Navigation Bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <nav className="flex space-x-1 sm:space-x-4 overflow-x-auto py-2">
            
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeTab === 'overview'
                  ? 'bg-navy-950 text-white shadow-sm'
                  : 'text-slate-600 hover:text-navy-900 hover:bg-slate-100'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('participation')}
              className={`flex items-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeTab === 'participation'
                  ? 'bg-navy-950 text-white shadow-sm'
                  : 'text-slate-600 hover:text-navy-900 hover:bg-slate-100'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Participation ({participation.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('winners')}
              className={`flex items-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeTab === 'winners'
                  ? 'bg-navy-950 text-white shadow-sm'
                  : 'text-slate-600 hover:text-navy-900 hover:bg-slate-100'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Winners & Awards ({teamAwards.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeTab === 'analytics'
                  ? 'bg-navy-950 text-white shadow-sm'
                  : 'text-slate-600 hover:text-navy-900 hover:bg-slate-100'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Analytics</span>
            </button>

            <button
              onClick={() => setActiveTab('audit')}
              className={`flex items-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeTab === 'audit'
                  ? 'bg-navy-950 text-white shadow-sm'
                  : 'text-slate-600 hover:text-navy-900 hover:bg-slate-100'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Data Quality</span>
            </button>

          </nav>
        </div>
      </div>

      {/* 3. Main Dashboard Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-6 w-full flex-1 space-y-6">
        
        {/* Global Filter Bar */}
        <GlobalFilters
          filters={filters}
          onChange={setFilters}
          hackathonOptions={hackathonOptions}
          departmentOptions={departmentOptions}
          yearOptions={yearOptions}
        />

        {/* Dynamic KPI Metric Cards */}
        <KpiCards metrics={activeMetrics} />

        {/* Data Quality & Discrepancy Status Card (Collapsible in overview) */}
        {auditReport.participationDiscrepancies.length > 0 || auditReport.winnerDiscrepancies.length > 0 ? (
          <DataQualityAudit
            audit={auditReport}
            totalHackathonCount={participation.length}
            totalTeamAwardsCount={teamAwards.length}
            totalStudentWinnersCount={studentWinners.length}
          />
        ) : null}

        {/* Tab-Specific Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            
            {/* Quick Analytics Highlights */}
            <ChartsSection
              participation={filteredParticipation}
              studentWinners={filteredStudentWinners}
              teamAwards={filteredTeamAwards}
            />

            {/* Side-by-side Top Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-navy-950 uppercase tracking-wider flex items-center gap-1.5">
                    <Trophy className="w-4 h-4 text-amber-600" />
                    <span>Recent Winners Honoured</span>
                  </h3>
                  <button 
                    onClick={() => setActiveTab('winners')}
                    className="text-xs text-pec-blue hover:underline font-semibold"
                  >
                    View All {teamAwards.length} Wins &rarr;
                  </button>
                </div>
                <WinnersTable
                  studentWinners={filteredStudentWinners.slice(0, 5)}
                  teamAwards={filteredTeamAwards.slice(0, 5)}
                  searchQuery={filters.searchQuery}
                  departmentFilter={filters.department}
                  yearFilter={filters.academicYear}
                  awardFilter={filters.awardPosition}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-navy-950 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-pec-blue" />
                    <span>Active Hackathon Events</span>
                  </h3>
                  <button 
                    onClick={() => setActiveTab('participation')}
                    className="text-xs text-pec-blue hover:underline font-semibold"
                  >
                    View All {participation.length} Events &rarr;
                  </button>
                </div>
                <ParticipationTable
                  participation={filteredParticipation.slice(0, 5)}
                  searchQuery={filters.searchQuery}
                  statusFilter={filters.status}
                />
              </div>
            </div>

          </div>
        )}

        {activeTab === 'participation' && (
          <div className="space-y-6">
            <ParticipationTable
              participation={filteredParticipation}
              searchQuery={filters.searchQuery}
              statusFilter={filters.status}
            />
          </div>
        )}

        {activeTab === 'winners' && (
          <div className="space-y-6">
            <WinnersView
              studentWinners={filteredStudentWinners}
              teamAwards={filteredTeamAwards}
              metrics={activeMetrics}
              searchQuery={filters.searchQuery}
              departmentFilter={filters.department}
              yearFilter={filters.academicYear}
              awardFilter={filters.awardPosition}
            />
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <ChartsSection
              participation={filteredParticipation}
              studentWinners={filteredStudentWinners}
              teamAwards={filteredTeamAwards}
            />
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="space-y-6">
            <DataQualityAudit
              audit={auditReport}
              totalHackathonCount={participation.length}
              totalTeamAwardsCount={teamAwards.length}
              totalStudentWinnersCount={studentWinners.length}
            />

            {/* Google Sheets Connection Info */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-subtle text-xs space-y-3">
              <h4 className="font-bold text-navy-950 text-sm flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-pec-blue" />
                Live Single Source of Truth Configuration
              </h4>
              <p className="text-slate-600">
                Current Spreadsheet Mode: <b className="text-navy-900">{connectionConfig.connectionMode.toUpperCase()}</b>
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-700 font-mono text-[11px]">
                <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                  <span className="font-sans block text-slate-500 font-bold">Configured Sheet ID:</span>
                  {connectionConfig.spreadsheetId || '(Using default PEC verified records)'}
                </div>
                <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                  <span className="font-sans block text-slate-500 font-bold">Auto-Refresh Interval:</span>
                  {connectionConfig.autoRefreshInterval > 0 ? `${connectionConfig.autoRefreshInterval} seconds` : 'Disabled (Manual)'}
                </div>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="px-3.5 py-2 bg-navy-900 text-white font-semibold rounded-lg hover:bg-navy-800 transition-colors"
                >
                  Configure / Change Spreadsheet
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* 4. Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <b className="text-navy-950">Prathyusha Engineering College</b> · Autonomous Institution · Hackathons Dashboard 2026
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>ODD Semester 2026–2027</span>
            <span>•</span>
            <span>Single Source: Google Sheets</span>
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
