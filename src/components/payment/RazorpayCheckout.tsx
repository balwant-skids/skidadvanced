'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, CreditCard, Smartphone, CheckCircle, Loader2 } from 'lucide-react'

interface RazorpayCheckoutProps {
  planId: string
  planName: string
  amount: number
  onSuccess: (paymentId: string, orderId: string) => void
  onError: (error: any) => void
}

declare global {
  interface Window {
    Razorpay: any
  }
}

export function RazorpayCheckout({ planId, planName, amount, onSuccess, onError }: RazorpayCheckoutProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'qr'>('card')

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const createOrder = async () => {
    try {
      const response = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount * 100, // Convert to paise
          currency: 'INR',
          planId,
          planName,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create order')
      }

      return await response.json()
    } catch (error) {
      console.error('Error creating order:', error)
      throw error
    }
  }

  const handlePayment = async () => {
    setIsLoading(true)

    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript()
      if (!scriptLoaded) {
        throw new Error('Failed to load Razorpay script')
      }

      // Create order
      const orderData = await createOrder()

      // Configure Razorpay options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'SKIDS Advanced',
        description: `${planName} Subscription`,
        order_id: orderData.id,
        image: '/logo.png', // Add your logo
        prefill: {
          name: 'Parent Name', // Get from user context
          email: 'parent@example.com', // Get from user context
          contact: '9999999999', // Get from user context
        },
        theme: {
          color: '#3B82F6', // Blue theme matching your design
        },
        method: {
          card: paymentMethod === 'card',
          upi: paymentMethod === 'upi',
          qr: paymentMethod === 'qr',
        },
        handler: function (response: any) {
          // Payment successful
          onSuccess(response.razorpay_payment_id, response.razorpay_order_id)
        },
        modal: {
          ondismiss: function () {
            setIsLoading(false)
          },
        },
      }

      // Open Razorpay checkout
      const razorpay = new window.Razorpay(options)
      razorpay.on('payment.failed', function (response: any) {
        onError(response.error)
        setIsLoading(false)
      })
      razorpay.open()
    } catch (error) {
      onError(error)
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Secure Payment</h3>
        <p className="text-gray-600">Complete your {planName} subscription</p>
      </div>

      {/* Payment Amount */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-8">
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900 mb-2">₹{amount.toLocaleString()}</div>
          <div className="text-gray-600">per month</div>
        </div>
      </div>

      {/* Payment Method Selection */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Choose Payment Method</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setPaymentMethod('card')}
            className={`p-4 border-2 rounded-xl transition-all ${
              paymentMethod === 'card'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <CreditCard className="w-6 h-6 mx-auto mb-2 text-gray-600" />
            <div className="text-sm font-medium text-gray-900">Card Payment</div>
            <div className="text-xs text-gray-600">Credit/Debit Cards</div>
          </button>

          <button
            onClick={() => setPaymentMethod('upi')}
            className={`p-4 border-2 rounded-xl transition-all ${
              paymentMethod === 'upi'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <Smartphone className="w-6 h-6 mx-auto mb-2 text-gray-600" />
            <div className="text-sm font-medium text-gray-900">UPI Payment</div>
            <div className="text-xs text-gray-600">PhonePe, GPay, Paytm</div>
          </button>

          <button
            onClick={() => setPaymentMethod('qr')}
            className={`p-4 border-2 rounded-xl transition-all ${
              paymentMethod === 'qr'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="w-6 h-6 mx-auto mb-2 border-2 border-gray-600 rounded"></div>
            <div className="text-sm font-medium text-gray-900">QR Code</div>
            <div className="text-xs text-gray-600">Scan & Pay</div>
          </button>
        </div>
      </div>

      {/* Security Features */}
      <div className="bg-gray-50 rounded-xl p-4 mb-8">
        <div className="flex items-center space-x-3">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="text-sm text-gray-700">256-bit SSL encryption</span>
        </div>
        <div className="flex items-center space-x-3 mt-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="text-sm text-gray-700">PCI DSS compliant</span>
        </div>
        <div className="flex items-center space-x-3 mt-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="text-sm text-gray-700">Razorpay secured</span>
        </div>
      </div>

      {/* Payment Button */}
      <button
        onClick={handlePayment}
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Processing...</span>
          </>
        ) : (
          <>
            <Shield className="w-5 h-5" />
            <span>Pay Securely</span>
          </>
        )}
      </button>

      <p className="text-xs text-gray-500 text-center mt-4">
        By proceeding, you agree to our Terms of Service and Privacy Policy
      </p>
    </div>
  )
}
