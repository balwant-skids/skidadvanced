'use client'

import { useState } from 'react'
import { User, Mail, Phone, MapPin, Calendar, Edit3, Save, X, Shield, Award, Clock } from 'lucide-react'
import { Navigation } from '@/components/layout/Navigation'
import { DrSkidsChat } from '@/components/chat/DrSkidsChat'
import { useRole } from '@/hooks/useAuth'
import { useUserContext } from '@/contexts/UserContext'

export default function ProfilePage() {
  const { userDetails: user } = useUserContext();
  const { role, isProvider, isAdmin, isParent } = useRole()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.emailAddresses?.[0]?.emailAddress || '',
    phone: '+91 98765 43210',
    location: 'Mumbai, India',
    bio: 'Dedicated to providing excellent healthcare services for children.',
    specialization: isProvider ? 'Pediatric Care' : '',
    experience: isProvider ? '8 years' : '',
    certifications: isProvider ? ['MBBS', 'MD Pediatrics', 'Fellowship in Child Development'] : []
  })

  const handleSave = () => {
    // In a real app, this would save to the backend
    console.log('Saving profile:', formData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    // Reset form data
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.emailAddresses?.[0]?.emailAddress || '',
      phone: '+91 98765 43210',
      location: 'Mumbai, India',
      bio: 'Dedicated to providing excellent healthcare services for children.',
      specialization: isProvider ? 'Pediatric Care' : '',
      experience: isProvider ? '8 years' : '',
      certifications: isProvider ? ['MBBS', 'MD Pediatrics', 'Fellowship in Child Development'] : []
    })
    setIsEditing(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation />
      <DrSkidsChat />
      
      <main className="pt-20 pb-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-display font-bold text-gray-900 mb-2">
              Profile Settings
            </h1>
            <p className="text-xl text-gray-600">
              Manage your account information and preferences
            </p>
          </div>

          {/* Profile Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 px-6 py-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                    <User className="w-10 h-10 text-purple-600" />
                  </div>
                  <div className="text-white">
                    <h2 className="text-2xl font-bold">
                      {formData.firstName} {formData.lastName}
                    </h2>
                    <p className="text-purple-100 capitalize">{role} Account</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Shield className="w-4 h-4" />
                      <span className="text-sm">Verified Account</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center space-x-2 bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                      <span>Edit Profile</span>
                    </button>
                  ) : (
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSave}
                        className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save</span>
                      </button>
                      <button
                        onClick={handleCancel}
                        className="flex items-center space-x-2 bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors"
                      >
                        <X className="w-4 h-4" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Information */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900">{formData.firstName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900">{formData.lastName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <p className="text-gray-900">{formData.email}</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <p className="text-gray-900">{formData.phone}</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    ) : (
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <p className="text-gray-900">{formData.location}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Professional Information (for providers) */}
                {isProvider && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Information</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={formData.specialization}
                          onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-gray-900">{formData.specialization}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={formData.experience}
                          onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <p className="text-gray-900">{formData.experience}</p>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Certifications</label>
                      <div className="flex flex-wrap gap-2">
                        {formData.certifications.map((cert, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center space-x-1 bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm"
                          >
                            <Award className="w-3 h-3" />
                            <span>{cert}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Account Statistics */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Statistics</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {isParent ? '3' : isProvider ? '127' : '45'}
                      </div>
                      <div className="text-sm text-gray-600">
                        {isParent ? 'Children' : isProvider ? 'Patients Managed' : 'Tasks Completed'}
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {isParent ? '12' : isProvider ? '89' : '23'}
                      </div>
                      <div className="text-sm text-gray-600">
                        {isParent ? 'Appointments' : isProvider ? 'Care Plans Created' : 'Projects'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bio Section */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Bio</h3>
                {isEditing ? (
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <p className="text-gray-700">{formData.bio}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
