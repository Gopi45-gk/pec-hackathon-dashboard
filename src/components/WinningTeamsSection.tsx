import React, { useState } from 'react';
import { 
  Trophy, 
  Medal, 
  Users, 
  ArrowUpRight, 
  Calendar, 
  ShieldCheck, 
  FileCheck,
  Building2,
  Award,
  Sparkles
} from 'lucide-react';
import { 
  OFFICIAL_DOC_WINNERS, 
  OfficialDocTeamAward, 
  TOTAL_OFFICIAL_DOC_PRIZE, 
  TOTAL_OFFICIAL_DOC_TEAMS 
} from '../data/officialDocWinners';
import { TeamDetailsModal } from './TeamDetailsModal';
import { TeamAwardRecord } from '../types';

interface WinningTeamsSectionProps {
  teamAwards?: TeamAwardRecord[];
}

export const WinningTeamsSection: React.FC<WinningTeamsSectionProps> = () => {
  // Currently selected award for detail modal
  const [selectedAward, setSelectedAward] = useState<OfficialDocTeamAward | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (award: OfficialDocTeamAward) => {
    setSelectedAward(award);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAward(null);
  };

  const getAwardBadge = (position: string) => {
    if (position === 'First Prize') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs">
          <Trophy className="w-3.5 h-3.5 text-amber-600" />
          First Prize
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-300 shadow-2xs">
        <Medal className="w-3.5 h-3.5 text-slate-600" />
        Second Prize
      </span>
    );
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-xl shadow-subtle overflow-hidden">
      
      {/* Institutional Section Header */}
      <div className="p-4 sm:p-5 border-b border-slate-200/90 bg-slate-50/70 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-600" />
            <h3 className="text-base font-bold text-navy-950">
              Winning Teams &amp; Achievements
            </h3>
            <span className="bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold px-2 py-0.5 rounded-full">
              {TOTAL_OFFICIAL_DOC_TEAMS} Verified Team Awards
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Institutional achievements record exclusively from <code className="bg-white px-1 py-0.5 rounded border border-slate-200 text-blue-900 font-semibold font-mono text-[11px]">hackathon 2026.docx</code>
          </p>
        </div>

        {/* Right Summary Badges */}
        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
          {/* Document Verification Badge */}
          <div className="inline-flex items-center gap-1.5 bg-blue-50/80 border border-blue-200 text-blue-900 px-3 py-1.5 rounded-lg text-xs font-medium">
            <FileCheck className="w-3.5 h-3.5 text-blue-700" />
            <span className="hidden sm:inline">Authoritative Doc:</span>
            <span className="font-semibold">hackathon 2026.docx</span>
          </div>

          {/* Total Purse Callout */}
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1.5 rounded-lg text-xs font-semibold">
            <span>Total Prize Purse:</span>
            <span className="font-mono font-bold text-emerald-950 text-sm">
              ₹{TOTAL_OFFICIAL_DOC_PRIZE.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {/* Grid of Clickable Winning Team Cards */}
      <div className="p-4 sm:p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {OFFICIAL_DOC_WINNERS.map((award) => {
            const isFirst = award.awardPosition === 'First Prize';
            const memberCount = award.members.length;

            return (
              <div
                key={award.id}
                onClick={() => handleOpenModal(award)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleOpenModal(award);
                  }
                }}
                className="group relative bg-white border border-slate-200/90 hover:border-blue-400 rounded-xl p-4 shadow-subtle hover:shadow-card hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label={`View team details for ${award.hackathonName}, ${award.awardPosition}, prize ${award.prizeMoneyFormatted}`}
              >
                
                {/* Top: Serial Number & Award Badge */}
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200/60">
                      Award #{award.sNo}
                    </span>
                    {getAwardBadge(award.awardPosition)}
                  </div>

                  {/* Hackathon Name */}
                  <h4 
                    className="text-xs sm:text-sm font-bold text-navy-950 tracking-tight leading-snug group-hover:text-blue-700 transition-colors line-clamp-2 min-h-[2.5rem]" 
                    title={award.hackathonName}
                  >
                    {award.hackathonName}
                  </h4>

                  {/* Event Date */}
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-1 font-medium">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>{award.eventDate}</span>
                  </div>

                  {/* Team Members Preview */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 mb-1.5">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3 text-slate-400" />
                        <span>Team ({memberCount})</span>
                      </span>
                      <span className="text-[10px] text-blue-600 font-bold group-hover:underline flex items-center gap-0.5">
                        Details <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </span>
                    </div>

                    {/* Member names preview */}
                    <div className="space-y-1">
                      {award.members.slice(0, 3).map((m, mIdx) => (
                        <div key={mIdx} className="flex items-center justify-between text-[11px] text-slate-700">
                          <span className="font-semibold truncate max-w-[130px]" title={m.name}>
                            {m.name}
                          </span>
                          {m.deptAndYear && (
                            <span className="text-[10px] font-mono text-slate-400 bg-slate-50 px-1 rounded border border-slate-200/60 shrink-0">
                              {m.deptAndYear}
                            </span>
                          )}
                        </div>
                      ))}

                      {memberCount > 3 && (
                        <p className="text-[10px] font-semibold text-blue-600 pt-0.5">
                          + {memberCount - 3} more {memberCount - 3 === 1 ? 'member' : 'members'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom Bar: Prize Purse & View Team Members Hint */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      Team Prize
                    </span>
                    <span className="text-sm sm:text-base font-black text-emerald-700 font-mono">
                      {award.prizeMoneyFormatted}
                    </span>
                  </div>

                  {/* Clickable Hint Pill */}
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 group-hover:bg-blue-600 group-hover:text-white border border-blue-200 group-hover:border-blue-600 px-2.5 py-1 rounded-lg transition-colors shadow-2xs">
                    <span>View Members</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </span>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Modal for Selected Team */}
      <TeamDetailsModal
        award={selectedAward}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

    </div>
  );
};
