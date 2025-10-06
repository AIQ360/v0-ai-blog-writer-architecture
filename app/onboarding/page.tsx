import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle } from "lucide-react"

export default function OnboardingPage() {
  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-4">Welcome to AI Blog Writer</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          You're all set up and ready to start creating amazing blog content with Gemini 2.0 Flash.
        </p>
      </div>

      <div className="space-y-8">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-start gap-4">
            <div className="bg-green-100 p-2 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">Google Authentication Configured</h2>
              <p className="text-gray-500">
                Your Google authentication is set up and ready to use. You can sign in with your Google account.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-start gap-4">
            <div className="bg-green-100 p-2 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">Gemini API Configured</h2>
              <p className="text-gray-500">
                Your Gemini API key is set up and ready to use. You can now generate content using Gemini 2.0 Flash.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-start gap-4">
            <div className="bg-green-100 p-2 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">Supabase Integration Ready</h2>
              <p className="text-gray-500">
                Your Supabase database is connected and ready to store your articles and settings.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <Button asChild size="lg">
            <Link href="/articles/new">Create Your First Article</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
