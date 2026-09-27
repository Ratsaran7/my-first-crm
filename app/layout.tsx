import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { CRMProvider } from '@/context/CRMContext';
import { ToastProvider } from '@/components/ui/Toast';
import { AppShell } from '@/components/layout/AppShell';

export const metadata: Metadata = {
  title: 'NexusCRM - Enterprise Sales & Relationship Platform',
  description:
    'A modern, high-performance Customer Relationship Management platform built with Next.js, TypeScript, and Tailwind CSS.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="min-h-screen antialiased bg-slate-50 dark:bg-slate-950">
        <ThemeProvider>
          <CRMProvider>
            <ToastProvider>
              <AppShell>{children}</AppShell>
            </ToastProvider>
          </CRMProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
