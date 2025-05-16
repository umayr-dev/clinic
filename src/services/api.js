import axios from 'axios'

const BASE_URL = 'https://clinic-backend-zeta.vercel.app'

export const fetchCategories = async () => {
  const response = await axios.get(`${BASE_URL}/category`)
  return response.data
}

export const fetchServices = async () => {
  const response = await axios.get(`${BASE_URL}/Service`)
  return response.data
}

export const createOrder = async (orderData) => {
  const order = {
    total_price: orderData.totalAmount,
    services: orderData.services,
    date: new Date().toISOString()
  }
  
  const response = await axios.post(`${BASE_URL}/order`, order)
  return response.data
}