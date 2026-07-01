import { useState } from 'react'
import React from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../../hooks/useAuth'
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineUser, HiOutlinePhone } from 'react-icons/hi'
import { FaHospital, FaUserMd, FaUserNurse } from 'react-icons/fa'
import Button from '../Common/Button'
import Input from '../Common/Input'
import toast from 'react-hot-toast'

const Register = () => {
  const { registerUser, isLoading } = useAuth()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm()
  const password = watch('password')

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    const userData = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      password: data.password,
      role: data.role,
      hospital: data.hospital,
      department: data.department,
      employeeId: data.employeeId
    }

    const result = await registerUser(userData)
    if (result.success) {
      navigate('/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">IV</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Smart IV Monitoring</span>
          </Link>
        </div>

        {/* Register Form */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h2>
          <p className="text-gray-600 mb-6">Register as healthcare staff</p>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="First Name"
                icon={HiOutlineUser}
                placeholder="Enter first name"
                error={errors.firstName?.message}
                {...register('firstName', { 
                  required: 'First name is required'
                })}
              />

              <Input
                label="Last Name"
                icon={HiOutlineUser}
                placeholder="Enter last name"
                error={errors.lastName?.message}
                {...register('lastName', { 
                  required: 'Last name is required'
                })}
              />
            </div>

            <Input
              label="Email Address"
              type="email"
              icon={HiOutlineMail}
              placeholder="Enter your email"
              error={errors.email?.message}
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
            />

            <Input
              label="Phone Number"
              icon={HiOutlinePhone}
              placeholder="0788123456"
              error={errors.phoneNumber?.message}
              {...register('phoneNumber', { 
                required: 'Phone number is required',
                pattern: {
                  value: /^0[0-9]{9}$/,
                  message: 'Invalid Rwanda phone number'
                }
              })}
            />

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <div className="grid grid-cols-3 gap-3">
                <label className={`
                  flex flex-col items-center p-3 border rounded-lg cursor-pointer
                  ${watch('role') === 'doctor' ? 'border-primary-600 bg-primary-50' : 'border-gray-200 hover:bg-gray-50'}
                `}>
                  <input
                    type="radio"
                    value="doctor"
                    {...register('role', { required: 'Role is required' })}
                    className="sr-only"
                  />
                  <FaUserMd className={`w-6 h-6 mb-1 ${watch('role') === 'doctor' ? 'text-primary-600' : 'text-gray-400'}`} />
                  <span className={`text-sm ${watch('role') === 'doctor' ? 'text-primary-600 font-medium' : 'text-gray-600'}`}>Doctor</span>
                </label>

                <label className={`
                  flex flex-col items-center p-3 border rounded-lg cursor-pointer
                  ${watch('role') === 'nurse' ? 'border-primary-600 bg-primary-50' : 'border-gray-200 hover:bg-gray-50'}
                `}>
                  <input
                    type="radio"
                    value="nurse"
                    {...register('role', { required: 'Role is required' })}
                    className="sr-only"
                  />
                  <FaUserNurse className={`w-6 h-6 mb-1 ${watch('role') === 'nurse' ? 'text-primary-600' : 'text-gray-400'}`} />
                  <span className={`text-sm ${watch('role') === 'nurse' ? 'text-primary-600 font-medium' : 'text-gray-600'}`}>Nurse</span>
                </label>

                <label className={`
                  flex flex-col items-center p-3 border rounded-lg cursor-pointer
                  ${watch('role') === 'support_staff' ? 'border-primary-600 bg-primary-50' : 'border-gray-200 hover:bg-gray-50'}
                `}>
                  <input
                    type="radio"
                    value="support_staff"
                    {...register('role', { required: 'Role is required' })}
                    className="sr-only"
                  />
                  <FaHospital className={`w-6 h-6 mb-1 ${watch('role') === 'support_staff' ? 'text-primary-600' : 'text-gray-400'}`} />
                  <span className={`text-sm ${watch('role') === 'support_staff' ? 'text-primary-600 font-medium' : 'text-gray-600'}`}>Support</span>
                </label>
              </div>
              {errors.role && (
                <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
              )}
            </div>

            {/* Hospital Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Hospital"
                icon={FaHospital}
                placeholder="Enter hospital name"
                error={errors.hospital?.message}
                {...register('hospital', { 
                  required: 'Hospital is required'
                })}
              />

              <Input
                label="Department"
                placeholder="e.g., ICU, Emergency"
                error={errors.department?.message}
                {...register('department')}
              />
            </div>

            <Input
              label="Employee ID"
              placeholder="Enter employee ID"
              error={errors.employeeId?.message}
              {...register('employeeId')}
            />

            {/* Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  icon={HiOutlineLockClosed}
                  placeholder="Create password"
                  error={errors.password?.message}
                  {...register('password', { 
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <HiOutlineEyeOff size={20} /> : <HiOutlineEye size={20} />}
                </button>
              </div>

              <div className="relative">
                <Input
                  label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  icon={HiOutlineLockClosed}
                  placeholder="Confirm password"
                  error={errors.confirmPassword?.message}
                  {...register('confirmPassword', { 
                    required: 'Please confirm your password',
                    validate: value => value === password || 'Passwords do not match'
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? <HiOutlineEyeOff size={20} /> : <HiOutlineEye size={20} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full"
            >
              Create Account
            </Button>

            <p className="text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register