'use client';

import { useState } from 'react';
import { Launch } from '@/types/launches';
import { formatDate } from '@/utils/date';
import { Countdown } from './Countdown';
import { LaunchDetailsModal } from './LaunchDetailsModal';
import { isNearSunriseOrSunset } from '@/lib/sun-utils';
import { Sunrise, Sunset } from 'lucide-react';
import Image from 'next/image';

interface LaunchCardProps {
  launch: Launch;
}

export function LaunchCard({ launch }: LaunchCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isNear, type } = isNearSunriseOrSunset(
    launch.net,
    launch.pad.location.latitude,
    launch.pad.location.longitude
  );

  const hasVideoLinks = launch.vidURLs?.youtube_id || launch.vidURLs?.twitter_id;

  // Log video URLs for debugging
  console.log('Launch video URLs:', {
    name: launch.name,
    vidURLs: launch.vidURLs,
  });

  return (
    <>
      <div
        className={`border rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer ${
          isNear && type === 'sunrise' ? 'bg-amber-50' :
          isNear && type === 'sunset' ? 'bg-orange-50' :
          'bg-white'
        }`}
        onClick={() => setIsModalOpen(true)}
      >
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-gray-900">{launch.name}</h3>
              <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full
                ${launch.status.name.toLowerCase().includes('go') ? 'bg-green-100 text-green-800' :
                  launch.status.name.toLowerCase().includes('hold') ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'}`}>
                {launch.status.name}
              </span>
              {isNear && type === 'sunrise' && (
                <Sunrise className="h-4 w-4 text-amber-600" />
              )}
              {isNear && type === 'sunset' && (
                <Sunset className="h-4 w-4 text-orange-600" />
              )}
            </div>
            <div className="space-y-1 mt-2">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  <span className="font-medium text-gray-700">Launch Window:</span><br />
                  Start: {formatDate(launch.window_start)}<br />
                  End: {formatDate(launch.window_end)}
                </p>
                <Countdown targetDate={launch.net} className="text-blue-600" />
              </div>
              <p className="text-sm text-gray-500">
                <span className="font-medium text-gray-700">Launch Site:</span> {launch.pad.name}
              </p>
              <p className="text-sm text-gray-500">
                <span className="font-medium text-gray-700">Location:</span> {launch.pad.location.name}, {launch.pad.location.country_code}
              </p>
              <p className="text-sm text-gray-500">
                <span className="font-medium text-gray-700">Rocket:</span> {launch.rocket.configuration.full_name}
                {launch.rocket.configuration.variant && ` (${launch.rocket.configuration.variant})`}
              </p>
              {launch.probability !== null && (
                <p className="text-sm text-gray-500">
                  <span className="font-medium text-gray-700">Success Probability:</span> {launch.probability}%
                </p>
              )}
              {launch.weather_concerns && (
                <p className="text-sm text-gray-500">
                  <span className="font-medium text-gray-700">Weather Concerns:</span> {launch.weather_concerns}
                </p>
              )}
            </div>
          </div>
          {launch.image && (
            <div className="w-24 h-24 flex-shrink-0 relative">
              <Image
                src={launch.image}
                alt={launch.name}
                fill
                className="object-cover rounded"
                sizes="96px"
              />
            </div>
          )}
        </div>

        <div className="mt-2 flex flex-wrap gap-2">
          {launch.webcast_live && (
            <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
              Live Webcast
            </span>
          )}
        </div>

        {launch.mission && (
          <div className="mt-3">
            <h4 className="text-sm font-medium text-gray-900">Mission Details:</h4>
            <p className="mt-1 text-sm text-gray-500">{launch.mission.description}</p>
          </div>
        )}

        <div className="mt-3 flex gap-2">
          {hasVideoLinks ? (
            <>
              {launch.vidURLs?.youtube_id && (
                <a
                  href={`https://youtube.com/watch?v=${launch.vidURLs.youtube_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-1 text-sm font-medium text-red-700 bg-red-100 rounded-full hover:bg-red-200"
                  onClick={(e) => e.stopPropagation()}
                >
                  Watch on YouTube
                </a>
              )}
              {launch.vidURLs?.twitter_id && (
                <a
                  href={`https://twitter.com/i/status/${launch.vidURLs.twitter_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-700 bg-blue-100 rounded-full hover:bg-blue-200"
                  onClick={(e) => e.stopPropagation()}
                >
                  View on X
                </a>
              )}
            </>
          ) : (
            <span className="text-sm text-gray-500">
              Video links will be available closer to launch
            </span>
          )}
        </div>
      </div>

      <LaunchDetailsModal
        launch={launch}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}