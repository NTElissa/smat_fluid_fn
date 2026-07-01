import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { createPatient, updatePatient } from '../../services/patientService'
import Button from '../Common/Button'
import Input from '../Common/Input'
import { HiOutlineUser, HiOutlineMail, HiOutlinePhone, HiOutlineCalendar } from 'react-icons/hi'
import toast from 'react-hot-toast'
import React from 'react'

const PatientForm = ({ patient, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: patient || {
      patientId: '',
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: 'male',
      phoneNumber: '',
      email: '',
      address: '',
      ward: '',
      room: '',
      bed: '',
      diagnosis: '',
      allergies: []
    }
  })

  const onSubmit = async (data) => {
    try {
      setLoading(true)
      if (patient) {
        await updatePatient(patient._id, data)
        toast.success('Patient updated successfully')
      } else {
        await createPatient(data)
        toast.success('Patient added successfully')
      }
      onSuccess()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white p-6 rounded-lg shadow max-w-lg mx-auto ">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Patient ID */}
        <Input
          label="Patient ID"
          {...register('patientId', { required: 'Patient ID is required' })}
          error={errors.patientId?.message}
          icon={HiOutlineUser}
          placeholder="PT2024001"
        />

        {/* First Name */}
        <Input
          label="First Name"
          {...register('firstName', { required: 'First name is required' })}
          error={errors.firstName?.message}
          placeholder="Enter first name"
        />

        {/* Last Name */}
        <Input
          label="Last Name"
          {...register('lastName', { required: 'Last name is required' })}
          error={errors.lastName?.message}
          placeholder="Enter last name"
        />

        {/* Date of Birth */}
        <Input
          label="Date of Birth"
          type="date"
          {...register('dateOfBirth', { required: 'Date of birth is required' })}
          error={errors.dateOfBirth?.message}
          icon={HiOutlineCalendar}
        />

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gender
          </label>
          <select
            {...register('gender')}
            className="input-field"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Phone Number */}
        <Input
          label="Phone Number"
          {...register('phoneNumber', { 
            required: 'Phone number is required',
            pattern: {
              value: /^(\+250|0)7[0-9]{8}$/,
              message: 'Invalid Rwanda phone number'
            }
          })}
          error={errors.phoneNumber?.message}
          icon={HiOutlinePhone}
          placeholder="0788123456"
        />

        {/* Email */}
        <Input
          label="Email"
          type="email"
          {...register('email')}
          icon={HiOutlineMail}
          placeholder="patient@example.com"
        />

        {/* Ward */}
        <Input
          label="Ward"
          {...register('ward')}
          placeholder="e.g., Ward A"
        />

        {/* Room */}
        <Input
          label="Room"
          {...register('room')}
          placeholder="e.g., 101"
        />

        {/* Bed */}
        <Input
          label="Bed"
          {...register('bed')}
          placeholder="e.g., B"
        />
      </div>

      {/* Address */}
      <Input
        label="Address"
        {...register('address')}
        placeholder="Enter full address"
      />

      {/* Diagnosis */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Diagnosis
        </label>
        <textarea
          {...register('diagnosis')}
          rows="3"
          className="input-field"
          placeholder="Enter diagnosis..."
        />
      </div>

      {/* Allergies */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Allergies (comma separated)
        </label>
        <input
          {...register('allergies')}
          className="input-field"
          placeholder="e.g., Penicillin, Aspirin"
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
          {patient ? 'Update Patient' : 'Add Patient'}
        </Button>
      </div>
    </form>
  )
}

export default PatientForm