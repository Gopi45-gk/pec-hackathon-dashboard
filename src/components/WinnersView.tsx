import React, { useMemo } from 'react';
import { 
  Trophy, 
  Medal, 
  Award, 
  Users, 
  IndianRupee, 
  Layers,
  Sparkles,
  TrendingUp
} from 'lucide-react';
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
import { StudentWinnerRecord, TeamAwardRecord, DashboardMetrics } from '../types';
import { WinnersTable } from './WinnersTable';

interface WinnersViewProps {
  studentWinners: StudentWinnerRecord[];
  teamAwards: TeamAwardRecord[];
  metrics: DashboardMetrics;
  searchQuery: string;
  departmentFilter: string;
  yearFilter: string;
  awardFilter: string;
}

const AWARD_COLORS: Record<string, string> = {
  'First': '#d97706',  // Gold
  'Second': '#64748b', // Silver
  'Third': '#b45309',  // Bronze
  'Special Award': '#4f46e5',
  'Other': '#2563eb'
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-navy-950 text-white p-3 rounded-lg shadow-elevated border border-navy-800 text-xs">
        <p className="font-semibold text-slate-200 mb-1.5">{label || payload[0].payload.name}</p>
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

export const WinnersView: React.FC<WinnersViewProps> = ({
  studentWinners,
  teamAwards,
  metrics,
  searchQuery,
  departmentFilter,
  yearFilter,
  awardFilter
}) => {
  // Compute chart data from the actual awarded records
  const prizeByHackathon = useMemo(() => {
    const map: Record<string, number> = {};
    teamAwards.forEach(t => {
      map[t.hackathonName] = (map[t.hackathonName] || 0) + t.prizeMoney;
    });
    return Object.entries(map)
      .map(([name, prize]) => ({
        name: name.length > 20 ? name.slice(0, 18) + '...' : name,
        fullName: name,
        prize
      }))
      .sort((a, b) => b.prize - a.prize);
  }, [teamAwards]);

  const awardDistribution = useMemo(() => {
    const map: Record<string, number> = {};
    teamAwards.forEach(t => {
      map[t.awardPosition] = (map[t.awardPosition] || 0) + 1;
    });
    return Object.entries(map).map(([pos, count]) => ({
      name: pos === 'First' ? 'First Prize' : pos === 'Second' ? 'Second Prize' : pos,
      rawPosition: pos,
      value: count
    }));
  }, [teamAwards]);

  const cards = [
    {
      label: 'Total Award Records',
      value: metrics.totalAwardRecords,
      subtitle: 'Recognized team finishes',
      icon: Trophy,
      iconColor: 'text-amber-600',
      iconBg: 'bg-amber-50',
    },
    {
      label: 'First Prizes',
      value: metrics.totalFirstPrizes,
      subtitle: 'Champion podiums',
      icon: Award,
      iconColor: 'text-amber-500',
      iconBg: 'bg-amber-50',
    },
    {
      label: 'Second Prizes',
      value: metrics.totalSecondPrizes,
      subtitle: 'Runner-up podiums',
      icon: Medal,
      iconColor: 'text-slate-600',
      iconBg: 'bg-slate-100',
    },
    {
      label: 'Total Prize Money',
      value: `₹${metrics.totalPrizeMoney.toLocaleString('en-IN')}`,
      subtitle: 'Cash awards won',
      icon: IndianRupee,
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-50',
    },
    {
      label: 'Unique Winning Students',
      value: metrics.uniqueWinningStudents,
      subtitle: 'Distinct achievers',
      icon: Users,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-50',
    },
    {
      label: 'Award-Winning Events',
      value: metrics.hackathonsWithAwards,
      subtitle: 'Events with medals',
      icon: Layers,
      iconColor: 'text-purple-600',
      iconBg: 'bg-purple-50',
    },
  ];

  return (
    <div className="space-y-6">
      
      {/* 1. Header Banner */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h2 className="text-base font-bold text-navy-950">
              Prathyusha Engineering College — Hackathon Winners &amp; Awards Gallery
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Institutional achievements, student recognitions, and cash honors won in hackathons
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold px-2.5 py-1 rounded-lg">
            {metrics.totalAwardRecords} Awards Won
          </span>
          <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold px-2.5 py-1 rounded-lg font-mono">
            ₹{metrics.totalPrizeMoney.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* 2. 6 Executive KPI Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {cards.map((card, idx) => {
          const IconComp = card.icon;
          return (
            <div 
              key={idx}
              className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-subtle hover:shadow-card hover:border-slate-300 transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-slate-500 truncate">{card.label}</span>
                <div className={`p-1.5 rounded-lg ${card.iconBg} ${card.iconColor}`}>
                  <IconComp className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="text-lg font-black text-navy-950 tracking-tight font-sans">
                {card.value}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5 font-medium">
                {card.subtitle}
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Prize Money Rankings & Award Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Prize Money by Hackathon */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-subtle">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Prize Money Rankings by Hackathon (₹)
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Total cash purse awarded to college teams</p>
            </div>
            <TrendingUp className="w-4 h-4 text-amber-600" />
          </div>

          <div className="h-64 w-full">
            {prizeByHackathon.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={prizeByHackathon} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    angle={-20} 
                    textAnchor="end" 
                    interval={0} 
                    tick={{ fontSize: 9.5, fill: '#64748b' }} 
                  />
                  <YAxis 
                    tick={{ fontSize: 10, fill: '#64748b' }}
                    tickFormatter={(v) => `₹${v/1000}k`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="prize" name="Prize Money" fill="#d97706" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                No prize money records available
              </div>
            )}
          </div>
        </div>

        {/* Award Distribution (First vs Second vs Special) */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-subtle">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Podium &amp; Award Position Breakdown
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Distribution of First, Second, and special honors</p>
            </div>
            <Trophy className="w-4 h-4 text-amber-500" />
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            {awardDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={awardDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {awardDistribution.map((entry, index) => (
                      <Cell 
                        key={`award-cell-${index}`} 
                        fill={AWARD_COLORS[entry.rawPosition] || '#2563eb'} 
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-slate-400 text-xs">No award records available</div>
            )}
          </div>
        </div>

      </div>

      {/* 4. Full Filterable & Searchable Winners Table */}
      <WinnersTable
        studentWinners={studentWinners}
        teamAwards={teamAwards}
        searchQuery={searchQuery}
        departmentFilter={departmentFilter}
        yearFilter={yearFilter}
        awardFilter={awardFilter}
      />

    </div>
  );
};
