// src/components/Patients/PatientCard.jsx
import { HiOutlinePencilSquare, HiOutlineTrash, HiOutlineHome, HiOutlineCalendar, HiOutlineUser, HiOutlinePhone, HiOutlineClipboardDocument, HiOutlineBeaker } from 'react-icons/hi2'

const PatientCard = ({ patient, onEdit, onDelete }) => {
  const statusColors = {
    admitted: 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25',
    discharged: 'bg-gradient-to-r from-slate-500 to-slate-600 text-white shadow-lg shadow-slate-500/25',
    transferred: 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/25'
  }

  const genderStyles = {
    male: { icon: '♂', gradient: 'from-sky-400 to-blue-500', bg: 'bg-gradient-to-br from-sky-100 to-blue-100 dark:from-sky-900/30 dark:to-blue-900/30' },
    female: { icon: '♀', gradient: 'from-pink-400 to-rose-500', bg: 'bg-gradient-to-br from-pink-100 to-rose-100 dark:from-pink-900/30 dark:to-rose-900/30' },
    other: { icon: '⚥', gradient: 'from-purple-400 to-violet-500', bg: 'bg-gradient-to-br from-purple-100 to-violet-100 dark:from-purple-900/30 dark:to-violet-900/30' }
  }

  const gender = genderStyles[patient.gender] || genderStyles.other

  return (
    <div className="group relative bg-white dark:bg-slate-900 rounded-3xl overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl shadow-lg hover:shadow-primary-500/10 dark:shadow-slate-800/50">
      {/* Gradient Border Effect */}
      <div className={`absolute inset-0 bg-gradient-to-r ${gender.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl blur-xl -z-10`}></div>
      
      {/* Card Inner */}
      <div className="relative bg-white dark:bg-slate-900 m-[2px] rounded-3xl overflow-hidden">
        {/* Decorative Header Pattern */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-500/5 to-transparent rounded-full blur-2xl -mr-10 -mt-10"></div>
        
        {/* Card Header */}
        <div className="relative p-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              {/* Avatar with gradient ring */}
              <div className="relative">
                <div className={`absolute -inset-1 bg-gradient-to-r ${gender.gradient} rounded-full blur opacity-60 group-hover:opacity-100 transition-opacity duration-500`}></div>
                <div className={`relative w-14 h-14 rounded-full ${gender.bg} flex items-center justify-center text-2xl font-bold border-2 border-white dark:border-slate-800 shadow-lg`}>
                  {gender.icon}
                </div>
                {/* Status dot */}
                <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white dark:border-slate-800 ${patient.status === 'admitted' ? 'bg-emerald-500' : patient.status === 'discharged' ? 'bg-slate-400' : 'bg-amber-500'}`}></div>
              </div>
              
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-lg leading-tight">
                  {patient.firstName} {patient.lastName}
                </h3>
                <p className="text-sm text-slate-400 dark:text-slate-500 font-mono tracking-wider">
                  #{patient.patientId || 'NO-ID'}
                </p>
              </div>
            </div>
            
            <span className={`relative px-4 py-1.5 text-xs font-bold rounded-full uppercase tracking-wider ${statusColors[patient.status] || statusColors.admitted}`}>
              {patient.status?.charAt(0).toUpperCase() + patient.status?.slice(1) || 'Admitted'}
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6 space-y-3">
          {/* Room & Ward - Enhanced */}
          {patient.roomId && (
            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-slate-50 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-800/30 rounded-xl border border-slate-200/50 dark:border-slate-700/50 group-hover:border-primary-200/50 dark:group-hover:border-primary-700/50 transition-colors duration-300">
              <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg text-primary-600 dark:text-primary-400">
                <HiOutlineHome className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider">Room</p>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {patient.roomId.roomNumber} • <span className="font-normal">{patient.roomId.ward}</span>
                </p>
              </div>
            </div>
          )}
          
          {/* Admission Date - Enhanced */}
          <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-slate-50 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-800/30 rounded-xl border border-slate-200/50 dark:border-slate-700/50 group-hover:border-primary-200/50 dark:group-hover:border-primary-700/50 transition-colors duration-300">
            <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg text-primary-600 dark:text-primary-400">
              <HiOutlineCalendar className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider">Admission Date</p>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                {patient.admissionDate
                  ? new Date(patient.admissionDate).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })
                  : 'Not admitted'}
              </p>
            </div>
          </div>

          {/* Phone - Enhanced */}
          {patient.phoneNumber && (
            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-slate-50 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-800/30 rounded-xl border border-slate-200/50 dark:border-slate-700/50 group-hover:border-primary-200/50 dark:group-hover:border-primary-700/50 transition-colors duration-300">
              <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg text-primary-600 dark:text-primary-400">
                <HiOutlinePhone className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider">Contact</p>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{patient.phoneNumber}</p>
              </div>
            </div>
          )}

          {/* Diagnosis - Enhanced */}
          {patient.diagnosis && (
            <div className="relative overflow-hidden p-4 bg-gradient-to-br from-primary-50 to-primary-100/50 dark:from-primary-900/20 dark:to-primary-800/10 rounded-xl border border-primary-200/50 dark:border-primary-700/30 group-hover:border-primary-300/50 dark:group-hover:border-primary-600/30 transition-colors duration-300">
              <div className="absolute top-0 right-0 w-20 h-20 bg-primary-500/5 rounded-full blur-2xl"></div>
              <div className="relative">
                <div className="flex items-center gap-2 mb-1.5">
                  <HiOutlineClipboardDocument className="w-4 h-4 text-primary-500 dark:text-primary-400" />
                  <p className="text-xs text-primary-600 dark:text-primary-400 font-semibold uppercase tracking-wider">Diagnosis</p>
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{patient.diagnosis}</p>
              </div>
            </div>
          )}

          {/* Allergies - Enhanced */}
          {patient.allergies && patient.allergies.length > 0 && (
            <div className="pt-1">
              <div className="flex items-center gap-2 mb-2">
                <HiOutlineBeaker className="w-4 h-4 text-rose-500 dark:text-rose-400" />
                <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">Allergies</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {patient.allergies.map((allergy, idx) => (
                  <span
                    key={idx}
                    className="group/allergy px-3 py-1.5 bg-gradient-to-r from-rose-50 to-red-50 dark:from-rose-900/20 dark:to-red-900/20 text-rose-700 dark:text-rose-300 rounded-lg text-xs font-semibold border border-rose-200/50 dark:border-rose-700/30 hover:scale-105 transition-all duration-300 cursor-default shadow-sm hover:shadow-rose-200/50 dark:hover:shadow-rose-900/30"
                  >
                    {allergy}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Card Footer */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-50/80 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-800/30 border-t border-slate-200/50 dark:border-slate-700/50 flex justify-end gap-1">
          <button
            onClick={() => onEdit?.(patient)}
            className="relative group/btn p-2.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-md"
            title="Edit patient"
          >
            <HiOutlinePencilSquare className="w-5 h-5 relative z-10" />
            <div className="absolute inset-0 bg-blue-500/0 group-hover/btn:bg-blue-500/10 rounded-xl transition-all duration-300"></div>
          </button>
          <button
            onClick={() => onDelete?.(patient._id)}
            className="relative group/btn p-2.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-md"
            title="Delete patient"
          >
            <HiOutlineTrash className="w-5 h-5 relative z-10" />
            <div className="absolute inset-0 bg-red-500/0 group-hover/btn:bg-red-500/10 rounded-xl transition-all duration-300"></div>
          </button>
        </div>
      </div>
    </div>
  )
}

export default PatientCard