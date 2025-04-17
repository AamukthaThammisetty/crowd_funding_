'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { prepareContractCall, sendTransaction } from 'thirdweb'
import { contract } from '@/client'
import { useActiveAccount } from 'thirdweb/react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, DollarSign, FileText, Image, Info, Type } from 'lucide-react'

export default function CreateCampaign() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [target, setTarget] = useState('')
  const [deadline, setDeadline] = useState('')
  const [image, setImage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
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
      setPreviewImage('')

      // You might want to show a success message or redirect
      console.log('Campaign created with hash:', transactionHash)
    } catch (error) {
      console.error('Error creating campaign:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value
    setImage(url)
    setPreviewImage(url)
  }

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-blue-900">Create a New Campaign</h1>

        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-blue-900 text-white">
            <CardTitle className="text-xl">Campaign Details</CardTitle>
            <CardDescription className="text-blue-100">Fill in the information below to start your fundraising campaign</CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="flex items-center text-sm font-medium mb-1 text-gray-700">
                    <Type size={18} className="mr-2 text-blue-900" />
                    Campaign Title
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter a captivating title"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="description" className="flex items-center text-sm font-medium mb-1 text-gray-700">
                    <FileText size={18} className="mr-2 text-blue-900" />
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                    placeholder="Describe your campaign and why people should support it"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="target" className="flex items-center text-sm font-medium mb-1 text-gray-700">
                    <DollarSign size={18} className="mr-2 text-blue-900" />
                    Target Amount (ETH)
                  </label>
                  <input
                    id="target"
                    type="number"
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0.01"
                    step="0.01"
                    placeholder="1.5"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="deadline" className="flex items-center text-sm font-medium mb-1 text-gray-700">
                    <Calendar size={18} className="mr-2 text-blue-900" />
                    Campaign Deadline
                  </label>
                  <input
                    id="deadline"
                    type="datetime-local"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="image" className="flex items-center text-sm font-medium mb-1 text-gray-700">
                    <Image size={18} className="mr-2 text-blue-900" />
                    Campaign Image URL
                  </label>
                  <input
                    id="image"
                    type="url"
                    value={image}
                    onChange={handleImageChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/image.jpg"
                    required
                  />
                </div>
              </div>

              {previewImage && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2 text-gray-700">Image Preview:</p>
                  <div className="border border-gray-300 rounded-md overflow-hidden h-48">
                    <img src={previewImage} alt="Campaign preview" className="w-full h-full object-cover" onError={() => setPreviewImage('/api/placeholder/400/320')} />
                  </div>
                </div>
              )}

              {!account && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md flex items-start">
                  <Info size={20} className="text-yellow-500 mr-2 mt-0.5" />
                  <p className="text-sm text-yellow-700">You need to connect your wallet before creating a campaign.</p>
                </div>
              )}
            </form>
          </CardContent>

          <CardFooter className="bg-gray-50 p-6">
            <Button onClick={handleSubmit} className="w-full bg-blue-900 hover:bg-blue-800 text-white py-3 font-medium text-lg" disabled={isLoading || !account}>
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></span>
                  Creating Campaign...
                </span>
              ) : (
                'Create Campaign'
              )}
            </Button>
          </CardFooter>
        </Card>

        <div className="mt-6 text-center text-gray-600 text-sm">
          <p>By creating a campaign, you agree to our Terms of Service and Privacy Policy.</p>
        </div>
      </div>
    </div>
  )
}
