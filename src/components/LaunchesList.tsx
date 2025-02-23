'use client';

import { useEffect, useState, useCallback } from 'react';
import { Launch } from '@/types/launches';
import { getUpcomingLaunches } from '@/services/launches';
import { LaunchCard } from './LaunchCard';
import { Filters } from './Filters';
import { useInView } from 'react-intersection-observer';
import { saveFilterPreferences, loadFilterPreferences, getCurrentMonth } from '@/lib/utils';

export function LaunchesList() {
  const [launches, setLaunches] = useState<Launch[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedRocket, setSelectedRocket] = useState<string | null>(null);
  const [selectedProbability, setSelectedProbability] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [availableLocations, setAvailableLocations] = useState<Array<{ name: string; country_code: string }>>([]);
  const [availableRockets, setAvailableRockets] = useState<Array<{ id: string; name: string; family: string }>>([]);
  const [availableStatuses, setAvailableStatuses] = useState<Array<{ name: string }>>([]);

  // Load saved preferences on mount
  useEffect(() => {
    const savedPreferences = loadFilterPreferences();
    if (savedPreferences) {
      setSelectedMonth(savedPreferences.selectedMonth);
      setSelectedLocation(savedPreferences.selectedLocation);
      setSelectedRocket(savedPreferences.selectedRocket);
      setSelectedProbability(savedPreferences.selectedProbability);
      setSelectedStatus(savedPreferences.selectedStatus);
    }
  }, []);

  // Save preferences when filters change
  useEffect(() => {
    saveFilterPreferences({
      selectedMonth,
      selectedLocation,
      selectedRocket,
      selectedProbability,
      selectedStatus,
    });
  }, [selectedMonth, selectedLocation, selectedRocket, selectedProbability, selectedStatus]);

  const { ref, inView } = useInView({
    threshold: 0,
  });

  const handleReset = useCallback(() => {
    setSelectedMonth(getCurrentMonth());
    setSelectedLocation(null);
    setSelectedRocket(null);
    setSelectedProbability(null);
    setSelectedStatus(null);
  }, []);

  const loadMoreLaunches = useCallback(async (currentPage = page, resetList = false) => {
    if ((loading || !hasMore) && !resetList) return;

    setLoading(true);
    setError(null);

    try {
      const response = await getUpcomingLaunches(currentPage, 25, selectedMonth);

      setLaunches(prevLaunches => {
        const existingLaunches = resetList ? [] : prevLaunches;
        const launchesMap = new Map(existingLaunches.map(launch => [launch.id, launch]));

        const filteredResults = response.results.filter(launch => {
          if (selectedLocation) {
            const [locationName, countryCode] = selectedLocation.split('|');
            if (launch.pad.location.name !== locationName ||
                launch.pad.location.country_code !== countryCode) {
              return false;
            }
          }

          if (selectedRocket && launch.rocket.configuration.id !== selectedRocket) {
            return false;
          }

          if (selectedProbability) {
            const probability = launch.probability;
            switch (selectedProbability) {
              case 'high':
                if (!probability || probability <= 80) return false;
                break;
              case 'medium':
                if (!probability || probability <= 50 || probability > 80) return false;
                break;
              case 'low':
                if (!probability || probability > 50) return false;
                break;
              case 'unknown':
                if (probability !== null) return false;
                break;
            }
          }

          if (selectedStatus && launch.status.name !== selectedStatus) {
            return false;
          }

          return true;
        });

        filteredResults.forEach(launch => {
          launchesMap.set(launch.id, launch);
        });

        if (resetList) {
          const locations = new Map(
            response.results.map(launch => [
              `${launch.pad.location.name}|${launch.pad.location.country_code}`,
              launch.pad.location
            ])
          );
          setAvailableLocations(Array.from(locations.values()));

          const rockets = new Map(
            response.results.map(launch => [
              launch.rocket.configuration.id,
              {
                id: launch.rocket.configuration.id,
                name: launch.rocket.configuration.name,
                family: launch.rocket.configuration.family
              }
            ])
          );
          setAvailableRockets(Array.from(rockets.values()));

          const statuses = new Map(
            response.results.map(launch => [
              launch.status.name,
              { name: launch.status.name }
            ])
          );
          setAvailableStatuses(Array.from(statuses.values()));
        }

        return Array.from(launchesMap.values());
      });

      setHasMore(!!response.next);
      setPage(currentPage + 1);

      if (response.results.length === 0 && currentPage === 1) {
        setError('No launches found for the selected filters');
        setHasMore(false);
      }
    } catch (err) {
      console.error('Error loading launches:', err);
      setError(err instanceof Error ? err.message : 'Failed to load launches. Please try again later.');
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [
    loading,
    hasMore,
    page,
    selectedMonth,
    selectedLocation,
    selectedRocket,
    selectedProbability,
    selectedStatus
  ]);

  // Reset and load launches when any filter changes
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    loadMoreLaunches(1, true);
  }, [loadMoreLaunches]);

  // Load more launches when scrolling
  useEffect(() => {
    if (inView && !loading && hasMore) {
      loadMoreLaunches();
    }
  }, [inView, loading, hasMore, loadMoreLaunches]);

  const handleRetry = useCallback(() => {
    setError(null);
    setPage(1);
    setHasMore(true);
    loadMoreLaunches(1, true);
  }, [loadMoreLaunches]);

  if (error && launches.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={handleRetry}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Filters
        selectedMonth={selectedMonth}
        onMonthChange={setSelectedMonth}
        selectedLocation={selectedLocation}
        onLocationChange={setSelectedLocation}
        availableLocations={availableLocations}
        selectedRocket={selectedRocket}
        onRocketChange={setSelectedRocket}
        availableRockets={availableRockets}
        selectedProbability={selectedProbability}
        onProbabilityChange={setSelectedProbability}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        availableStatuses={availableStatuses}
        onReset={handleReset}
      />

      <div className="space-y-4">
        {launches.length === 0 && loading ? (
          <div className="text-center py-8">Loading launches...</div>
        ) : launches.length === 0 ? (
          <div className="text-center py-8 text-gray-600">
            No launches found for the selected filters
          </div>
        ) : (
          <>
            {launches.map((launch) => (
              <LaunchCard key={launch.id} launch={launch} />
            ))}

            {error && (
              <div className="text-center py-4">
                <p className="text-red-600 mb-2">{error}</p>
                <button
                  onClick={handleRetry}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Try Again
                </button>
              </div>
            )}

            {loading && (
              <div className="text-center py-4">
                Loading more launches...
              </div>
            )}

            <div ref={ref} style={{ height: '20px' }} />

            {!hasMore && launches.length > 0 && (
              <div className="text-center py-4 text-gray-600">
                No more launches to load
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}