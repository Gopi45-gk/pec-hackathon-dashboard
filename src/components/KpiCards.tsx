import React, { useEffect, useState } from 'react';
import { 
  Layers, 
  Users, 
  UserCheck, 
  Trophy, 
  Clock
} from 'lucide-react';
import { DashboardMetrics } from '../types';
import { 
  TOTAL_OFFICIAL_DOC_AWARDS, 
  TOTAL_OFFICIAL_DOC_PRIZE 
} from '../data/officialDocWinners';

interface KpiCardsProps {
  metrics: DashboardMetrics;
}

// Lightweight count-up hook for smooth initial number animation
function useCountUp(target: number, duration: number = 800): number {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || target === 0) {
      setCount(target);
      return;
    }

    let start = 0;
    const end = target;
    const stepTime = 16;
    const totalSteps = duration / stepTime;
    const increment = (end - start) / totalSteps;
    let current = start;

    const timer = setInterval(() => {
      current += increment;
      if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.round(current));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [target, duration]);

  return count;
}

export const KpiCards: React.FC<KpiCardsProps> = ({ metrics }) => {
  // Live participation metrics
  const animatedHackathons = useCountUp(metrics.totalHackathons);
  const animatedTeams = useCountUp(metrics.totalRegisteredTeams);
  const animatedStudents = useCountUp(metrics.totalParticipatingStudents);
  const animatedUpcoming = useCountUp(metrics.yetToParticipateHackathons);

  // Authoritative Word document winners metrics (hackathon 2026.docx)
  const animatedAwards = useCountUp(TOTAL_OFFICIAL_DOC_AWARDS);

  const formatNumber = (num: number) => Math.round(num).toLocaleString('en-IN');

  const cards = [
    {
      id: 'total-hackathons',
      label: 'Total Hackathons',
      value: formatNumber(animatedHackathons),
      subtitle: 'Unique hackathon records',
      icon: Layers,
      iconColor: 'text-slate-700',
      iconBg: 'bg-slate-100',
      sourceBadge: 'Live Sheet',
    },
    {
      id: 'total-teams',
      label: 'Total Teams',
      value: formatNumber(animatedTeams),
      subtitle: metrics.totalExpectedTeams > 0 
        ? `Actual participating (Target: ${formatNumber(metrics.totalExpectedTeams)})`
        : 'Actual participating teams',
      icon: Users,
      iconColor: 'text-blue-700',
      iconBg: 'bg-blue-50',
      sourceBadge: 'Live Sheet',
    },
    {
      id: 'total-students',
      label: 'Total Students',
      value: formatNumber(animatedStudents),
      subtitle: metrics.totalExpectedStudents > 0
        ? `Actual participants (Target: ${formatNumber(metrics.totalExpectedStudents)})`
        : 'Actual participating students',
      icon: UserCheck,
      iconColor: 'text-indigo-700',
      iconBg: 'bg-indigo-50',
      sourceBadge: 'Live Sheet',
    },
    {
      id: 'winning-teams',
      label: 'Winning Teams / Award Records',
      value: formatNumber(animatedAwards),
      subtitle: `₹${TOTAL_OFFICIAL_DOC_PRIZE.toLocaleString('en-IN')} cash awarded`,
      icon: Trophy,
      iconColor: 'text-amber-600',
      iconBg: 'bg-amber-50',
      sourceBadge: 'Official Doc',
    },
    {
      id: 'upcoming-hackathons',
      label: 'Upcoming / Yet to Participate',
      value: formatNumber(animatedUpcoming),
      subtitle: 'Registered & pending events',
      icon: Clock,
      iconColor: 'text-purple-700',
      iconBg: 'bg-purple-50',
      sourceBadge: 'Live Sheet',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
      {cards.map((card) => {
        const IconComponent = card.icon;
        return (
          <div
            key={card.id}
            className="bg-white border border-slate-200/90 rounded-xl p-3 sm:p-4 shadow-subtle hover:shadow-card hover:border-slate-300 transition-all duration-200 flex flex-col justify-between group min-w-0 last:col-span-2 md:last:col-span-1 lg:last:col-span-1"
          >
            <div className="flex items-center justify-between gap-1.5 mb-2">
              <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 uppercase tracking-wider truncate" title={card.label}>
                {card.label}
              </span>
              <div className={`p-1 sm:p-1.5 rounded-lg ${card.iconBg} ${card.iconColor} shrink-0`}>
                <IconComponent className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
            </div>

            <div className="my-0.5 sm:my-1">
              <span className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-navy-950 tracking-tight font-sans">
                {card.value}
              </span>
            </div>

            <p className="text-[10px] sm:text-[11px] text-slate-500 mt-1 truncate" title={card.subtitle}>
              {card.subtitle}
            </p>
          </div>
        );
      })}
    </div>
  );
};
