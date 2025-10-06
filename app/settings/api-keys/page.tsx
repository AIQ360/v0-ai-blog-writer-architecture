import GoogleApiSetup from "@/components/google-api-setup"

export default function ApiKeysPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">API Keys</h1>
      <p className="text-gray-500 mb-8">
        Configure your API keys to enable AI Blog Writer to generate content using Gemini 2.0 Flash.
      </p>

      <GoogleApiSetup />
    </div>
  )
}
