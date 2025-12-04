'use client';

/**
 * Parent Dashboard - Appointments Section
 * View upcoming appointments and reminders
 */

import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';

interface Appointment {
  id: string;
  type: string;
  title?: string;
  description?: string;
  scheduledAt: string;
  duration: number;
  status: string;
  child: {
    id: string;
    name: string;
  };
}

export default function AppointmentsPage() {
  const { isLoaded } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded) fetchAppointments();
  }, [isLoaded]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/appointments?limit=20');
      if (res.ok) {
        const data = await res.json();
        setAppointments(data.appointments || []);
      }
    } catch (err) {
      console.error('Failed to fetch appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isToday = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isTomorrow = (dateStr: string) => {
    const date = new Date(dateStr);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return date.toDateString() === tomorrow.toDateString();
  };

  const statusColors: Record<string, string> = {
    scheduled: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-green-100 text-green-700',
    completed: 'bg-blue-100 text-blue-700',
    cancelled: 'bg-red-100 text-red-700',
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
        <div className="max-w-4xl mx-auto animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-8" />
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
          <p className="text-gray-600 mt-1">Your upcoming appointments and reminders</p>
        </div>

        {/* Appointments List */}
        {appointments.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No upcoming appointments</h3>
            <p className="text-gray-500">Your scheduled appointments will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map(appointment => (
              <div
                key={appointment.id}
                className={`bg-white rounded-2xl shadow-lg p-6 border-l-4 ${
                  isToday(appointment.scheduledAt) 
                    ? 'border-green-500' 
                    : isTomorrow(appointment.scheduledAt)
                    ? 'border-yellow-500'
                    : 'border-blue-500'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    <div className="text-center min-w-[60px]">
                      <div className={`text-2xl font-bold ${
                        isToday(appointment.scheduledAt) ? 'text-green-600' : 'text-gray-900'
                      }`}>
                        {new Date(appointment.scheduledAt).getDate()}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(appointment.scheduledAt).toLocaleDateString('en-IN', { month: 'short' })}
                      </div>
                      {isToday(appointment.scheduledAt) && (
                        <span className="text-xs text-green-600 font-medium">Today</span>
                      )}
                      {isTomorrow(appointment.scheduledAt) && (
                        <span className="text-xs text-yellow-600 font-medium">Tomorrow</span>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {appointment.title || appointment.type}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        For {appointment.child.name}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {formatTime(appointment.scheduledAt)}
                        </span>
                        <span>{appointment.duration} mins</span>
                      </div>
                      {appointment.description && (
                        <p className="text-gray-500 text-sm mt-2">{appointment.description}</p>
                      )}
                    </div>
                  </div>

                  <span className={`px-3 py-1 text-xs rounded-full ${statusColors[appointment.status]}`}>
                    {appointment.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
