import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../hooks/useAuth'
import {
  HiOutlineUser,
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlinePhone,
  HiOutlineOfficeBuilding,
  HiOutlineIdentification,
  HiOutlineArrowLeft,
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle
} from 'react-icons/hi'
import { FaMapMarkerAlt } from 'react-icons/fa'

const RegisterPage = () => {
  const navigate = useNavigate()
  const { registerUser, isLoading, isAuthenticated } = useAuth()
  const { register, handleSubmit, watch, formState: { errors, isValid } } = useForm({
    mode: 'onChange'
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [registrationError, setRegistrationError] = useState('')

  const password = watch('password', '')
  const watchFields = watch()

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate])

  const onSubmit = async (data) => {
    setRegistrationError('')

    // Remove confirmPassword and terms before sending to API
    const { confirmPassword, terms, ...userData } = data

    const registrationData = {
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      phoneNumber: userData.phoneNumber,
      password: userData.password,
      role: userData.role,
      hospital: userData.hospital,
      department: userData.department || '',
      employeeId: userData.employeeId || ''
    }

    const result = await registerUser(registrationData)
    if (!result.success) {
      setRegistrationError(result.error)
    }
  }

  const nextStep = () => {
    if (currentStep === 1) {
      if (watchFields.firstName && watchFields.lastName && watchFields.email && watchFields.phoneNumber) {
        setCurrentStep(2)
      }
    } else if (currentStep === 2) {
      if (watchFields.role && watchFields.hospital) {
        setCurrentStep(3)
      }
    }
  }

  const steps = [
    { number: 1, name: 'Personal Info', fields: ['firstName', 'lastName', 'email', 'phoneNumber'] },
    { number: 2, name: 'Professional Info', fields: ['role', 'hospital'] },
    { number: 3, name: 'Security', fields: ['password', 'confirmPassword', 'terms'] }
  ]

  const roles = [
    { value: 'doctor', label: 'Doctor', icon: '👨‍⚕️', description: 'Medical Doctor' },
    { value: 'nurse', label: 'Nurse', icon: '👩‍⚕️', description: 'Registered Nurse' },
    { value: 'support_staff', label: 'Support Staff', icon: '🛠️', description: 'Technical Support' },
    { value: 'admin', label: 'Administrator', icon: '👔', description: 'Hospital Admin' }
  ]

  const hospitals = [
    'CHUK - Kigali',
    'CHUB - Butare',
    'Rwanda Military Hospital',
    'King Faisal Hospital',
    'Kibagabaga Hospital',
    'Masaka Hospital',
    'Nyamata Hospital',
    'Other'
  ]

  const departments = [
    'Emergency',
    'ICU',
    'Surgery',
    'Pediatrics',
    'Maternity',
    'Cardiology',
    'Oncology',
    'General Ward',
    'Administration'
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 py-8 px-4">
      {/* Back to Home Link */}
      <Link
        to="/"
        className="absolute top-4 left-4 flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors group z-10"
      >
        <HiOutlineArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span>Back to Home</span>
      </Link>

      <div className="max-w-2xl mx-auto">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-600 rounded-2xl shadow-lg mb-4 transform hover:scale-105 transition-transform">
            <span className="text-white font-bold text-3xl">IV</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create Your Account
          </h1>
          <p className="text-gray-600 flex items-center justify-center gap-2">
            <FaMapMarkerAlt className="w-5 h-5 text-primary-600" />
            Join Rwanda's Smart IV Monitoring System
          </p>
        </div>

        {/* Error Message */}
        {registrationError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
            <HiOutlineExclamationCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-red-700">{registrationError}</p>
              <p className="text-xs text-red-600 mt-1">Please check your information and try again</p>
            </div>
          </div>
        )}

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step) => (
              <div key={step.number} className="flex-1 text-center">
                <div className="relative">
                  <div
                    className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                      currentStep > step.number
                        ? 'bg-green-500 text-white'
                        : currentStep === step.number
                        ? 'bg-primary-600 text-white ring-4 ring-primary-100'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {currentStep > step.number ? (
                      <HiOutlineCheckCircle className="w-6 h-6" />
                    ) : (
                      step.number
                    )}
                  </div>
                  <p className="text-xs mt-2 text-gray-600 hidden sm:block font-medium">{step.name}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="relative mt-4">
            <div className="absolute top-0 left-0 h-1 bg-gray-200 w-full rounded"></div>
            <div
              className="absolute top-0 left-0 h-1 bg-primary-600 rounded transition-all duration-500"
              style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Registration Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="space-y-5 animate-fadeIn">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <span className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 text-sm">1</span>
                  <span>Personal Information</span>
                </h2>

                {/* First Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <HiOutlineUser className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      {...register('firstName', {
                        required: 'First name is required',
                        minLength: { value: 2, message: 'First name must be at least 2 characters' },
                        pattern: { value: /^[A-Za-z\s]+$/, message: 'First name can only contain letters' }
                      })}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
                        errors.firstName ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="Enter your first name"
                      disabled={isLoading}
                    />
                  </div>
                  {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>}
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <HiOutlineUser className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      {...register('lastName', {
                        required: 'Last name is required',
                        minLength: { value: 2, message: 'Last name must be at least 2 characters' },
                        pattern: { value: /^[A-Za-z\s]+$/, message: 'Last name can only contain letters' }
                      })}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                        errors.lastName ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="Enter your last name"
                      disabled={isLoading}
                    />
                  </div>
                  {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <HiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      {...register('email', {
                        required: 'Email is required',
                        pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Please enter a valid email address' }
                      })}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                        errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="you@hospital.rw"
                      disabled={isLoading}
                    />
                  </div>
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <HiOutlinePhone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      {...register('phoneNumber', {
                        required: 'Phone number is required',
                        pattern: { value: /^(\+250|0)7[0-9]{8}$/, message: 'Please enter a valid Rwanda phone number' }
                      })}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                        errors.phoneNumber ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="0788 123 456"
                      disabled={isLoading}
                    />
                  </div>
                  {errors.phoneNumber && <p className="mt-1 text-sm text-red-600">{errors.phoneNumber.message}</p>}
                  <p className="text-xs text-gray-500 mt-1">Format: 0788 123 456 or +250788123456</p>
                </div>
              </div>
            )}

            {/* Step 2: Professional Information */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-fadeIn">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <span className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 text-sm">2</span>
                  <span>Professional Information</span>
                </h2>

                {/* Role - Improved version */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Your Role <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {roles.map((role) => (
                      <label
                        key={role.value}
                        className={`
                          relative cursor-pointer group rounded-xl border-2 p-5 text-center 
                          transition-all duration-200 hover:border-primary-400 hover:shadow-md hover:-translate-y-0.5
                          focus-within:ring-2 focus-within:ring-primary-300 focus-within:ring-offset-2
                          ${watch('role') === role.value
                            ? 'border-primary-600 bg-primary-50 shadow-md ring-2 ring-primary-200/60'
                            : 'border-gray-200 bg-white'
                          }
                        `}
                      >
                        <input
                          type="radio"
                          value={role.value}
                          {...register('role', { required: 'Please select your role' })}
                          className="sr-only peer"
                          disabled={isLoading}
                        />

                        <div className={`
                          mx-auto mb-3 w-16 h-16 flex items-center justify-center rounded-full text-4xl
                          transition-all duration-200
                          ${watch('role') === role.value
                            ? 'bg-primary-100 text-primary-700 ring-4 ring-primary-100/50'
                            : 'bg-gray-100 text-gray-600'
                          }
                        `}>
                          {role.icon}
                        </div>

                        <div className="space-y-1">
                          <div className={`
                            font-semibold text-base transition-colors
                            ${watch('role') === role.value ? 'text-primary-700' : 'text-gray-800'}
                          `}>
                            {role.label}
                          </div>
                          <div className="text-xs text-gray-500">
                            {role.description}
                          </div>
                        </div>

                        {watch('role') === role.value && (
                          <div className="absolute -top-2 -right-2 bg-primary-600 text-white rounded-full p-1 shadow-sm">
                            <HiOutlineCheckCircle className="w-5 h-5" />
                          </div>
                        )}
                      </label>
                    ))}
                  </div>

                  {errors.role && (
                    <p className="mt-2 text-sm text-red-600">{errors.role.message}</p>
                  )}
                </div>

                {/* Hospital */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hospital/Facility <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <HiOutlineOfficeBuilding className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      {...register('hospital', { required: 'Please select your hospital' })}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white ${
                        errors.hospital ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                      disabled={isLoading}
                    >
                      <option value="">Select your hospital</option>
                      {hospitals.map(hospital => (
                        <option key={hospital} value={hospital}>{hospital}</option>
                      ))}
                    </select>
                  </div>
                  {errors.hospital && <p className="mt-1 text-sm text-red-600">{errors.hospital.message}</p>}
                </div>

                {/* Department */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department
                  </label>
                  <select
                    {...register('department')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    disabled={isLoading}
                  >
                    <option value="">Select department (optional)</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                {/* Employee ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Employee/Staff ID
                  </label>
                  <div className="relative">
                    <HiOutlineIdentification className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      {...register('employeeId')}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter your staff ID (optional)"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Security */}
            {currentStep === 3 && (
              <div className="space-y-5 animate-fadeIn">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <span className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 text-sm">3</span>
                  <span>Security Settings</span>
                </h2>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <HiOutlineLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      {...register('password', {
                        required: 'Password is required',
                        minLength: { value: 8, message: 'Password must be at least 8 characters' },
                        pattern: {
                          value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                          message: 'Must contain uppercase, lowercase and number'
                        }
                      })}
                      className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                        errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="Create a strong password"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                      disabled={isLoading}
                    >
                      {showPassword ? <HiOutlineEyeOff className="w-5 h-5" /> : <HiOutlineEye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}

                  {/* Password strength */}
                  <div className="mt-3 space-y-2">
                    <div className="flex space-x-1">
                      <div className={`h-1 flex-1 rounded transition-colors ${password.length >= 8 ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                      <div className={`h-1 flex-1 rounded transition-colors ${/[A-Z]/.test(password) ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                      <div className={`h-1 flex-1 rounded transition-colors ${/[a-z]/.test(password) ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                      <div className={`h-1 flex-1 rounded transition-colors ${/\d/.test(password) ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                    </div>
                    <ul className="text-xs text-gray-500 space-y-1">
                      <li className={`flex items-center space-x-1 ${password.length >= 8 ? 'text-green-600' : ''}`}>
                        <span>{password.length >= 8 ? '✓' : '○'}</span><span>At least 8 characters</span>
                      </li>
                      <li className={`flex items-center space-x-1 ${/[A-Z]/.test(password) ? 'text-green-600' : ''}`}>
                        <span>{/[A-Z]/.test(password) ? '✓' : '○'}</span><span>One uppercase letter</span>
                      </li>
                      <li className={`flex items-center space-x-1 ${/[a-z]/.test(password) ? 'text-green-600' : ''}`}>
                        <span>{/[a-z]/.test(password) ? '✓' : '○'}</span><span>One lowercase letter</span>
                      </li>
                      <li className={`flex items-center space-x-1 ${/\d/.test(password) ? 'text-green-600' : ''}`}>
                        <span>{/\d/.test(password) ? '✓' : '○'}</span><span>One number</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <HiOutlineLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      {...register('confirmPassword', {
                        required: 'Please confirm your password',
                        validate: value => value === password || 'Passwords do not match'
                      })}
                      className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                        errors.confirmPassword ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="Re-enter your password"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? <HiOutlineEyeOff className="w-5 h-5" /> : <HiOutlineEye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>}
                </div>

                {/* Terms */}
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      {...register('terms', { required: 'You must accept the terms and conditions' })}
                      className="mt-1 w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                      disabled={isLoading}
                    />
                    <span className="text-sm text-gray-600">
                      I agree to the{' '}
                      <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">Terms of Service</a>
                      {' '}and{' '}
                      <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">Privacy Policy</a>.
                      Your information is secure and encrypted.
                    </span>
                  </label>
                  {errors.terms && <p className="mt-1 text-sm text-red-600">{errors.terms.message}</p>}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t border-gray-200">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors flex items-center space-x-2"
                  disabled={isLoading}
                >
                  <span>←</span>
                  <span>Previous</span>
                </button>
              )}

              {currentStep < 3 ? (
                <button
                 type="button"
  onClick={nextStep}
  className="ml-auto px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2 transform hover:scale-[1.02] active:scale-[0.98]"
  disabled={isLoading}
                >
                  <span>Next Step</span>
                  <span>→</span>
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!isValid || isLoading}
                  className="ml-auto px-8 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2 min-w-[180px]"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Account</span>
                      <span>✓</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </form>

          <p className="text-center text-sm text-gray-600 mt-8">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium transition-colors">
              Sign in here
            </Link>
          </p>
        </div>

        {/* Security Note */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500 flex items-center justify-center space-x-1">
            <span>🔒</span>
            <span>Your information is encrypted and secure. We'll never share your details.</span>
          </p>
        </div>
      </div>

      {/* Animation keyframes */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}

export default RegisterPage