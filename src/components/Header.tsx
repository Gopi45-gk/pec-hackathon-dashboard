import React from 'react';
import { 
  RefreshCw, 
  Settings, 
  Database, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  FileSpreadsheet, 
  Building2,
  Printer
} from 'lucide-react';
import { SheetConnectionConfig } from '../types';

interface HeaderProps {
  lastUpdated: Date | null;
  syncStatus: 'connected' | 'refreshing' | 'error' | 'idle';
  dataSourceType: 'live-sheets' | 'fallback-data';
  errorMessage: string | null;
  onRefresh: () => void;
  onOpenSettings: () => void;
  connectionConfig: SheetConnectionConfig;
}

export const Header: React.FC<HeaderProps> = ({
  lastUpdated,
  syncStatus,
  dataSourceType,
  errorMessage,
  onRefresh,
  onOpenSettings,
  connectionConfig
}) => {
  const formatTime = (date: Date | null) => {
    if (!date) return 'Not yet synced';
    return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  };

  const getRelativeTime = (date: Date | null) => {
    if (!date) return '';
    const diffSec = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (diffSec < 5) return 'Just now';
    if (diffSec < 60) return `${diffSec}s ago`;
    const diffMin = Math.floor(diffSec / 60);
    return `${diffMin}m ago`;
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-subtle">
      {/* Top institution bar */}
      <div className="bg-navy-900 text-white text-xs py-1.5 px-4 sm:px-8 border-b border-navy-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 tracking-wide font-medium">
            <Building2 className="w-3.5 h-3.5 text-blue-300" />
            <span>PRATHYUSHA ENGINEERING COLLEGE</span>
            <span className="text-navy-300 font-light hidden sm:inline">|</span>
            <span className="text-navy-200 hidden sm:inline">AN AUTONOMOUS INSTITUTION</span>
          </div>
          <div className="flex items-center gap-4 text-navy-200 text-[11px]">
            <span className="bg-navy-800 px-2 py-0.5 rounded text-blue-200 border border-navy-700">
              Odd Semester · Academic Year 2026–2027
            </span>
            <span className="hidden md:inline">Research Day Achievement Cycle</span>
          </div>
        </div>
      </div>

      {/* Main dashboard navigation header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 sm:py-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          
          {/* Title and subtitle */}
          <div>
            <div className="flex items-center gap-2.5">
              <span className="bg-blue-50 text-pec-blue border border-blue-200 p-2 rounded-lg font-bold text-lg shadow-sm">
                PEC
              </span>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-navy-950 tracking-tight leading-tight">
                  PEC – HACKATHON PARTICIPATION & WINNERS DASHBOARD 2026
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 font-normal mt-0.5">
                  Single Source of Truth: Live Google Sheets · Automated Real-time Synchronization
                </p>
              </div>
            </div>
          </div>

          {/* Action controls & sync badge */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            
            {/* Live Data Source Status Badge */}
            <div 
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                syncStatus === 'refreshing'
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : syncStatus === 'error'
                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                  : dataSourceType === 'live-sheets'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}
              title={errorMessage || (dataSourceType === 'live-sheets' ? 'Connected to live Google Sheets' : 'Using verified PEC records (Connect your Google Sheet ID)')}
            >
              {syncStatus === 'refreshing' ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" />
                  <span>Refreshing Data...</span>
                </>
              ) : syncStatus === 'error' ? (
                <>
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  <span className="font-semibold">Sync Error (Using Cache)</span>
                </>
              ) : dataSourceType === 'live-sheets' ? (
                <>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Google Sheets Connected</span>
                </>
              ) : (
                <>
                  <Database className="w-3.5 h-3.5 text-amber-600" />
                  <span>Verified PEC Records (Snapshot)</span>
                </>
              )}
            </div>

            {/* Last updated timestamp */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 px-2.5 py-1.5 rounded-md border border-slate-200">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Synced: <b className="text-slate-700 font-semibold">{formatTime(lastUpdated)}</b></span>
              {lastUpdated && <span className="text-slate-400">({getRelativeTime(lastUpdated)})</span>}
            </div>

            {/* Refresh Now Button */}
            <button
              onClick={onRefresh}
              disabled={syncStatus === 'refreshing'}
              className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 text-navy-800 border border-slate-300 active:bg-slate-100 disabled:opacity-50 text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
              title="Fetch fresh data from Google Sheets immediately"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncStatus === 'refreshing' ? 'animate-spin text-blue-600' : 'text-slate-600'}`} />
              <span>Refresh Now</span>
            </button>

            {/* Connection Settings Button */}
            <button
              onClick={onOpenSettings}
              className="inline-flex items-center gap-1.5 bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
              title="Configure Google Spreadsheet ID, Tab Names, and Refresh Interval"
            >
              <Settings className="w-3.5 h-3.5 text-blue-300" />
              <span className="hidden sm:inline">Sheet Setup</span>
              <span className="sm:hidden">Setup</span>
            </button>

            {/* Print action */}
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium px-2.5 py-1.5 rounded-lg transition-colors border border-slate-200"
              title="Print official dashboard report"
            >
              <Printer className="w-3.5 h-3.5" />
            </button>

          </div>
        </div>

        {/* Sync Error Banner if refresh fails (preserves existing data view) */}
        {syncStatus === 'error' && errorMessage && (
          <div className="mt-3 p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 flex items-start justify-between gap-3 animate-fadeIn">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-rose-900">Google Sheets Sync Notice</p>
                <p className="mt-0.5 text-rose-700">{errorMessage}</p>
                <p className="mt-1 text-[11px] text-slate-600">
                  Note: Preserving the last successfully loaded records. Check that your Google Sheet has "Anyone with the link can view" enabled, or verify the Sheet ID in Settings.
                </p>
              </div>
            </div>
            <button
              onClick={onOpenSettings}
              className="text-xs font-medium underline text-rose-900 hover:text-rose-950 shrink-0"
            >
              Check Sheet ID
            </button>
          </div>
        )}

      </div>
    </header>
  );
};
