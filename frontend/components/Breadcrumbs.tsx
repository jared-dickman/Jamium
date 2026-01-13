'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSongs } from '@/lib/SongsContext';
import { useMemo } from 'react';

function SignalWave({ clickable = false, onClick }: { clickable?: boolean; onClick?: () => void }) {
  const className = `inline-flex items-center justify-center mx-5 opacity-50 ${clickable ? 'cursor-pointer hover:opacity-100 transition-opacity' : ''}`;

  return (
    <span className={className} aria-hidden={!clickable} onClick={onClick}>
      <svg width="24" height="16" viewBox="0 0 18 12" fill="none" className="text-foreground">
        <line
          x1="1"
          y1="5"
          x2="1"
          y2="7"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <line
          x1="5"
          y1="4"
          x2="5"
          y2="8"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <line
          x1="9"
          y1="2"
          x2="9"
          y2="10"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <line
          x1="13"
          y1="4"
          x2="13"
          y2="8"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <line
          x1="17"
          y1="5"
          x2="17"
          y2="7"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

interface Crumb {
  label: string;
  href: string;
}

export function Breadcrumbs() {
  const pathname = usePathname();
  const router = useRouter();
  const { songs } = useSongs();

  const crumbs = useMemo(() => {
    const segments = pathname.split('/').filter(Boolean);
    const result: Crumb[] = [];

    // Don't include Jamium - it's already in the header logo
    if (segments.length === 0) return result;

    // Map routes to friendly names
    const routeLabels: Record<string, string> = {
      repertoire: 'Repertoire',
      jam: 'Jam',
      studio: 'Studio',
      composer: 'Compose',
      'music-theory': 'Theory',
    };

    // Handle repertoire paths: /repertoire/[artist]/[song]
    if (segments[0] === 'repertoire') {
      result.push({ label: 'Repertoire', href: '/repertoire' });

      const artistSlug = segments[1];
      if (artistSlug) {
        const song = songs.find(s => s.artistSlug === artistSlug);
        const artistName = song?.artist ?? decodeURIComponent(artistSlug).replace(/_/g, ' ');
        result.push({ label: artistName, href: `/repertoire/${artistSlug}` });

        const songSlug = segments[2];
        if (songSlug) {
          const matchedSong = songs.find(
            s => s.artistSlug === artistSlug && s.songSlug === songSlug
          );
          const songTitle = matchedSong?.title ?? decodeURIComponent(songSlug).replace(/_/g, ' ');
          result.push({ label: songTitle, href: `/repertoire/${artistSlug}/${songSlug}` });
        }
      }
    } else {
      // Other routes
      const firstSegment = segments[0];
      if (firstSegment) {
        const label =
          routeLabels[firstSegment] ?? firstSegment.charAt(0).toUpperCase() + firstSegment.slice(1);
        result.push({ label, href: `/${firstSegment}` });
      }
    }

    return result;
  }, [pathname, songs]);

  const lastCrumb = crumbs[crumbs.length - 1];
  const parentCrumb = crumbs.length > 1 ? crumbs[crumbs.length - 2] : null;

  // Home page or no crumbs - show nothing
  if (crumbs.length === 0) {
    return null;
  }

  const handleMobileBack = () => {
    if (parentCrumb) {
      router.push(parentCrumb.href);
    } else {
      router.back();
    }
  };

  return (
    <nav className="flex items-center min-w-0" aria-label="Navigation">
      {/* Desktop: Full breadcrumb path */}
      <div className="hidden md:flex items-center">
        {crumbs.map((crumb, i) => {
          const isLast = i === crumbs.length - 1;
          return (
            <span key={crumb.href} className="flex items-center">
              <SignalWave />
              {isLast ? (
                <span className="text-xl font-bold text-foreground/90">{crumb.label}</span>
              ) : (
                <Link
                  href={crumb.href}
                  className="text-xl font-bold text-foreground/60 hover:text-foreground/80 transition-colors"
                >
                  {crumb.label}
                </Link>
              )}
            </span>
          );
        })}
      </div>

      {/* Mobile: Last item only, clickable wave to go back */}
      <div className="flex md:hidden items-center">
        <SignalWave clickable onClick={handleMobileBack} />
        <span className="text-xl font-bold text-foreground/90">{lastCrumb?.label}</span>
      </div>
    </nav>
  );
}
