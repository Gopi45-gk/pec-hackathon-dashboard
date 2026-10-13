import React, { useState, useMemo } from 'react';
import { 
  Trophy, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  ArrowUpDown, 
  Users, 
  Medal, 
  Calendar, 
  Building, 
  GraduationCap, 
  IndianRupee,
  Layers,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { StudentWinnerRecord, TeamAwardRecord, AwardPosition } from '../types';

interface WinnersTableProps {
  studentWinners: StudentWinnerRecord[];
  teamAwards: TeamAwardRecord[];
  searchQuery: string;
  departmentFilter: string;
  yearFilter: string;
  awardFilter: string;
}

type SortField = 'prizeMoney' | 'studentName' | 'hackathonName' | 'eventDate' | 'awardPosition';
type SortOrder = 'asc' | 'desc';

export const WinnersTable: React.FC<WinnersTableProps> = ({
  studentWinners,
  teamAwards,
  searchQuery,
  departmentFilter,
  yearFilter,
  awardFilter
}) => {
  const [viewMode, setViewMode] = useState<'students' | 'teams'>('students');
  const [sortField, setSortField] = useState<SortField>('prizeMoney');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const formatInr = (amount: number) => '₹' + amount.toLocaleString('en-IN');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  // Filter students
  const filteredStudents = useMemo(() => {
    return studentWinners.filter(item => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        item.studentName.toLowerCase().includes(q) || 
        item.hackathonName.toLowerCase().includes(q) ||
        item.deptAndYear.toLowerCase().includes(q);

      const matchesDept = departmentFilter === 'All' || item.department.toUpperCase() === departmentFilter.toUpperCase();
      const matchesYear = yearFilter === 'All' || item.academicYear === yearFilter;
      const matchesAward = awardFilter === 'All' || item.awardPosition === awardFilter;

      return matchesSearch && matchesDept && matchesYear && matchesAward;
    });
  }, [studentWinners, searchQuery, departmentFilter, yearFilter, awardFilter]);

  // Filter teams
  const filteredTeams = useMemo(() => {
    return teamAwards.filter(team => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        team.hackathonName.toLowerCase().includes(q) || 
        team.members.some(m => m.name.toLowerCase().includes(q) || m.deptAndYear.toLowerCase().includes(q));

      const matchesDept = departmentFilter === 'All' || team.members.some(m => m.department.toUpperCase() === departmentFilter.toUpperCase());
      const matchesYear = yearFilter === 'All' || team.members.some(m => m.academicYear === yearFilter);
      const matchesAward = awardFilter === 'All' || team.awardPosition === awardFilter;

      return matchesSearch && matchesDept && matchesYear && matchesAward;
    });
  }, [teamAwards, searchQuery, departmentFilter, yearFilter, awardFilter]);

  // Calculate filtered prize total (using team awards to prevent duplicate counting)
  const filteredPrizeTotal = useMemo(() => {
    if (viewMode === 'teams') {
      return filteredTeams.reduce((sum, t) => sum + t.prizeMoney, 0);
    } else {
      // Find distinct teams among filtered students
      const includedTeamIds = new Set(filteredStudents.map(s => s.teamId));
      let total = 0;
      teamAwards.forEach(t => {
        if (includedTeamIds.has(t.teamId)) {
          total += t.prizeMoney;
        }
      });
      return total;
    }
  }, [viewMode, filteredTeams, filteredStudents, teamAwards]);

  // Sort student data
  const sortedStudents = useMemo(() => {
    return [...filteredStudents].sort((a, b) => {
      let comparison = 0;
      if (sortField === 'prizeMoney') comparison = a.prizeMoney - b.prizeMoney;
      else if (sortField === 'studentName') comparison = a.studentName.localeCompare(b.studentName);
      else if (sortField === 'hackathonName') comparison = a.hackathonName.localeCompare(b.hackathonName);
      else if (sortField === 'awardPosition') comparison = a.awardPosition.localeCompare(b.awardPosition);
      else if (sortField === 'eventDate') comparison = a.eventDate.localeCompare(b.eventDate);

      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [filteredStudents, sortField, sortOrder]);

  // Sort team data
  const sortedTeams = useMemo(() => {
    return [...filteredTeams].sort((a, b) => {
      let comparison = 0;
      if (sortField === 'prizeMoney') comparison = a.prizeMoney - b.prizeMoney;
      else if (sortField === 'hackathonName') comparison = a.hackathonName.localeCompare(b.hackathonName);
      else if (sortField === 'awardPosition') comparison = a.awardPosition.localeCompare(b.awardPosition);
      else if (sortField === 'eventDate') comparison = a.eventDate.localeCompare(b.eventDate);

      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [filteredTeams, sortField, sortOrder]);

  // Pagination
  const totalItems = viewMode === 'students' ? sortedStudents.length : sortedTeams.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedStudents.slice(start, start + pageSize);
  }, [sortedStudents, currentPage, pageSize]);

  const paginatedTeams = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedTeams.slice(start, start + pageSize);
  }, [sortedTeams, currentPage, pageSize]);

  const getAwardBadge = (award: AwardPosition) => {
    switch (award) {
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
            <Medal className="w-3 h-3 text-slate-500" />
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
            {award}
          </span>
        );
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-subtle overflow-hidden">
      
      {/* Table Header and Controls */}
      <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-600" />
            <h3 className="text-base font-bold text-navy-950">
              PEC Hackathon Achievers & Winners Table 2026
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Student records honoured by college management for outstanding achievements
          </p>
        </div>

        {/* View Toggle and Filtered Total Summary */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Filtered Prize Total Callout */}
          <div className="bg-white border border-amber-200 px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-500 uppercase">Filtered Prize Total:</span>
            <span className="text-sm font-extrabold text-amber-700 font-mono">
              {formatInr(filteredPrizeTotal)}
            </span>
          </div>

          {/* View Mode Toggle: Student vs Team View */}
          <div className="inline-flex bg-slate-200 p-0.5 rounded-lg border border-slate-300 text-xs">
            <button
              onClick={() => { setViewMode('students'); setCurrentPage(1); }}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
                viewMode === 'students' 
                  ? 'bg-white text-navy-900 shadow-sm' 
                  : 'text-slate-600 hover:text-navy-900'
              }`}
            >
              Students ({filteredStudents.length})
            </button>
            <button
              onClick={() => { setViewMode('teams'); setCurrentPage(1); }}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
                viewMode === 'teams' 
                  ? 'bg-white text-navy-900 shadow-sm' 
                  : 'text-slate-600 hover:text-navy-900'
              }`}
            >
              Teams ({filteredTeams.length})
            </button>
          </div>

        </div>
      </div>

      {/* Table Wrapper */}
      <div className="overflow-x-auto">
        {viewMode === 'students' ? (
          /* 1. STUDENT-BY-STUDENT VIEW */
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4 w-12 text-center">S.No</th>
                <th 
                  className="py-3 px-4 cursor-pointer hover:text-navy-900 select-none"
                  onClick={() => handleSort('studentName')}
                >
                  <div className="flex items-center gap-1.5">
                    <span>Student Name</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-4">Department & Year</th>
                <th 
                  className="py-3 px-4 cursor-pointer hover:text-navy-900 select-none"
                  onClick={() => handleSort('hackathonName')}
                >
                  <div className="flex items-center gap-1.5">
                    <span>Hackathon Name</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th 
                  className="py-3 px-4 cursor-pointer hover:text-navy-900 select-none"
                  onClick={() => handleSort('eventDate')}
                >
                  <div className="flex items-center gap-1.5">
                    <span>Event Date</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th 
                  className="py-3 px-4 cursor-pointer hover:text-navy-900 select-none"
                  onClick={() => handleSort('awardPosition')}
                >
                  <div className="flex items-center gap-1.5">
                    <span>Award Position</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th 
                  className="py-3 px-4 text-right cursor-pointer hover:text-navy-900 select-none"
                  onClick={() => handleSort('prizeMoney')}
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Team Prize Money</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {paginatedStudents.length > 0 ? (
                paginatedStudents.map((item, index) => (
                  <tr 
                    key={item.id} 
                    className="hover:bg-blue-50/40 transition-colors"
                  >
                    <td className="py-3 px-4 text-center font-medium text-slate-400">
                      {((currentPage - 1) * pageSize) + index + 1}
                    </td>
                    <td className="py-3 px-4 font-semibold text-navy-950">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-blue-100 text-pec-blue flex items-center justify-center font-bold text-xs uppercase shrink-0">
                          {item.studentName.charAt(0)}
                        </div>
                        <span>{item.studentName}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-block bg-slate-100 text-slate-700 font-mono text-[11px] px-2 py-0.5 rounded border border-slate-200">
                        {item.deptAndYear || `${item.department}/${item.academicYear}`}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800">
                      {item.hackathonName}
                    </td>
                    <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                      {item.eventDate}
                    </td>
                    <td className="py-3 px-4">
                      {getAwardBadge(item.awardPosition)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-navy-950 whitespace-nowrap">
                      {item.prizeMoney > 0 ? (
                        <span className="text-emerald-700">{formatInr(item.prizeMoney)}</span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No winner records found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        ) : (
          /* 2. TEAM AWARD VIEW */
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4 w-12 text-center">S.No</th>
                <th className="py-3 px-4">Hackathon Event</th>
                <th className="py-3 px-4">Event Date</th>
                <th className="py-3 px-4">Award</th>
                <th className="py-3 px-4 text-right">Team Prize</th>
                <th className="py-3 px-4">Winning Team Members</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {paginatedTeams.length > 0 ? (
                paginatedTeams.map((team, index) => (
                  <tr key={team.teamId} className="hover:bg-blue-50/40 transition-colors">
                    <td className="py-3 px-4 text-center font-medium text-slate-400">
                      {((currentPage - 1) * pageSize) + index + 1}
                    </td>
                    <td className="py-3 px-4 font-bold text-navy-950">
                      {team.hackathonName}
                    </td>
                    <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                      {team.eventDate}
                    </td>
                    <td className="py-3 px-4">
                      {getAwardBadge(team.awardPosition)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-extrabold text-emerald-700 whitespace-nowrap text-sm">
                      {formatInr(team.prizeMoney)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1.5">
                        {team.members.map((member, mIdx) => (
                          <span 
                            key={mIdx}
                            className="inline-flex items-center gap-1 bg-slate-100 text-slate-800 text-[11px] px-2 py-1 rounded border border-slate-200"
                          >
                            <span className="font-semibold">{member.name}</span>
                            <span className="text-[10px] text-slate-500 font-mono">({member.deptAndYear})</span>
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No team awards matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination & Footer summary */}
      <div className="p-3 sm:p-4 border-t border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
        
        <div className="flex items-center gap-2">
          <span>Showing {totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, totalItems)} of {totalItems} entries</span>
          <select
            value={pageSize}
            onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
            className="bg-white border border-slate-300 rounded px-2 py-1 text-xs"
          >
            <option value={10}>10 per page</option>
            <option value={25}>25 per page</option>
            <option value={50}>50 per page</option>
          </select>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <span className="px-2 font-medium">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};
