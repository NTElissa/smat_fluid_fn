import { format, formatDistanceToNow } from 'date-fns'

export const formatDate = (date, formatStr = 'PPP') => {
  if (!date) return 'N/A'
  return format(new Date(date), formatStr)
}

export const formatTimeAgo = (date) => {
  if (!date) return 'N/A'
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

export const formatPhoneNumber = (phone) => {
  if (!phone) return 'N/A'
  // Format for Rwanda: +250 XXX XXX XXX
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.startsWith('250')) {
    return `+250 ${cleaned.slice(3, 6)} ${cleaned.slice(6, 9)} ${cleaned.slice(9)}`
  }
  return phone
}

export const formatFluidLevel = (level) => {
  return `${Math.round(level)}%`
}

export const formatFlowRate = (rate) => {
  return `${rate} ml/h`
}

export const formatName = (firstName, lastName) => {
  return `${firstName} ${lastName}`.trim()
}

export const capitalizeFirst = (str) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}