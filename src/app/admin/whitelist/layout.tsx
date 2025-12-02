import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth-helpers';

export default async function WhitelistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    // Verify user is super admin
    await requireAdmin();
  } catch (error) {
    // Not authorized, redirect to dashboard
    redirect('/dashboard');
  }

  return <>{children}</>;
}
