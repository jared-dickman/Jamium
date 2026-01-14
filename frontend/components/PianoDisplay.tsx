'use client';

import { PianoKeyboard } from '@/components/PianoKeyboard';
import type { PianoChordVoicing } from '@/lib/pianoChords';
import { getPianoChordVoicings } from '@/lib/pianoChords';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Piano } from 'lucide-react';
import { useChordVoicings } from '@/lib/hooks/useChordVoicings';

interface PianoDisplayProps {
  chordName: string | null;
  className?: string;
}

export function PianoDisplay({ chordName, className = '' }: PianoDisplayProps) {
  const {
    voicings,
    currentIndex: currentVoicingIndex,
    setCurrentIndex: setCurrentVoicingIndex,
  } = useChordVoicings<PianoChordVoicing>({
    chordName,
    getVoicings: getPianoChordVoicings,
  });

  if (!chordName) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Piano className="h-5 w-5" />
            Interactive Piano
          </CardTitle>
          <CardDescription>Select a song to see chord diagrams</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[200px] text-muted-foreground">
            <div className="text-center">
              <Piano className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Chords will appear here when you view a song</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (voicings.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Piano className="h-5 w-5" />
            Interactive Piano
          </CardTitle>
          <CardDescription>Chord: {chordName}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[200px] text-muted-foreground">
            <div className="text-center">
              <p>No piano chord diagram available for</p>
              <Badge variant="outline" className="mt-2">
                {chordName}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Piano className="h-5 w-5" />
          Interactive Piano
        </CardTitle>
        <CardDescription>Click the keyboard to hear the chord</CardDescription>
      </CardHeader>
      <CardContent>
        <PianoKeyboard
          voicings={voicings}
          currentVoicingIndex={currentVoicingIndex}
          onVoicingChange={setCurrentVoicingIndex}
        />
      </CardContent>
    </Card>
  );
}
