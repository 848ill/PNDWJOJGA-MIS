// app/(dashboard)/layout.tsx
import Header from '@/components/shared/Header';
import Sidebar from '@/components/shared/Sidebar';
import { cn } from '@/lib/utils';
import { ThemeProvider } from "@/components/shared/theme-provider";
import { getDashboardData } from './dashboard-data-provider';
import DashboardClientLayout from './dashboard-client-layout';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, userRole } = await getDashboardData();

  return (
    <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
      <DashboardClientLayout user={user} userRole={userRole}>
        {children}
      </DashboardClientLayout>
    </ThemeProvider>
  );
}