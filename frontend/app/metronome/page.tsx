'use client';

import dynamic from 'next/dynamic';
import { RandomLoader } from '@/components/ui/loaders/RandomLoader';

const MetronomeClient = dynamic(
  () => import('@/app/metronome/MetronomeClient').then(mod => ({ default: mod.MetronomeClient })),
  {
    ssr: false,
    loading: () => <RandomLoader />,
  }
);

export default function MetronomePage() {
  return <MetronomeClient />;
}
