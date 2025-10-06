import GoogleAuthInstructions from "@/components/google-auth-instructions"

export default function AuthSettingsPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Authentication Settings</h1>
      <p className="text-gray-500 mb-8">Configure authentication settings for your AI Blog Writer application.</p>

      <GoogleAuthInstructions />
    </div>
  )
}
