import React from 'react';
import { 
  Trophy, 
  Users, 
  Award, 
  CheckCircle, 
  Clock, 
  Layers, 
  Percent, 
  IndianRupee, 
  Medal, 
  GraduationCap,
  Info,
  CalendarCheck
} from 'lucide-react';
import { DashboardMetrics } from '../types';

interface KpiCardsProps {
  metrics: DashboardMetrics;
}

export const KpiCards: React.FC<KpiCardsProps> = ({ metrics }) => {
  const formatInr = (amount: number) => {
    return '₹' + amount.toLocaleString('en-IN');
  };

  return (
    <div className="space-y-6">
      
      {/* 1. WINNER & ACHIEVEMENT KPIS */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-600" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-navy-950">
              Achievements & Prize Accolades
            </h2>
          </div>
          <span className="text-[11px] text-slate-500 flex items-center gap-1">
            <Info className="w-3 h-3 text-slate-400" />
            Prize counted once per winning team entry (no duplication)
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          
          {/* Total Prize Money */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-subtle hover:border-blue-300 transition-all relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-16 h-16 bg-amber-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
            <div className="flex items-center justify-between text-slate-500 mb-1.5 relative z-10">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">Total Prize Money</span>
              <IndianRupee className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-navy-950 relative z-10 font-mono">
              {formatInr(metrics.totalPrizeMoney)}
            </div>
            <p className="text-[11px] text-slate-500 mt-1 relative z-10">
              Official Management Honoured
            </p>
          </div>

          {/* First Prizes */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-subtle hover:border-blue-300 transition-all relative overflow-hidden group">
            <div className="flex items-center justify-between text-slate-500 mb-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">First Prizes</span>
              <Trophy className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-extrabold text-navy-950">
              {metrics.totalFirstPrizes}
            </div>
            <p className="text-[11px] text-amber-700 font-medium mt-1">
              Top Honours Secured
            </p>
          </div>

          {/* Second Prizes */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-subtle hover:border-blue-300 transition-all relative overflow-hidden group">
            <div className="flex items-center justify-between text-slate-500 mb-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">Second Prizes</span>
              <Medal className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-2xl font-extrabold text-navy-950">
              {metrics.totalSecondPrizes}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Runner-Up Awards
            </p>
          </div>

          {/* Total Award Records */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-subtle hover:border-blue-300 transition-all">
            <div className="flex items-center justify-between text-slate-500 mb-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">Total Award Teams</span>
              <Award className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-extrabold text-navy-950">
              {metrics.totalAwardRecords}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Distinct Winning Teams
            </p>
          </div>

          {/* Unique Student Winners */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-subtle hover:border-blue-300 transition-all">
            <div className="flex items-center justify-between text-slate-500 mb-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">Unique Achievers</span>
              <GraduationCap className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-2xl font-extrabold text-navy-950">
              {metrics.uniqueWinningStudents}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Individual Students Honoured
            </p>
          </div>

          {/* Hackathons with Winning Teams */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-subtle hover:border-blue-300 transition-all">
            <div className="flex items-center justify-between text-slate-500 mb-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">Won Hackathons</span>
              <CalendarCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-extrabold text-navy-950">
              {metrics.hackathonsWithWinningTeams}
            </div>
            <p className="text-[11px] text-emerald-700 font-medium mt-1">
              Conducted Events with Wins
            </p>
          </div>

        </div>
      </div>

      {/* 2. PARTICIPATION & OPERATIONAL METRICS */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-700" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-navy-950">
              Participation, Registrations & Pipeline
            </h2>
          </div>
          <span className="text-[11px] text-slate-500">
            Dynamically aggregated from Participation sheet
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          
          {/* Total Hackathon Records */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-subtle hover:border-blue-300 transition-all">
            <div className="flex items-center justify-between text-slate-500 mb-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">Hackathon Events</span>
              <Layers className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-extrabold text-navy-950">
              {metrics.totalHackathons}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Tracked in Sheet
            </p>
          </div>

          {/* Teams: Expected vs Registered */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-subtle hover:border-blue-300 transition-all">
            <div className="flex items-center justify-between text-slate-500 mb-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">Registered Teams</span>
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-extrabold text-navy-950">{metrics.totalRegisteredTeams}</span>
              <span className="text-xs text-slate-400 font-medium">/ {metrics.totalExpectedTeams} Exp</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {metrics.totalExpectedTeams > 0 ? Math.round((metrics.totalRegisteredTeams / metrics.totalExpectedTeams) * 100) : 0}% Team Registration Rate
            </p>
          </div>

          {/* Students: Participating vs Expected */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-subtle hover:border-blue-300 transition-all">
            <div className="flex items-center justify-between text-slate-500 mb-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">Part. Students</span>
              <Users className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-extrabold text-navy-950">{metrics.totalParticipatingStudents}</span>
              <span className="text-xs text-slate-400 font-medium">/ {metrics.totalExpectedStudents} Exp</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Active Student Involvements
            </p>
          </div>

          {/* Student Participation % */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-subtle hover:border-blue-300 transition-all">
            <div className="flex items-center justify-between text-slate-500 mb-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">Student Part. Rate</span>
              <Percent className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-extrabold text-navy-950">
              {metrics.studentParticipationPercentage}%
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
              <div 
                className="bg-blue-600 h-1.5 rounded-full transition-all duration-500" 
                style={{ width: `${Math.min(100, metrics.studentParticipationPercentage)}%` }}
              ></div>
            </div>
          </div>

          {/* Completed Hackathons */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-subtle hover:border-blue-300 transition-all">
            <div className="flex items-center justify-between text-slate-500 mb-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">Completed</span>
              <CheckCircle className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-extrabold text-navy-950">
              {metrics.completedHackathons}
            </div>
            <p className="text-[11px] text-emerald-700 font-medium mt-1">
              Events Concluded
            </p>
          </div>

          {/* Shortlisted / Pending Hackathons */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-subtle hover:border-blue-300 transition-all">
            <div className="flex items-center justify-between text-slate-500 mb-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">Pending / Shortlisted</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-extrabold text-navy-950">
                {metrics.shortlistedHackathons + metrics.registeredPendingHackathons}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                ({metrics.shortlistedHackathons} shortlist)
              </span>
            </div>
            <p className="text-[11px] text-amber-700 font-medium mt-1">
              Active In Pipeline
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};
