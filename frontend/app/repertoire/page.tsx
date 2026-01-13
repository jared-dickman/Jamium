'use client';

import { useState, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Trash2, Music, Disc3, ChevronDown, Users, Album } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { SapphireCard } from '@/components/ui/card';
import { DramaticLoader } from '@/components/ui/loaders/DramaticLoader';
import { cn } from '@/lib/utils';
import { useSongs, useDeleteSong } from '@/app/features/songs/hooks';
import { useArtists } from '@/app/features/artists/hooks';
import { ANIMATION_DURATION, SLIDE_UP_VARIANTS } from '@/lib/constants/animation.constants';

type ViewMode = 'songs' | 'artists' | 'albums';

const RepertoireTestIds = {
  container: 'repertoire-page',
  toggle: 'repertoire-toggle',
  songsList: 'songs-list',
  artistsList: 'artists-list',
  albumsList: 'albums-list',
} as const;

function ViewToggle({
  view,
  onViewChange,
  songsCount,
  artistsCount,
  albumsCount,
}: {
  view: ViewMode;
  onViewChange: (v: ViewMode) => void;
  songsCount: number | null;
  artistsCount: number | null;
  albumsCount: number | null;
}) {
  const getIndicatorPosition = () => {
    if (view === 'songs') return 4;
    if (view === 'artists') return 'calc(33.33%)';
    return 'calc(66.66%)';
  };

  return (
    <div
      className="relative grid grid-cols-3 gap-0.5 bg-sapphire-500/10 border border-sapphire-500/20 rounded-lg p-1"
      data-testid={RepertoireTestIds.toggle}
    >
      {/* Sliding indicator */}
      <motion.div
        className="absolute inset-y-1 w-[calc(33.33%-4px)] rounded-md bg-sapphire-500/20 border border-sapphire-500/30 pointer-events-none"
        animate={{ left: getIndicatorPosition() }}
        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
      />
      <button
        onClick={() => onViewChange('songs')}
        className={cn(
          'relative z-10 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium transition-colors rounded-md',
          view === 'songs' ? 'text-sapphire-300' : 'text-muted-foreground hover:text-foreground'
        )}
      >
        <Music className="h-4 w-4" />
        Songs{songsCount !== null && ` (${songsCount})`}
      </button>
      <button
        onClick={() => onViewChange('artists')}
        className={cn(
          'relative z-10 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium transition-colors rounded-md',
          view === 'artists' ? 'text-sapphire-300' : 'text-muted-foreground hover:text-foreground'
        )}
      >
        <Users className="h-4 w-4" />
        Artists{artistsCount !== null && ` (${artistsCount})`}
      </button>
      <button
        onClick={() => onViewChange('albums')}
        className={cn(
          'relative z-10 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium transition-colors rounded-md',
          view === 'albums' ? 'text-sapphire-300' : 'text-muted-foreground hover:text-foreground'
        )}
      >
        <Album className="h-4 w-4" />
        Albums{albumsCount !== null && ` (${albumsCount})`}
      </button>
    </div>
  );
}

function SongsView() {
  const { data: songs = [], isLoading } = useSongs();
  const { mutate: deleteSongMutation, isPending: isDeleting } = useDeleteSong();

  const sortedSongs = useMemo(
    () =>
      [...songs].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()),
    [songs]
  );

  function handleDelete(artistSlug: string, songSlug: string, title: string) {
    if (!confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) return;
    deleteSongMutation({ artistSlug, songSlug });
  }

  if (isLoading) {
    return (
      <div className="relative min-h-[300px]">
        <DramaticLoader isLoading={isLoading} size="lg" />
      </div>
    );
  }

  if (songs.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12 rounded-lg border border-sapphire-500/20 bg-card/30"
      >
        <Music className="h-12 w-12 mx-auto text-sapphire-400/40 mb-3" />
        <p className="text-muted-foreground">No songs yet. Use Buddy to find and save songs.</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
      initial="hidden"
      animate="show"
      variants={{
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.03 } },
      }}
      data-testid={RepertoireTestIds.songsList}
    >
      {sortedSongs.map(song => (
        <motion.div key={`${song.artistSlug}/${song.songSlug}`} variants={SLIDE_UP_VARIANTS}>
          <SapphireCard className="group">
            <Link href={`/repertoire/${song.artistSlug}/${song.songSlug}`} className="block p-4">
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
  );
}

function ArtistsView() {
  const { data: artists = [], isLoading } = useArtists();
  const [expandedArtist, setExpandedArtist] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="relative min-h-[300px]">
        <DramaticLoader isLoading={isLoading} size="lg" />
      </div>
    );
  }

  if (artists.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12 rounded-lg border border-sapphire-500/20 bg-card/30"
      >
        <Music className="h-12 w-12 mx-auto text-sapphire-400/40 mb-3" />
        <p className="text-muted-foreground">No artists yet. Save some songs to see them here.</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="space-y-2"
      initial="hidden"
      animate="show"
      variants={{
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.05 } },
      }}
      data-testid={RepertoireTestIds.artistsList}
    >
      {artists.map(artist => {
        const isExpanded = expandedArtist === artist.slug;
        return (
          <motion.div key={artist.slug} variants={SLIDE_UP_VARIANTS}>
            <SapphireCard className={cn(isExpanded && 'border-sapphire-500/40 bg-card/70')}>
              <button
                onClick={() =>
                  setExpandedArtist(prev => (prev === artist.slug ? null : artist.slug))
                }
                className="w-full flex items-center justify-between p-4 text-left"
              >
                <div className="flex items-center gap-3">
                  <Music className="h-5 w-5 text-sapphire-400" />
                  <div>
                    <h3 className="font-medium">{artist.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {artist.songCount} {artist.songCount === 1 ? 'song' : 'songs'}
                    </p>
                  </div>
                </div>
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: ANIMATION_DURATION.FAST }}
                >
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                </motion.div>
              </button>
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: ANIMATION_DURATION.FAST }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 pt-0 space-y-3 border-t border-sapphire-500/10">
                      <div className="pt-3 flex flex-wrap gap-2">
                        <Link href={artist.songsUrl}>
                          <Button variant="secondary" size="sm" className="gap-2">
                            <Disc3 className="h-4 w-4" />
                            View Songs
                          </Button>
                        </Link>
                      </div>
                      <p className="text-sm text-muted-foreground italic">
                        Ask Buddy about {artist.name}&apos;s influences, style, or history.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </SapphireCard>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

function AlbumsView() {
  const { data: songs = [], isLoading } = useSongs();
  const [expandedAlbum, setExpandedAlbum] = useState<string | null>(null);

  // Group songs by album
  const albumsMap = useMemo(() => {
    const map = new Map<string, typeof songs>();
    songs.forEach(song => {
      const albumKey = song.album || 'Unknown Album';
      if (!map.has(albumKey)) {
        map.set(albumKey, []);
      }
      map.get(albumKey)?.push(song);
    });
    return map;
  }, [songs]);

  const albums = useMemo(() => {
    return Array.from(albumsMap.entries())
      .map(([name, songs]) => ({ name, songs, songCount: songs.length }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [albumsMap]);

  if (isLoading) {
    return (
      <div className="relative min-h-[300px]">
        <DramaticLoader isLoading={isLoading} size="lg" />
      </div>
    );
  }

  if (albums.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12 rounded-lg border border-sapphire-500/20 bg-card/30"
      >
        <Album className="h-12 w-12 mx-auto text-sapphire-400/40 mb-3" />
        <p className="text-muted-foreground">No albums yet. Save some songs to see them here.</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="space-y-2"
      initial="hidden"
      animate="show"
      variants={{
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.05 } },
      }}
      data-testid={RepertoireTestIds.albumsList}
    >
      {albums.map(album => {
        const isExpanded = expandedAlbum === album.name;
        return (
          <motion.div key={album.name} variants={SLIDE_UP_VARIANTS}>
            <SapphireCard className={cn(isExpanded && 'border-sapphire-500/40 bg-card/70')}>
              <button
                onClick={() => setExpandedAlbum(prev => (prev === album.name ? null : album.name))}
                className="w-full flex items-center justify-between p-4 text-left"
              >
                <div className="flex items-center gap-3">
                  <Album className="h-5 w-5 text-sapphire-400" />
                  <div>
                    <h3 className="font-medium">{album.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {album.songCount} {album.songCount === 1 ? 'song' : 'songs'}
                    </p>
                  </div>
                </div>
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: ANIMATION_DURATION.FAST }}
                >
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                </motion.div>
              </button>
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: ANIMATION_DURATION.FAST }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 pt-0 space-y-2 border-t border-sapphire-500/10">
                      {album.songs.map(song => (
                        <Link
                          key={`${song.artistSlug}/${song.songSlug}`}
                          href={`/repertoire/${song.artistSlug}/${song.songSlug}`}
                          className="block p-3 rounded-md hover:bg-sapphire-500/10 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <Disc3 className="h-4 w-4 text-sapphire-400/60" />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{song.title}</p>
                              <p className="text-xs text-muted-foreground truncate">
                                {song.artist}
                              </p>
                            </div>
                            {song.key && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-sapphire-500/10 text-sapphire-400">
                                {song.key}
                              </span>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </SapphireCard>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

function RepertoireContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const viewParam = searchParams.get('view') as ViewMode | null;
  const [view, setView] = useState<ViewMode>(
    viewParam === 'artists' ? 'artists' : viewParam === 'albums' ? 'albums' : 'songs'
  );

  const handleViewChange = (newView: ViewMode) => {
    setView(newView);
    router.replace(`/repertoire?view=${newView}`, { scroll: false });
  };

  const { data: songs = [], isLoading: songsLoading } = useSongs();
  const { data: artists = [], isLoading: artistsLoading } = useArtists();
  const isLoaded = !songsLoading && !artistsLoading;

  // Calculate unique album count
  const albumsCount = useMemo(() => {
    if (!isLoaded) return null;
    const uniqueAlbums = new Set(songs.map(s => s.album || 'Unknown Album'));
    return uniqueAlbums.size;
  }, [songs, isLoaded]);

  return (
    <div className="space-y-4" data-testid={RepertoireTestIds.container}>
      <div className="flex flex-col items-end gap-1">
        <ViewToggle
          view={view}
          onViewChange={handleViewChange}
          songsCount={isLoaded ? songs.length : null}
          artistsCount={isLoaded ? artists.length : null}
          albumsCount={albumsCount}
        />
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.12 }}
        >
          {view === 'songs' ? <SongsView /> : view === 'artists' ? <ArtistsView /> : <AlbumsView />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default function RepertoirePage() {
  return (
    <Suspense
      fallback={
        <div className="relative min-h-[300px]">
          <DramaticLoader isLoading={true} size="lg" />
        </div>
      }
    >
      <RepertoireContent />
    </Suspense>
  );
}
