export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export const validatePhoneNumber = (phone) => {
  // Rwanda phone numbers: 078XXXXXXX or +25078XXXXXXX
  const re = /^(\+250|0)7[0-9]{8}$/
  return re.test(phone.replace(/\s/g, ''))
}

export const validatePassword = (password) => {
  return password.length >= 6
}

export const validatePatientId = (id) => {
  const re = /^PT\d{7}$/
  return re.test(id)
}

export const validateFluidLevel = (level) => {
  return level >= 0 && level <= 100
}

export const validateFlowRate = (rate) => {
  return rate > 0 && rate <= 1000
}