'use client';

import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { RandomLoader } from '@/components/ui/loaders/RandomLoader';

const JamAssistantClient = dynamic(() => import('@/components/JamAssistantClient'), {
  ssr: false,
  loading: () => <RandomLoader />,
});

function JamContent() {
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode');

  return <JamAssistantClient initialMode={mode} />;
}

export default function JamPage() {
  return (
    <Suspense fallback={<RandomLoader />}>
      <JamContent />
    </Suspense>
  );
}
