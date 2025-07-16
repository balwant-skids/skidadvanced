export default function TestPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          SKIDS Advanced Test Page
        </h1>
        <p className="text-gray-600 mb-8">
          If you can see this, the basic Next.js setup is working.
        </p>
        <div className="space-y-4">
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            ✅ Next.js is working
          </div>
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
            ✅ Tailwind CSS is working
          </div>
          <div className="bg-purple-100 border border-purple-400 text-purple-700 px-4 py-3 rounded">
            ✅ TypeScript is working
          </div>
        </div>
        <div className="mt-8">
          <a 
            href="/" 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Back to Homepage
          </a>
        </div>
      </div>
    </div>
  )
}
