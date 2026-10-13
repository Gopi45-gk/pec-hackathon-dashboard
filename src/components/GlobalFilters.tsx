import React from 'react';
import { Search, Filter, RotateCcw, Calendar, Award, Building, BookOpen } from 'lucide-react';
import { GlobalFilterState } from '../types';

interface GlobalFiltersProps {
  filters: GlobalFilterState;
  onChange: (filters: GlobalFilterState) => void;
  hackathonOptions: string[];
  departmentOptions: string[];
  yearOptions: string[];
}

export const GlobalFilters: React.FC<GlobalFiltersProps> = ({
  filters,
  onChange,
  hackathonOptions,
  departmentOptions,
  yearOptions
}) => {
  const isFiltered = 
    filters.searchQuery !== '' || 
    filters.hackathon !== 'All' || 
    filters.status !== 'All' || 
    filters.department !== 'All' || 
    filters.academicYear !== 'All' || 
    filters.awardPosition !== 'All';

  const handleReset = () => {
    onChange({
      searchQuery: '',
      hackathon: 'All',
      status: 'All',
      department: 'All',
      academicYear: 'All',
      awardPosition: 'All',
      dateRange: 'All'
    });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-subtle mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-pec-blue" />
          <h3 className="text-sm font-bold text-navy-950">Dashboard Filters</h3>
          <span className="text-xs text-slate-400">
            (Synchronized across KPIs, Analytics Charts, and Data Tables)
          </span>
        </div>

        {isFiltered && (
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded-md transition-colors w-fit"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mt-3">
        
        {/* Search Input */}
        <div className="relative">
          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
            Search Keyword
          </label>
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search event, student..."
              value={filters.searchQuery}
              onChange={(e) => onChange({ ...filters, searchQuery: e.target.value })}
              className="w-full text-xs pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all text-slate-800 placeholder-slate-400"
            />
          </div>
        </div>

        {/* Hackathon Select */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
            Hackathon Event
          </label>
          <select
            value={filters.hackathon}
            onChange={(e) => onChange({ ...filters, hackathon: e.target.value })}
            className="w-full text-xs px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white text-slate-800"
          >
            <option value="All">All Hackathons ({hackathonOptions.length})</option>
            {hackathonOptions.map((h) => (
              <option key={h} value={h}>{h}</option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
            Participation Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => onChange({ ...filters, status: e.target.value })}
            className="w-full text-xs px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white text-slate-800"
          >
            <option value="All">All Statuses</option>
            <option value="Won Prize">Won Prize</option>
            <option value="Completed">Completed</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Registered">Registered / Pending</option>
            <option value="Needs Review">Needs Review</option>
          </select>
        </div>

        {/* Department Filter */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
            Department
          </label>
          <select
            value={filters.department}
            onChange={(e) => onChange({ ...filters, department: e.target.value })}
            className="w-full text-xs px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white text-slate-800"
          >
            <option value="All">All Departments</option>
            {departmentOptions.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* Academic Year Filter */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
            Academic Year
          </label>
          <select
            value={filters.academicYear}
            onChange={(e) => onChange({ ...filters, academicYear: e.target.value })}
            className="w-full text-xs px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white text-slate-800"
          >
            <option value="All">All Years</option>
            {yearOptions.map((y) => (
              <option key={y} value={y}>Year {y}</option>
            ))}
          </select>
        </div>

        {/* Award Position Filter */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
            Award Position
          </label>
          <select
            value={filters.awardPosition}
            onChange={(e) => onChange({ ...filters, awardPosition: e.target.value })}
            className="w-full text-xs px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white text-slate-800"
          >
            <option value="All">All Awards</option>
            <option value="First">First Prize</option>
            <option value="Second">Second Prize</option>
            <option value="Third">Third Prize</option>
            <option value="Special Award">Special / Model Award</option>
          </select>
        </div>

      </div>
    </div>
  );
};
