import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PitchForge — AI Pitch Studio powered by Miro + Qwen',
  description: 'Turn your raw problem statement and Miro workspace into a battle-tested pitch package, presentations, speaker scripts, and AI judge defenses.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#080C14] text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
