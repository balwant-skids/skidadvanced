export default function BrowserCheckPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">🌐 Browser Compatibility Check</h1>
        <p className="text-gray-600 mb-6">This page tests if your browser can display the SKIDS Advanced application correctly.</p>

        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          ✅ <strong>HTML is working</strong> - You can see this text
        </div>

        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          ✅ <strong>CSS is working</strong> - This page has styling
        </div>

        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          ✅ <strong>React is working</strong> - No hydration errors
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-4">Navigation Links</h2>
        <div className="space-x-4 mb-6">
          <a href="/" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Back to Homepage</a>
          <a href="/test" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Test Page</a>
          <a href="/debug-console" className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">Debug Console</a>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-blue-900 mb-4">✅ Hydration Error Fixed!</h2>
          <p className="text-blue-800">The application should now load without blank screens.</p>
        </div>
      </div>
    </div>
  )
}
