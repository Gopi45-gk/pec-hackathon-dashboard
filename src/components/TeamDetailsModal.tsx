import React, { useEffect } from 'react';
import { 
  X, 
  Trophy, 
  Medal, 
  Calendar, 
  IndianRupee, 
  Users, 
  GraduationCap, 
  Building2, 
  ShieldCheck, 
  Sparkles,
  Award
} from 'lucide-react';
import { OfficialDocTeamAward } from '../data/officialDocWinners';

interface TeamDetailsModalProps {
  award: OfficialDocTeamAward | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TeamDetailsModal: React.FC<TeamDetailsModalProps> = ({
  award,
  isOpen,
  onClose
}) => {
  // Handle escape key to close modal
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    // Lock body scroll
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen || !award) return null;

  const isFirstPrize = award.awardPosition === 'First Prize';

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-navy-950/60 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="team-modal-title"
    >
      {/* Modal Card */}
      <div 
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-elevated border border-slate-200 overflow-hidden transform transition-all animate-fadeIn my-auto"
        onClick={(e) => e.stopPropagation()} // Prevent close on card content click
      >
        
        {/* Header Ribbon / Banner */}
        <div className={`p-5 sm:p-6 border-b ${
          isFirstPrize 
            ? 'bg-gradient-to-r from-amber-50 via-amber-100/50 to-orange-50/40 border-amber-200/80' 
            : 'bg-gradient-to-r from-slate-50 via-blue-50/40 to-slate-100/60 border-slate-200'
        }`}>
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-white/80 text-navy-900 border border-slate-200 shadow-xs">
                  Award #{award.sNo}
                </span>

                {isFirstPrize ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-white shadow-xs">
                    <Trophy className="w-3.5 h-3.5 text-amber-100" />
                    First Prize
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-700 text-white shadow-xs">
                    <Medal className="w-3.5 h-3.5 text-slate-200" />
                    Second Prize
                  </span>
                )}

                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full border border-emerald-300">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  Official Register
                </span>
              </div>

              <h3 
                id="team-modal-title"
                className="text-lg sm:text-xl font-black text-navy-950 tracking-tight leading-snug pt-2"
              >
                {award.hackathonName}
              </h3>

              <div className="flex items-center gap-2 text-xs text-slate-600 pt-1 font-medium">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>Date: <b>{award.eventDate}</b></span>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-navy-950 hover:bg-white/80 rounded-xl transition-colors border border-transparent hover:border-slate-200 shadow-xs shrink-0"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Prize Money Callout Bar */}
        <div className="bg-slate-50/90 border-b border-slate-200 px-5 sm:px-6 py-3.5 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">
              Total Team Prize Purse
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-xl sm:text-2xl font-black font-mono text-emerald-700">
                {award.prizeMoneyFormatted}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                (for full team)
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">
              Team Size
            </span>
            <span className="text-sm sm:text-base font-bold text-navy-900 font-mono">
              {award.members.length} {award.members.length === 1 ? 'Student' : 'Students'}
            </span>
          </div>
        </div>

        {/* Modal Body: Team Members List */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[50vh] sm:max-h-[55vh] overflow-y-auto">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-blue-700" />
              <span>Winning Team Members</span>
            </h4>
            <span className="text-[11px] text-slate-500">
              Prathyusha Engineering College
            </span>
          </div>

          <div className="space-y-2.5">
            {award.members.map((member, idx) => (
              <div 
                key={idx}
                className="p-3 sm:p-3.5 bg-slate-50 hover:bg-blue-50/40 rounded-xl border border-slate-200/90 transition-colors flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Member Index Avatar */}
                  <div className="w-8 h-8 rounded-lg bg-navy-950 text-white font-mono text-xs font-bold flex items-center justify-center shrink-0 shadow-xs group-hover:bg-blue-700 transition-colors">
                    0{idx + 1}
                  </div>

                  {/* Student Name */}
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-navy-950 truncate" title={member.name}>
                      {member.name}
                    </p>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Student Participant
                    </p>
                  </div>
                </div>

                {/* Department and Academic Year */}
                <div className="text-right shrink-0">
                  {member.deptAndYear ? (
                    <div className="flex flex-col items-end gap-1">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold font-mono text-navy-900 bg-white px-2 py-0.5 rounded border border-slate-200 shadow-2xs">
                        <Building2 className="w-3 h-3 text-blue-600" />
                        {member.deptAndYear}
                      </span>
                      {member.academicYear && (
                        <span className="text-[10px] text-slate-500 font-medium">
                          Year {member.academicYear}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-[11px] text-slate-400 italic">
                      Institutional Entry
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Validation Footnote */}
          <div className="pt-2 text-[11px] text-slate-500 bg-slate-100/60 p-3 rounded-lg border border-slate-200/60 flex items-start gap-2">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Official winning achievement validated against <code className="text-navy-900 font-semibold">hackathon 2026.docx</code>. Prize money of {award.prizeMoneyFormatted} is allocated once to the entire team without double-counting.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between gap-3">
          <span className="text-[11px] text-slate-500 hidden sm:inline">
            Press <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-300 font-mono text-[10px] text-slate-700 shadow-2xs">ESC</kbd> or click outside to dismiss
          </span>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 text-xs font-bold text-navy-950 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg shadow-xs transition-colors ml-auto focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Close Details
          </button>
        </div>

      </div>
    </div>
  );
};
