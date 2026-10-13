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
import { PieChart as PieIcon, Trophy, CheckCircle2, Clock } from 'lucide-react';
import { ParticipationRecord, TeamAwardRecord } from '../types';

interface MinimalChartsProps {
  participation: ParticipationRecord[];
  teamAwards: TeamAwardRecord[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-navy-950 text-white p-3 rounded-lg shadow-elevated border border-navy-800 text-xs font-sans">
        <p className="font-semibold text-slate-200 mb-1">{label || payload[0].payload.name || payload[0].name}</p>
        <div className="space-y-1">
          {payload.map((entry: any, index: number) => (
            <div key={`tooltip-${index}`} className="flex items-center justify-between gap-4 text-[11px]">
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color || entry.fill }}></span>
                {entry.name}:
              </span>
              <span className="font-mono font-bold text-white">
                {typeof entry.value === 'number' && entry.name.toLowerCase().includes('prize') 
                  ? `₹${entry.value.toLocaleString('en-IN')}`
                  : entry.value.toLocaleString('en-IN')}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export const MinimalCharts: React.FC<MinimalChartsProps> = ({ participation, teamAwards }) => {
  // 1. Participated vs Yet to Participate data
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

  // 2. Winning teams / prizes by Hackathon
  const winningTeamsData = useMemo(() => {
    return teamAwards.map(t => ({
      name: t.hackathonName.length > 20 ? t.hackathonName.slice(0, 18) + '...' : t.hackathonName,
      fullName: t.hackathonName,
      award: t.awardPosition,
      prizeMoney: t.prizeMoney,
      teams: 1
    })).sort((a, b) => b.prizeMoney - a.prizeMoney);
  }, [teamAwards]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      
      {/* Chart 1: Participated vs Yet to Participate */}
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

        <div className="h-60 w-full flex items-center justify-center">
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

      {/* Chart 2: Winning Teams & Awards by Hackathon */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-subtle flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-amber-600" />
              <span>Winning Teams by Hackathon</span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Awarded prize money per winning hackathon
            </p>
          </div>
          <span className="text-[10px] font-mono bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded font-semibold">
            {teamAwards.length} Winning Teams
          </span>
        </div>

        <div className="h-60 w-full">
          {winningTeamsData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={winningTeamsData}
                margin={{ top: 10, right: 20, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis 
                  type="number" 
                  tick={{ fontSize: 10, fill: '#64748b' }} 
                  tickFormatter={(v) => `₹${v/1000}k`}
                />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  tick={{ fontSize: 10, fill: '#1e293b', fontWeight: 600 }} 
                  width={110} 
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
              No winning teams recorded
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
