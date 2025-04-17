'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { prepareContractCall, sendTransaction } from 'thirdweb'
import { contract } from '@/client'
import { useActiveAccount } from 'thirdweb/react'

export function CreateCampaign() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [target, setTarget] = useState('')
  const [deadline, setDeadline] = useState('')
  const [image, setImage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const account = useActiveAccount()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!account) return

    try {
      setIsLoading(true)
      const transaction = await prepareContractCall({
        contract,
        method: 'function createCampaign(address _owner, string _title, string _description, uint256 _target, uint256 _deadline, string _image) returns (uint256)',
        params: [
          account.address,
          title,
          description,
          BigInt(Number(target) * 1e18), // Convert ETH to wei
          BigInt(Math.floor(new Date(deadline).getTime() / 1000)), // Convert to Unix timestamp
          image,
        ],
      })

      const { transactionHash } = await sendTransaction({
        transaction,
        account,
      })

      // Reset form
      setTitle('')
      setDescription('')
      setTarget('')
      setDeadline('')
      setImage('')

      // You might want to show a success message or redirect
      console.log('Campaign created with hash:', transactionHash)
    } catch (error) {
      console.error('Error creating campaign:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Create a New Campaign</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            Campaign Title
          </label>
          <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 border rounded" required />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">
            Description
          </label>
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2 border rounded" rows={4} required />
        </div>

        <div>
          <label htmlFor="target" className="block text-sm font-medium mb-1">
            Target Amount (ETH)
          </label>
          <input id="target" type="number" value={target} onChange={(e) => setTarget(e.target.value)} className="w-full p-2 border rounded" min="0.01" step="0.01" required />
        </div>

        <div>
          <label htmlFor="deadline" className="block text-sm font-medium mb-1">
            Deadline
          </label>
          <input id="deadline" type="datetime-local" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="w-full p-2 border rounded" required />
        </div>

        <div>
          <label htmlFor="image" className="block text-sm font-medium mb-1">
            Image URL
          </label>
          <input id="image" type="url" value={image} onChange={(e) => setImage(e.target.value)} className="w-full p-2 border rounded" required />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading || !account}>
          {isLoading ? 'Creating...' : 'Create Campaign'}
        </Button>
      </form>
    </div>
  )
}
