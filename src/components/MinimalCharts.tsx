import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { PieChart as PieIcon, Trophy } from 'lucide-react';
import { ParticipationRecord, TeamAwardRecord } from '../types';
import { 
  OFFICIAL_DOC_WINNERS, 
  TOTAL_OFFICIAL_DOC_PRIZE, 
  TOTAL_OFFICIAL_DOC_TEAMS 
} from '../data/officialDocWinners';

interface MinimalChartsProps {
  participation: ParticipationRecord[];
  teamAwards?: TeamAwardRecord[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const entry = payload[0];
    const data = entry.payload || {};
    
    // For Pie Chart
    if (data.name && typeof data.value === 'number' && !data.prizeMoney) {
      return (
        <div className="bg-navy-950 text-white p-3 rounded-lg shadow-elevated border border-navy-800 text-xs font-sans">
          <p className="font-semibold text-slate-200 mb-1">{data.name}</p>
          <div className="flex items-center justify-between gap-4 text-[11px]">
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: data.color || entry.fill }}></span>
              Hackathons:
            </span>
            <span className="font-mono font-bold text-white">
              {data.value}
            </span>
          </div>
        </div>
      );
    }

    // For Official Winning Awards Bar Chart
    return (
      <div className="bg-navy-950 text-white p-3 rounded-lg shadow-elevated border border-navy-800 text-xs font-sans max-w-xs">
        <p className="font-bold text-slate-100 mb-1 leading-snug">
          {data.fullName || label || data.name}
        </p>
        <div className="space-y-1 pt-1 border-t border-slate-800">
          {data.award && (
            <div className="flex items-center justify-between gap-3 text-[11px]">
              <span className="text-slate-400">Position:</span>
              <span className="font-semibold text-amber-400">{data.award}</span>
            </div>
          )}
          <div className="flex items-center justify-between gap-3 text-[11px]">
            <span className="text-slate-400">Prize Purse:</span>
            <span className="font-mono font-bold text-emerald-400">
              ₹{Number(data.prizeMoney || 0).toLocaleString('en-IN')}/-
            </span>
          </div>
          {data.memberCount !== undefined && (
            <div className="flex items-center justify-between gap-3 text-[11px]">
              <span className="text-slate-400">Team Size:</span>
              <span className="font-semibold text-slate-300">
                {data.memberCount} student {data.memberCount === 1 ? 'member' : 'members'}
              </span>
            </div>
          )}
          {data.eventDate && (
            <div className="flex items-center justify-between gap-3 text-[10px] text-slate-400 pt-0.5">
              <span>Date:</span>
              <span>{data.eventDate}</span>
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
};

export const MinimalCharts: React.FC<MinimalChartsProps> = ({ participation }) => {
  // 1. Participated vs Yet to Participate (Driven live by Google Sheets)
  const participationRatioData = useMemo(() => {
    let pendingCount = 0;
    let completedCount = 0;

    participation.forEach(p => {
      const fUp = (p.followUpCompleted || '').toLowerCase();
      const sWon = (p.statusWon || '').toLowerCase();
      if (p.derivedStatus === 'Registered' || fUp.includes('yet to') || sWon.includes('yet to')) {
        pendingCount++;
      } else {
        completedCount++;
      }
    });

    return [
      { name: 'Participated / Attended', value: completedCount, color: '#0b2545' },
      { name: 'Yet to Participate', value: pendingCount, color: '#7c3aed' }
    ];
  }, [participation]);

  // 2. Official Winning Awards by Hackathon (Driven exclusively by hackathon 2026.docx Word Doc dataset)
  // Sorted by prize amount in descending order
  const officialAwardsData = useMemo(() => {
    return [...OFFICIAL_DOC_WINNERS]
      .sort((a, b) => b.prizeMoney - a.prizeMoney)
      .map(award => ({
        id: award.id,
        name: award.chartLabel,
        displayName: award.chartLabel.length > 25 ? award.chartLabel.slice(0, 23) + '…' : award.chartLabel,
        fullName: award.chartLabel,
        hackathonName: award.hackathonName,
        award: award.awardPosition,
        prizeMoney: award.prizeMoney,
        prizeMoneyFormatted: award.prizeMoneyFormatted,
        eventDate: award.eventDate,
        memberCount: award.members.length,
      }));
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      
      {/* Chart 1: Participated vs Yet to Participate (Live Google Sheets) */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-subtle flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <PieIcon className="w-3.5 h-3.5 text-blue-700" />
              <span>Participated vs Yet to Participate Hackathons</span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Ratio of completed hackathons against pending registered events
            </p>
          </div>
          <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-semibold">
            {participation.length} Total
          </span>
        </div>

        <div className="h-64 sm:h-72 w-full flex items-center justify-center">
          {participation.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={participationRatioData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {participationRatioData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-slate-400 text-xs">No participation records loaded</div>
          )}
        </div>
      </div>

      {/* Chart 2: Official Winning Awards by Hackathon (Exclusive Word Document Dataset) */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-subtle flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-navy-950 flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-amber-600" />
              <span>OFFICIAL WINNING AWARDS BY HACKATHON</span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Awarded prize money per winning hackathon from official register
            </p>
          </div>
          <span className="text-[10px] font-mono bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded font-semibold">
            {TOTAL_OFFICIAL_DOC_TEAMS} Award Records
          </span>
        </div>

        <div className="h-64 sm:h-72 w-full">
          {officialAwardsData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={officialAwardsData}
                margin={{ top: 10, right: 25, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis 
                  type="number" 
                  tick={{ fontSize: 10, fill: '#64748b' }} 
                  tickFormatter={(v) => `₹${v/1000}k`}
                />
                <YAxis 
                  type="category" 
                  dataKey="displayName" 
                  tick={{ fontSize: 10, fill: '#1e293b', fontWeight: 600 }} 
                  width={150} 
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="prizeMoney" 
                  name="Prize Money" 
                  fill="#d97706" 
                  radius={[0, 4, 4, 0]} 
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400 text-xs">
              No winning awards recorded
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
