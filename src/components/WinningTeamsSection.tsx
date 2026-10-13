import React from 'react';
import { Trophy, Medal, Award, IndianRupee, Users, CheckCircle2 } from 'lucide-react';
import { TeamAwardRecord } from '../types';

interface WinningTeamsSectionProps {
  teamAwards: TeamAwardRecord[];
}

export const WinningTeamsSection: React.FC<WinningTeamsSectionProps> = ({ teamAwards }) => {
  const totalPrizeMoney = teamAwards.reduce((acc, t) => acc + (t.prizeMoney || 0), 0);

  const getAwardBadge = (pos: string) => {
    switch (pos) {
      case 'First':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
            <Trophy className="w-3 h-3 text-amber-600" />
            First Prize
          </span>
        );
      case 'Second':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-300">
            <Medal className="w-3 h-3 text-slate-600" />
            Second Prize
          </span>
        );
      case 'Third':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
            Third Prize
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200">
            <Award className="w-3 h-3 text-blue-600" />
            {pos || 'Podium Honor'}
          </span>
        );
    }
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-xl shadow-subtle overflow-hidden">
      
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-slate-200/90 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-600" />
            <h3 className="text-base font-bold text-navy-950">
              Winning Teams &amp; Achievements
            </h3>
            <span className="bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold px-2 py-0.5 rounded-full">
              {teamAwards.length} Teams Honoured
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Confirmed student teams and achievements honoured with college management recognition
          </p>
        </div>

        {totalPrizeMoney > 0 && (
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1.5 rounded-lg text-xs font-semibold">
            <span>Total Cash Purse Won:</span>
            <span className="font-mono font-bold text-emerald-900 text-sm">
              ₹{totalPrizeMoney.toLocaleString('en-IN')}
            </span>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <th className="py-3 px-4 w-12 text-center">#</th>
              <th className="py-3 px-4">Hackathon Name</th>
              <th className="py-3 px-4">Award / Position</th>
              <th className="py-3 px-4">Team &amp; Student Members</th>
              <th className="py-3 px-4 text-right">Prize Money</th>
              <th className="py-3 px-4 text-center">Achievement Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {teamAwards.length > 0 ? (
              teamAwards.map((item, index) => {
                const memberListStr = item.members && item.members.length > 0
                  ? item.members.map(m => m.deptAndYear ? `${m.name} (${m.deptAndYear})` : m.name).join(', ')
                  : 'College Innovation Team';

                return (
                  <tr key={item.teamId || index} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 text-center font-medium text-slate-400">
                      {index + 1}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-navy-950 max-w-xs">
                      {item.hackathonName}
                    </td>
                    <td className="py-3.5 px-4">
                      {getAwardBadge(item.awardPosition)}
                    </td>
                    <td className="py-3.5 px-4 max-w-sm">
                      <div className="flex items-start gap-1.5">
                        <Users className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <span className="text-slate-700 font-medium leading-relaxed">
                          {memberListStr}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-700 text-sm whitespace-nowrap">
                      {item.prizeMoney > 0 ? `₹${item.prizeMoney.toLocaleString('en-IN')}` : (
                        <span className="text-slate-400 font-sans font-normal text-xs">Trophy / Certificate</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Confirmed Winner
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                  No winning records recorded in the connected spreadsheet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};
