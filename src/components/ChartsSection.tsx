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

const COLORS = [
  '#0f2d59', // Primary Navy
  '#2563eb', // Royal Blue
  '#059669', // Emerald
  '#d97706', // Amber Gold
  '#7c3aed', // Purple
  '#0891b2', // Cyan
  '#e11d48', // Rose
  '#475569', // Slate
];

const AWARD_COLORS: Record<string, string> = {
  'First': '#f59e0b',  // Gold
  'Second': '#94a3b8', // Silver
  'Third': '#b45309',  // Bronze
  'Special Award': '#6366f1',
  'Other': '#3b82f6'
};

const formatInrTooltip = (val: any) => {
  return ['₹' + Number(val || 0).toLocaleString('en-IN'), 'Prize Money'];
};

export const ChartsSection: React.FC<ChartsSectionProps> = ({
  participation,
  studentWinners,
  teamAwards
}) => {
  // 1. Expected vs Registered Teams
  const teamsComparisonData = participation.map(p => ({
    name: p.title.length > 20 ? p.title.slice(0, 18) + '...' : p.title,
    fullName: p.title,
    'Expected Teams': p.expectedTeams,
    'Registered Teams': p.teamsRegistered
  }));

  // 2. Expected vs Participating Students
  const studentsComparisonData = participation.map(p => ({
    name: p.title.length > 20 ? p.title.slice(0, 18) + '...' : p.title,
    fullName: p.title,
    'Expected Students': p.expectedStudents,
    'Participating Students': p.studentsParticipated
  }));

  // 3. Hackathon Outcome Distribution
  const outcomeCounts: Record<string, number> = {};
  participation.forEach(p => {
    outcomeCounts[p.derivedStatus] = (outcomeCounts[p.derivedStatus] || 0) + 1;
  });
  const outcomeData = Object.entries(outcomeCounts).map(([status, count]) => ({
    name: status,
    value: count
  }));

  // 4. Top 10 Hackathons by Student Participation
  const topHackathonsData = [...participation]
    .sort((a, b) => b.studentsParticipated - a.studentsParticipated)
    .slice(0, 8)
    .map(p => ({
      name: p.title.length > 24 ? p.title.slice(0, 22) + '...' : p.title,
      fullName: p.title,
      students: p.studentsParticipated,
      teams: p.teamsRegistered
    }));

  // 5. Prize Money by Hackathon
  const prizeByHackathonMap: Record<string, number> = {};
  teamAwards.forEach(t => {
    prizeByHackathonMap[t.hackathonName] = (prizeByHackathonMap[t.hackathonName] || 0) + t.prizeMoney;
  });
  const prizeByHackathonData = Object.entries(prizeByHackathonMap)
    .map(([name, prize]) => ({
      name: name.length > 20 ? name.slice(0, 18) + '...' : name,
      fullName: name,
      prize
    }))
    .sort((a, b) => b.prize - a.prize);

  // 6. First Prize vs Second Prize Distribution
  const awardCounts: Record<string, number> = {};
  teamAwards.forEach(t => {
    awardCounts[t.awardPosition] = (awardCounts[t.awardPosition] || 0) + 1;
  });
  const awardDistributionData = Object.entries(awardCounts).map(([award, count]) => ({
    name: award === 'First' ? 'First Prize' : award === 'Second' ? 'Second Prize' : award,
    rawAward: award,
    value: count
  }));

  // 7. Department-wise Student Participation & Winners
  const deptMap: Record<string, { dept: string; winners: number }> = {};
  studentWinners.forEach(s => {
    const dept = s.department || 'Other';
    if (!deptMap[dept]) deptMap[dept] = { dept, winners: 0 };
    deptMap[dept].winners += 1;
  });
  const deptData = Object.values(deptMap).sort((a, b) => b.winners - a.winners);

  // 8. Academic Year Distribution (II, III, IV)
  const yearCounts: Record<string, number> = {};
  studentWinners.forEach(s => {
    const yr = s.academicYear || 'Other';
    yearCounts[yr] = (yearCounts[yr] || 0) + 1;
  });
  const yearData = Object.entries(yearCounts).map(([yr, count]) => ({
    name: `Year ${yr}`,
    count
  }));

  return (
    <div className="space-y-6">
      
      {/* ROW 1: Teams and Students Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Expected Teams vs Registered Teams */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-subtle">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-pec-blue" />
              <h3 className="text-sm font-bold text-navy-950">
                Expected Teams vs Registered Teams
              </h3>
            </div>
            <span className="text-[11px] text-slate-400">Team Target vs Actual</span>
          </div>

          <div className="h-72 w-full">
            {teamsComparisonData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={teamsComparisonData} margin={{ top: 10, right: 10, left: -15, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    angle={-25} 
                    textAnchor="end" 
                    interval={0} 
                    tick={{ fontSize: 10, fill: '#64748b' }} 
                  />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f2648', borderColor: '#1e3a8a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                    itemStyle={{ color: '#e2e8f0' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Bar dataKey="Expected Teams" fill="#93c5fd" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Registered Teams" fill="#0f2d59" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                No team comparison data available
              </div>
            )}
          </div>
        </div>

        {/* Chart 2: Expected Students vs Participating Students */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-subtle">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-navy-950">
                Expected Students vs Participating Students
              </h3>
            </div>
            <span className="text-[11px] text-slate-400">Student Target vs Turnout</span>
          </div>

          <div className="h-72 w-full">
            {studentsComparisonData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={studentsComparisonData} margin={{ top: 10, right: 10, left: -15, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    angle={-25} 
                    textAnchor="end" 
                    interval={0} 
                    tick={{ fontSize: 10, fill: '#64748b' }} 
                  />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f2648', borderColor: '#1e3a8a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                    itemStyle={{ color: '#e2e8f0' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Bar dataKey="Expected Students" fill="#a7f3d0" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Participating Students" fill="#059669" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                No student comparison data available
              </div>
            )}
          </div>
        </div>

      </div>

      {/* ROW 2: Prize Money & Award Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart 5: Prize Money by Hackathon */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-subtle">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-600" />
              <h3 className="text-sm font-bold text-navy-950">
                Prize Money Won by Hackathon Event (₹)
              </h3>
            </div>
            <span className="text-[11px] text-amber-700 font-semibold">Total ₹96,000+</span>
          </div>

          <div className="h-72 w-full">
            {prizeByHackathonData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={prizeByHackathonData} margin={{ top: 10, right: 10, left: 10, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    angle={-20} 
                    textAnchor="end" 
                    interval={0} 
                    tick={{ fontSize: 10, fill: '#64748b' }} 
                  />
                  <YAxis 
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    tickFormatter={(v) => `₹${v/1000}k`}
                  />
                  <Tooltip 
                    formatter={formatInrTooltip}
                    contentStyle={{ backgroundColor: '#0f2648', borderColor: '#1e3a8a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                  />
                  <Bar dataKey="prize" fill="#d97706" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                No prize money awards in the selected filter
              </div>
            )}
          </div>
        </div>

        {/* Chart 6: First Prize vs Second Prize Doughnut */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-bold text-navy-950">
                First vs Second Awards
              </h3>
            </div>
            <span className="text-[11px] text-slate-400">Award Breakdown</span>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            {awardDistributionData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={awardDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {awardDistributionData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={AWARD_COLORS[entry.rawAward] || COLORS[index % COLORS.length]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0f2648', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-slate-400 text-xs">No award data found</div>
            )}
          </div>
          
          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-[11px] text-slate-600 flex justify-around text-center">
            <div>
              <span className="block font-bold text-amber-700">
                {teamAwards.filter(t => t.awardPosition === 'First').length}
              </span>
              <span>1st Prizes</span>
            </div>
            <div className="border-r border-slate-200"></div>
            <div>
              <span className="block font-bold text-slate-700">
                {teamAwards.filter(t => t.awardPosition === 'Second').length}
              </span>
              <span>2nd Prizes</span>
            </div>
            <div className="border-r border-slate-200"></div>
            <div>
              <span className="block font-bold text-blue-700">
                {teamAwards.length}
              </span>
              <span>Total Wins</span>
            </div>
          </div>
        </div>

      </div>

      {/* ROW 3: Outcome Distribution, Top Hackathons, Department Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart 3: Hackathon Outcome Distribution */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-subtle">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-blue-700" />
              <h3 className="text-sm font-bold text-navy-950">
                Hackathon Outcome Distribution
              </h3>
            </div>
            <span className="text-[11px] text-slate-400">Event Status</span>
          </div>

          <div className="h-64 w-full">
            {outcomeData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={outcomeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {outcomeData.map((_, index) => (
                      <Cell key={`cell-outcome-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0f2648', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                No outcome distribution available
              </div>
            )}
          </div>
        </div>

        {/* Chart 4: Top Hackathons by Student Participation */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-subtle">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-pec-blue" />
              <h3 className="text-sm font-bold text-navy-950">
                Top Events by Student Turnout
              </h3>
            </div>
            <span className="text-[11px] text-slate-400">Highest Involvements</span>
          </div>

          <div className="h-64 w-full">
            {topHackathonsData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  layout="vertical" 
                  data={topHackathonsData} 
                  margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis type="number" tick={{ fontSize: 10, fill: '#64748b' }} />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    tick={{ fontSize: 9, fill: '#64748b' }} 
                    width={110} 
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f2648', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                  />
                  <Bar dataKey="students" name="Participating Students" fill="#1d5fa7" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                No top hackathon records
              </div>
            )}
          </div>
        </div>

        {/* Chart 8: Department-wise Winning Student Participation */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-subtle">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-navy-950">
                Department-wise Winning Achievers
              </h3>
            </div>
            <span className="text-[11px] text-slate-400">Award Honourees</span>
          </div>

          <div className="h-64 w-full">
            {deptData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deptData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="dept" 
                    tick={{ fontSize: 10, fill: '#64748b' }} 
                  />
                  <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f2648', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
                  <Bar dataKey="winners" name="Winning Students" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                No department breakdown available
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
