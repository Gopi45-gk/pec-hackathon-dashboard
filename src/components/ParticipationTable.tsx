import React, { useState, useMemo } from 'react';
import { 
  Layers, 
  Search, 
  ArrowUpDown, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Clock, 
  Award, 
  AlertCircle, 
  ExternalLink,
  Users,
  Percent,
  X
} from 'lucide-react';
import { ParticipationRecord, DerivedStatus } from '../types';

interface ParticipationTableProps {
  participation: ParticipationRecord[];
  searchQuery: string;
  statusFilter: string;
}

type SortField = 'title' | 'expectedTeams' | 'teamsRegistered' | 'expectedStudents' | 'studentsParticipated' | 'derivedStatus';
type SortOrder = 'asc' | 'desc';

export const ParticipationTable: React.FC<ParticipationTableProps> = ({
  participation,
  searchQuery,
  statusFilter
}) => {
  const [sortField, setSortField] = useState<SortField>('teamsRegistered');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [selectedHackathon, setSelectedHackathon] = useState<ParticipationRecord | null>(null);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const filteredData = useMemo(() => {
    return participation.filter(item => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        item.title.toLowerCase().includes(q) ||
        item.statusWon.toLowerCase().includes(q) ||
        item.followUpCompleted.toLowerCase().includes(q);

      const matchesStatus = statusFilter === 'All' || item.derivedStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [participation, searchQuery, statusFilter]);

  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      let comparison = 0;
      if (sortField === 'title') comparison = a.title.localeCompare(b.title);
      else if (sortField === 'expectedTeams') comparison = a.expectedTeams - b.expectedTeams;
      else if (sortField === 'teamsRegistered') comparison = a.teamsRegistered - b.teamsRegistered;
      else if (sortField === 'expectedStudents') comparison = a.expectedStudents - b.expectedStudents;
      else if (sortField === 'studentsParticipated') comparison = a.studentsParticipated - b.studentsParticipated;
      else if (sortField === 'derivedStatus') comparison = a.derivedStatus.localeCompare(b.derivedStatus);

      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [filteredData, sortField, sortOrder]);

  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const getStatusBadge = (status: DerivedStatus) => {
    switch (status) {
      case 'Won Prize':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
            <Award className="w-3 h-3 text-amber-600" />
            Won Prize
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Completed
          </span>
        );
      case 'Shortlisted':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
            <Clock className="w-3 h-3 text-blue-600" />
            Shortlisted
          </span>
        );
      case 'Registered':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200">
            Registered / Pending
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
            <AlertCircle className="w-3 h-3 text-slate-500" />
            Needs Review
          </span>
        );
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-subtle overflow-hidden">
      
      {/* Table Header and Summary */}
      <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-pec-blue" />
            <h3 className="text-base font-bold text-navy-950">
              PEC Hackathon Participation & Registration Register
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Operational pipeline tracking expected vs actual turnout and participation milestones
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm text-xs text-slate-600">
            <span>Total Records: </span>
            <b className="font-semibold text-navy-950">{filteredData.length} Hackathons</b>
          </div>
        </div>
      </div>

      {/* Table View */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <th className="py-3 px-4 w-12 text-center">S.No</th>
              <th 
                className="py-3 px-4 cursor-pointer hover:text-navy-900 select-none"
                onClick={() => handleSort('title')}
              >
                <div className="flex items-center gap-1.5">
                  <span>Hackathon Title</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th 
                className="py-3 px-4 text-center cursor-pointer hover:text-navy-900 select-none"
                onClick={() => handleSort('expectedTeams')}
              >
                <div className="flex items-center justify-center gap-1">
                  <span>Expected Teams</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th 
                className="py-3 px-4 text-center cursor-pointer hover:text-navy-900 select-none"
                onClick={() => handleSort('teamsRegistered')}
              >
                <div className="flex items-center justify-center gap-1">
                  <span>Registered Teams</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th 
                className="py-3 px-4 text-center cursor-pointer hover:text-navy-900 select-none"
                onClick={() => handleSort('expectedStudents')}
              >
                <div className="flex items-center justify-center gap-1">
                  <span>Expected Students</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th 
                className="py-3 px-4 text-center cursor-pointer hover:text-navy-900 select-none"
                onClick={() => handleSort('studentsParticipated')}
              >
                <div className="flex items-center justify-center gap-1">
                  <span>Actual Students</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th 
                className="py-3 px-4 cursor-pointer hover:text-navy-900 select-none"
                onClick={() => handleSort('derivedStatus')}
              >
                <div className="flex items-center gap-1">
                  <span>Derived Status</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3 px-4">Award / Follow-Up Notes</th>
              <th className="py-3 px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {paginatedData.length > 0 ? (
              paginatedData.map((item, index) => {
                const studentTurnout = item.expectedStudents > 0 
                  ? Math.round((item.studentsParticipated / item.expectedStudents) * 100) 
                  : 0;

                return (
                  <tr 
                    key={item.id} 
                    className="hover:bg-blue-50/40 transition-colors cursor-pointer"
                    onClick={() => setSelectedHackathon(item)}
                  >
                    <td className="py-3 px-4 text-center font-medium text-slate-400">
                      {((currentPage - 1) * pageSize) + index + 1}
                    </td>
                    <td className="py-3 px-4 font-semibold text-navy-950 max-w-xs">
                      <div className="truncate font-semibold" title={item.title}>
                        {item.title}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-medium text-slate-600">
                      {item.expectedTeams}
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-navy-900">
                      {item.teamsRegistered}
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-medium text-slate-600">
                      {item.expectedStudents}
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-emerald-700">
                      {item.studentsParticipated}
                      <span className="text-[10px] text-slate-400 block font-sans font-normal">
                        ({studentTurnout}%)
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {getStatusBadge(item.derivedStatus)}
                    </td>
                    <td className="py-3 px-4 text-slate-600 max-w-xs">
                      <div className="truncate text-[11px]" title={`${item.statusWon} · ${item.followUpCompleted}`}>
                        {item.statusWon ? <span className="font-semibold text-slate-800">{item.statusWon}</span> : null}
                        {item.statusWon && item.followUpCompleted ? ' · ' : null}
                        <span className="text-slate-500">{item.followUpCompleted}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedHackathon(item);
                        }}
                        className="text-pec-blue hover:text-navy-900 bg-blue-50 hover:bg-blue-100 p-1 rounded transition-colors"
                        title="View Full Hackathon Details"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={9} className="py-8 text-center text-slate-400">
                  No hackathon participation records match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-3 sm:p-4 border-t border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <span>Showing {sortedData.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length} records</span>
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

      {/* Details Modal / Drawer */}
      {selectedHackathon && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-elevated border border-slate-200 relative animate-scaleUp">
            
            <button
              onClick={() => setSelectedHackathon(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-3 mb-4">
              <div className="p-2.5 bg-blue-50 text-pec-blue rounded-xl border border-blue-200 shrink-0">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Hackathon Event Profile
                </span>
                <h3 className="text-lg font-bold text-navy-950 leading-tight mt-0.5">
                  {selectedHackathon.title}
                </h3>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              
              {/* Derived Status */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <span className="font-semibold text-slate-600">Current Status:</span>
                <div>{getStatusBadge(selectedHackathon.derivedStatus)}</div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100">
                  <span className="text-[11px] text-slate-500 block">Teams Registered / Expected</span>
                  <span className="text-lg font-extrabold text-navy-950 font-mono">
                    {selectedHackathon.teamsRegistered} <span className="text-xs text-slate-400 font-normal">/ {selectedHackathon.expectedTeams}</span>
                  </span>
                </div>

                <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
                  <span className="text-[11px] text-slate-500 block">Students Turnout / Target</span>
                  <span className="text-lg font-extrabold text-emerald-800 font-mono">
                    {selectedHackathon.studentsParticipated} <span className="text-xs text-slate-400 font-normal">/ {selectedHackathon.expectedStudents}</span>
                  </span>
                </div>
              </div>

              {/* Notes and Raw Fields */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div>
                  <span className="font-semibold text-slate-700 block">Status / Won Field:</span>
                  <p className="text-slate-600 mt-0.5">{selectedHackathon.statusWon || 'None recorded'}</p>
                </div>
                <div className="pt-2 border-t border-slate-200">
                  <span className="font-semibold text-slate-700 block">Follow-Up / Completed Notes:</span>
                  <p className="text-slate-600 mt-0.5">{selectedHackathon.followUpCompleted || 'None recorded'}</p>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
                <span>Row index in sheet: #{selectedHackathon.sourceRowIndex || selectedHackathon.sNo}</span>
                <span>Original Google Sheet single source</span>
              </div>

            </div>

            <div className="mt-5 pt-3 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedHackathon(null)}
                className="px-4 py-2 bg-navy-900 text-white font-semibold rounded-lg text-xs hover:bg-navy-800 transition-colors"
              >
                Close Details
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
