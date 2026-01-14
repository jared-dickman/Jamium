'use client';

import { cn } from '@/lib/utils';
import { SECTION_COLORS, type SongSection } from '@/lib/jamProgressions';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';

interface SectionTabsProps {
  sections: Record<string, SongSection>;
  activeSectionLabel: string;
  onSectionChange: (label: string) => void;
  onAddSection: () => void;
  className?: string;
}

export function SectionTabs({
  sections,
  activeSectionLabel,
  onSectionChange,
  onAddSection,
  className,
}: SectionTabsProps) {
  const sectionLabels = Object.keys(sections).sort();

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Tabs value={activeSectionLabel} onValueChange={onSectionChange}>
        <TabsList className="bg-transparent p-0 gap-1">
          {sectionLabels.map(label => {
            const section = sections[label];
            const color = section?.color ?? SECTION_COLORS[label] ?? SECTION_COLORS.C;
            const isActive = label === activeSectionLabel;

            return (
              <TabsTrigger
                key={label}
                value={label}
                className={cn(
                  'relative min-w-[2.5rem] h-9 px-3 rounded-md font-bold text-sm transition-all',
                  'border-2 after:hidden',
                  isActive
                    ? 'bg-opacity-20 shadow-md scale-105'
                    : 'bg-opacity-10 hover:bg-opacity-15 hover:scale-102'
                )}
                style={{
                  backgroundColor: isActive ? `${color}30` : `${color}15`,
                  borderColor: isActive ? color : 'transparent',
                  color: isActive ? color : undefined,
                }}
              >
                <motion.span
                  initial={false}
                  animate={{ scale: isActive ? 1.1 : 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                >
                  {label}
                </motion.span>
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>

      <Button
        variant="outline"
        size="sm"
        onClick={onAddSection}
        className="h-9 w-9 p-0 rounded-md border-dashed border-2 hover:border-solid"
        aria-label="Add new section"
      >
        <Plus className="size-4" />
      </Button>
    </div>
  );
}
