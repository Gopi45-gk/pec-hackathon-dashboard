import React, { useState, useMemo } from 'react';
import { Clock, Search, Calendar, Users, Layers, AlertCircle } from 'lucide-react';
import { ParticipationRecord } from '../types';

interface UpcomingHackathonsProps {
  participation: ParticipationRecord[];
}

export const UpcomingHackathons: React.FC<UpcomingHackathonsProps> = ({ participation }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter only hackathons that are registered and genuinely yet to be participated in
  const upcomingRecords = useMemo(() => {
    return participation.filter(p => {
      const fUp = (p.followUpCompleted || '').toLowerCase();
      const sWon = (p.statusWon || '').toLowerCase();
      return p.derivedStatus === 'Registered' || fUp.includes('yet to') || sWon.includes('yet to');
    });
  }, [participation]);

  // Check if dates are available in records
  const hasValidDates = useMemo(() => {
    return upcomingRecords.some(p => {
      const combined = `${p.title} ${p.followUpCompleted}`;
      return /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|\d{1,2}[\/\.-]\d{1,2})\b/i.test(combined);
    });
  }, [upcomingRecords]);

  // Extract date string if present
  const extractDate = (p: ParticipationRecord): string | null => {
    const combined = `${p.title} ${p.followUpCompleted}`;
    const match = combined.match(/\b(sep(?:tember)?\s*\d{1,2}(?:\s*-\s*\d{1,2})?|aug(?:ust)?\s*\d{1,2}|\d{1,2}\/\d{1,2}(?:\/\d{2,4})?)\b/i);
    return match ? match[0] : null;
  };

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return upcomingRecords;
    const q = searchQuery.toLowerCase().trim();
    return upcomingRecords.filter(p => 
      p.title.toLowerCase().includes(q) || 
      (p.followUpCompleted && p.followUpCompleted.toLowerCase().includes(q))
    );
  }, [upcomingRecords, searchQuery]);

  const sectionTitle = hasValidDates 
    ? "Upcoming Hackathons & Registered Events" 
    : "Registered / Pending Participation";

  return (
    <div className="bg-white border border-slate-200/90 rounded-xl shadow-subtle overflow-hidden">
      
      {/* Section Header */}
      <div className="p-4 sm:p-5 border-b border-slate-200/90 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-purple-700" />
            <h3 className="text-base font-bold text-navy-950">
              {sectionTitle}
            </h3>
            <span className="bg-purple-50 text-purple-700 border border-purple-200 text-xs font-semibold px-2 py-0.5 rounded-full">
              {upcomingRecords.length} Events
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Confirmed registrations currently pending event attendance and completion
          </p>
        </div>

        {/* Compact Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search pending events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-navy-950 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      {/* Table / List */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <th className="py-3 px-4 w-12 text-center">#</th>
              <th className="py-3 px-4">Hackathon Name</th>
              <th className="py-3 px-4 text-center">Registered Teams</th>
              <th className="py-3 px-4 text-center">Student Count</th>
              <th className="py-3 px-4">Schedule / Date</th>
              <th className="py-3 px-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {filtered.length > 0 ? (
              filtered.map((item, index) => {
                const dateStr = extractDate(item);
                return (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 text-center font-medium text-slate-400">
                      {index + 1}
                    </td>
                    <td className="py-3 px-4 font-semibold text-navy-950 max-w-sm">
                      <div className="truncate" title={item.title}>
                        {item.title}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-navy-900">
                      {item.teamsRegistered || item.expectedTeams || 1}
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-medium text-slate-600">
                      {item.studentsParticipated || item.expectedStudents || (item.teamsRegistered ? item.teamsRegistered * 4 : 4)}
                      <span className="text-[10px] text-slate-400 font-sans block">students</span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 text-xs">
                      {dateStr ? (
                        <span className="inline-flex items-center gap-1.5 text-blue-800 font-medium bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                          <Calendar className="w-3 h-3 text-blue-600" />
                          {dateStr}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">Date not scheduled</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-50 text-purple-800 border border-purple-200">
                        <Clock className="w-3 h-3 text-purple-600" />
                        Yet to Participate
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                  {searchQuery ? 'No matching pending hackathons found.' : 'No upcoming hackathons pending participation.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};
