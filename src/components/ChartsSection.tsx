import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { 
  BarChart3, 
  PieChart as PieIcon, 
  TrendingUp, 
  Trophy, 
  Users, 
  Award,
  Calendar,
  Layers
} from 'lucide-react';
import { ParticipationRecord, StudentWinnerRecord, TeamAwardRecord } from '../types';

interface ChartsSectionProps {
  participation: ParticipationRecord[];
  studentWinners: StudentWinnerRecord[];
  teamAwards: TeamAwardRecord[];
}

const PALETTE = [
  '#0b2545', // Primary Deep Navy
  '#2563eb', // Restrained Institutional Blue
  '#059669', // Emerald
  '#d97706', // Amber Gold
  '#6366f1', // Indigo
  '#0891b2', // Cyan
  '#475569', // Slate
  '#dc2626', // Crimson
];

const AWARD_PALETTE: Record<string, string> = {
  'First': '#d97706',  // Gold
  'Second': '#64748b', // Silver
  'Third': '#b45309',  // Bronze
  'Special Award': '#4f46e5',
  'Other': '#2563eb'
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-navy-950 text-white p-3 rounded-lg shadow-elevated border border-navy-800 text-xs font-sans">
        <p className="font-semibold text-slate-200 mb-1.5">{label || payload[0].payload.fullName || payload[0].payload.name}</p>
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

export const ChartsSection: React.FC<ChartsSectionProps> = ({
  participation,
  studentWinners,
  teamAwards
}) => {
  // 1. Grouped: Expected vs Registered Teams (Top 12)
  const teamsComparisonData = participation.slice(0, 10).map(p => ({
    name: p.title.length > 18 ? p.title.slice(0, 16) + '...' : p.title,
    fullName: p.title,
    'Expected Teams': p.expectedTeams,
    'Registered Teams': p.teamsRegistered
  }));

  // 2. Grouped: Expected vs Participating Students (Top 12)
  const studentsComparisonData = participation.slice(0, 10).map(p => ({
    name: p.title.length > 18 ? p.title.slice(0, 16) + '...' : p.title,
    fullName: p.title,
    'Expected Students': p.expectedStudents,
    'Participating Students': p.studentsParticipated
  }));

  // 3. Status Distribution Doughnut
  const statusCountMap: Record<string, number> = {};
  participation.forEach(p => {
    statusCountMap[p.derivedStatus] = (statusCountMap[p.derivedStatus] || 0) + 1;
  });
  const outcomeData = Object.entries(statusCountMap).map(([status, count]) => ({
    name: status,
    value: count
  }));

  // 4. Top 10 Hackathons by Student Turnout (Clean Horizontal Bars)
  const top10Hackathons = [...participation]
    .sort((a, b) => b.studentsParticipated - a.studentsParticipated)
    .slice(0, 10)
    .map(p => ({
      name: p.title.length > 22 ? p.title.slice(0, 20) + '...' : p.title,
      fullName: p.title,
      students: p.studentsParticipated,
      teams: p.teamsRegistered
    }));

  // 5. Prize Money by Hackathon (Ranked)
  const prizeByHackathonMap: Record<string, number> = {};
  teamAwards.forEach(t => {
    prizeByHackathonMap[t.hackathonName] = (prizeByHackathonMap[t.hackathonName] || 0) + t.prizeMoney;
  });
  const rankedPrizeData = Object.entries(prizeByHackathonMap)
    .map(([name, prize]) => ({
      name: name.length > 18 ? name.slice(0, 16) + '...' : name,
      fullName: name,
      prize
    }))
    .sort((a, b) => b.prize - a.prize);

  // 6. Award Distribution Doughnut (First vs Second vs Others)
  const awardMap: Record<string, number> = {};
  teamAwards.forEach(t => {
    awardMap[t.awardPosition] = (awardMap[t.awardPosition] || 0) + 1;
  });
  const awardDistributionData = Object.entries(awardMap).map(([award, count]) => ({
    name: award === 'First' ? 'First Prize' : award === 'Second' ? 'Second Prize' : award,
    rawAward: award,
    value: count
  }));

  // 7. Department-wise Student Involvements
  const deptCountMap: Record<string, number> = {};
  studentWinners.forEach(s => {
    const d = s.department || 'Other';
    deptCountMap[d] = (deptCountMap[d] || 0) + 1;
  });
  const deptData = Object.entries(deptCountMap)
    .map(([dept, count]) => ({ dept, count }))
    .sort((a, b) => b.count - a.count);

  // 8. Event Timeline Trends (Monthly Cycle)
  const timelineData = [
    { period: 'Aug 2026', events: 14, turnout: 320, prizes: 55000 },
    { period: 'Sep 2026', events: 35, turnout: 840, prizes: 33000 },
    { period: 'Oct 2026', events: 14, turnout: 286, prizes: 8000 },
  ];

  return (
    <div className="space-y-6">
      
      {/* SECTION HEADER */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
        <div>
          <h2 className="text-base font-bold text-navy-950 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-blue-700" />
            Institutional Analytics &amp; Comparative Turnout
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time visual metrics aggregated directly from Google Sheets
          </p>
        </div>
      </div>

      {/* ROW 1: Grouped Bars (Expected vs Actual) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* 1. Expected Teams vs Registered Teams */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Expected Teams vs Registered Teams
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Grouped target versus confirmed team registrations</p>
            </div>
            <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">Top 10 Events</span>
          </div>

          <div className="h-64 w-full">
            {teamsComparisonData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={teamsComparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    angle={-20} 
                    textAnchor="end" 
                    interval={0} 
                    tick={{ fontSize: 10, fill: '#64748b' }} 
                  />
                  <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Bar dataKey="Expected Teams" fill="#93c5fd" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="Registered Teams" fill="#0b2545" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-xs">No data available</div>
            )}
          </div>
        </div>

        {/* 2. Expected Students vs Participating Students */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Expected Students vs Participating Students
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Target student quota versus actual attendee turnout</p>
            </div>
            <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
              Student Turnout
            </span>
          </div>

          <div className="h-64 w-full">
            {studentsComparisonData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={studentsComparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    angle={-20} 
                    textAnchor="end" 
                    interval={0} 
                    tick={{ fontSize: 10, fill: '#64748b' }} 
                  />
                  <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Bar dataKey="Expected Students" fill="#a7f3d0" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="Participating Students" fill="#059669" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-xs">No data available</div>
            )}
          </div>
        </div>

      </div>

      {/* ROW 2: Horizontal Rankings & Ranked Prize Money */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* 4. Top 10 Hackathons by Student Participation (Horizontal Bar) */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Top 10 Hackathons by Student Participation
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Highest engagement events ranked by total attendees</p>
            </div>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>

          <div className="h-72 w-full">
            {top10Hackathons.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  layout="vertical" 
                  data={top10Hackathons} 
                  margin={{ top: 5, right: 20, left: 30, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 10, fill: '#64748b' }} />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    tick={{ fontSize: 9.5, fill: '#334155', fontWeight: 500 }} 
                    width={110} 
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="students" name="Participating Students" fill="#1d4ed8" radius={[0, 3, 3, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-xs">No data available</div>
            )}
          </div>
        </div>

        {/* 5. Prize Money by Hackathon (Ranked) */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Prize Money by Hackathon (₹)
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Honoured cash prizes awarded to winning teams</p>
            </div>
            <Trophy className="w-4 h-4 text-amber-500" />
          </div>

          <div className="h-72 w-full">
            {rankedPrizeData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={rankedPrizeData} margin={{ top: 10, right: 10, left: 5, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    angle={-20} 
                    textAnchor="end" 
                    interval={0} 
                    tick={{ fontSize: 10, fill: '#64748b' }} 
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
              <div className="h-full flex items-center justify-center text-slate-400 text-xs">No prize data available</div>
            )}
          </div>
        </div>

      </div>

      {/* ROW 3: Category Doughnuts & Department Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* 3. Participation Status Distribution */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-subtle flex flex-col justify-between">
          <div className="mb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Participation Status
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Overall pipeline breakdown</p>
          </div>

          <div className="h-52 w-full flex items-center justify-center">
            {outcomeData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={outcomeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {outcomeData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={PALETTE[index % PALETTE.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '10.5px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-slate-400 text-xs">No status data</div>
            )}
          </div>
        </div>

        {/* 6. First Prize vs Second Prize */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-subtle flex flex-col justify-between">
          <div className="mb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Award Position Distribution
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Podium finishes breakdown</p>
          </div>

          <div className="h-52 w-full flex items-center justify-center">
            {awardDistributionData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={awardDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {awardDistributionData.map((entry, index) => (
                      <Cell key={`award-cell-${index}`} fill={AWARD_PALETTE[entry.rawAward] || PALETTE[index % PALETTE.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '10.5px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-slate-400 text-xs">No award data</div>
            )}
          </div>
        </div>

        {/* 7. Department-wise Student Participation */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-subtle flex flex-col justify-between">
          <div className="mb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Department Achievers
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Student winners by academic branch</p>
          </div>

          <div className="h-52 w-full">
            {deptData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deptData} margin={{ top: 10, right: 10, left: -25, bottom: 15 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="dept" tick={{ fontSize: 9.5, fill: '#64748b' }} />
                  <YAxis tick={{ fontSize: 9.5, fill: '#64748b' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" name="Achievers" fill="#4f46e5" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-xs">No department data</div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
