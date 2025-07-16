'use client'

import { motion } from 'framer-motion'
import { Calendar, Clock, MapPin, Video, Phone, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

const appointments = [
  {
    id: 1,
    title: 'Behavioral Assessment',
    doctor: 'Dr. Sarah Johnson',
    date: '2024-01-20',
    time: '10:00 AM',
    type: 'in-person',
    location: 'SKIDS Clinic - Room 203',
    color: 'brain',
    avatar: '👩‍⚕️'
  },
  {
    id: 2,
    title: 'Follow-up Consultation',
    doctor: 'Dr. Michael Chen',
    date: '2024-01-25',
    time: '2:30 PM',
    type: 'video',
    location: 'Video Call',
    color: 'cardiovascular',
    avatar: '👨‍⚕️'
  },
  {
    id: 3,
    title: 'Nutrition Planning',
    doctor: 'Dr. Emily Rodriguez',
    date: '2024-01-28',
    time: '11:15 AM',
    type: 'phone',
    location: 'Phone Consultation',
    color: 'digestive',
    avatar: '👩‍⚕️'
  }
]

export function UpcomingAppointments() {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="w-4 h-4" />
      case 'phone':
        return <Phone className="w-4 h-4" />
      default:
        return <MapPin className="w-4 h-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video':
        return 'bg-blue-100 text-blue-700'
      case 'phone':
        return 'bg-green-100 text-green-700'
      default:
        return 'bg-purple-100 text-purple-700'
    }
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Upcoming Appointments</h3>
        <button className="bg-brain-500 text-white p-2 rounded-lg hover:bg-brain-600 transition-colors">
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {appointments.map((appointment, index) => (
          <motion.div
            key={appointment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-colors"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">
                  {appointment.avatar}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">
                    {appointment.title}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {appointment.doctor}
                  </p>
                </div>
              </div>
              
              <div className={cn(
                "flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium",
                getTypeColor(appointment.type)
              )}>
                {getTypeIcon(appointment.type)}
                <span className="capitalize">{appointment.type}</span>
              </div>
            </div>

            {/* Date and Time */}
            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date(appointment.date).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{appointment.time}</span>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center space-x-1 text-sm text-gray-600 mb-4">
              {getTypeIcon(appointment.type)}
              <span>{appointment.location}</span>
            </div>

            {/* Actions */}
            <div className="flex space-x-2">
              <button className={cn(
                "flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors",
                `bg-${appointment.color}-500 text-white hover:bg-${appointment.color}-600`
              )}>
                {appointment.type === 'video' ? 'Join Call' : 
                 appointment.type === 'phone' ? 'Call Now' : 'Get Directions'}
              </button>
              <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                Reschedule
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Schedule */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <button className="w-full bg-gradient-to-r from-brain-500 to-cardiovascular-500 text-white py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2">
          <Calendar className="w-5 h-5" />
          <span>Schedule New Appointment</span>
        </button>
      </div>
    </div>
  )
}
