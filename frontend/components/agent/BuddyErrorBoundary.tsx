'use client';

import type { ErrorInfo, ReactNode } from 'react';
import { Component } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { errorTracker } from '@/app/utils/error-tracker';
import {
  BUDDY_ICON_GLOW_ANIMATION,
  BUDDY_ICON_GLOW_TRANSITION,
  BUDDY_GRADIENT_SEND_BTN,
} from '@/lib/constants/buddy.constants';

interface BuddyErrorBoundaryProps {
  children: ReactNode;
  onReset?: () => void;
}

interface BuddyErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Buddy-styled Error Boundary
 * Catches errors in Buddy component tree with matching visual aesthetic
 */
export class BuddyErrorBoundary extends Component<
  BuddyErrorBoundaryProps,
  BuddyErrorBoundaryState
> {
  public state: BuddyErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): BuddyErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    errorTracker.captureException(error, {
      service: 'buddy-agent',
      componentStack: errorInfo.componentStack,
    });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  public render() {
    if (this.state.hasError) {
      return <BuddyErrorFallback onReset={this.handleReset} />;
    }

    return this.props.children;
  }
}

/** Styled fallback UI matching Buddy's aesthetic */
function BuddyErrorFallback({ onReset }: { onReset: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full flex flex-col items-center justify-center text-center py-8 px-4"
    >
      <motion.div
        animate={BUDDY_ICON_GLOW_ANIMATION}
        transition={BUDDY_ICON_GLOW_TRANSITION}
        className="h-14 w-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-red-500/20 flex items-center justify-center mb-4 border border-white/10"
      >
        <AlertTriangle className="h-7 w-7 text-amber-400/80" />
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-sm text-white/70 font-medium max-w-[200px]"
      >
        Buddy hit a wrong note
      </motion.p>

      <Button
        onClick={onReset}
        className={cn('mt-4 h-8 px-4 rounded-lg text-xs', BUDDY_GRADIENT_SEND_BTN)}
      >
        <RefreshCcw className="h-3 w-3 mr-1.5" />
        Try Again
      </Button>
    </motion.div>
  );
}

export default BuddyErrorBoundary;
