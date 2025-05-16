import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { Alert } from 'antd'
import Login from './components/Login'
import ReceiptScanner from './components/ReceiptScanner'
import { printReceipt } from './utils/receipt'
import { fetchCategories, fetchServices, createOrder } from './services/api'
import './App.css'

function ProtectedRoute({ children }) {
  const isAuthenticated = localStorage.getItem('isAuthenticated')
  return isAuthenticated ? children : <Navigate to="/login" />
}

function Dashboard() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [allServices, setAllServices] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedServices, setSelectedServices] = useState([])
  const [showSuccess, setShowSuccess] = useState(false)
  const [totalAmount, setTotalAmount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [categoriesData, servicesData] = await Promise.all([
          fetchCategories(),
          fetchServices()
        ])
        setCategories(categoriesData)
        setAllServices(servicesData)  // Services are being set here
        setSelectedCategory(categoriesData[0]?._id)
        setLoading(false)
      } catch (error) {
        console.error('Data loading error:', error)
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const handleServiceClick = (service) => {
    if (!selectedServices.find(s => s._id === service._id)) {
      setSelectedServices([...selectedServices, service])
    }
  }

  const handleRemoveService = (serviceId) => {
    setSelectedServices(selectedServices.filter(s => s._id !== serviceId))
  }

  const handleSubmit = async () => {
    if (selectedServices.length > 0) {
      const total = selectedServices.reduce((sum, service) => sum + parseInt(service.price), 0)
      
      try {
        const orderData = {
          services: selectedServices.map(service => ({
            _id: service._id,
            category_id: service.category_id._id,
            name: service.name,
            price: service.price
          })),
          totalAmount: total
        }

        await createOrder(orderData)
        
        // Print receipt
        const printed = await printReceipt(selectedServices, total)
        
        if (printed) {
          setTotalAmount(total)
          setSelectedServices([])
          setShowSuccess(true)
          setTimeout(() => {
            setShowSuccess(false)
          }, 3000)
        }
      } catch (error) {
        console.error('Order creation failed:', error)
        alert('Buyurtma yuborishda xatolik')
      }
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated')
    navigate('/login')
  }

  const handleCategoryClick = (categoryId) => {
    // Only allow category change if no services are selected
    if (selectedServices.length === 0) {
      setSelectedCategory(categoryId)
    }
  }

  const handleClearServices = () => {
    setSelectedServices([])
  }

  if (loading) {
    return <div className="loading">Loading...</div>
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
            key={category._id}
            className={`category-btn ${selectedCategory === category._id ? 'active' : ''} ${
              selectedServices.length > 0 && selectedCategory !== category._id ? 'disabled' : ''
            }`}
            onClick={() => handleCategoryClick(category._id)}
            disabled={selectedServices.length > 0 && selectedCategory !== category._id}
          >
            {category.name}
          </button>
        ))}
        {selectedServices.length > 0 && (
          <button 
            className="category-btn clear-btn"
            onClick={handleClearServices}
          >
            Bekor qilish
          </button>
        )}
        <button 
          className="category-btn logout-btn" 
          onClick={handleLogout}
        >
          Chiqish
        </button>
      </div>

      {/* Services */}
      <div className="services">
        <h2>Xizmatlar</h2>
        <div className="services-grid">
          {allServices
            .filter(service => service.category_id._id === selectedCategory)
            .map(service => (
              <div
                key={service._id}
                className="service-card"
                onClick={() => handleServiceClick(service)}
              >
                <h3>{service.name}</h3>
                <p>{service.price} so'm</p>
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
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route path="/scanner" element={
          <ProtectedRoute>
            <ReceiptScanner />
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App