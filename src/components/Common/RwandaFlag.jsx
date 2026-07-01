const RwandaFlag = ({ className = "w-5 h-5" }) => {
  return (
    <svg 
      className={className} 
      viewBox="0 0 30 20" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="30" height="20" fill="#00A1DE"/>
      <rect width="30" height="13.33" y="3.33" fill="#FAD201"/>
      <rect width="30" height="6.67" y="6.67" fill="#E10000"/>
      <circle cx="22" cy="7" r="2.5" fill="#FAD201"/>
      <path d="M22 5.5 L23 7 L22 8.5 L21 7 Z" fill="#E10000"/>
    </svg>
  )
}

export default RwandaFlag