// test-rate-limit.js
import axios from 'axios'

const testRateLimit = async () => {
  const token = 'YOUR_TOKEN_HERE' // Replace with actual token
  
  console.log('Testing rate limiting...')
  
  for (let i = 0; i < 150; i++) {
    try {
      const response = await axios.get('http://localhost:5000/api/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      })
      console.log(`Request ${i + 1}: Success (${response.status})`)
    } catch (error) {
      if (error.response?.status === 429) {
        console.log(`Request ${i + 1}: ⚠️ Rate limited after ${i} requests`)
        console.log('Message:', error.response.data.message)
        break
      }
    }
    
    // Small delay to see progress
    await new Promise(resolve => setTimeout(resolve, 100))
  }
}

testRateLimit()