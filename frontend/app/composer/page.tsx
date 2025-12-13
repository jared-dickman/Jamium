/**
 * Composer Page - Redirects to Jam with Expert mode
 * The IntelligentComposer is now integrated into the unified Jam experience
 */

import { redirect } from 'next/navigation';
import { pageRoutes } from '@/lib/routes';

export default function ComposerPage() {
  redirect(`${pageRoutes.jam}?mode=expert`);
}
