import React, { useEffect, useState } from 'react';
import { 
  Layers, 
  Users, 
  UserCheck, 
  CheckCircle2, 
  Clock, 
  Trophy, 
  Percent, 
  TrendingUp,
  Target
} from 'lucide-react';
import { DashboardMetrics } from '../types';

interface KpiCardsProps {
  metrics: DashboardMetrics;
}

// Lightweight count-up hook for smooth initial number animation
function useCountUp(target: number, duration: number = 1000): number {
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
        setCount(Math.round(current * 10) / 10);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [target, duration]);

  return count;
}

export const KpiCards: React.FC<KpiCardsProps> = ({ metrics }) => {
  const animatedHackathons = useCountUp(metrics.totalHackathons, 800);
  const animatedExpTeams = useCountUp(metrics.totalExpectedTeams, 900);
  const animatedRegTeams = useCountUp(metrics.totalRegisteredTeams, 900);
  const animatedExpStudents = useCountUp(metrics.totalExpectedStudents, 1000);
  const animatedPartStudents = useCountUp(metrics.totalParticipatingStudents, 1000);
  const animatedRate = useCountUp(metrics.studentParticipationPercentage, 1000);
  const animatedPending = useCountUp(metrics.registeredPendingHackathons, 800);
  const animatedWins = useCountUp(metrics.totalAwardRecords, 800);

  const formatNumber = (num: number) => Math.round(num).toLocaleString('en-IN');

  const cards = [
    {
      label: 'Total Hackathons',
      value: formatNumber(animatedHackathons),
      subtitle: 'Tracked across 13 domains',
      icon: Layers,
      iconColor: 'text-slate-600',
      iconBg: 'bg-slate-100',
      tooltip: 'Total distinct hackathons cataloged in the institutional register'
    },
    {
      label: 'Expected Teams',
      value: formatNumber(animatedExpTeams),
      subtitle: 'Target institutional quota',
      icon: Target,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-50',
      tooltip: 'Cumulative expected team participation across all events'
    },
    {
      label: 'Registered Teams',
      value: formatNumber(animatedRegTeams),
      subtitle: `${metrics.totalExpectedTeams > 0 ? Math.round((metrics.totalRegisteredTeams / metrics.totalExpectedTeams) * 100) : 0}% of expected quota`,
      icon: Users,
      iconColor: 'text-indigo-600',
      iconBg: 'bg-indigo-50',
      tooltip: 'Teams with confirmed registration and participation status'
    },
    {
      label: 'Expected Students',
      value: formatNumber(animatedExpStudents),
      subtitle: 'Target student outreach',
      icon: UserCheck,
      iconColor: 'text-cyan-600',
      iconBg: 'bg-cyan-50',
      tooltip: 'Expected student participant numbers computed from registrations'
    },
    {
      label: 'Participating Students',
      value: formatNumber(animatedPartStudents),
      subtitle: 'Actual student involvements',
      icon: TrendingUp,
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-50',
      tooltip: 'Confirmed students who have actively attended or submitted projects'
    },
    {
      label: 'Participation Rate',
      value: `${animatedRate.toFixed(1)}%`,
      subtitle: 'Actual vs Target students',
      icon: Percent,
      iconColor: 'text-teal-600',
      iconBg: 'bg-teal-50',
      tooltip: 'Percentage of participating students relative to target expected students'
    },
    {
      label: 'Yet to Participate',
      value: formatNumber(animatedPending),
      subtitle: 'Active upcoming events',
      icon: Clock,
      iconColor: 'text-amber-600',
      iconBg: 'bg-amber-50',
      tooltip: 'Hackathons currently in registered or preparation stage'
    },
    {
      label: 'Prize-Winning Records',
      value: formatNumber(animatedWins),
      subtitle: `₹${metrics.totalPrizeMoney.toLocaleString('en-IN')} total honours`,
      icon: Trophy,
      iconColor: 'text-amber-500',
      iconBg: 'bg-amber-50',
      tooltip: 'Distinct winning achievements honoured by college management'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4">
      {cards.map((card, idx) => {
        const IconComponent = card.icon;
        return (
          <div
            key={idx}
            title={card.tooltip}
            className="bg-white border border-slate-200/90 rounded-xl p-4 sm:p-4.5 shadow-subtle hover:shadow-card hover:border-slate-300 transition-all duration-200 flex flex-col justify-between group cursor-default"
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[11px] font-semibold tracking-wider uppercase text-slate-500 line-clamp-1">
                {card.label}
              </span>
              <div className={`p-1.5 rounded-lg ${card.iconBg} ${card.iconColor} shrink-0 transition-transform group-hover:scale-105`}>
                <IconComponent className="w-3.5 h-3.5" />
              </div>
            </div>

            <div>
              <div className="text-xl sm:text-2xl font-bold text-navy-950 font-mono tracking-tight leading-none mb-1.5">
                {card.value}
              </div>
              <p className="text-[11px] text-slate-400 font-medium line-clamp-1">
                {card.subtitle}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
