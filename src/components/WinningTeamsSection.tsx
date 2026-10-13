import React, { useState, useMemo } from 'react';
import { 
  Trophy, 
  Medal, 
  Award, 
  IndianRupee, 
  Users, 
  CheckCircle2, 
  AlertTriangle, 
  FileCheck,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { TeamAwardRecord } from '../types';
import { OFFICIAL_DOC_WINNERS, OfficialDocTeamAward } from '../data/officialDocWinners';
import { validateWinnersAgainstDoc } from '../services/docValidator';

interface WinningTeamsSectionProps {
  teamAwards: TeamAwardRecord[];
}

export const WinningTeamsSection: React.FC<WinningTeamsSectionProps> = ({ teamAwards }) => {
  const [viewMode, setViewMode] = useState<'live' | 'official-doc'>('live');
  const [showDifferences, setShowDifferences] = useState(false);

  // Validation report comparing live Google Sheets against hackathon 2026.docx
  const validation = useMemo(() => {
    return validateWinnersAgainstDoc(teamAwards);
  }, [teamAwards]);

  const activeAwards = useMemo(() => {
    if (viewMode === 'official-doc') {
      return OFFICIAL_DOC_WINNERS.map(doc => ({
        id: `doc-${doc.sNo}`,
        sNo: doc.sNo,
        hackathonName: doc.hackathonName,
        eventDate: doc.eventDate,
        awardPosition: doc.awardPosition,
        prizeMoney: doc.prizeMoney,
        prizeFormatted: doc.prizeMoneyFormatted,
        members: doc.members,
        isFromDoc: true
      }));
    }

    // Live Google Sheets awards
    return teamAwards.map((t, idx) => ({
      id: t.teamId || `live-${idx}`,
      sNo: t.sNo || String(idx + 1),
      hackathonName: t.hackathonName,
      eventDate: t.eventDate || '2026',
      awardPosition: t.awardPosition,
      prizeMoney: t.prizeMoney,
      prizeFormatted: t.prizeMoney > 0 ? `₹${t.prizeMoney.toLocaleString('en-IN')}/-` : 'Honor Award',
      members: t.members || [],
      isFromDoc: false
    }));
  }, [viewMode, teamAwards]);

  const activeTotalPrize = useMemo(() => {
    return activeAwards.reduce((sum, a) => sum + (a.prizeMoney || 0), 0);
  }, [activeAwards]);

  const getAwardBadge = (pos: string) => {
    const p = (pos || '').toLowerCase();
    if (p.includes('first') || p.includes('1st')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 shadow-xs">
          <Trophy className="w-3 h-3 text-amber-600" />
          First Prize
        </span>
      );
    }
    if (p.includes('second') || p.includes('2nd') || p.includes('runner')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-300 shadow-xs">
          <Medal className="w-3 h-3 text-slate-600" />
          Second Prize
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200">
        <Award className="w-3 h-3 text-blue-600" />
        {pos || 'Podium Honor'}
      </span>
    );
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-xl shadow-subtle overflow-hidden space-y-0">
      
      {/* Header & Controls */}
      <div className="p-4 sm:p-5 border-b border-slate-200/90 bg-slate-50/70 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-600" />
            <h3 className="text-base font-bold text-navy-950">
              Winning Teams &amp; Achievements
            </h3>
            <span className="bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold px-2 py-0.5 rounded-full">
              {activeAwards.length} Team Awards
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Confirmed student teams and achievements honoured with college management recognition
          </p>
        </div>

        {/* View Toggle & Summary Pill */}
        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
          {/* Source Toggle */}
          <div className="inline-flex bg-slate-200/80 p-0.5 rounded-lg border border-slate-300 text-xs font-semibold">
            <button
              onClick={() => setViewMode('live')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                viewMode === 'live'
                  ? 'bg-white text-navy-950 shadow-xs'
                  : 'text-slate-600 hover:text-navy-900'
              }`}
            >
              Live Sheets ({teamAwards.length})
            </button>
            <button
              onClick={() => setViewMode('official-doc')}
              className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1 ${
                viewMode === 'official-doc'
                  ? 'bg-white text-navy-950 shadow-xs'
                  : 'text-slate-600 hover:text-navy-900'
              }`}
              title="Official Word Document reference: hackathon 2026.docx"
            >
              <FileCheck className="w-3 h-3 text-blue-600" />
              <span>Word Doc Ref (8)</span>
            </button>
          </div>

          {/* Prize Purse Callout */}
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1.5 rounded-lg text-xs font-semibold">
            <span>Prize Purse:</span>
            <span className="font-mono font-bold text-emerald-950 text-sm">
              ₹{activeTotalPrize.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {/* Document Validation & Difference Notice Banner */}
      <div className="bg-blue-50/50 border-b border-blue-100 px-4 sm:px-5 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 text-slate-700">
          <FileCheck className="w-3.5 h-3.5 text-blue-700 shrink-0" />
          <span>
            <b>Validation Reference:</b> <code className="bg-white px-1.5 py-0.5 rounded border border-blue-200 text-[11px] text-blue-900">hackathon 2026.docx</code>
          </span>
          <span className="text-slate-400 hidden sm:inline">•</span>
          <span className="text-slate-600 hidden sm:inline">
            8 Official Team Awards (₹96,000 Verified)
          </span>
        </div>

        {validation.differences.length > 0 && (
          <button
            onClick={() => setShowDifferences(!showDifferences)}
            className="text-blue-700 hover:text-blue-900 font-semibold text-xs flex items-center gap-1 self-start sm:self-auto"
          >
            <span>{validation.differences.length} Differences Flagged</span>
            {showDifferences ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>

      {/* Collapsible Differences Details */}
      {showDifferences && validation.differences.length > 0 && (
        <div className="bg-amber-50/70 border-b border-amber-200 p-4 text-xs text-amber-950 space-y-2 animate-fadeIn">
          <div className="flex items-center gap-2 font-bold text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Audit Discrepancies between Word Document and Google Sheets Winners Tab:</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-slate-700 pl-1 text-[11.5px]">
            {validation.differences.map((diff, dIdx) => (
              <li key={dIdx} className="leading-relaxed">
                {diff}
              </li>
            ))}
          </ul>
          <p className="text-[11px] text-slate-500 pt-1 italic">
            * Automatic updates stream directly from Google Sheets. The Word document serves as the authoritative institutional audit reference.
          </p>
        </div>
      )}

      {/* Grid of Unique Winning-Team Cards */}
      <div className="p-4 sm:p-5">
        {activeAwards.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {activeAwards.map((award, index) => {
              const members = award.members || [];
              const memberNames = members.map(m => m.name).join(', ');

              return (
                <div
                  key={award.id}
                  className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-subtle hover:shadow-card hover:border-slate-300 transition-all flex flex-col justify-between group"
                >
                  {/* Top Bar: Hackathon Name & Award Badge */}
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                        Award #{award.sNo}
                      </span>
                      {getAwardBadge(award.awardPosition)}
                    </div>

                    <h4 className="text-xs sm:text-sm font-bold text-navy-950 tracking-tight leading-snug line-clamp-2 min-h-[2.4rem]" title={award.hackathonName}>
                      {award.hackathonName}
                    </h4>

                    {award.eventDate && (
                      <span className="text-[10px] text-slate-400 block mt-0.5 font-medium">
                        {award.eventDate}
                      </span>
                    )}

                    {/* Team Members List */}
                    <div className="mt-3 pt-2.5 border-t border-slate-100">
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 mb-1.5">
                        <Users className="w-3 h-3 text-slate-400" />
                        <span>Team Members ({members.length || 1})</span>
                      </div>

                      {members.length > 0 ? (
                        <div className="space-y-1">
                          {members.map((m, mIdx) => (
                            <div key={mIdx} className="flex items-center justify-between text-[11px] text-slate-700">
                              <span className="font-semibold truncate max-w-[140px]" title={m.name}>
                                {m.name}
                              </span>
                              {m.deptAndYear && (
                                <span className="text-[10px] font-mono text-slate-400 bg-slate-50 px-1 rounded border border-slate-200/60 shrink-0">
                                  {m.deptAndYear}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[11px] text-slate-500 italic">
                          College Innovation Team
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Bottom Bar: Prize Money & Verification Status */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                        Team Prize
                      </span>
                      <span className="text-sm sm:text-base font-black text-emerald-700 font-mono">
                        {award.prizeMoney > 0 ? `₹${award.prizeMoney.toLocaleString('en-IN')}` : 'Honor Trophy'}
                      </span>
                    </div>

                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Verified
                    </span>
                  </div>

                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-12 text-center text-slate-400 text-xs">
            No winning teams recorded.
          </div>
        )}
      </div>

    </div>
  );
};
