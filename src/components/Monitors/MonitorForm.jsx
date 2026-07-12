// src/components/Monitors/MonitorForm.jsx
import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { createMonitor, getMonitorPatients } from '../../services/monitorService'
import Input from '../Common/Input'
import Button from '../Common/Button'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  HiOutlineDeviceMobile,
  HiOutlineUser,
  HiOutlineBeaker,
  HiOutlineLocationMarker,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineSearch,
  HiOutlineX,
  HiOutlineCog,
  HiOutlineChartBar,
  HiOutlineHeart,
  HiOutlineSparkles,
  HiOutlineShieldCheck,
  HiOutlineDotsCircleHorizontal
} from 'react-icons/hi'

const MonitorForm = ({ onSuccess, onCancel }) => {
  const [patients, setPatients] = useState([])
  const [filteredPatients, setFilteredPatients] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingPatients, setLoadingPatients] = useState(true)
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showPatientDropdown, setShowPatientDropdown] = useState(false)
  const [error, setError] = useState(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [formProgress, setFormProgress] = useState(0)
  
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      deviceId: '',
      patientId: '',
      fluidType: '',
      fluidVolume: '',
      flowRate: '',
      ward: '',
      room: '',
      bed: ''
    }
  })
  
  const selectedPatientId = watch('patientId')
  const deviceId = watch('deviceId')
  const fluidType = watch('fluidType')
  const fluidVolume = watch('fluidVolume')
  const flowRate = watch('flowRate')

  useEffect(() => {
    loadPatients()
  }, [])

  useEffect(() => {
    let progress = 0
    if (deviceId?.trim()) progress += 25
    if (selectedPatientId) progress += 25
    if (fluidType && fluidVolume && flowRate) progress += 25
    if (progress > 0) setFormProgress(progress + 25)
  }, [deviceId, selectedPatientId, fluidType, fluidVolume, flowRate])

  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = patients.filter(patient => {
        const fullName = `${patient.firstName || ''} ${patient.lastName || ''}`.toLowerCase()
        const searchLower = searchTerm.toLowerCase()
        return fullName.includes(searchLower) ||
          (patient.patientId && patient.patientId.toLowerCase().includes(searchLower)) ||
          (patient.diagnosis && patient.diagnosis.toLowerCase().includes(searchLower))
      })
      setFilteredPatients(filtered)
      setShowPatientDropdown(true)
    } else {
      setFilteredPatients(patients)
      setShowPatientDropdown(false)
    }
  }, [searchTerm, patients])

  useEffect(() => {
    if (!selectedPatientId) {
      setSelectedPatient(null)
      setValue('ward', '')
      setValue('room', '')
      setValue('bed', '')
      setSearchTerm('')
      return
    }

    const patient = patients.find((p) => p._id === selectedPatientId)
    if (patient) {
      setSelectedPatient(patient)
      const ward = patient.roomId?.ward || patient.ward || ''
      const room = patient.roomId?.roomNumber || patient.room || ''
      const bed = patient.bed || ''
      
      setValue('ward', ward)
      setValue('room', room)
      setValue('bed', bed)
      setSearchTerm(`${patient.firstName || ''} ${patient.lastName || ''} - ${patient.patientId || ''}`)
      setShowPatientDropdown(false)
      setCurrentStep(2)
    }
  }, [selectedPatientId, patients, setValue])

  const loadPatients = async () => {
    try {
      setLoadingPatients(true)
      setError(null)
      
      const response = await getMonitorPatients()
      
      let patientData = []
      if (response.data) {
        if (Array.isArray(response.data)) {
          patientData = response.data
        } else if (response.data.data && Array.isArray(response.data.data)) {
          patientData = response.data.data
        } else if (response.data.patients && Array.isArray(response.data.patients)) {
          patientData = response.data.patients
        }
      }
      
      setPatients(patientData)
      setFilteredPatients(patientData)
      
      if (patientData.length === 0) {
        toast.error('No patients found in the system')
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to load patients'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoadingPatients(false)
    }
  }

  const onSubmit = async (data) => {
    try {
      setLoading(true)
      
      if (!data.patientId) {
        toast.error('Please select a patient')
        setLoading(false)
        return
      }

      const location = {
        ward: data.ward?.trim() || selectedPatient?.roomId?.ward || selectedPatient?.ward || '',
        room: data.room?.trim() || selectedPatient?.roomId?.roomNumber || selectedPatient?.room || '',
        bed: data.bed?.trim() || selectedPatient?.bed || ''
      }

      const monitorData = {
        deviceId: data.deviceId.trim().toUpperCase(),
        patientId: data.patientId,
        fluidType: data.fluidType,
        fluidVolume: Number(data.fluidVolume),
        flowRate: Number(data.flowRate),
        currentLevel: 100,
        airBubbleDetected: false,
        location
      }

      await createMonitor(monitorData)
      toast.success('IV Monitor created successfully')
      onSuccess?.()
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || 'Failed to create monitor'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const handlePatientSelect = (patient) => {
    setValue('patientId', patient._id)
    setSelectedPatient(patient)
    setSearchTerm(`${patient.firstName || ''} ${patient.lastName || ''} - ${patient.patientId || ''}`)
    setShowPatientDropdown(false)
    
    setValue('ward', patient.roomId?.ward || patient.ward || '')
    setValue('room', patient.roomId?.roomNumber || patient.room || '')
    setValue('bed', patient.bed || '')
    setCurrentStep(2)
  }

  const clearPatientSelection = () => {
    setValue('patientId', '')
    setSelectedPatient(null)
    setSearchTerm('')
    setShowPatientDropdown(false)
    setValue('ward', '')
    setValue('room', '')
    setValue('bed', '')
    setCurrentStep(1)
  }

  const fluidOptions = [
    { value: 'Saline', label: 'Saline', icon: '💧' },
    { value: 'Dextrose', label: 'Dextrose', icon: '🍬' },
    { value: "Ringer's Lactate", label: "Ringer's Lactate", icon: '🧪' },
    { value: 'Other', label: 'Other', icon: '📋' }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, type: 'spring', damping: 25 }}
      className="relative overflow-hidden"
    >
      {/* Clean Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-100/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-slate-100/20 rounded-full blur-2xl"></div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="relative z-10 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                <HiOutlineHeart className="w-7 h-7 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white animate-pulse"></div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-800">Connect IV Monitor</h3>
              <p className="text-slate-500 text-sm">Configure and deploy a new monitoring device</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="w-10 h-10 rounded-full bg-white/80 hover:bg-white transition-all duration-200 flex items-center justify-center text-slate-400 hover:text-slate-600 border border-slate-200 shadow-sm"
          >
            <HiOutlineX className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Setup Progress</span>
            <span className="text-blue-600 font-medium">{Math.min(formProgress, 100)}%</span>
          </div>
          <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(formProgress, 100)}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Step Indicators */}
        <div className="flex items-center gap-3 mb-8">
          {[
            { step: 1, label: 'Device', icon: HiOutlineCog },
            { step: 2, label: 'Patient', icon: HiOutlineUser },
            { step: 3, label: 'Fluid', icon: HiOutlineBeaker }
          ].map((item) => (
            <div key={item.step} className="flex items-center flex-1">
              <div className={`flex items-center space-x-2 ${currentStep >= item.step ? 'text-slate-700' : 'text-slate-300'}`}>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  currentStep >= item.step 
                    ? 'bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/25' 
                    : 'bg-white text-slate-300 border-2 border-slate-200'
                }`}>
                  <item.icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-medium hidden sm:block">{item.label}</span>
              </div>
              {item.step < 3 && (
                <div className={`flex-1 h-0.5 mx-3 transition-all duration-300 ${
                  currentStep > item.step ? 'bg-gradient-to-r from-blue-500 to-indigo-500' : 'bg-slate-200'
                }`}></div>
              )}
            </div>
          ))}
        </div>

        {/* Device ID - Step 1 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-200 shadow-sm mb-6 hover:shadow-md transition-all duration-300"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-slate-100 rounded-xl border border-slate-200">
              <HiOutlineCog className="w-5 h-5 text-slate-600" />
            </div>
            <span className="text-slate-800 font-medium">Device Identification</span>
            <span className="ml-auto text-xs text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Step 1
            </span>
          </div>
          <div className="space-y-2">
            <Input
              placeholder="Enter device ID (e.g., IV-MON-001)"
              error={errors.deviceId?.message}
              className="bg-white/50 border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 rounded-xl transition-all duration-200"
              {...register('deviceId', { 
                required: 'Device ID is required',
                pattern: {
                  value: /^[A-Z0-9-]+$/,
                  message: 'Only uppercase letters, numbers, and hyphens allowed'
                }
              })}
            />
            <p className="text-xs text-slate-400 flex items-center space-x-1">
              <HiOutlineShieldCheck className="w-3 h-3" />
              <span>Unique identifier for the IV monitoring device</span>
            </p>
          </div>
        </motion.div>

        {/* Patient Selection - Step 2 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-200 shadow-sm mb-6 hover:shadow-md transition-all duration-300"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-200">
              <HiOutlineUser className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="text-slate-800 font-medium">Patient Assignment</span>
            <span className="ml-auto text-xs text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Step 2
            </span>
          </div>
          
          <div className="space-y-3">
            <div className="relative">
              <div className="relative">
                <HiOutlineSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder={loadingPatients ? "Loading patients..." : "Search for patient by name or ID..."}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => {
                    if (patients.length > 0) {
                      setShowPatientDropdown(true)
                    }
                  }}
                  disabled={loadingPatients}
                  className="w-full pl-12 pr-12 py-3.5 bg-white/50 backdrop-blur-xl border border-slate-200 rounded-xl focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 transition-all duration-200 text-slate-800 placeholder:text-slate-400 disabled:opacity-50"
                />
                {selectedPatient && (
                  <button
                    type="button"
                    onClick={clearPatientSelection}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-rose-500 transition-colors"
                  >
                    <HiOutlineX className="w-5 h-5" />
                  </button>
                )}
              </div>
              
              <AnimatePresence>
                {showPatientDropdown && patients.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute z-50 mt-2 w-full bg-white/95 backdrop-blur-xl border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-y-auto"
                  >
                    {filteredPatients.length === 0 ? (
                      <div className="p-4 text-center text-slate-500">
                        {searchTerm ? 'No patients found matching your search' : 'No patients available'}
                      </div>
                    ) : (
                      filteredPatients.map(patient => {
                        const hasActiveMonitor = patient.hasActiveMonitor || 
                          (patient.currentIVMonitorId && 
                           ['active', 'alert', 'paused'].includes(patient.currentIVMonitorId?.status))
                        
                        return (
                          <button
                            key={patient._id}
                            type="button"
                            onClick={() => handlePatientSelect(patient)}
                            className="w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0 flex items-center justify-between group"
                          >
                            <div>
                              <p className="font-medium text-slate-800 group-hover:text-blue-600 transition-colors">
                                {patient.firstName || 'Unknown'} {patient.lastName || ''}
                              </p>
                              <p className="text-sm text-slate-500">
                                {patient.patientId || 'No ID'} • 
                                {patient.roomId?.ward || patient.ward || 'No Ward'} • 
                                Room {patient.roomId?.roomNumber || patient.room || 'N/A'}
                              </p>
                              {patient.diagnosis && (
                                <p className="text-xs text-slate-400 mt-1">{patient.diagnosis}</p>
                              )}
                            </div>
                            <div className="flex items-center space-x-2">
                              {hasActiveMonitor && (
                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700 border border-amber-200">
                                  Active IV
                                </span>
                              )}
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                                hasActiveMonitor 
                                  ? 'bg-amber-50 text-amber-600 border-amber-200' 
                                  : 'bg-emerald-50 text-emerald-600 border-emerald-200'
                              }`}>
                                {hasActiveMonitor ? 'Busy' : 'Available'}
                              </span>
                            </div>
                          </button>
                        )
                      })
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {errors.patientId && (
              <p className="text-sm text-rose-500 flex items-center space-x-1">
                <span>⚠️</span>
                <span>{errors.patientId.message}</span>
              </p>
            )}
            
            <AnimatePresence>
              {selectedPatient && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-3 p-4 bg-emerald-50/80 border border-emerald-200 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-800">
                        {selectedPatient.firstName || 'Unknown'} {selectedPatient.lastName || ''}
                      </p>
                      <p className="text-xs text-slate-500">
                        ID: {selectedPatient.patientId || 'N/A'} • 
                        Ward: {selectedPatient.roomId?.ward || selectedPatient.ward || 'N/A'} • 
                        Room: {selectedPatient.roomId?.roomNumber || selectedPatient.room || 'N/A'} • 
                        Bed: {selectedPatient.bed || 'N/A'}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                        selectedPatient.hasActiveMonitor 
                          ? 'bg-amber-50 text-amber-600 border-amber-200' 
                          : 'bg-emerald-50 text-emerald-600 border-emerald-200'
                      }`}>
                        {selectedPatient.hasActiveMonitor ? 'Active IV assigned' : 'Available for IV'}
                      </span>
                      <HiOutlineCheckCircle className="w-5 h-5 text-emerald-500" />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Patient Statistics */}
            <div className="mt-3 rounded-xl border border-slate-200 bg-white/50 p-4">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span>Available Patients in System</span>
                <span className="font-medium text-slate-700">{patients.length} Total</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs border border-emerald-200">
                  {patients.filter(p => {
                    const hasActive = p.hasActiveMonitor || 
                      (p.currentIVMonitorId && ['active', 'alert', 'paused'].includes(p.currentIVMonitorId?.status))
                    return !hasActive
                  }).length} Available
                </span>
                <span className="px-2 py-1 bg-amber-50 text-amber-600 rounded-full text-xs border border-amber-200">
                  {patients.filter(p => {
                    const hasActive = p.hasActiveMonitor || 
                      (p.currentIVMonitorId && ['active', 'alert', 'paused'].includes(p.currentIVMonitorId?.status))
                    return hasActive
                  }).length} Active IV
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Fluid Configuration - Step 3 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-200 shadow-sm mb-6 hover:shadow-md transition-all duration-300"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-50 rounded-xl border border-blue-200">
              <HiOutlineBeaker className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-slate-800 font-medium">Fluid Configuration</span>
            <span className="ml-auto text-xs text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Step 3
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Fluid Type */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-600 flex items-center space-x-1">
                <HiOutlineBeaker className="w-3 h-3" />
                <span>Fluid Type</span>
              </label>
              <select
                className="w-full px-4 py-3 bg-white/50 backdrop-blur-xl border border-slate-200 rounded-xl focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-slate-800"
                {...register('fluidType', { required: 'Fluid type is required' })}
              >
                <option value="" className="bg-white">Select fluid type</option>
                {fluidOptions.map(option => (
                  <option key={option.value} value={option.value} className="bg-white">
                    {option.icon} {option.label}
                  </option>
                ))}
              </select>
              {errors.fluidType && (
                <p className="text-xs text-rose-500">{errors.fluidType.message}</p>
              )}
            </div>

            {/* Fluid Volume */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-600 flex items-center space-x-1">
                <HiOutlineDotsCircleHorizontal className="w-3 h-3 text-blue-500" />
                <span>Volume (ml)</span>
              </label>
              <Input
                type="number"
                placeholder="Enter volume (50-5000ml)"
                className="bg-white/50 border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-blue-400 rounded-xl transition-all duration-200"
                error={errors.fluidVolume?.message}
                {...register('fluidVolume', { 
                  required: 'Fluid volume is required',
                  min: { value: 50, message: 'Minimum 50ml' },
                  max: { value: 5000, message: 'Maximum 5000ml' }
                })}
              />
            </div>

            {/* Flow Rate */}
            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-medium text-slate-600 flex items-center space-x-1">
                <HiOutlineChartBar className="w-3 h-3" />
                <span>Flow Rate (ml/h)</span>
              </label>
              <Input
                type="number"
                placeholder="Set flow rate (10-1000 ml/h)"
                className="bg-white/50 border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-blue-400 rounded-xl transition-all duration-200"
                error={errors.flowRate?.message}
                {...register('flowRate', { 
                  required: 'Flow rate is required',
                  min: { value: 10, message: 'Minimum 10ml/h' },
                  max: { value: 1000, message: 'Maximum 1000ml/h' }
                })}
              />
            </div>
          </div>
        </motion.div>

        {/* Location - Optional */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-200 shadow-sm mb-8 hover:shadow-md transition-all duration-300"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-purple-50 rounded-xl border border-purple-200">
              <HiOutlineLocationMarker className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-slate-800 font-medium">Location Details</span>
            {selectedPatient && (
              <span className="ml-auto text-xs text-slate-500 bg-slate-50 px-3 py-1 rounded-full border border-slate-200">
                Auto-filled
              </span>
            )}
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-600">Ward</label>
              <Input
                placeholder="Ward"
                className="bg-white/50 border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-purple-400 rounded-xl transition-all duration-200"
                error={errors.ward?.message}
                {...register('ward')}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-600">Room</label>
              <Input
                placeholder="Room #"
                className="bg-white/50 border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-purple-400 rounded-xl transition-all duration-200"
                error={errors.room?.message}
                {...register('room')}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-600">Bed</label>
              <Input
                placeholder="Bed"
                className="bg-white/50 border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-purple-400 rounded-xl transition-all duration-200"
                error={errors.bed?.message}
                {...register('bed')}
              />
            </div>
          </div>
        </motion.div>

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={loading}
            className="px-6 py-3 rounded-xl border-2 border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={loading}
            disabled={!selectedPatient || loading}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            <span className="flex items-center space-x-2 relative">
              <span>{loading ? 'Creating...' : 'Create Monitor'}</span>
              {!loading && (
                <motion.span
                  initial={{ x: 0 }}
                  animate={{ x: 5 }}
                  transition={{ duration: 0.3, repeat: Infinity, repeatType: 'reverse' }}
                >
                  <HiOutlineSparkles className="w-4 h-4" />
                </motion.span>
              )}
            </span>
          </Button>
        </div>

        {/* Footer Stats */}
        <div className="mt-6 pt-6 border-t border-slate-200 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center space-x-4">
            <span>🔒 Secure connection</span>
            <span>•</span>
            <span>⚡ Real-time monitoring</span>
          </div>
          <div className="flex items-center space-x-1">
            <HiOutlineShieldCheck className="w-3 h-3" />
            <span>v2.0.1</span>
          </div>
        </div>
      </form>
    </motion.div>
  )
}

export default MonitorForm