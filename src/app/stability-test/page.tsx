'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function StabilityTestPage() {
  const [counter, setCounter] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [errors, setErrors] = useState<string[]>([])

  useEffect(() => {
    // Test for memory leaks and infinite re-renders
    console.log('Component mounted/updated:', counter)
    setIsLoaded(true)
    
    // Test error handling
    try {
      // Simulate some operations that might cause issues
      const testArray = new Array(1000).fill(0).map((_, i) => i)
      console.log('Array test passed:', testArray.length)
    } catch (error) {
      setErrors(prev => [...prev, `Array test failed: ${error}`])
    }

    // Cleanup function to prevent memory leaks
    return () => {
      console.log('Component cleanup')
    }
  }, [counter])

  const handleStressTest = () => {
    // Test rapid state updates
    for (let i = 0; i < 10; i++) {
      setTimeout(() => {
        setCounter(prev => prev + 1)
      }, i * 100)
    }
  }

  const handleErrorTest = () => {
    try {
      // Intentionally cause an error to test error boundaries
      throw new Error('Test error - this should be caught')
    } catch (error) {
      setErrors(prev => [...prev, `Caught error: ${error}`])
      console.error('Test error caught:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Stability Test Page
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Status Indicators */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Status Indicators</h2>
            <div className="space-y-2">
              <div className={`px-3 py-2 rounded ${isLoaded ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                {isLoaded ? '✅ Component Loaded' : '⏳ Loading...'}
              </div>
              <div className="bg-blue-100 text-blue-800 px-3 py-2 rounded">
                🔢 Counter: {counter}
              </div>
              <div className={`px-3 py-2 rounded ${errors.length === 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {errors.length === 0 ? '✅ No Errors' : `❌ ${errors.length} Errors`}
              </div>
            </div>
          </div>

          {/* Test Controls */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Test Controls</h2>
            <div className="space-y-3">
              <button
                onClick={() => setCounter(prev => prev + 1)}
                className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Increment Counter
              </button>
              <button
                onClick={handleStressTest}
                className="w-full bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
              >
                Stress Test (Rapid Updates)
              </button>
              <button
                onClick={handleErrorTest}
                className="w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Test Error Handling
              </button>
              <button
                onClick={() => {
                  setCounter(0)
                  setErrors([])
                }}
                className="w-full bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              >
                Reset All
              </button>
            </div>
          </div>
        </div>

        {/* Error Log */}
        {errors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-red-800 mb-4">Error Log</h2>
            <div className="space-y-2">
              {errors.map((error, index) => (
                <div key={index} className="bg-red-100 text-red-800 px-3 py-2 rounded text-sm">
                  {error}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Navigation Test</h2>
          <div className="flex flex-wrap gap-4">
            <Link href="/" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
              Homepage
            </Link>
            <Link href="/debug" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
              Debug Page
            </Link>
            <Link href="/test" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded">
              Test Page
            </Link>
            <Link href="/discovery" className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded">
              Discovery
            </Link>
          </div>
        </div>

        {/* Performance Info */}
        <div className="mt-8 bg-gray-100 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Performance Info</h2>
          <div className="text-sm text-gray-600 space-y-1">
            <div>• Check browser console for any JavaScript errors</div>
            <div>• Monitor memory usage in DevTools</div>
            <div>• Test navigation between pages</div>
            <div>• Verify no infinite re-renders occur</div>
            <div>• Ensure smooth interactions without crashes</div>
          </div>
        </div>
      </div>
    </div>
  )
}
