import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  HiOutlineHeart, 
  HiOutlineBell, 
  HiOutlineCpuChip, 
  HiOutlineUsers,
  HiOutlineChevronRight,
  HiOutlineCheckCircle,
  HiOutlineShieldCheck,
  HiOutlineClock,
  HiOutlineGlobeAlt,
  HiOutlineAcademicCap,
  HiOutlineLightBulb
} from 'react-icons/hi2'
import { FaMapMarkerAlt } from 'react-icons/fa'
import { useAuth } from '../hooks/useAuth'

const LandingPage = () => {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isAuthenticated, navigate])

  const features = [
    {
      icon: HiOutlineBell,
      title: 'Instant Notifications',
      description: 'SMS & app alerts for low/high IV levels — critical in busy & understaffed wards',
      color: 'bg-red-50 text-red-700'
    },
    {
      icon: HiOutlineCpuChip,
      title: 'Accurate Fluid Tracking',
      description: 'Weight-based sensors with >95% accuracy — detects both low levels & overload risk',
      color: 'bg-blue-50 text-blue-700'
    },
    {
      icon: HiOutlineUsers,
      title: 'Task Delegation',
      description: 'Doctors & nurses assign bag changes to support staff — reduces workload & delays',
      color: 'bg-green-50 text-green-700'
    },
    {
      icon: HiOutlineClock,
      title: 'Offline & Solar Ready',
      description: 'Works in low-connectivity & power-unstable areas — essential for rural Rwanda',
      color: 'bg-purple-50 text-purple-700'
    }
  ]

  const howItWorks = [
    { step: '1', title: 'Install Device', desc: 'Attach low-cost sensor & microcontroller to IV stand' },
    { step: '2', title: 'Connect & Configure', desc: 'Link to Wi-Fi / GSM — set thresholds & staff list' },
    { step: '3', title: 'Monitor in Real-Time', desc: 'Dashboard shows levels — alerts fire automatically' },
    { step: '4', title: 'Delegate & Act', desc: 'Assign tasks via app/SMS — improve response time' }
  ]

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* ─── Sticky Navbar ──────────────────────────────────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm py-3' : 'bg-transparent py-5'
      }`}>
        <div className="max-w-7xl mx-auto px-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
              IV
            </div>
            <span className="font-semibold text-gray-900 text-lg">Smart IV Monitor</span>
          </div>

          <div className="flex items-center gap-5">
            {/* <Link to="/login" className="text-gray-700 hover:text-gray-900 font-medium">
              Login
            </Link> */}
            <Link
              to="/login"
              className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── Hero ────────────────────────────────────────────────────────── */}
      <section className="pt-28 pb-20 md:pt-40 md:pb-28 px-5 bg-gradient-to-br from-indigo-50/70 via-white to-blue-50/40">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 text-indigo-700 mb-5 text-sm font-medium">
              <FaMapMarkerAlt className="w-4 h-4" />
              <span>Kigali, Rwanda — Built for Rwandan Hospitals</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Safer IV Therapy with <span className="text-indigo-600">Smart Real-Time Monitoring</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-700 mb-8 leading-relaxed">
              Reduce air embolism & fluid overload risks. Instant alerts + task delegation — designed for busy wards and rural clinics with limited staff & connectivity.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/register"
                className="bg-indigo-600 text-white px-8 py-3.5 rounded-lg font-medium hover:bg-indigo-700 transition flex items-center justify-center gap-2 shadow-md"
              >
                Request Prototype Demo
                <HiOutlineChevronRight className="w-5 h-5" />
              </Link>
              <Link
                to="/about"
                className="border-2 border-indigo-600 text-indigo-700 px-8 py-3.5 rounded-lg font-medium hover:bg-indigo-50 transition text-center"
              >
                Learn How It Works
              </Link>
            </div>

            {/* Mini trust bar */}
            <div className="flex flex-wrap gap-6 mt-10 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <HiOutlineAcademicCap className="w-5 h-5 text-indigo-600" />
                <span>University of Kigali Research</span>
              </div>
              <div className="flex items-center gap-2">
                <HiOutlineCheckCircle className="w-5 h-5 text-green-600" />
                <span>95%+ Detection Accuracy</span>
              </div>
              <div className="flex items-center gap-2">
                <HiOutlineLightBulb className="w-5 h-5 text-amber-600" />
                <span>Prototype Validated in Simulation</span>
              </div>
            </div>
          </div>

          {/* Hero visual placeholder */}
          <div className="relative hidden md:block">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              <div className="aspect-video bg-gradient-to-br from-indigo-100 to-blue-100 flex items-center justify-center">
                <div className="text-center p-8">
                  <HiOutlineHeart className="w-20 h-20 text-indigo-500 mx-auto mb-4 opacity-80" />
                  <p className="text-gray-700 font-medium">Real-time IV Dashboard</p>
                  <p className="text-sm text-gray-500 mt-2">Fluid level • Alerts • Task status</p>
                </div>
              </div>
              <div className="absolute -bottom-5 -right-5 bg-white rounded-xl shadow-lg p-4 border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-medium text-gray-800">Monitoring Live</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Features ────────────────────────────────────────────────────── */}
      <section className="py-20 bg-gray-50/70">
        <div className="max-w-7xl mx-auto px-5">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-5">
              Built for Rwanda's Healthcare Reality
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Addresses manual checking delays, understaffing, unreliable power & internet — common challenges in urban and rural facilities.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f, i) => (
              <div 
                key={i} 
                className="bg-white rounded-xl p-7 shadow-sm hover:shadow-md transition-all border border-gray-100"
              >
                <div className={`w-14 h-14 ${f.color} rounded-xl flex items-center justify-center mb-5`}>
                  <f.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{f.title}</h3>
                <p className="text-gray-600">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works ────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-5">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-5">
              Simple Deployment Path
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              From prototype installation to daily use in your ward — designed for fast onboarding.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 md:gap-6">
            {howItWorks.map((step) => (
              <div key={step.step} className="relative text-center">
                <div className="w-14 h-14 mx-auto bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-2xl mb-6 shadow-sm">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Final ───────────────────────────────────────────────────── */}
      <section className="py-24 bg-indigo-600 text-white">
        <div className="max-w-5xl mx-auto px-5 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Pilot in Your Hospital?
          </h2>
          <p className="text-indigo-100 text-lg mb-10 max-w-2xl mx-auto">
            Join early pilot partners. Start with simulated testing — help shape the next version for Rwanda’s healthcare system.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <Link
              to="/register"
              className="bg-white text-indigo-700 px-10 py-4 rounded-lg font-semibold hover:bg-gray-100 transition text-lg shadow-lg"
            >
              Request Pilot Information
            </Link>
            <Link
              to="/contact"
              className="border-2 border-white/70 text-white px-10 py-4 rounded-lg font-semibold hover:bg-white/10 transition text-lg"
            >
              Speak with the Team
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Footer ──────────────────────────────────────────────────────── */}
      <footer className="bg-gray-900 text-gray-400 py-16">
        <div className="max-w-7xl mx-auto px-5 grid md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
                IV
              </div>
              <span className="text-white font-semibold text-lg">Smart IV Monitor</span>
            </div>
            <p className="text-sm">
              IoT-based IV monitoring system developed from University of Kigali research — making IV therapy safer across Rwanda.
            </p>
          </div>

          <div>
            <h4 className="text-white font-medium mb-5">Product</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/features" className="hover:text-white">Features</Link></li>
              <li><Link to="/how-it-works" className="hover:text-white">How It Works</Link></li>
              <li><Link to="/pilot" className="hover:text-white">Pilot Program</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium mb-5">Resources</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/research" className="hover:text-white">Research Paper</Link></li>
              <li><Link to="/faq" className="hover:text-white">FAQ</Link></li>
              <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium mb-5">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li>info@smartiv.rw</li>
              <li>+250 788 183 209 2</li>
              <li>Kigali, Rwanda</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm">
          © {new Date().getFullYear()} Smart IV Monitoring System — University of Kigali Research Project
        </div>
      </footer>
    </div>
  )
}

export default LandingPage