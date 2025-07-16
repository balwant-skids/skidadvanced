'use client'

export default function DebugPage() {
  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Debug Page - Basic React Test
      </h1>
      <div className="space-y-4">
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          ✅ React is rendering
        </div>
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
          ✅ CSS classes are working
        </div>
        <div className="bg-purple-100 border border-purple-400 text-purple-700 px-4 py-3 rounded">
          ✅ No JavaScript errors so far
        </div>
        <button 
          onClick={() => console.log('Button clicked!')}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Test Click Event
        </button>
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Navigation Test</h2>
          <a href="/" className="text-blue-600 hover:text-blue-800 underline">
            Back to Homepage
          </a>
        </div>
      </div>
    </div>
  )
}
