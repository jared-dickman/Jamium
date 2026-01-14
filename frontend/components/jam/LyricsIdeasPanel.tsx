'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronDown, ChevronUp, Sparkles, Lightbulb, PenLine, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { LyricsSection, SongSection, Vibe } from '@/lib/jamProgressions';

interface LyricsIdeasPanelProps {
  lyrics: LyricsSection[];
  ideas: string;
  sections: Record<string, SongSection>;
  currentKey: string;
  currentVibe: Vibe[];
  onLyricsChange: (lyrics: LyricsSection[]) => void;
  onIdeasChange: (ideas: string) => void;
  onRequestAI: (action: 'generate_lyrics' | 'suggest_themes', sectionId?: string) => void;
  isAILoading?: boolean;
}

export default function LyricsIdeasPanel({
  lyrics,
  ideas,
  sections,
  currentKey,
  currentVibe,
  onLyricsChange,
  onIdeasChange,
  onRequestAI,
  isAILoading,
}: LyricsIdeasPanelProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<'lyrics' | 'ideas'>('lyrics');

  const sectionLabels = Object.keys(sections);

  const handleLyricUpdate = (sectionId: string, content: string) => {
    const existing = lyrics.find(l => l.id === sectionId);
    if (existing) {
      onLyricsChange(lyrics.map(l => (l.id === sectionId ? { ...l, content } : l)));
    } else {
      const section = sections[sectionId];
      if (section) {
        onLyricsChange([
          ...lyrics,
          {
            id: sectionId,
            type: section.sectionType,
            content,
            linkedSectionLabel: sectionId,
          },
        ]);
      }
    }
  };

  const getLyricContent = (sectionId: string): string => {
    return lyrics.find(l => l.id === sectionId || l.linkedSectionLabel === sectionId)?.content || '';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <PenLine className="w-5 h-5" />
              Lyrics & Ideas
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="h-8 w-8 p-0"
            >
              <motion.div animate={{ rotate: isCollapsed ? 0 : 180 }} transition={{ duration: 0.2 }}>
                <ChevronUp className="w-4 h-4" />
              </motion.div>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Key: {currentKey} | Vibe: {currentVibe.join(', ')}
          </p>
        </CardHeader>

        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CardContent className="pt-0">
                <Tabs value={activeTab} onValueChange={v => setActiveTab(v as 'lyrics' | 'ideas')}>
                  <TabsList className="mb-4">
                    <TabsTrigger value="lyrics" className="flex items-center gap-1.5">
                      <PenLine className="w-3.5 h-3.5" />
                      Lyrics
                    </TabsTrigger>
                    <TabsTrigger value="ideas" className="flex items-center gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5" />
                      Ideas
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="lyrics" className="space-y-4">
                    {sectionLabels.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        Add sections to your song to write lyrics
                      </p>
                    ) : (
                      sectionLabels.map(label => {
                        const section = sections[label];
                        if (!section) return null;
                        return (
                          <div key={label} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <label className="text-sm font-medium flex items-center gap-2">
                                <span
                                  className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold text-white"
                                  style={{ backgroundColor: section.color || 'hsl(210, 90%, 60%)' }}
                                >
                                  {label}
                                </span>
                                {section.name} ({section.sectionType})
                              </label>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onRequestAI('generate_lyrics', label)}
                                disabled={isAILoading}
                                className="h-7 text-xs"
                              >
                                {isAILoading ? (
                                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                                ) : (
                                  <Sparkles className="w-3 h-3 mr-1" />
                                )}
                                Generate
                              </Button>
                            </div>
                            <Textarea
                              placeholder={`Write ${section.sectionType} lyrics here...`}
                              value={getLyricContent(label)}
                              onChange={e => handleLyricUpdate(label, e.target.value)}
                              className="min-h-[80px] text-sm"
                            />
                          </div>
                        );
                      })
                    )}
                  </TabsContent>

                  <TabsContent value="ideas" className="space-y-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-muted-foreground">
                        Freeform scratchpad for themes, rhymes, and inspiration
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onRequestAI('suggest_themes')}
                        disabled={isAILoading}
                        className="h-7 text-xs"
                      >
                        {isAILoading ? (
                          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                        ) : (
                          <Lightbulb className="w-3 h-3 mr-1" />
                        )}
                        Suggest Themes
                      </Button>
                    </div>
                    <Textarea
                      placeholder="Jot down ideas, rhyme schemes, themes, snippets..."
                      value={ideas}
                      onChange={e => onIdeasChange(e.target.value)}
                      className="min-h-[150px] text-sm"
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}
