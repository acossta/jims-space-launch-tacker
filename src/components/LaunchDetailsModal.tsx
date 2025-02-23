'use client';

import * as React from 'react';
import { Launch } from '@/types/launches';
import { formatDate } from '@/utils/date';
import { Countdown } from './Countdown';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

interface LaunchDetailsModalProps {
  launch: Launch;
  isOpen: boolean;
  onClose: () => void;
}

export function LaunchDetailsModal({ launch, isOpen, onClose }: LaunchDetailsModalProps) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-[50%] top-[50%] max-h-[85vh] w-[90vw] max-w-[800px] translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white p-6 shadow-lg overflow-y-auto">
          <div className="flex justify-between items-start mb-6">
            <Dialog.Title className="text-2xl font-bold text-gray-900">{launch.name}</Dialog.Title>
            <Dialog.Close className="rounded-full p-1.5 hover:bg-gray-100 text-gray-500 hover:text-gray-700">
              <X className="h-5 w-5" />
            </Dialog.Close>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left column */}
            <div className="space-y-4">
              {launch.image && (
                <div className="aspect-video w-full">
                  <img
                    src={launch.image}
                    alt={launch.name}
                    className="w-full h-full object-cover rounded-lg shadow-md"
                  />
                </div>
              )}

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Launch Timing</h3>
                <div className="space-y-2">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium text-gray-900">NET:</span> {formatDate(launch.net)}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium text-gray-900">Window Start:</span> {formatDate(launch.window_start)}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium text-gray-900">Window End:</span> {formatDate(launch.window_end)}
                  </p>
                  <Countdown targetDate={launch.net} className="mt-2 text-blue-700" />
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Launch Site</h3>
                <div className="space-y-2">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium text-gray-900">Pad:</span> {launch.pad.name}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium text-gray-900">Location:</span> {launch.pad.location.name}, {launch.pad.location.country_code}
                  </p>
                </div>
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Mission Status</h3>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full
                      ${launch.status.name.toLowerCase().includes('go') ? 'bg-green-100 text-green-800' :
                        launch.status.name.toLowerCase().includes('hold') ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'}`}>
                      {launch.status.name}
                    </span>
                    {launch.webcast_live && (
                      <span className="inline-block px-3 py-1 text-sm font-semibold rounded-full bg-red-100 text-red-800">
                        Live Webcast
                      </span>
                    )}
                  </div>
                  {launch.probability !== null && (
                    <p className="text-sm text-gray-700">
                      <span className="font-medium text-gray-900">Success Probability:</span> {launch.probability}%
                    </p>
                  )}
                  {launch.weather_concerns && (
                    <p className="text-sm text-gray-700">
                      <span className="font-medium text-gray-900">Weather Concerns:</span> {launch.weather_concerns}
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Rocket Information</h3>
                <div className="space-y-2">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium text-gray-900">Name:</span> {launch.rocket.configuration.full_name}
                  </p>
                  {launch.rocket.configuration.variant && (
                    <p className="text-sm text-gray-700">
                      <span className="font-medium text-gray-900">Variant:</span> {launch.rocket.configuration.variant}
                    </p>
                  )}
                  {launch.rocket.configuration.family && (
                    <p className="text-sm text-gray-700">
                      <span className="font-medium text-gray-900">Family:</span> {launch.rocket.configuration.family}
                    </p>
                  )}
                </div>
              </div>

              {launch.mission && (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Mission Details</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">{launch.mission.description}</p>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                {launch.vidURLs?.youtube_id && (
                  <a
                    href={`https://youtube.com/watch?v=${launch.vidURLs.youtube_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium shadow-sm"
                  >
                    Watch on YouTube
                  </a>
                )}
                {launch.vidURLs?.twitter_id && (
                  <a
                    href={`https://twitter.com/i/status/${launch.vidURLs.twitter_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium shadow-sm"
                  >
                    View on X
                  </a>
                )}
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}