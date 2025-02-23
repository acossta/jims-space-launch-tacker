import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface FilterPreferences {
  selectedMonth: string;
  selectedLocation: string | null;
  selectedRocket: string | null;
  selectedProbability: string | null;
  selectedStatus: string | null;
}

const FILTER_PREFERENCES_KEY = 'space-launches-filters';

export function getCurrentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

export function saveFilterPreferences(preferences: FilterPreferences): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(FILTER_PREFERENCES_KEY, JSON.stringify(preferences));
  }
}

export function loadFilterPreferences(): FilterPreferences | null {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(FILTER_PREFERENCES_KEY);
    if (saved) {
      try {
        const preferences = JSON.parse(saved);
        // Always use current month, but keep other preferences
        return {
          ...preferences,
          selectedMonth: getCurrentMonth()
        };
      } catch (e) {
        console.error('Error parsing filter preferences:', e);
        localStorage.removeItem(FILTER_PREFERENCES_KEY);
      }
    }
  }
  return null;
}

export function clearFilterPreferences(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(FILTER_PREFERENCES_KEY);
  }
}