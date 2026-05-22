import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'FlowCraft | Enterprise SaaS Project & Task Management',
  description:
    'Modern high-performance project management platform with real-time Kanban boards, velocity metrics, and team collaboration.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-50 dark:bg-slate-950 min-h-screen">
        {children}
      </body>
    </html>
  );
}
