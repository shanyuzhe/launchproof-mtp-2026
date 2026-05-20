import './globals.css';
import PendoInstall from './pendo-install';

export const metadata = {
  title: 'LaunchProof',
  description: 'Launch readiness workspace for AI builders.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <PendoInstall />
        {children}
      </body>
    </html>
  );
}
