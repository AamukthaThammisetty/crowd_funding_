'use client'

import { useState, useEffect } from 'react'
import { readContract, prepareContractCall, sendTransaction } from 'thirdweb'
import { contract } from '@/client'
import { formatEther } from 'viem'
import { Search, Info, Calendar } from 'lucide-react'
import Link from 'next/link'
import { useActiveAccount } from 'thirdweb/react'
import { Button } from '@/components/ui/button'

interface Campaign {
  pId: number
  owner: string
  title: string
  description: string
  target: bigint
  deadline: bigint
  amountCollected: bigint
  image: string
  donators: string[]
  donations: bigint[]
}

export default function Home() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)
  const [amount, setAmount] = useState('')
  const [isDonating, setIsDonating] = useState(false)
  const account = useActiveAccount()

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const campaignsData = await readContract({
          contract,
          method:
            'function getCampaigns() view returns ((address owner, string title, string description, uint256 target, uint256 deadline, uint256 amountCollected, string image, address[] donators, uint256[] donations)[])',
          params: [],
        })

        const parsedCampaigns: Campaign[] = campaignsData.map((campaign: any, index: number) => ({
          pId: index,
          owner: campaign.owner,
          title: campaign.title,
          description: campaign.description,
          target: BigInt(campaign.target),
          deadline: BigInt(campaign.deadline),
          amountCollected: BigInt(campaign.amountCollected),
          image: campaign.image,
          donators: campaign.donators,
          donations: campaign.donations.map((d: any) => BigInt(d)),
        }))

        setCampaigns(parsedCampaigns)
      } catch (error) {
        console.error('Error fetching campaigns:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCampaigns()
  }, [])

  const handleDonate = async () => {
    if (!account || !amount || Number(amount) <= 0 || !selectedCampaign) return

    try {
      setIsDonating(true)
      const transaction = await prepareContractCall({
        contract,
        method: 'function donateToCampaign(uint256 _id) payable',
        params: [BigInt(selectedCampaign.pId)],
        value: BigInt(Math.floor(Number(amount) * 1e18)), // ETH to wei
      })

      const { transactionHash } = await sendTransaction({
        transaction,
        account,
      })

      console.log('Donation successful. Hash:', transactionHash)
      setAmount('')
      // Refresh campaigns after donation
      window.location.reload()
    } catch (error) {
      console.error('Donation failed:', error)
    } finally {
      setIsDonating(false)
    }
  }

  const filteredCampaigns = campaigns.filter((campaign) => campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) || campaign.description.toLowerCase().includes(searchTerm.toLowerCase()))

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Donate to Campaigns</h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Section - Campaign List */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Active Campaigns</h2>
              <span className="text-sm text-gray-600">
                {filteredCampaigns.length} of {campaigns.length} Active Campaigns
              </span>
            </div>

            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search Campaigns by name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 text-gray-900 placeholder-gray-500"
                />
              </div>
            </div>

            <div className="space-y-4">
              {filteredCampaigns.map((campaign) => {
                const registrationDate = new Date(Number(campaign.deadline) * 1000)
                const isSelected = selectedCampaign?.pId === campaign.pId
                return (
                  <div key={campaign.pId} className={`bg-white border rounded-lg p-4 transition-all ${isSelected ? 'border-blue-500' : 'border-gray-200 hover:border-gray-300'}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{campaign.title}</h3>
                        <div className="text-sm text-gray-500 mb-2">Registered: {registrationDate.toLocaleDateString()}</div>
                        <p className="text-gray-600 text-sm line-clamp-2">{campaign.description}</p>
                      </div>
                      <Button onClick={() => setSelectedCampaign(campaign)} variant={isSelected ? 'default' : 'outline'} className="px-4">
                        {isSelected ? 'Selected' : 'Select Campaign'}
                      </Button>
                    </div>
                  </div>
                )
              })}

              {filteredCampaigns.length === 0 && (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No campaigns found matching your search.</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Section - Donation Form */}
          {selectedCampaign && (
            <div className="lg:w-[400px]">
              <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Make a Donation</h2>
                <p className="text-gray-600 text-sm mb-6">Support {selectedCampaign.title} with your contribution</p>

                <div className="space-y-6">
                  <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                      Donation Amount (ETH)
                    </label>
                    <div className="mt-1">
                      <input
                        type="number"
                        id="amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        min="0.001"
                        step="0.001"
                        placeholder="0.00"
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <Button onClick={handleDonate} disabled={!account || isDonating || !amount || Number(amount) <= 0} className="w-full">
                    {isDonating ? 'Processing...' : 'Donate Now'}
                  </Button>

                  {!account && <p className="text-sm text-center text-gray-500">Please connect your wallet to make a donation</p>}

                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-sm font-medium text-gray-900 mb-4">Why donate through our platform?</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <span className="text-sm text-gray-600">• 100% of your donation goes directly to the Campaign</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-sm text-gray-600">• Transparent tracking of funds via blockchain</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-sm text-gray-600">• Secure and immediate fund transfer</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
