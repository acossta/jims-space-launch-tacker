import { Suspense } from 'react';
import { LaunchesList } from '@/components/LaunchesList';

export default function Home() {
  return (
    <div className="grid grid-rows-[auto_1fr_auto] min-h-screen p-8 pb-20 gap-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <header className="text-center">
        <h1 className="text-3xl font-bold mb-2">Jim&apos;s Space Launch Tracker</h1>
        <p className="text-gray-600">Track upcoming SpaceX launches in real-time</p>
      </header>

      <main className="w-full max-w-4xl mx-auto">
        <Suspense fallback={<div className="text-center py-8">Loading launches...</div>}>
          <LaunchesList />
        </Suspense>
      </main>

      <footer className="text-center text-gray-600">
        Jim&apos;s Space Launch Tracker
      </footer>
    </div>
  );
}
