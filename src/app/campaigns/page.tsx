'use client'

import { useState } from 'react'
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  Users, 
  TrendingUp, 
  Mail, 
  MessageSquare, 
  Target,
  Eye,
  Edit3,
  Trash2,
  Send,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { Navigation } from '@/components/layout/Navigation'
import { DrSkidsChat } from '@/components/chat/DrSkidsChat'

interface Campaign {
  id: string
  name: string
  type: 'email' | 'sms' | 'push' | 'newsletter'
  status: 'draft' | 'scheduled' | 'active' | 'completed' | 'paused'
  audience: string
  targetCount: number
  sentCount: number
  openRate: number
  clickRate: number
  createdDate: Date
  scheduledDate?: Date
  description: string
}

export default function CampaignsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')

  // Mock campaigns data
  const [campaigns] = useState<Campaign[]>([
    {
      id: '1',
      name: 'Child Development Milestones Newsletter',
      type: 'newsletter',
      status: 'active',
      audience: 'All Parents',
      targetCount: 1250,
      sentCount: 1250,
      openRate: 68.5,
      clickRate: 12.3,
      createdDate: new Date('2024-01-15'),
      scheduledDate: new Date('2024-01-20'),
      description: 'Monthly newsletter covering important developmental milestones for children aged 0-5 years.'
    },
    {
      id: '2',
      name: 'Vision Screening Reminder',
      type: 'email',
      status: 'scheduled',
      audience: 'Parents with children 3-6 years',
      targetCount: 450,
      sentCount: 0,
      openRate: 0,
      clickRate: 0,
      createdDate: new Date('2024-01-18'),
      scheduledDate: new Date('2024-01-25'),
      description: 'Reminder for annual vision screening appointments for preschool children.'
    },
    {
      id: '3',
      name: 'Nutrition Workshop Invitation',
      type: 'email',
      status: 'completed',
      audience: 'Premium Subscribers',
      targetCount: 320,
      sentCount: 320,
      openRate: 75.2,
      clickRate: 28.4,
      createdDate: new Date('2024-01-10'),
      scheduledDate: new Date('2024-01-12'),
      description: 'Invitation to exclusive nutrition workshop for healthy child development.'
    },
    {
      id: '4',
      name: 'Behavioral Assessment Follow-up',
      type: 'sms',
      status: 'draft',
      audience: 'Recent Assessment Participants',
      targetCount: 85,
      sentCount: 0,
      openRate: 0,
      clickRate: 0,
      createdDate: new Date('2024-01-19'),
      description: 'Follow-up SMS for parents who completed behavioral assessments.'
    }
  ])

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter
    const matchesType = typeFilter === 'all' || campaign.type === typeFilter
    
    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusColor = (status: Campaign['status']) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      scheduled: 'bg-blue-100 text-blue-800',
      active: 'bg-green-100 text-green-800',
      completed: 'bg-purple-100 text-purple-800',
      paused: 'bg-yellow-100 text-yellow-800'
    }
    return colors[status]
  }

  const getStatusIcon = (status: Campaign['status']) => {
    const icons = {
      draft: <Edit3 className="w-4 h-4" />,
      scheduled: <Clock className="w-4 h-4" />,
      active: <Send className="w-4 h-4" />,
      completed: <CheckCircle className="w-4 h-4" />,
      paused: <AlertCircle className="w-4 h-4" />
    }
    return icons[status]
  }

  const getTypeIcon = (type: Campaign['type']) => {
    const icons = {
      email: <Mail className="w-5 h-5" />,
      sms: <MessageSquare className="w-5 h-5" />,
      push: <Target className="w-5 h-5" />,
      newsletter: <BarChart3 className="w-5 h-5" />
    }
    return icons[type]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation />
      <DrSkidsChat />
      
      <main className="pt-20 pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-4xl font-display font-bold text-gray-900 mb-2">
                  Campaign Management
                </h1>
                <p className="text-xl text-gray-600">
                  Create and manage parent outreach campaigns and newsletters
                </p>
              </div>
              
              <button className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all">
                <Plus className="w-5 h-5" />
                <span>Create Campaign</span>
              </button>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Campaigns</p>
                  <p className="text-3xl font-bold text-gray-900">{campaigns.length}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Campaigns</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {campaigns.filter(c => c.status === 'active').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Send className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Reach</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {campaigns.reduce((sum, c) => sum + c.targetCount, 0).toLocaleString()}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Open Rate</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {(campaigns.reduce((sum, c) => sum + c.openRate, 0) / campaigns.length).toFixed(1)}%
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search campaigns..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex gap-4">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="draft">Draft</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="paused">Paused</option>
                </select>
                
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="all">All Types</option>
                  <option value="email">Email</option>
                  <option value="sms">SMS</option>
                  <option value="push">Push</option>
                  <option value="newsletter">Newsletter</option>
                </select>
              </div>
            </div>
          </div>

          {/* Campaigns List */}
          <div className="space-y-4">
            {filteredCampaigns.map((campaign) => (
              <div key={campaign.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      {getTypeIcon(campaign.type)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{campaign.name}</h3>
                      <p className="text-sm text-gray-600">{campaign.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(campaign.status)}`}>
                      {getStatusIcon(campaign.status)}
                      <span className="capitalize">{campaign.status}</span>
                    </span>
                    
                    <div className="flex space-x-2">
                      <button className="p-2 text-gray-400 hover:text-purple-600 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Audience</p>
                    <p className="font-medium text-gray-900">{campaign.audience}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Target Count</p>
                    <p className="font-medium text-gray-900">{campaign.targetCount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Sent</p>
                    <p className="font-medium text-gray-900">{campaign.sentCount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Open Rate</p>
                    <p className="font-medium text-gray-900">{campaign.openRate}%</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Click Rate</p>
                    <p className="font-medium text-gray-900">{campaign.clickRate}%</p>
                  </div>
                </div>
                
                {campaign.scheduledDate && (
                  <div className="mt-4 flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {campaign.status === 'scheduled' ? 'Scheduled for' : 'Sent on'}: {' '}
                      {campaign.scheduledDate.toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredCampaigns.length === 0 && (
            <div className="text-center py-12">
              <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No campaigns found</h3>
              <p className="text-gray-600">Try adjusting your search or filters, or create a new campaign.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
