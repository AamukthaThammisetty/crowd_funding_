import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThirdwebProvider } from 'thirdweb/react'
import Navbar from '@/components/navbar'
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SafeFund - Secure Crowdfunding Platform',
  description: 'A secure and transparent crowdfunding platform powered by blockchain technology',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <ThirdwebProvider>
        <Navbar />
        <body className={inter.className}>{children}</body>
      </ThirdwebProvider>
    </html>
  )
}
