'use client'
import { readContract } from 'thirdweb'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CrowdfundingContract } from '@/types/contract'
import { contract } from '@/client'
import { useState, useEffect } from 'react'
import { formatEther, parseEther } from 'viem'

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

export const CampaignList = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])

  useEffect(() => {
    const fetchCampaigns = async () => {
      const campaignsData = await readContract({
        contract,
        method:
          'function getCampaigns() view returns ((address owner, string title, string description, uint256 target, uint256 deadline, uint256 amountCollected, string image, address[] donators, uint256[] donations)[])',
        params: [],
      })

      const parseCampaigns: Campaign[] = campaignsData.map((campaign: any, index: number) => ({
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

      setCampaigns(parseCampaigns)
    }

    fetchCampaigns()
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {campaigns.map((campaign, index) => {
        const progress = (Number(campaign.amountCollected) / Number(campaign.target)) * 100
        const daysLeft = Math.ceil((Number(campaign.deadline) - Date.now() / 1000) / 86400)

        return (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{campaign.title}</CardTitle>
              <CardDescription>{campaign.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="h-2 bg-gray-200 rounded-full">
                  <div className="h-2 bg-green-500 rounded-full" style={{ width: `${Math.min(progress, 100)}%` }} />
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{progress.toFixed(1)}% funded</span>
                  <span>{daysLeft > 0 ? `${daysLeft} days left` : 'Ended'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Target: {formatEther(campaign.target)} ETH</span>
                  <span>Raised: {formatEther(campaign.amountCollected)} ETH</span>
                </div>
                <Button className="w-full">Support Project</Button>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
