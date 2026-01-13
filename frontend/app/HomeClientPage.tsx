'use client';

import { useState, useMemo } from 'react';
import { Trash2, Music, Disc3 } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

import { SapphireCard } from '@/components/ui/card';
import { DramaticLoader } from '@/components/ui/loaders/DramaticLoader';
import { useSongs, useDeleteSong } from '@/app/features/songs/hooks';
import { SLIDE_UP_VARIANTS } from '@/lib/constants/animation.constants';

interface StatusMessage {
  type: 'success' | 'error' | 'info';
  message: string;
}

const HomePageTestIds = {
  container: 'home-page',
  songsList: 'songs-list',
  artistGroup: 'artist-group',
} as const;

export default function HomePage() {
  const { data: songs = [], isLoading } = useSongs();
  const { mutate: deleteSongMutation, isPending: isDeleting } = useDeleteSong();
  const [status, setStatus] = useState<StatusMessage | null>(null);

  // Sort songs by most recently updated
  const sortedSongs = useMemo(
    () =>
      [...songs].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()),
    [songs]
  );

  function handleDelete(artistSlug: string, songSlug: string, title: string) {
    if (!confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
      return;
    }

    deleteSongMutation(
      { artistSlug, songSlug },
      {
        onSuccess: () => {
          setStatus({ type: 'success', message: `✨ ${title} deleted successfully.` });
          setTimeout(() => setStatus(null), 3000);
        },
        onError: error => {
          setStatus({ type: 'error', message: error.message || 'Failed to delete song.' });
        },
      }
    );
  }

  return (
    <div className="space-y-6" data-testid={HomePageTestIds.container}>
      {/* Songs Library */}
      <div className="space-y-2" data-testid={HomePageTestIds.songsList}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">
            Your Library
            <span className="text-muted-foreground font-normal ml-2 text-base">
              {isLoading ? '' : `(${songs.length} songs)`}
            </span>
          </h2>
        </div>

        {isLoading && (
          <div className="relative min-h-[300px]">
            <DramaticLoader isLoading={isLoading} size="lg" />
          </div>
        )}

        {!isLoading && songs.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 rounded-lg border border-sapphire-500/20 bg-card/30"
          >
            <Music className="h-12 w-12 mx-auto text-sapphire-400/40 mb-3" />
            <p className="text-muted-foreground">
              No songs yet. Use the agent above to find and save songs.
            </p>
          </motion.div>
        )}

        {!isLoading && songs.length > 0 && (
          <motion.div
            className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.03 },
              },
            }}
          >
            {sortedSongs.map(song => (
              <motion.div key={`${song.artistSlug}/${song.songSlug}`} variants={SLIDE_UP_VARIANTS}>
                <SapphireCard className="group">
                  <Link
                    href={`/repertoire/${song.artistSlug}/${song.songSlug}`}
                    className="block p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-md bg-sapphire-500/10 text-sapphire-400">
                        <Disc3 className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate group-hover:text-sapphire-400 transition-colors">
                          {song.title}
                        </h3>
                        <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {song.key && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-sapphire-500/10 text-sapphire-400">
                              {song.key}
                            </span>
                          )}
                          <span className="text-xs text-muted-foreground">
                            {new Date(song.updatedAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={e => {
                          e.preventDefault();
                          handleDelete(song.artistSlug, song.songSlug, song.title);
                        }}
                        disabled={isDeleting}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-destructive/10 rounded text-destructive disabled:opacity-50"
                        title="Delete song"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </Link>
                </SapphireCard>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
