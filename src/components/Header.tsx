import React from 'react';
import { 
  RefreshCw, 
  Settings, 
  Database, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Printer,
  Calendar
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
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-[0_1px_3px_0_rgba(15,23,42,0.03)]">
      
      {/* Top institutional strip */}
      <div className="bg-navy-950 text-white text-[11px] py-1 px-4 sm:px-8 border-b border-navy-900">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 tracking-wide font-medium text-slate-300">
            <span>PRATHYUSHA ENGINEERING COLLEGE</span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="text-slate-400 text-[10px] hidden sm:inline uppercase tracking-widest font-semibold">
              Autonomous Institution
            </span>
          </div>
          <div className="flex items-center gap-3 text-slate-400 text-[10px]">
            <span className="hidden sm:inline">Affiliated to Anna University</span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="text-blue-300 font-mono">Academic Year 2026–2027</span>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          
          {/* Left: Logo & Titles */}
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-200 p-1 flex items-center justify-center shrink-0 shadow-sm hover:border-slate-300 transition-colors">
              <img 
                src="/pec-logo.svg" 
                alt="Prathyusha Engineering College Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold text-navy-950 tracking-tight leading-tight">
                  Hackathon Analytics
                </h1>
                <span className="bg-slate-100 text-slate-600 text-[10px] font-semibold px-2 py-0.5 rounded border border-slate-200 uppercase tracking-wider">
                  Live BI
                </span>
              </div>
              <p className="text-xs text-slate-500 font-normal mt-0.5">
                Participation, Progress &amp; Achievements | 2026
              </p>
            </div>
          </div>

          {/* Right: Metadata & Actions */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs">
            
            {/* Reporting Period */}
            <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 text-[11px]">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Reporting: <b>Odd Semester 2026</b></span>
            </div>

            {/* Google Sheets Connection Status Badge */}
            <div 
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                syncStatus === 'refreshing'
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : syncStatus === 'error'
                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                  : dataSourceType === 'live-sheets'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-slate-50 text-slate-600 border-slate-200'
              }`}
              title={errorMessage || (dataSourceType === 'live-sheets' ? 'Connected to live Google Sheets' : 'No Google Sheet connected')}
            >
              {syncStatus === 'refreshing' ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" />
                  <span>Syncing...</span>
                </>
              ) : syncStatus === 'error' ? (
                <>
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  <span className="font-semibold">Sync Notice</span>
                </>
              ) : dataSourceType === 'live-sheets' ? (
                <>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="font-semibold">Google Sheets Connected</span>
                </>
              ) : (
                <>
                  <Database className="w-3.5 h-3.5 text-slate-400" />
                  <span>Disconnected</span>
                </>
              )}
            </div>

            {/* Last Updated Timestamp */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Synced: <b className="text-slate-800 font-mono font-semibold">{formatTime(lastUpdated)}</b></span>
              {lastUpdated && <span className="text-slate-400 text-[11px]">({getRelativeTime(lastUpdated)})</span>}
            </div>

            {/* Refresh Now Button */}
            <button
              onClick={onRefresh}
              disabled={syncStatus === 'refreshing'}
              className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 text-navy-900 border border-slate-300 active:bg-slate-100 disabled:opacity-50 text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
              title="Fetch fresh data from Google Sheets immediately"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncStatus === 'refreshing' ? 'animate-spin text-blue-600' : 'text-slate-500'}`} />
              <span>Refresh Now</span>
            </button>

            {/* Settings button */}
            <button
              onClick={onOpenSettings}
              className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors border border-slate-200"
              title="Google Sheet configuration"
            >
              <Settings className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">Settings</span>
            </button>

            {/* Print button */}
            <button
              onClick={() => window.print()}
              className="inline-flex items-center p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
              title="Print official report"
            >
              <Printer className="w-3.5 h-3.5" />
            </button>

          </div>
        </div>

        {/* Sync Error Banner if refresh fails */}
        {syncStatus === 'error' && errorMessage && (
          <div className="mt-3 p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 flex items-start justify-between gap-3 animate-fadeIn">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-rose-900">Google Sheets Sync Notice</p>
                <p className="mt-0.5 text-rose-700">{errorMessage}</p>
                <p className="mt-1 text-[11px] text-slate-600">
                  Displaying last successfully loaded records.
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
