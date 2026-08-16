import type {Metadata} from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://synapse.dev'),
  title: 'Synapse OS — AI-Native CFO Operating System',
  description: 'Enterprise-grade AI operating system for finance teams. Real-time financial intelligence, autonomous agents, and predictive analytics.',
  alternates: {
    canonical: '/',
  }
};
import { ClientProviders } from '@/components/Providers';

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${jetbrainsMono.variable}`}>
      <body>
        <ClientProviders />
        {children}
      </body>
    </html>
  );
}
