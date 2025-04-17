'use client'

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { AlertCircle } from 'lucide-react'

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="max-w-md p-6 bg-white rounded-lg shadow-lg text-center">
        <AlertCircle className="mx-auto text-yellow-500 w-16 h-16 mb-4" />
        <h1 className="text-2xl font-bold mb-4">Page Not Found</h1>
        <p className="text-gray-600 mb-6">The page you are looking for does not exist.</p>
        <Button onClick={() => router.push('/')} className="bg-blue-600 hover:bg-blue-700">
          Return to Home
        </Button>
      </div>
    </div>
  )
}
