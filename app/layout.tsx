import '../styles/globals.css';
import type { Metadata } from 'next';
import Header from './components/Header';
import { UserProvider } from './context/UserContext';

export const metadata: Metadata = {
  title: 'Taste Journal',
  description: 'Save external recipes and manage your own collection',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          <Header />
          <main className="page">{children}</main>
        </UserProvider>
      </body>
    </html>
  );
}
