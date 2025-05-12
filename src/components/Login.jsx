import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './login.css'

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (username === 'clinic' && password === 'clinic') {
      navigate('/')
    } else {
      setError('Invalid username or password')
    }
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="cart-icon">
          <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="white">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
            <path d="M3 6h18" />
            <path d="M16 10a4 4 0 01-8 0" />
          </svg>
        </div>
        
        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          <div className="input-group">
            <input
              type="text"
              placeholder="USERNAME"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          
          <div className="input-group">
            <input
              type="password"
              placeholder="PASSWORD"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <button type="submit">LOGIN</button>
        </form>
      </div>
    </div>
  )
}

export default Login