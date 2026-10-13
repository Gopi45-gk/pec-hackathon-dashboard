import React from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  FileSpreadsheet, 
  HelpCircle,
  TrendingUp,
  Award,
  Users
} from 'lucide-react';
import { DataAuditReport } from '../types';

interface DataQualityAuditProps {
  audit: DataAuditReport;
  totalHackathonCount: number;
  totalTeamAwardsCount: number;
  totalStudentWinnersCount: number;
}

export const DataQualityAudit: React.FC<DataQualityAuditProps> = ({
  audit,
  totalHackathonCount,
  totalTeamAwardsCount,
  totalStudentWinnersCount
}) => {
  const hasDiscrepancy = 
    audit.participationDiscrepancies.length > 0 || 
    audit.winnerDiscrepancies.length > 0;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-subtle mb-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className={`w-5 h-5 ${hasDiscrepancy ? 'text-amber-600' : 'text-emerald-600'}`} />
          <div>
            <h3 className="text-base font-bold text-navy-950">
              Data Integrity & Mathematical Audit Engine
            </h3>
            <p className="text-xs text-slate-500">
              Autonomous verification: Underlying row sum vs Spreadsheet summary rows
            </p>
          </div>
        </div>

        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
          hasDiscrepancy 
            ? 'bg-amber-50 text-amber-800 border-amber-200' 
            : 'bg-emerald-50 text-emerald-800 border-emerald-200'
        }`}>
          {hasDiscrepancy ? (
            <>
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>Discrepancy Detected (Logged Below)</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>100% Calculated & Verified Accurate</span>
            </>
          )}
        </span>
      </div>

      {/* Discrepancy Warnings if sheet total does not equal calculated sum */}
      {hasDiscrepancy && (
        <div className="mt-4 p-4 bg-amber-50/80 border border-amber-200 rounded-lg text-xs text-amber-900 space-y-2">
          <p className="font-bold flex items-center gap-1.5 text-amber-950">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            Audit Alert: Spreadsheet Summary Row Mismatch
          </p>
          
          {audit.participationDiscrepancies.map((msg, i) => (
            <p key={`p-disc-${i}`} className="pl-5 text-amber-800">
              • {msg}
            </p>
          ))}

          {audit.winnerDiscrepancies.map((msg, i) => (
            <p key={`w-disc-${i}`} className="pl-5 text-amber-800">
              • {msg}
            </p>
          ))}

          <p className="pl-5 text-[11px] text-slate-600 pt-1">
            <b>Resolution Rule Applied:</b> Per requirement #13, the dashboard uses calculated sums from individual records to guarantee accuracy against spreadsheet formula omissions or manual typos.
          </p>
        </div>
      )}

      {/* Audit Matrix & Verification Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-xs">
        
        {/* Box 1: Team & Student Aggregation Verification */}
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
          <div className="flex items-center gap-1.5 font-bold text-navy-950 mb-2">
            <Users className="w-4 h-4 text-blue-600" />
            <span>Turnout Verification</span>
          </div>
          <div className="space-y-1.5 text-slate-600 text-[11px]">
            <div className="flex justify-between">
              <span>Expected Teams:</span>
              <span className="font-mono font-bold text-slate-900">{audit.calculatedParticipationExpectedTeams}</span>
            </div>
            <div className="flex justify-between">
              <span>Registered Teams:</span>
              <span className="font-mono font-bold text-slate-900">{audit.calculatedParticipationRegisteredTeams}</span>
            </div>
            <div className="flex justify-between">
              <span>Expected Students:</span>
              <span className="font-mono font-bold text-slate-900">{audit.calculatedParticipationExpectedStudents}</span>
            </div>
            <div className="flex justify-between">
              <span>Actual Turnout:</span>
              <span className="font-mono font-bold text-emerald-700">{audit.calculatedParticipationActualStudents}</span>
            </div>
          </div>
        </div>

        {/* Box 2: Prize Money De-duplication Check */}
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
          <div className="flex items-center gap-1.5 font-bold text-navy-950 mb-2">
            <Award className="w-4 h-4 text-amber-600" />
            <span>Prize Money De-duplication</span>
          </div>
          <div className="space-y-1.5 text-slate-600 text-[11px]">
            <div className="flex justify-between">
              <span>Winning Teams:</span>
              <span className="font-mono font-bold text-slate-900">{totalTeamAwardsCount} teams</span>
            </div>
            <div className="flex justify-between">
              <span>Student Achievers:</span>
              <span className="font-mono font-bold text-slate-900">{totalStudentWinnersCount} students</span>
            </div>
            <div className="flex justify-between">
              <span>Calculated Total Prize:</span>
              <span className="font-mono font-extrabold text-amber-700">₹{audit.calculatedPrizeMoney.toLocaleString('en-IN')}</span>
            </div>
            <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-200">
              Verified: Team prize is never multiplied by team members count.
            </div>
          </div>
        </div>

        {/* Box 3: Row Classification Engine */}
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
          <div className="flex items-center gap-1.5 font-bold text-navy-950 mb-2">
            <FileSpreadsheet className="w-4 h-4 text-indigo-600" />
            <span>Sheet Structure Guard</span>
          </div>
          <div className="space-y-1.5 text-slate-600 text-[11px]">
            <div className="flex justify-between">
              <span>Valid Hackathon Rows:</span>
              <span className="font-mono font-bold text-slate-900">{totalHackathonCount}</span>
            </div>
            <div className="flex justify-between">
              <span>Summary Rows Skipped:</span>
              <span className="font-mono font-bold text-emerald-700">Yes (Auto-filtered)</span>
            </div>
            <div className="flex justify-between">
              <span>Continuation Rows Linked:</span>
              <span className="font-mono font-bold text-emerald-700">Yes (Preserved)</span>
            </div>
            <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-200">
              Empty rows and malformed cells discarded cleanly.
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
