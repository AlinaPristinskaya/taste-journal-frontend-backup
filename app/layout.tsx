import '../styles/globals.css'
import { UserProvider } from './context/UserContext'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Taste Journal',
  description: 'Save and create your favorite recipes',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  )
}