// src/components/Monitors/MonitorForm.jsx
import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { createMonitor } from '../../services/monitorService'
import { getPatients } from '../../services/patientService'
import Input from '../Common/Input'
import Button from '../Common/Button'
import toast from 'react-hot-toast'

const MonitorForm = ({ onSuccess, onCancel }) => {
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingPatients, setLoadingPatients] = useState(true)
  const { register, handleSubmit, formState: { errors } } = useForm()

  useEffect(() => {
    loadPatients()
  }, [])

  const loadPatients = async () => {
    try {
      setLoadingPatients(true)
      const response = await getPatients({ status: 'admitted' })
      setPatients(response.data.data || [])
    } catch (error) {
      toast.error('Failed to load patients')
    } finally {
      setLoadingPatients(false)
    }
  }

  const onSubmit = async (data) => {
    try {
      setLoading(true)
      await createMonitor({
        deviceId: data.deviceId,
        patientId: data.patientId,
        fluidType: data.fluidType,
        fluidVolume: parseInt(data.fluidVolume),
        flowRate: parseInt(data.flowRate),
        location: {
          ward: data.ward,
          room: data.room,
          bed: data.bed
        }
      })
      toast.success('IV Monitor created successfully')
      onSuccess()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create monitor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Device ID */}
      <Input
        label="Device ID"
        placeholder="e.g., IV-MON-001"
        error={errors.deviceId?.message}
        {...register('deviceId', { 
          required: 'Device ID is required',
          pattern: {
            value: /^[A-Z0-9-]+$/,
            message: 'Only uppercase letters, numbers, and hyphens allowed'
          }
        })}
      />

      {/* Patient Selection */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          Select Patient
        </label>
        <select
          className="input-field"
          {...register('patientId', { required: 'Patient is required' })}
          disabled={loadingPatients}
        >
          <option value="">
            {loadingPatients ? 'Loading patients...' : 'Choose a patient...'}
          </option>
          {patients.map(patient => (
            <option key={patient._id} value={patient._id}>
              {patient.firstName} {patient.lastName} - {patient.patientId} (Room {patient.room}{patient.bed})
            </option>
          ))}
        </select>
        {errors.patientId && (
          <p className="text-sm text-red-600">{errors.patientId.message}</p>
        )}
      </div>

      {/* Fluid Type */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          Fluid Type
        </label>
        <select
          className="input-field"
          {...register('fluidType', { required: 'Fluid type is required' })}
        >
          <option value="">Select fluid type...</option>
          <option value="Saline">Saline</option>
          <option value="Dextrose">Dextrose</option>
          <option value="Ringer's Lactate">Ringer's Lactate</option>
          <option value="Other">Other</option>
        </select>
        {errors.fluidType && (
          <p className="text-sm text-red-600">{errors.fluidType.message}</p>
        )}
      </div>

      {/* Fluid Volume */}
      <Input
        label="Fluid Volume (ml)"
        type="number"
        placeholder="e.g., 1000"
        error={errors.fluidVolume?.message}
        {...register('fluidVolume', { 
          required: 'Fluid volume is required',
          min: { value: 50, message: 'Minimum volume is 50ml' },
          max: { value: 5000, message: 'Maximum volume is 5000ml' }
        })}
      />

      {/* Flow Rate */}
      <Input
        label="Flow Rate (ml/h)"
        type="number"
        placeholder="e.g., 120"
        error={errors.flowRate?.message}
        {...register('flowRate', { 
          required: 'Flow rate is required',
          min: { value: 10, message: 'Minimum flow rate is 10ml/h' },
          max: { value: 1000, message: 'Maximum flow rate is 1000ml/h' }
        })}
      />

      {/* Location */}
      <div className="grid grid-cols-3 gap-2">
        <Input
          label="Ward"
          placeholder="Ward A"
          error={errors.ward?.message}
          {...register('ward', { required: 'Ward is required' })}
        />
        <Input
          label="Room"
          placeholder="101"
          error={errors.room?.message}
          {...register('room', { required: 'Room is required' })}
        />
        <Input
          label="Bed"
          placeholder="B"
          error={errors.bed?.message}
          {...register('bed', { required: 'Bed is required' })}
        />
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={loading}
        >
          Create Monitor
        </Button>
      </div>
    </form>
  )
}

export default MonitorForm