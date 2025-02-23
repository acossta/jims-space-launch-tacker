'use client';

import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import * as Select from '@radix-ui/react-select';
import { cn } from '@/lib/utils';

interface FiltersProps {
  onMonthChange: (month: string) => void;
  selectedMonth: string;
  onLocationChange: (location: string | null) => void;
  selectedLocation: string | null;
  availableLocations: Array<{
    name: string;
    country_code: string;
  }>;
  onRocketChange: (rocket: string | null) => void;
  selectedRocket: string | null;
  availableRockets: Array<{
    id: string;
    name: string;
    family: string;
  }>;
  onProbabilityChange: (probability: string | null) => void;
  selectedProbability: string | null;
  onStatusChange: (status: string | null) => void;
  selectedStatus: string | null;
  availableStatuses: Array<{
    name: string;
  }>;
  onReset: () => void;
}

const PROBABILITY_RANGES = [
  { value: 'high', label: 'High (>80%)', min: 80, max: 100 },
  { value: 'medium', label: 'Medium (50-80%)', min: 50, max: 80 },
  { value: 'low', label: 'Low (<50%)', min: 0, max: 50 },
  { value: 'unknown', label: 'Unknown', min: null, max: null }
];

export function Filters({
  onMonthChange,
  selectedMonth,
  onLocationChange,
  selectedLocation,
  availableLocations,
  onRocketChange,
  selectedRocket,
  availableRockets,
  onProbabilityChange,
  selectedProbability,
  onStatusChange,
  selectedStatus,
  availableStatuses,
  onReset
}: FiltersProps) {
  const months = React.useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return Array.from({ length: 12 }, (_, i) => {
      const monthIndex = (currentMonth + i) % 12;
      const year = currentYear + Math.floor((currentMonth + i) / 12);
      const date = new Date(year, monthIndex);

      return {
        value: `${year}-${String(monthIndex + 1).padStart(2, '0')}`,
        label: date.toLocaleString('default', { month: 'long', year: 'numeric' })
      };
    });
  }, []);

  const locations = React.useMemo(() => {
    return availableLocations.map(loc => ({
      value: `${loc.name}|${loc.country_code}`,
      label: `${loc.name}, ${loc.country_code}`
    }));
  }, [availableLocations]);

  const rockets = React.useMemo(() => {
    return availableRockets.map(rocket => ({
      value: rocket.id,
      label: rocket.family ? `${rocket.name} (${rocket.family})` : rocket.name
    }));
  }, [availableRockets]);

  const statuses = React.useMemo(() => {
    return availableStatuses.map(status => ({
      value: status.name,
      label: status.name
    }));
  }, [availableStatuses]);

  return (
    <div className="flex flex-col gap-4 p-4 bg-white/80 backdrop-blur-lg rounded-lg shadow-sm border border-gray-200">
      <div className="flex flex-wrap gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700">Month</label>
          <Select.Root value={selectedMonth} onValueChange={onMonthChange}>
            <Select.Trigger
              className="inline-flex items-center justify-between rounded-md px-3 py-2 text-sm bg-white border border-gray-300 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[180px] text-gray-900 shadow-sm"
              aria-label="Month"
            >
              <Select.Value>
                {months.find(m => m.value === selectedMonth)?.label || 'Select month'}
              </Select.Value>
              <Select.Icon>
                <ChevronDown className="h-4 w-4 text-gray-600" />
              </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
              <Select.Content
                className="overflow-hidden bg-white rounded-md shadow-lg border border-gray-200"
                position="popper"
                sideOffset={5}
              >
                <Select.Viewport className="p-1">
                  {months.map((month) => (
                    <Select.Item
                      key={month.value}
                      value={month.value}
                      className={cn(
                        "relative flex items-center px-8 py-2 text-sm rounded-sm text-gray-900 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none cursor-pointer",
                        selectedMonth === month.value && "bg-blue-100 text-blue-900 font-medium"
                      )}
                    >
                      <Select.ItemText>{month.label}</Select.ItemText>
                    </Select.Item>
                  ))}
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700">Location</label>
          <Select.Root
            value={selectedLocation || 'all'}
            onValueChange={value => onLocationChange(value === 'all' ? null : value)}
          >
            <Select.Trigger
              className="inline-flex items-center justify-between rounded-md px-3 py-2 text-sm bg-white border border-gray-300 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[220px] text-gray-900 shadow-sm"
              aria-label="Location"
            >
              <Select.Value>
                {selectedLocation
                  ? locations.find(l => l.value === selectedLocation)?.label
                  : 'All locations'}
              </Select.Value>
              <Select.Icon>
                <ChevronDown className="h-4 w-4 text-gray-600" />
              </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
              <Select.Content
                className="overflow-hidden bg-white rounded-md shadow-lg border border-gray-200"
                position="popper"
                sideOffset={5}
              >
                <Select.Viewport className="p-1">
                  <Select.Item
                    value="all"
                    className={cn(
                      "relative flex items-center px-8 py-2 text-sm rounded-sm text-gray-900 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none cursor-pointer",
                      !selectedLocation && "bg-blue-100 text-blue-900 font-medium"
                    )}
                  >
                    <Select.ItemText>All locations</Select.ItemText>
                  </Select.Item>
                  {locations.map((location) => (
                    <Select.Item
                      key={location.value}
                      value={location.value}
                      className={cn(
                        "relative flex items-center px-8 py-2 text-sm rounded-sm text-gray-900 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none cursor-pointer",
                        selectedLocation === location.value && "bg-blue-100 text-blue-900 font-medium"
                      )}
                    >
                      <Select.ItemText>{location.label}</Select.ItemText>
                    </Select.Item>
                  ))}
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700">Rocket</label>
          <Select.Root
            value={selectedRocket || 'all'}
            onValueChange={value => onRocketChange(value === 'all' ? null : value)}
          >
            <Select.Trigger
              className="inline-flex items-center justify-between rounded-md px-3 py-2 text-sm bg-white border border-gray-300 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[220px] text-gray-900 shadow-sm"
              aria-label="Rocket"
            >
              <Select.Value>
                {selectedRocket
                  ? rockets.find(r => r.value === selectedRocket)?.label
                  : 'All rockets'}
              </Select.Value>
              <Select.Icon>
                <ChevronDown className="h-4 w-4 text-gray-600" />
              </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
              <Select.Content
                className="overflow-hidden bg-white rounded-md shadow-lg border border-gray-200"
                position="popper"
                sideOffset={5}
              >
                <Select.Viewport className="p-1">
                  <Select.Item
                    value="all"
                    className={cn(
                      "relative flex items-center px-8 py-2 text-sm rounded-sm text-gray-900 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none cursor-pointer",
                      !selectedRocket && "bg-blue-100 text-blue-900 font-medium"
                    )}
                  >
                    <Select.ItemText>All rockets</Select.ItemText>
                  </Select.Item>
                  {rockets.map((rocket) => (
                    <Select.Item
                      key={rocket.value}
                      value={rocket.value}
                      className={cn(
                        "relative flex items-center px-8 py-2 text-sm rounded-sm text-gray-900 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none cursor-pointer",
                        selectedRocket === rocket.value && "bg-blue-100 text-blue-900 font-medium"
                      )}
                    >
                      <Select.ItemText>{rocket.label}</Select.ItemText>
                    </Select.Item>
                  ))}
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700">Success Probability</label>
          <Select.Root
            value={selectedProbability || 'all'}
            onValueChange={value => onProbabilityChange(value === 'all' ? null : value)}
          >
            <Select.Trigger
              className="inline-flex items-center justify-between rounded-md px-3 py-2 text-sm bg-white border border-gray-300 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[180px] text-gray-900 shadow-sm"
              aria-label="Success Probability"
            >
              <Select.Value>
                {selectedProbability
                  ? PROBABILITY_RANGES.find(p => p.value === selectedProbability)?.label
                  : 'Any probability'}
              </Select.Value>
              <Select.Icon>
                <ChevronDown className="h-4 w-4 text-gray-600" />
              </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
              <Select.Content
                className="overflow-hidden bg-white rounded-md shadow-lg border border-gray-200"
                position="popper"
                sideOffset={5}
              >
                <Select.Viewport className="p-1">
                  <Select.Item
                    value="all"
                    className={cn(
                      "relative flex items-center px-8 py-2 text-sm rounded-sm text-gray-900 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none cursor-pointer",
                      !selectedProbability && "bg-blue-100 text-blue-900 font-medium"
                    )}
                  >
                    <Select.ItemText>Any probability</Select.ItemText>
                  </Select.Item>
                  {PROBABILITY_RANGES.map((range) => (
                    <Select.Item
                      key={range.value}
                      value={range.value}
                      className={cn(
                        "relative flex items-center px-8 py-2 text-sm rounded-sm text-gray-900 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none cursor-pointer",
                        selectedProbability === range.value && "bg-blue-100 text-blue-900 font-medium"
                      )}
                    >
                      <Select.ItemText>{range.label}</Select.ItemText>
                    </Select.Item>
                  ))}
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700">Status</label>
          <Select.Root
            value={selectedStatus || 'all'}
            onValueChange={value => onStatusChange(value === 'all' ? null : value)}
          >
            <Select.Trigger
              className="inline-flex items-center justify-between rounded-md px-3 py-2 text-sm bg-white border border-gray-300 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[180px] text-gray-900 shadow-sm"
              aria-label="Status"
            >
              <Select.Value>
                {selectedStatus
                  ? statuses.find(s => s.value === selectedStatus)?.label
                  : 'All statuses'}
              </Select.Value>
              <Select.Icon>
                <ChevronDown className="h-4 w-4 text-gray-600" />
              </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
              <Select.Content
                className="overflow-hidden bg-white rounded-md shadow-lg border border-gray-200"
                position="popper"
                sideOffset={5}
              >
                <Select.Viewport className="p-1">
                  <Select.Item
                    value="all"
                    className={cn(
                      "relative flex items-center px-8 py-2 text-sm rounded-sm text-gray-900 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none cursor-pointer",
                      !selectedStatus && "bg-blue-100 text-blue-900 font-medium"
                    )}
                  >
                    <Select.ItemText>All statuses</Select.ItemText>
                  </Select.Item>
                  {statuses.map((status) => (
                    <Select.Item
                      key={status.value}
                      value={status.value}
                      className={cn(
                        "relative flex items-center px-8 py-2 text-sm rounded-sm text-gray-900 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none cursor-pointer",
                        selectedStatus === status.value && "bg-blue-100 text-blue-900 font-medium"
                      )}
                    >
                      <Select.ItemText>{status.label}</Select.ItemText>
                    </Select.Item>
                  ))}
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={onReset}
          className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
}