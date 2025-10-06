import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info } from "lucide-react"

export default function GoogleAuthInstructions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Setting Up Google Authentication</CardTitle>
        <CardDescription>Follow these steps to configure Google OAuth for your application</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Important</AlertTitle>
          <AlertDescription>
            You'll need to configure your Google OAuth credentials in the Google Cloud Console.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <h3 className="font-medium">Step 1: Create OAuth credentials</h3>
          <ol className="list-decimal pl-5 space-y-2">
            <li>
              Go to the{" "}
              <a
                href="https://console.cloud.google.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Google Cloud Console
              </a>
            </li>
            <li>Create a new project or select an existing one</li>
            <li>Navigate to "APIs & Services" > "Credentials"</li>
            <li>Click "Create Credentials" > "OAuth client ID"</li>
            <li>Select "Web application" as the application type</li>
          </ol>
        </div>
        <div className="space-y-4">
          <h3 className="font-medium">Step 2: Configure redirect URIs</h3>
          <p>Add the following redirect URI to your OAuth credentials:</p>
          <div className="bg-gray-100 p-3 rounded-md font-mono text-sm">
            <p>For production:</p>
            <p className="text-blue-600">https://your-domain.com/api/auth/callback/google</p>
            <p className="mt-2">For development:</p>
            <p className="text-blue-600">http://localhost:3000/api/auth/callback/google</p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">Step 3: Get your credentials</h3>
          <p>After creating the OAuth client, you'll receive:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Client ID</li>
            <li>Client Secret</li>
          </ul>
          <p>
            Add these to your environment variables as <code>GOOGLE_CLIENT_ID</code> and{" "}
            <code>GOOGLE_CLIENT_SECRET</code>.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
