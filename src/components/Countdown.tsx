'use client';

import { useEffect, useState } from 'react';

interface CountdownProps {
  targetDate: string;
  className?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function Countdown({ targetDate, className = '' }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [isToday, setIsToday] = useState(false);

  useEffect(() => {
    function calculateTimeLeft(): TimeLeft | null {
      const difference = new Date(targetDate).getTime() - new Date().getTime();

      if (difference <= 0) {
        return null;
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    }

    function checkIfToday() {
      const target = new Date(targetDate);
      const now = new Date();
      return target.getDate() === now.getDate() &&
             target.getMonth() === now.getMonth() &&
             target.getFullYear() === now.getFullYear();
    }

    // Initial calculations
    setTimeLeft(calculateTimeLeft());
    setIsToday(checkIfToday());

    // Update countdown every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!timeLeft) {
    return null;
  }

  // For launches not today, show a simplified display
  if (!isToday) {
    return (
      <div className={`text-sm ${className}`}>
        Launches in {timeLeft.days} day{timeLeft.days !== 1 ? 's' : ''}
      </div>
    );
  }

  // For launches today, show detailed countdown
  return (
    <div className={`flex gap-2 text-sm ${className}`}>
      <div className="flex flex-col items-center">
        <span className="font-bold">{timeLeft.hours.toString().padStart(2, '0')}</span>
        <span className="text-xs text-gray-500">hours</span>
      </div>
      <div className="flex items-start">:</div>
      <div className="flex flex-col items-center">
        <span className="font-bold">{timeLeft.minutes.toString().padStart(2, '0')}</span>
        <span className="text-xs text-gray-500">min</span>
      </div>
      <div className="flex items-start">:</div>
      <div className="flex flex-col items-center">
        <span className="font-bold">{timeLeft.seconds.toString().padStart(2, '0')}</span>
        <span className="text-xs text-gray-500">sec</span>
      </div>
    </div>
  );
}