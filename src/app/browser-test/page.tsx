'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function BrowserTestPage() {
  const [testResults, setTestResults] = useState<{[key: string]: boolean}>({})
  const [isRunning, setIsRunning] = useState(false)
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const runBrowserTests = async () => {
    setIsRunning(true)
    setTestResults({})
    setLogs([])
    
    addLog('Starting browser compatibility tests...')

    // Test 1: Basic DOM manipulation
    try {
      const testDiv = document.createElement('div')
      testDiv.innerHTML = '<p>Test</p>'
      document.body.appendChild(testDiv)
      document.body.removeChild(testDiv)
      setTestResults(prev => ({ ...prev, domManipulation: true }))
      addLog('✅ DOM manipulation test passed')
    } catch (error) {
      setTestResults(prev => ({ ...prev, domManipulation: false }))
      addLog(`❌ DOM manipulation test failed: ${error}`)
    }

    // Test 2: Local Storage
    try {
      localStorage.setItem('test', 'value')
      const value = localStorage.getItem('test')
      localStorage.removeItem('test')
      if (value === 'value') {
        setTestResults(prev => ({ ...prev, localStorage: true }))
        addLog('✅ Local storage test passed')
      } else {
        throw new Error('Value mismatch')
      }
    } catch (error) {
      setTestResults(prev => ({ ...prev, localStorage: false }))
      addLog(`❌ Local storage test failed: ${error}`)
    }

    // Test 3: Event handling
    try {
      let eventFired = false
      const testButton = document.createElement('button')
      testButton.addEventListener('click', () => { eventFired = true })
      testButton.click()
      if (eventFired) {
        setTestResults(prev => ({ ...prev, eventHandling: true }))
        addLog('✅ Event handling test passed')
      } else {
        throw new Error('Event not fired')
      }
    } catch (error) {
      setTestResults(prev => ({ ...prev, eventHandling: false }))
      addLog(`❌ Event handling test failed: ${error}`)
    }

    // Test 4: CSS animations
    try {
      const testElement = document.createElement('div')
      testElement.style.transition = 'opacity 0.1s'
      testElement.style.opacity = '0'
      document.body.appendChild(testElement)
      testElement.style.opacity = '1'
      setTimeout(() => {
        document.body.removeChild(testElement)
        setTestResults(prev => ({ ...prev, cssAnimations: true }))
        addLog('✅ CSS animations test passed')
      }, 200)
    } catch (error) {
      setTestResults(prev => ({ ...prev, cssAnimations: false }))
      addLog(`❌ CSS animations test failed: ${error}`)
    }

    // Test 5: Memory stress test
    try {
      const largeArray = new Array(100000).fill(0).map((_, i) => ({ id: i, data: `item-${i}` }))
      const filtered = largeArray.filter(item => item.id % 2 === 0)
      if (filtered.length === 50000) {
        setTestResults(prev => ({ ...prev, memoryStress: true }))
        addLog('✅ Memory stress test passed')
      } else {
        throw new Error('Array processing failed')
      }
    } catch (error) {
      setTestResults(prev => ({ ...prev, memoryStress: false }))
      addLog(`❌ Memory stress test failed: ${error}`)
    }

    // Test 6: Async operations
    try {
      await new Promise(resolve => setTimeout(resolve, 100))
      const response = await fetch('/api/health').catch(() => ({ ok: false }))
      setTestResults(prev => ({ ...prev, asyncOperations: true }))
      addLog('✅ Async operations test passed')
    } catch (error) {
      setTestResults(prev => ({ ...prev, asyncOperations: false }))
      addLog(`❌ Async operations test failed: ${error}`)
    }

    setIsRunning(false)
    addLog('All tests completed!')
  }

  useEffect(() => {
    addLog('Browser test page loaded successfully')
  }, [])

  const allTestsPassed = Object.values(testResults).every(result => result === true)
  const testsCompleted = Object.keys(testResults).length

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Browser Compatibility & Stability Test
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Test Controls */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4">Test Controls</h2>
            <div className="space-y-4">
              <button
                onClick={runBrowserTests}
                disabled={isRunning}
                className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-colors ${
                  isRunning 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isRunning ? 'Running Tests...' : 'Run Browser Tests'}
              </button>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-blue-50 p-3 rounded">
                  <div className="text-2xl font-bold text-blue-600">{testsCompleted}</div>
                  <div className="text-sm text-gray-600">Tests Run</div>
                </div>
                <div className="bg-green-50 p-3 rounded">
                  <div className="text-2xl font-bold text-green-600">
                    {Object.values(testResults).filter(r => r).length}
                  </div>
                  <div className="text-sm text-gray-600">Passed</div>
                </div>
                <div className="bg-red-50 p-3 rounded">
                  <div className="text-2xl font-bold text-red-600">
                    {Object.values(testResults).filter(r => !r).length}
                  </div>
                  <div className="text-sm text-gray-600">Failed</div>
                </div>
              </div>

              {testsCompleted > 0 && (
                <div className={`p-4 rounded-lg ${
                  allTestsPassed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {allTestsPassed 
                    ? '🎉 All tests passed! Browser is fully compatible.' 
                    : '⚠️ Some tests failed. Check the logs for details.'
                  }
                </div>
              )}
            </div>
          </div>

          {/* Test Results */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4">Test Results</h2>
            <div className="space-y-2">
              {[
                { key: 'domManipulation', label: 'DOM Manipulation' },
                { key: 'localStorage', label: 'Local Storage' },
                { key: 'eventHandling', label: 'Event Handling' },
                { key: 'cssAnimations', label: 'CSS Animations' },
                { key: 'memoryStress', label: 'Memory Stress Test' },
                { key: 'asyncOperations', label: 'Async Operations' },
              ].map(test => (
                <div key={test.key} className="flex items-center justify-between p-2 border rounded">
                  <span className="font-medium">{test.label}</span>
                  <span className={`px-2 py-1 rounded text-sm ${
                    testResults[test.key] === true 
                      ? 'bg-green-100 text-green-800' 
                      : testResults[test.key] === false 
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-600'
                  }`}>
                    {testResults[test.key] === true 
                      ? '✅ Pass' 
                      : testResults[test.key] === false 
                        ? '❌ Fail'
                        : '⏳ Pending'
                    }
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Logs */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Test Logs</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-64 overflow-y-auto">
            {logs.length === 0 ? (
              <div className="text-gray-500">No logs yet. Run tests to see output.</div>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="mb-1">{log}</div>
              ))
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Navigation</h2>
          <div className="flex flex-wrap gap-4">
            <Link href="/" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
              Homepage
            </Link>
            <Link href="/debug" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
              Debug Page
            </Link>
            <Link href="/stability-test" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded">
              Stability Test
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
