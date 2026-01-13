'use client';

import { useSongDetail } from '@/app/features/songs/hooks';
import SongClient from '@/app/repertoire/[artist]/[song]/SongClient';
import { DramaticLoader } from '@/components/ui/loaders/DramaticLoader';
import { use } from 'react';

interface SongPageProps {
  params: Promise<{
    artist: string;
    song: string;
  }>;
}

export default function SongPage({ params }: SongPageProps) {
  const { artist, song } = use(params);
  const { data: songData, isLoading, error } = useSongDetail(artist, song);

  if (isLoading) {
    return (
      <div className="relative min-h-[32rem]">
        <DramaticLoader isLoading={isLoading} size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[24rem] text-center">
        <div className="text-6xl mb-4">🎸</div>
        <h2 className="text-xl font-semibold text-destructive mb-2">Failed to load song</h2>
        <p className="text-muted-foreground">{error.message}</p>
      </div>
    );
  }

  if (!songData || !songData.sections) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[24rem] text-center">
        <div className="text-6xl mb-4">🎵</div>
        <h2 className="text-xl font-semibold mb-2">Song not found</h2>
        <p className="text-muted-foreground">
          This song may have been removed or the link is incorrect.
        </p>
      </div>
    );
  }

  return (
    <SongClient
      song={{
        artist: songData.artist,
        title: songData.title,
        key: songData.key,
        sections: songData.sections,
      }}
      artistSlug={artist}
      songSlug={song}
    />
  );
}
