import { useState } from 'react'
import { 
  HiOutlineIdentification,
  HiOutlineCalendar,
  HiOutlinePhone,
  HiOutlineHome,
  HiOutlineBeaker,
  HiOutlineClipboard,
  HiOutlineUserCircle,
  HiOutlineClock,
  HiOutlineLocationMarker,
  HiOutlineMail,
  HiOutlineHeart,
  HiOutlineShieldCheck,
  HiOutlineDocumentText,
  HiOutlineChartBar
} from 'react-icons/hi'
import { formatDate } from '../../utils/formatters'
import Button from '../Common/Button'

const PatientDetail = ({ patient, onClose }) => {
  const [activeTab, setActiveTab] = useState('info')

  const tabs = [
    { id: 'info', label: 'Profile', icon: HiOutlineUserCircle, color: 'blue' },
    { id: 'medical', label: 'Clinical', icon: HiOutlineBeaker, color: 'emerald' },
    { id: 'history', label: 'Timeline', icon: HiOutlineClock, color: 'purple' }
  ]

  const getGenderEmoji = (gender) => {
    const map = {
      male: '♂️',
      female: '♀️',
      other: '⚧️'
    }
    return map[gender] || '👤'
  }

  const getStatusConfig = (status) => {
    const configs = {
      admitted: { 
        color: 'emerald', 
        icon: '🟢',
        label: 'Active',
        bg: 'bg-emerald-50 dark:bg-emerald-500/10',
        text: 'text-emerald-700 dark:text-emerald-400',
        border: 'border-emerald-200 dark:border-emerald-500/30'
      },
      discharged: { 
        color: 'slate', 
        icon: '⚪',
        label: 'Discharged',
        bg: 'bg-slate-50 dark:bg-slate-500/10',
        text: 'text-slate-700 dark:text-slate-400',
        border: 'border-slate-200 dark:border-slate-500/30'
      },
      transferred: { 
        color: 'amber', 
        icon: '🟡',
        label: 'Transferred',
        bg: 'bg-amber-50 dark:bg-amber-500/10',
        text: 'text-amber-700 dark:text-amber-400',
        border: 'border-amber-200 dark:border-amber-500/30'
      }
    }
    return configs[status] || configs.admitted
  }

  const statusConfig = getStatusConfig(patient.status)

  return (
    <div className="relative bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 rounded-3xl shadow-2xl overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary-500/5 to-purple-500/5 rounded-full blur-3xl -mr-48 -mt-48"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-emerald-500/5 to-blue-500/5 rounded-full blur-3xl -ml-32 -mb-32"></div>
      
      {/* Content */}
      <div className="relative p-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-8">
          {/* Patient Profile */}
          <div className="flex items-start gap-6">
            {/* Avatar with Status Ring */}
            <div className="relative">
              <div className={`absolute -inset-1 bg-gradient-to-r from-${statusConfig.color}-400 to-${statusConfig.color}-600 rounded-full blur opacity-60 animate-pulse`}></div>
              <div className={`relative w-20 h-20 rounded-full bg-gradient-to-br from-${statusConfig.color}-100 to-${statusConfig.color}-200 dark:from-${statusConfig.color}-900/30 dark:to-${statusConfig.color}-800/30 flex items-center justify-center text-4xl border-4 border-white dark:border-slate-800 shadow-xl`}>
                {getGenderEmoji(patient.gender)}
              </div>
              <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full ${statusConfig.bg} border-2 border-white dark:border-slate-800 flex items-center justify-center text-xs shadow-lg`}>
                {statusConfig.icon}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {patient.firstName} {patient.lastName}
                </h2>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border}`}>
                  {statusConfig.label}
                </span>
              </div>
              
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-sm text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <HiOutlineIdentification className="w-4 h-4 text-primary-500" />
                  <span className="font-mono font-medium">{patient.patientId || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <HiOutlineCalendar className="w-4 h-4 text-primary-500" />
                  <span>DOB: {formatDate(patient.dateOfBirth, 'MMM dd, yyyy')}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <HiOutlineClock className="w-4 h-4 text-primary-500" />
                  <span>Age: {patient.age || 'N/A'} years</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button className="p-2.5 bg-slate-100 dark:bg-slate-700/50 hover:bg-primary-100 dark:hover:bg-primary-500/20 rounded-xl transition-all duration-300 hover:scale-110 group">
              <HiOutlineHeart className="w-5 h-5 text-slate-500 group-hover:text-primary-500 dark:text-slate-400" />
            </button>
            <button className="p-2.5 bg-slate-100 dark:bg-slate-700/50 hover:bg-primary-100 dark:hover:bg-primary-500/20 rounded-xl transition-all duration-300 hover:scale-110 group">
              <HiOutlineShieldCheck className="w-5 h-5 text-slate-500 group-hover:text-primary-500 dark:text-slate-400" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800/50 rounded-2xl mb-8">
          {tabs.map(tab => {
            const isActive = activeTab === tab.id
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-300 ${
                  isActive
                    ? `bg-white dark:bg-slate-800 text-${tab.color}-600 dark:text-${tab.color}-400 shadow-lg shadow-${tab.color}-500/10`
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-700/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? `text-${tab.color}-500` : ''}`} />
                <span>{tab.label}</span>
                {isActive && (
                  <div className={`w-1.5 h-1.5 rounded-full bg-${tab.color}-500 animate-pulse`}></div>
                )}
              </button>
            )
          })}
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {/* Information Tab */}
          {activeTab === 'info' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fadeIn">
              {/* Contact Card */}
              <div className="group bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 hover:border-primary-200 dark:hover:border-primary-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl">
                    <HiOutlinePhone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">Contact</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm p-2.5 bg-slate-50 dark:bg-slate-700/30 rounded-xl">
                    <HiOutlinePhone className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-700 dark:text-slate-300">{patient.phoneNumber || 'Not provided'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm p-2.5 bg-slate-50 dark:bg-slate-700/30 rounded-xl">
                    <HiOutlineMail className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-700 dark:text-slate-300">{patient.email || 'Not provided'}</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm p-2.5 bg-slate-50 dark:bg-slate-700/30 rounded-xl">
                    <HiOutlineLocationMarker className="w-4 h-4 text-slate-400 mt-0.5" />
                    <span className="text-slate-700 dark:text-slate-300">{patient.address || 'Not provided'}</span>
                  </div>
                </div>
              </div>

              {/* Location Card */}
              <div className="group bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 hover:border-primary-200 dark:hover:border-primary-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/30 dark:to-emerald-800/30 rounded-xl">
                    <HiOutlineHome className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">Location</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm p-2.5 bg-slate-50 dark:bg-slate-700/30 rounded-xl">
                    <HiOutlineHome className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-700 dark:text-slate-300">
                      Ward {patient.ward || '—'} • Room {patient.room || '—'} • Bed {patient.bed || '—'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm p-2.5 bg-slate-50 dark:bg-slate-700/30 rounded-xl">
                    <HiOutlineCalendar className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-700 dark:text-slate-300">
                      Admitted: {formatDate(patient.admissionDate, 'MMM dd, yyyy • hh:mm a')}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm p-2.5 bg-slate-50 dark:bg-slate-700/30 rounded-xl">
                    <HiOutlineClipboard className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-700 dark:text-slate-300">Status: {patient.status || 'Admitted'}</span>
                  </div>
                </div>
              </div>

              {/* Emergency Contact - Full Width */}
              {patient.emergencyContact && (
                <div className="lg:col-span-2 group bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-2xl p-6 border border-orange-200 dark:border-orange-700/30 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2.5 bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-800/30 rounded-xl">
                      <span className="text-xl">🚨</span>
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">Emergency Contact</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { label: 'Name', value: patient.emergencyContact.name },
                      { label: 'Relationship', value: patient.emergencyContact.relationship },
                      { label: 'Phone', value: patient.emergencyContact.phoneNumber }
                    ].map((item, idx) => (
                      <div key={idx} className="bg-white/50 dark:bg-slate-800/30 rounded-xl p-3">
                        <p className="text-xs text-orange-600 dark:text-orange-400 font-medium mb-1">{item.label}</p>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Medical Tab */}
          {activeTab === 'medical' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Diagnosis */}
              <div className="group bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 hover:border-primary-200 dark:hover:border-primary-700 transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 rounded-xl">
                    <HiOutlineClipboard className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">Primary Diagnosis</h3>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-800/10 rounded-xl p-4 border border-purple-200 dark:border-purple-700/30">
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    {patient.diagnosis || 'No diagnosis recorded'}
                  </p>
                </div>
              </div>

              {/* Allergies */}
              <div className="group bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 hover:border-primary-200 dark:hover:border-primary-700 transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 bg-gradient-to-br from-red-100 to-rose-200 dark:from-red-900/30 dark:to-rose-800/30 rounded-xl">
                    <HiOutlineBeaker className="w-5 h-5 text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">Known Allergies</h3>
                </div>
                {patient.allergies?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {patient.allergies.map((allergy, index) => (
                      <span 
                        key={index} 
                        className="group/allergy px-4 py-2 bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 text-red-700 dark:text-red-300 rounded-xl text-sm font-medium border border-red-200 dark:border-red-700/30 hover:scale-105 transition-all duration-300 cursor-default shadow-sm hover:shadow-red-200/50 dark:hover:shadow-red-900/30"
                      >
                        {allergy}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="bg-slate-50 dark:bg-slate-700/30 rounded-xl p-4 text-center">
                    <p className="text-slate-500 dark:text-slate-400">No known allergies</p>
                  </div>
                )}
              </div>

              {/* Additional Notes */}
              {patient.notes && (
                <div className="group bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 hover:border-primary-200 dark:hover:border-primary-700 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2.5 bg-gradient-to-br from-blue-100 to-cyan-200 dark:from-blue-900/30 dark:to-cyan-800/30 rounded-xl">
                      <HiOutlineDocumentText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">Clinical Notes</h3>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-700/30 rounded-xl p-4">
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{patient.notes}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-gradient-to-br from-indigo-100 to-purple-200 dark:from-indigo-900/30 dark:to-purple-800/30 rounded-xl">
                  <HiOutlineChartBar className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white">Treatment Timeline</h3>
              </div>
              
              {patient.ivHistory?.length > 0 ? (
                <div className="space-y-4">
                  {patient.ivHistory.map((history, index) => (
                    <div 
                      key={index} 
                      className="group bg-white dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 hover:border-primary-200 dark:hover:border-primary-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/30 dark:to-emerald-800/30 rounded-xl flex items-center justify-center text-lg">
                            💉
                          </div>
                          <div>
                            <h4 className="font-semibold text-slate-900 dark:text-white">{history.fluidType}</h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400">IV Therapy</p>
                          </div>
                        </div>
                        <span className="px-3 py-1 bg-primary-50 dark:bg-primary-500/10 text-primary-700 dark:text-primary-400 rounded-lg text-sm font-semibold">
                          {history.volume}ml
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-700/30 rounded-xl p-3">
                        <div className="flex items-center gap-2">
                          <span className="inline-block w-2 h-2 bg-emerald-500 rounded-full"></span>
                          <span>Started: {formatDate(history.startTime, 'MMM dd, yyyy • hh:mm a')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="inline-block w-2 h-2 bg-rose-500 rounded-full"></span>
                          <span>Ended: {formatDate(history.endTime, 'MMM dd, yyyy • hh:mm a')}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <div className="text-5xl mb-4">📋</div>
                  <p className="text-slate-500 dark:text-slate-400 font-medium">No IV history available</p>
                  <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Patient hasn't received any IV therapy yet</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end pt-6 mt-6 border-t border-slate-200 dark:border-slate-700">
          <Button 
            variant="secondary" 
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-100 dark:bg-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl transition-all duration-300 hover:scale-105"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}

export default PatientDetail