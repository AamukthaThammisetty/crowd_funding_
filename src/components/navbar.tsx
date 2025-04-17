'use client'
import { Button } from '@/components/ui/button'
import { CampaignList } from '@/components/campaign-list'
import { client, contract } from '@/client'
import { ConnectButton } from 'thirdweb/react'
import Link from 'next/link'
import { useActiveAccount } from 'thirdweb/react'
import { createWallet } from 'thirdweb/wallets'
import { inAppWallet } from 'thirdweb/wallets'
import { Shield } from 'lucide-react'

const wallets = [
  inAppWallet({
    auth: {
      options: [],
    },
  }),
  createWallet('io.metamask'),
  // createWallet('com.coinbase.wallet'),
]

export default function Home() {
  const account = useActiveAccount()
  return (
    <nav className="border-b bg-white sticky top-0 z-10 shadow-sm">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Shield className="h-8 w-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-800">SafeFund</h1>
        </div>

        <div className="hidden md:flex items-center space-x-8">
          <Link href="/" className="text-gray-800 hover:text-blue-600 font-medium">
            Discover
          </Link>
          <Link href="/create" className="text-gray-800 hover:text-blue-600 font-medium">
            Create
          </Link>
        </div>

        <div>
          <ConnectButton
            client={client}
            wallets={wallets}
            theme={'light'}
            connectModal={{ size: 'compact' }}
            connectButton={{
              label: account ? 'Wallet Connected' : 'Connect Wallet',
              className: 'px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
            }}
          />
        </div>
      </div>
    </nav>
  )
}
