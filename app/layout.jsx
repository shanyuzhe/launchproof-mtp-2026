import './globals.css';

export const metadata = {
  title: 'LaunchProof',
  description: 'Launch readiness workspace for AI builders.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
