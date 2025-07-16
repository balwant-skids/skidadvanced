'use client'

import { useEffect, useState } from 'react'

export default function DebugConsolePage() {
  const [logs, setLogs] = useState<string[]>([])
  const [errors, setErrors] = useState<string[]>([])

  useEffect(() => {
    // Capture console errors
    const originalError = console.error
    const originalLog = console.log
    const originalWarn = console.warn

    console.error = (...args) => {
      setErrors(prev => [...prev, `ERROR: ${args.join(' ')}`])
      originalError(...args)
    }

    console.log = (...args) => {
      setLogs(prev => [...prev, `LOG: ${args.join(' ')}`])
      originalLog(...args)
    }

    console.warn = (...args) => {
      setLogs(prev => [...prev, `WARN: ${args.join(' ')}`])
      originalWarn(...args)
    }

    // Capture unhandled errors
    const handleError = (event: ErrorEvent) => {
      setErrors(prev => [...prev, `UNHANDLED ERROR: ${event.message} at ${event.filename}:${event.lineno}`])
    }

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      setErrors(prev => [...prev, `UNHANDLED PROMISE REJECTION: ${event.reason}`])
    }

    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleUnhandledRejection)

    // Test basic functionality
    console.log('Debug console initialized')
    
    return () => {
      console.error = originalError
      console.log = originalLog
      console.warn = originalWarn
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [])

  const triggerTestError = () => {
    console.error('Test error triggered')
    throw new Error('This is a test error')
  }

  const triggerTestLog = () => {
    console.log('Test log message')
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">🐛 Console Debug Monitor</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Controls */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Debug Controls</h2>
            <div className="space-y-4">
              <button
                onClick={triggerTestLog}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Trigger Test Log
              </button>
              <button
                onClick={() => {
                  try {
                    triggerTestError()
                  } catch (e) {
                    console.error('Caught test error:', e)
                  }
                }}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Trigger Test Error (Safe)
              </button>
              <button
                onClick={() => {
                  setLogs([])
                  setErrors([])
                }}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                Clear Logs
              </button>
            </div>

            <div className="mt-6">
              <h3 className="font-bold mb-2">Navigation Test</h3>
              <div className="space-x-2">
                <a href="/" className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700">
                  Home
                </a>
                <a href="/test" className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                  Test
                </a>
                <a href="/diagnostic" className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700">
                  Diagnostic
                </a>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">System Status</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Page Loaded:</span>
                <span className="text-green-600">✅ Yes</span>
              </div>
              <div className="flex justify-between">
                <span>React Hydrated:</span>
                <span className="text-green-600">✅ Yes</span>
              </div>
              <div className="flex justify-between">
                <span>Console Monitoring:</span>
                <span className="text-green-600">✅ Active</span>
              </div>
              <div className="flex justify-between">
                <span>Error Count:</span>
                <span className={errors.length > 0 ? 'text-red-600' : 'text-green-600'}>
                  {errors.length}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Log Count:</span>
                <span className="text-blue-600">{logs.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Error Log */}
        {errors.length > 0 && (
          <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-xl font-bold text-red-800 mb-4">🚨 Errors Detected</h2>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {errors.map((error, index) => (
                <div key={index} className="bg-red-100 p-2 rounded text-red-800 text-sm font-mono">
                  {error}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Console Log */}
        <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">📝 Console Logs</h2>
          <div className="space-y-1 max-h-64 overflow-y-auto">
            {logs.length === 0 ? (
              <div className="text-gray-500 italic">No logs yet...</div>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="bg-gray-100 p-2 rounded text-gray-800 text-sm font-mono">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-blue-800 mb-4">📋 Debug Instructions</h2>
          <ol className="list-decimal list-inside space-y-2 text-blue-800">
            <li>Open your browser's Developer Tools (F12)</li>
            <li>Go to the Console tab</li>
            <li>Navigate to different pages and watch for errors</li>
            <li>Use the test buttons above to verify error capturing</li>
            <li>Check this page for any JavaScript errors in real-time</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
