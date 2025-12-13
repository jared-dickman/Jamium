/**
 * Composer Page - Redirects to Jam with Expert mode
 * The IntelligentComposer is now integrated into the unified Jam experience
 */

import { redirect } from 'next/navigation';

export default function ComposerPage() {
  redirect('/jam?mode=expert');
}
