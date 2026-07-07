import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { createPatient, updatePatient } from '../../services/patientService'
import Button from '../Common/Button'
import Input from '../Common/Input'
import { HiOutlineUser, HiOutlineMail, HiOutlinePhone, HiOutlineCalendar, HiOutlineHome, HiOutlineIdentification, HiOutlineBeaker, HiOutlineShieldExclamation, HiOutlineClipboardList } from 'react-icons/hi'
import toast from 'react-hot-toast'
import React from 'react'

const PatientForm = ({ patient, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
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
      status: 'admitted',
      allergies: ''
    }
  })

  useEffect(() => {
    reset({
      patientId: patient?.patientId || '',
      firstName: patient?.firstName || '',
      lastName: patient?.lastName || '',
      dateOfBirth: patient?.dateOfBirth ? new Date(patient.dateOfBirth).toISOString().split('T')[0] : '',
      gender: patient?.gender || 'male',
      phoneNumber: patient?.phoneNumber || '',
      email: patient?.email || '',
      address: patient?.address || '',
      ward: patient?.ward || '',
      room: patient?.room || '',
      bed: patient?.bed || '',
      diagnosis: patient?.diagnosis || '',
      status: patient?.status || 'admitted',
      allergies: Array.isArray(patient?.allergies) ? patient.allergies.join(', ') : ''
    })
  }, [patient, reset])

  const onSubmit = async (data) => {
    try {
      setLoading(true)
      const payload = {
        ...data,
        allergies: data.allergies
          ? data.allergies.split(',').map((item) => item.trim()).filter(Boolean)
          : []
      }

      if (patient) {
        await updatePatient(patient._id, payload)
        toast.success('Patient updated successfully')
      } else {
        await createPatient(payload)
        toast.success('Patient added successfully')
      }
      onSuccess?.()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed')
    } finally {
      setLoading(false)
    }
  }

  const statusStyles = {
    admitted: 'bg-teal-50 text-teal-700 ring-teal-600/20 dark:bg-teal-500/10 dark:text-teal-300 dark:ring-teal-400/20',
    discharged: 'bg-slate-100 text-slate-600 ring-slate-500/20 dark:bg-slate-500/10 dark:text-slate-300 dark:ring-slate-400/20',
    transferred: 'bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-400/20'
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto max-w-3xl space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900"
    >
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-slate-100 pb-5 dark:border-slate-800">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-700 text-white shadow-sm shadow-teal-900/20">
          <HiOutlineIdentification className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            {patient ? 'Update patient' : 'Add patient'}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Capture patient details and assign them to a room.
          </p>
        </div>
      </div>

      {/* Section: Identity */}
      <section className="rounded-xl border-l-4 border-teal-600 bg-teal-50/40 p-4 dark:border-teal-500 dark:bg-teal-500/5">
        <div className="mb-3 flex items-center justify-between">
          <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-300">
            <HiOutlineUser className="h-4 w-4" />
            Identity
          </span>
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${statusStyles[patient?.status || 'admitted']}`}>
            {(patient?.status || 'admitted').replace(/^\w/, (c) => c.toUpperCase())}
          </span>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input
            label="Patient ID"
            {...register('patientId', { required: 'Patient ID is required' })}
            error={errors.patientId?.message}
            icon={HiOutlineIdentification}
            placeholder="PT2024001"
          />
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Status</label>
            <select {...register('status')} className="input-field">
              <option value="admitted">Admitted</option>
              <option value="discharged">Discharged</option>
              <option value="transferred">Transferred</option>
            </select>
          </div>
          <Input
            label="First Name"
            {...register('firstName', { required: 'First name is required' })}
            error={errors.firstName?.message}
            placeholder="Enter first name"
          />
          <Input
            label="Last Name"
            {...register('lastName', { required: 'Last name is required' })}
            error={errors.lastName?.message}
            placeholder="Enter last name"
          />
          <Input
            label="Date of Birth"
            type="date"
            {...register('dateOfBirth', { required: 'Date of birth is required' })}
            error={errors.dateOfBirth?.message}
            icon={HiOutlineCalendar}
          />
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Gender</label>
            <select {...register('gender')} className="input-field">
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </section>

      {/* Section: Contact */}
      <section className="rounded-xl border-l-4 border-sky-500 bg-sky-50/40 p-4 dark:border-sky-400 dark:bg-sky-500/5">
        <span className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-700 dark:text-sky-300">
          <HiOutlinePhone className="h-4 w-4" />
          Contact
        </span>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
          <Input
            label="Email"
            type="email"
            {...register('email')}
            icon={HiOutlineMail}
            placeholder="patient@example.com"
          />
        </div>
        <div className="mt-4">
          <Input label="Address" {...register('address')} icon={HiOutlineHome} placeholder="Enter full address" />
        </div>
      </section>

      {/* Section: Room assignment */}
      <section className="rounded-xl border-l-4 border-indigo-500 bg-indigo-50/40 p-4 dark:border-indigo-400 dark:bg-indigo-500/5">
        <span className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
          <HiOutlineHome className="h-4 w-4" />
          Room assignment
        </span>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Input label="Ward" {...register('ward')} placeholder="e.g., Ward A" />
          <Input label="Room" {...register('room')} placeholder="e.g., 101" />
          <Input label="Bed" {...register('bed')} placeholder="e.g., B" />
        </div>
      </section>

      {/* Section: Clinical */}
      <section className="rounded-xl border-l-4 border-slate-400 bg-slate-50 p-4 dark:border-slate-600 dark:bg-slate-800/40">
        <span className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
          <HiOutlineClipboardList className="h-4 w-4" />
          Clinical notes
        </span>
        <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Diagnosis</label>
        <textarea {...register('diagnosis')} rows="3" className="input-field" placeholder="Enter diagnosis..." />
      </section>

      {/* Allergies — deliberately the one "alert" toned section on the form */}
      <section className="rounded-xl border border-amber-300/70 bg-amber-50 p-4 dark:border-amber-500/30 dark:bg-amber-500/10">
        <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-amber-800 dark:text-amber-300">
          <HiOutlineShieldExclamation className="h-4 w-4" />
          Allergies
          <span className="font-normal text-amber-600/80 dark:text-amber-400/80">(comma separated)</span>
        </label>
        <div className="relative">
          <HiOutlineBeaker className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-amber-500" />
          <input
            {...register('allergies')}
            className="input-field border-amber-300 bg-white pl-10 focus:border-amber-500 focus:ring-amber-500 dark:border-amber-500/30 dark:bg-slate-900"
            placeholder="e.g., Penicillin, Aspirin"
          />
        </div>
      </section>

      {/* Actions */}
      <div className="flex justify-end gap-3 border-t border-slate-100 pt-5 dark:border-slate-800">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" isLoading={loading}>
          {patient ? 'Update patient' : 'Add patient'}
        </Button>
      </div>
    </form>
  )
}

export default PatientForm