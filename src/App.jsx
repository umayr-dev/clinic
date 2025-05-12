import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Alert } from 'antd'
import Login from './components/Login'
import './App.css'

function Dashboard() {
  const [selectedCategory, setSelectedCategory] = useState('LOR')
  const [selectedServices, setSelectedServices] = useState([])
  const [showSuccess, setShowSuccess] = useState(false)
  const [totalAmount, setTotalAmount] = useState(0)

  const categories = [
    { id: 'LOR', name: 'LOR' },
    { id: 'fizaterpiya', name: 'Fizaterpiya' },
    { id: 'massaj', name: 'Massaj' }
  ]

  const services = {
    LOR: [
      { id: 1, name: 'Quloq yuvish', price: '50000' },
      { id: 2, name: 'Tomoq qarash', price: '30000' },
      { id: 3, name: 'Burun yuvish', price: '40000' }
    ],
    fizaterpiya: [
      { id: 4, name: 'Elektroforez', price: '60000' },
      { id: 5, name: 'UVCh', price: '45000' },
      { id: 6, name: 'Ultratovush', price: '55000' }
    ],
    massaj: [
      { id: 7, name: 'Umimiy massaj', price: '100000' },
      { id: 8, name: 'Bel massaji', price: '70000' },
      { id: 9, name: 'Oyoq massaji', price: '60000' }
    ]
  }

  const handleServiceClick = (service) => {
    if (!selectedServices.find(s => s.id === service.id)) {
      setSelectedServices([...selectedServices, service])
    }
  }

  const handleRemoveService = (serviceId) => {
    setSelectedServices(selectedServices.filter(s => s.id !== serviceId))
  }

  const handleSubmit = () => {
    if (selectedServices.length > 0) {
      // Calculate total before clearing
      const total = selectedServices.reduce((sum, service) => sum + parseInt(service.price), 0)
      setTotalAmount(total)
      
      // Clear selected services
      setSelectedServices([])
      
      // Show success alert
      setShowSuccess(true)
      
      // Hide alert after 3 seconds
      setTimeout(() => {
        setShowSuccess(false)
      }, 3000)
    }
  }

  return (
    <div className="dashboard">
      {showSuccess && (
        <div className="alert-container">
          <Alert
            message={`Muvaffaqiyatli yuborildi! Jami: ${totalAmount} so'm`}
            type="success"
            showIcon
            banner
          />
        </div>
      )}
      
      {/* Categories */}
      <div className="categories">
        {categories.map(category => (
          <button
            key={category.id}
            className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Services */}
      <div className="services">
        <h2>Xizmatlar</h2>
        <div className="services-grid">
          {services[selectedCategory].map(service => (
            <div
              key={service.id}
              className="service-card"
              onClick={() => handleServiceClick(service)}
            >
              <h3>{service.name}</h3>
              <p>{service.price} so`m</p>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Services */}
      <div className="selected-services">
        <h2>Tanlangan Xizmatlar:</h2>
        {selectedServices.map(service => (
          <div key={service.id} className="selected-service">
            <span>{service.name} - {service.price} so`m</span>
            <button onClick={() => handleRemoveService(service.id)}>×</button>
          </div>
        ))}
        {selectedServices.length > 0 && (
          <div className="total">
            Jami: {selectedServices.reduce((sum, service) => sum + parseInt(service.price), 0)} so`m
          </div>
        )}
        {selectedServices.length > 0 && (
          <button className="submit-btn" onClick={handleSubmit}>
            Yuborish
          </button>
        )}
      </div>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App