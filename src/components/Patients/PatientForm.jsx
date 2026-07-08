// components/Patients/PatientForm.jsx
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { createPatient, updatePatient } from '../../services/patientService';
import { getRooms } from '../../services/roomService';
import Button from '../Common/Button';
import Input from '../Common/Input';
import { 
  HiOutlineUser, 
  HiOutlineMail, 
  HiOutlinePhone, 
  HiOutlineCalendar, 
  HiOutlineHome, 
  HiOutlineIdentification, 
  HiOutlineBeaker, 
  HiOutlineShieldExclamation, 
  HiOutlineClipboardList,
  HiOutlineUserGroup,
  HiOutlineHeart,
  HiOutlinePhoneIncoming,
  HiOutlineLocationMarker,
  HiOutlineInformationCircle,
  HiOutlinePlusCircle,
  HiOutlineXCircle
} from 'react-icons/hi';
import toast from 'react-hot-toast';
import React from 'react';

const PatientForm = ({ patient, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(false);
  
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm({
    defaultValues: {
      patientId: '',
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: 'male',
      phoneNumber: '',
      email: '',
      address: '',
      roomId: '',
      diagnosis: '',
      status: 'admitted',
      allergies: '',
      emergencyContact: {
        name: '',
        relationship: '',
        phoneNumber: ''
      },
      notes: ''
    }
  });

  // Watch roomId to show room details
  const selectedRoomId = watch('roomId');
  const selectedRoom = rooms.find(r => r._id === selectedRoomId);

  useEffect(() => {
    loadRooms();
  }, []);

  useEffect(() => {
    if (patient) {
      reset({
        patientId: patient.patientId || '',
        firstName: patient.firstName || '',
        lastName: patient.lastName || '',
        dateOfBirth: patient.dateOfBirth ? new Date(patient.dateOfBirth).toISOString().split('T')[0] : '',
        gender: patient.gender || 'male',
        phoneNumber: patient.phoneNumber || '',
        email: patient.email || '',
        address: patient.address || '',
        roomId: patient.roomId?._id || patient.roomId || '',
        diagnosis: patient.diagnosis || '',
        status: patient.status || 'admitted',
        allergies: Array.isArray(patient.allergies) ? patient.allergies.join(', ') : '',
        emergencyContact: {
          name: patient.emergencyContact?.name || '',
          relationship: patient.emergencyContact?.relationship || '',
          phoneNumber: patient.emergencyContact?.phoneNumber || ''
        },
        notes: patient.notes || ''
      });
    }
  }, [patient, reset]);

  const loadRooms = async () => {
    try {
      setLoadingRooms(true);
      const response = await getRooms({ isActive: true });
      setRooms(response.data || []);
    } catch (error) {
      console.error('Error loading rooms:', error);
      toast.error('Failed to load rooms');
    } finally {
      setLoadingRooms(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      
      // Format data for backend
      const payload = {
        ...data,
        allergies: data.allergies ? data.allergies.split(',').map(item => item.trim()).filter(Boolean) : [],
        emergencyContact: data.emergencyContact
      };

      if (patient) {
        await updatePatient(patient._id, payload);
        toast.success('Patient updated successfully');
      } else {
        await createPatient(payload);
        toast.success('Patient added successfully');
      }
      onSuccess?.();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
      console.error('Error saving patient:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Header */}
      <div className="flex items-start gap-4 border-b border-gray-200 pb-6 dark:border-gray-700">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30">
          <HiOutlineUser className="h-7 w-7" />
        </div>
        <div className="flex-1">
          <h3 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {patient ? 'Update Patient Record' : 'Register New Patient'}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {patient ? 'Edit patient details and medical information' : 'Create a complete patient profile with room assignment'}
          </p>
        </div>
        {patient && (
          <span className={`inline-flex items-center rounded-full px-4 py-1.5 text-sm font-medium ring-1 ring-inset ${
            patient.status === 'admitted' ? 'bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-500/10 dark:text-green-400' :
            patient.status === 'discharged' ? 'bg-gray-50 text-gray-600 ring-gray-500/20 dark:bg-gray-500/10 dark:text-gray-400' :
            'bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-400'
          }`}>
            {patient.status?.charAt(0).toUpperCase() + patient.status?.slice(1)}
          </span>
        )}
      </div>

      {/* Personal Information */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
            <HiOutlineIdentification className="h-5 w-5" />
          </div>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Personal Information</h4>
        </div>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Input
            label="Patient ID"
            {...register('patientId', { required: 'Patient ID is required' })}
            error={errors.patientId?.message}
            icon={HiOutlineIdentification}
            placeholder="Auto-generated"
            disabled
            className="bg-gray-50 dark:bg-gray-800"
          />
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
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Gender</label>
            <div className="flex gap-4">
              {['male', 'female', 'other'].map((option) => (
                <label key={option} className="flex items-center gap-2">
                  <input
                    type="radio"
                    value={option}
                    {...register('gender')}
                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">{option}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
            <select 
              {...register('status')} 
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            >
              <option value="admitted">Admitted</option>
              <option value="discharged">Discharged</option>
              <option value="transferred">Transferred</option>
            </select>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
            <HiOutlinePhone className="h-5 w-5" />
          </div>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Contact Details</h4>
        </div>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input
            label="Phone Number"
            {...register('phoneNumber', { 
              required: 'Phone number is required',
              pattern: {
                value: /^(\+250|0)[0-9]{9}$/,
                message: 'Invalid phone number'
              }
            })}
            error={errors.phoneNumber?.message}
            icon={HiOutlinePhone}
            placeholder="0788123456"
          />
          <Input
            label="Email Address"
            type="email"
            {...register('email')}
            icon={HiOutlineMail}
            placeholder="patient@example.com"
          />
          <Input
            label="Address"
            {...register('address')}
            icon={HiOutlineLocationMarker}
            placeholder="Enter full address"
            className="md:col-span-2"
          />
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400">
            <HiOutlinePhoneIncoming className="h-5 w-5" />
          </div>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Emergency Contact</h4>
        </div>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Input
            label="Contact Name"
            {...register('emergencyContact.name')}
            placeholder="Full name"
          />
          <Input
            label="Relationship"
            {...register('emergencyContact.relationship')}
            placeholder="e.g., Spouse, Parent"
          />
          <Input
            label="Phone Number"
            {...register('emergencyContact.phoneNumber')}
            placeholder="0788123456"
          />
        </div>
      </div>

      {/* Room Assignment */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
            <HiOutlineHome className="h-5 w-5" />
          </div>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Room Assignment</h4>
        </div>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Select Room</label>
            <select
              {...register('roomId')}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              disabled={loadingRooms}
            >
              <option value="">No Room Assigned</option>
              {rooms.map((room) => (
                <option key={room._id} value={room._id}>
                  {room.roomNumber} - {room.ward} (Floor {room.floor}) - {room.currentOccupancy}/{room.capacity}
                </option>
              ))}
            </select>
            {loadingRooms && <p className="mt-1 text-sm text-gray-500">Loading rooms...</p>}
          </div>
          
          {selectedRoom && (
            <div className="rounded-lg bg-emerald-50 p-4 dark:bg-emerald-900/20">
              <div className="flex items-start gap-3">
                <HiOutlineInformationCircle className="mt-0.5 h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Room {selectedRoom.roomNumber}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedRoom.ward} • Floor {selectedRoom.floor} • {selectedRoom.type}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Occupancy: {selectedRoom.currentOccupancy}/{selectedRoom.capacity}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Medical Information */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
            <HiOutlineHeart className="h-5 w-5" />
          </div>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Medical Information</h4>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Diagnosis</label>
            <textarea
              {...register('diagnosis')}
              rows="2"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              placeholder="Enter primary diagnosis..."
            />
          </div>
          
          <div>
            <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <HiOutlineShieldExclamation className="h-4 w-4 text-amber-500" />
              Allergies
              <span className="text-xs font-normal text-gray-500">(comma separated)</span>
            </label>
            <Input
              {...register('allergies')}
              placeholder="e.g., Penicillin, Aspirin, Latex"
              className="border-amber-200 focus:border-amber-500 focus:ring-amber-500/20 dark:border-amber-800"
            />
          </div>
          
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Additional Notes</label>
            <textarea
              {...register('notes')}
              rows="3"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              placeholder="Any additional notes about the patient..."
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-6 dark:border-gray-700 sm:flex-row sm:justify-end">
        <Button 
          type="button" 
          variant="secondary" 
          onClick={onCancel} 
          disabled={loading}
          className="w-full sm:w-auto"
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          variant="primary" 
          isLoading={loading}
          className="w-full sm:w-auto"
        >
          {patient ? 'Update Patient' : 'Register Patient'}
        </Button>
      </div>
    </form>
  );
};

export default PatientForm;