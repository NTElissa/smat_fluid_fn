import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../hooks/useAuth'
import { 
  HiOutlineMail, 
  HiOutlineLockClosed,
  HiOutlineArrowLeft,
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineExclamationCircle,
  HiOutlineShieldCheck
} from 'react-icons/hi'
import { FaMapMarkerAlt } from 'react-icons/fa'

const LoginPage = () => {
  const navigate = useNavigate()
  const { loginUser, isLoading, isAuthenticated, error: authError } = useAuth()
  const { register, handleSubmit, formState: { errors, isValid } } = useForm({
    mode: 'onChange'
  })
  
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [loginError, setLoginError] = useState('')

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }
    if (authError) setLoginError(authError)
  }, [isAuthenticated, navigate, authError])

  const onSubmit = async (data) => {
    setLoginError('')
    const result = await loginUser(data.email, data.password)
    if (!result.success) {
      setLoginError(result.error || 'Invalid credentials. Please try again.')
    }
  }

  // Demo credentials filler
  const fillDemo = (role) => {
    const emailInput = document.querySelector('input[name="email"]')
    const passInput = document.querySelector('input[name="password"]')
    if (!emailInput || !passInput) return

    if (role === 'doctor') {
      emailInput.value = 'dr.jean@hospital.rw'
      passInput.value = 'password123'
    } else if (role === 'nurse') {
      emailInput.value = 'nurse.marie@hospital.rw'
      passInput.value = 'password123'
    }
    // Trigger form validation update
    const event = new Event('input', { bubbles: true })
    emailInput.dispatchEvent(event)
    passInput.dispatchEvent(event)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50/30 flex items-center justify-center p-4 sm:p-6">
      {/* Back link */}
      <Link 
        to="/" 
        className="absolute top-6 left-6 flex items-center gap-2 text-gray-600 hover:text-blue-700 transition-colors group text-sm font-medium"
      >
        <HiOutlineArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        Back to Home
      </Link>

      <div className="w-full max-w-md">
        {/* Header / Branding */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-2xl shadow-lg mb-5 transform transition hover:scale-105">
            <span className="text-white font-bold text-4xl">IV</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Welcome Back
          </h1>
          <p className="text-gray-600 flex items-center justify-center gap-2.5">
            <FaMapMarkerAlt className="w-5 h-5 text-teal-600" />
            Sign in to Smart IV Monitoring
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100/80 overflow-hidden">
          <div className="p-8 sm:p-10">
            {/* Error banner */}
            {(loginError || authError) && (
              <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                <HiOutlineExclamationCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-800">{loginError}</p>
                  <p className="text-xs text-red-700 mt-1">Please verify your credentials and try again.</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Invalid email format'
                      }
                    })}
                    className={`w-full pl-11 pr-4 py-3.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 placeholder-gray-400 ${
                      errors.email ? 'border-red-500 bg-red-50/50' : 'border-gray-300 hover:border-gray-400'
                    }`}
                    placeholder="doctor@hospital.rw"
                    disabled={isLoading}
                  />
                </div>
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1.5">
                    <HiOutlineExclamationCircle className="w-4 h-4" />
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    {...register('password', { 
                      required: 'Password is required',
                      minLength: { value: 6, message: 'Minimum 6 characters' }
                    })}
                    className={`w-full pl-11 pr-12 py-3.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 placeholder-gray-400 ${
                      errors.password ? 'border-red-500 bg-red-50/50' : 'border-gray-300 hover:border-gray-400'
                    }`}
                    placeholder="••••••••"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors p-1"
                    disabled={isLoading}
                  >
                    {showPassword ? <HiOutlineEyeOff className="w-5 h-5" /> : <HiOutlineEye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1.5">
                    <HiOutlineExclamationCircle className="w-4 h-4" />
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Options row */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    disabled={isLoading}
                  />
                  <span className="text-sm text-gray-700">Remember me</span>
                </label>

                <Link 
                  to="/forgot-password" 
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={!isValid || isLoading}
                className={`w-full py-3.5 px-6 rounded-xl font-medium text-white transition-all flex items-center justify-center gap-2 shadow-md ${
                  isValid && !isLoading
                    ? 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
                    : 'bg-blue-400 cursor-not-allowed'
                }`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <HiOutlineShieldCheck className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            {/* Register link */}
            <p className="text-center text-sm text-gray-600 mt-8">
              New here?{' '}
              <Link to="/register" className="text-blue-600 hover:text-blue-800 font-medium transition-colors">
                Create an account
              </Link>
            </p>
          </div>

          {/* Demo credentials section */}
          <div className="bg-gray-50/70 border-t border-gray-100 px-8 sm:px-10 py-6">
            <p className="text-xs font-medium text-gray-700 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></span>
              Quick Demo Access (for testing)
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => fillDemo('doctor')}
                className="py-2.5 px-4 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:border-blue-300 hover:bg-blue-50/50 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                disabled={isLoading}
              >
                <span className="text-lg">👨‍⚕️</span>
                <span>Doctor</span>
              </button>
              <button
                onClick={() => fillDemo('nurse')}
                className="py-2.5 px-4 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:border-blue-300 hover:bg-blue-50/50 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                disabled={isLoading}
              >
                <span className="text-lg">👩‍⚕️</span>
                <span>Nurse</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-gray-500 mt-8">
          © {new Date().getFullYear()} Smart IV Monitoring System — University of Kigali Project
        </p>
      </div>
    </div>
  )
}

export default LoginPage