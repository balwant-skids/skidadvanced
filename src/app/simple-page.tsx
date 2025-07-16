import Link from 'next/link'

export default function SimplePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Simple Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-blue-600">SKIDS Advanced</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-700 hover:text-blue-600">Home</Link>
              <Link href="/discovery" className="text-gray-700 hover:text-blue-600">Discovery</Link>
              <Link href="/care-plans" className="text-gray-700 hover:text-blue-600">Care Plans</Link>
              <Link href="/behavioral" className="text-gray-700 hover:text-blue-600">Behavioral</Link>
              <Link href="/provider" className="text-gray-700 hover:text-blue-600">Provider</Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-gray-700 hover:text-blue-600">Dashboard</Link>
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                DU
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Simple Hero Section */}
      <section className="pt-20 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Discover the Amazing World
            <br />
            <span className="text-blue-600">Inside Your Child</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Embark on an incredible journey through your child's body. Explore how their heart beats, 
            brain learns, and lungs breathe in ways that will amaze and educate your entire family.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/discovery"
              className="bg-blue-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-blue-700 transition-colors"
            >
              Begin Discovery Journey
            </Link>
            <Link 
              href="/test"
              className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-blue-50 transition-colors"
            >
              Test Page
            </Link>
          </div>
        </div>
      </section>

      {/* Simple Features Grid */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Explore Amazing Body Systems
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Heart */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
              <div className="text-4xl mb-4">❤️</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Amazing Heart</h3>
              <p className="text-gray-600 mb-4">Discover how your child's heart beats 100,000 times a day</p>
              <Link href="/discovery/heart" className="text-red-600 font-semibold hover:text-red-700">
                Explore →
              </Link>
            </div>

            {/* Brain */}
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 text-center">
              <div className="text-4xl mb-4">🧠</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Incredible Brain</h3>
              <p className="text-gray-600 mb-4">Explore 1 million new connections every second</p>
              <Link href="/discovery/brain" className="text-purple-600 font-semibold hover:text-purple-700">
                Explore →
              </Link>
            </div>

            {/* Lungs */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
              <div className="text-4xl mb-4">🫁</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Breathing Balloons</h3>
              <p className="text-gray-600 mb-4">See how lungs bring oxygen to every cell</p>
              <Link href="/discovery/lungs" className="text-blue-600 font-semibold hover:text-blue-700">
                Explore →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Simple CTA */}
      <section className="py-16 px-4 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Explore the Incredible?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of families discovering the amazing science behind their child's development
          </p>
          <Link 
            href="/discovery"
            className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors"
          >
            Start Exploring Now
          </Link>
        </div>
      </section>

      {/* Development Notice */}
      <div className="fixed bottom-4 right-4 bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-2 rounded-lg shadow-lg max-w-sm">
        <div className="text-sm font-medium mb-1">⚠️ Development Mode</div>
        <div className="text-xs">
          Simplified homepage - no animations or complex components.
        </div>
      </div>
    </div>
  )
}
