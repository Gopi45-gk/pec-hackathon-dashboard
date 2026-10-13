import React, { useEffect, useState } from 'react';
import { CollegeLogo } from './CollegeLogo';

interface SplashScreenProps {
  onComplete: () => void;
  minDuration?: number; // default 2000ms
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ 
  onComplete,
  minDuration = 2000 
}) => {
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      onComplete();
      return;
    }

    // Smoothly animate the progress indicator from 0 to 100%
    const intervalTime = 20;
    const totalSteps = minDuration / intervalTime;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const currentPct = Math.min(100, Math.round((currentStep / totalSteps) * 100));
      setProgress(currentPct);

      if (currentStep >= totalSteps) {
        clearInterval(timer);
        setIsFadingOut(true);
        setTimeout(() => {
          onComplete();
        }, 400); // 400ms fade transition
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [minDuration, onComplete]);

  return (
    <div 
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-white transition-all duration-500 ease-out select-none ${
        isFadingOut ? 'opacity-0 scale-[1.02] pointer-events-none' : 'opacity-100 scale-100'
      }`}
      style={{
        background: 'radial-gradient(circle at 50% 45%, #ffffff 0%, #f8fafc 100%)'
      }}
    >
      <div className="flex flex-col items-center text-center max-w-lg px-6 animate-fadeIn">
        
        {/* College Logo Emblem */}
        <div className="relative mb-6 group">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white p-2.5 shadow-card border border-slate-200/80 flex items-center justify-center transition-transform duration-700 transform hover:scale-105">
            <CollegeLogo className="w-full h-full" fallbackSize="lg" />
          </div>
          {/* Subtle concentric accent ring */}
          <div className="absolute -inset-2 rounded-3xl border border-blue-100/60 -z-10 animate-pulse"></div>
        </div>

        {/* College Name */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold tracking-[0.25em] text-blue-700 uppercase block">
            An Autonomous Institution
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-navy-950 tracking-tight leading-tight">
            PRATHYUSHA ENGINEERING COLLEGE
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium tracking-normal mt-1">
            Hackathon Participation Dashboard 2026
          </p>
        </div>

        {/* Minimal Institutional Loading Indicator */}
        <div className="w-48 sm:w-56 mt-8">
          <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden border border-slate-200/50">
            <div 
              className="bg-navy-900 h-full rounded-full transition-all duration-75 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 font-mono">
            <span>INITIALIZING ANALYTICS</span>
            <span>{progress}%</span>
          </div>
        </div>

      </div>

      {/* Institutional Accreditation Footer in Splash */}
      <div className="absolute bottom-6 text-center text-[10px] text-slate-400 tracking-wider uppercase font-semibold">
        Research &amp; Innovation Excellence Cycle · 2026–2027
      </div>
    </div>
  );
};
