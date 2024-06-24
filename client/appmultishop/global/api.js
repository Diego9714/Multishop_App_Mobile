import axios from "axios"

export const instanceAuth = axios.create({
  baseURL: `https://multishop-app-mobile-auth.onrender.com`,
  // baseURL: 'http://192.168.1.103:4000',
  headers: {
    Accept: "application/json"
  }
})

export const instanceClient = axios.create({
  baseURL: 'https://multishop-app-mobile-clients.onrender.com',
  // baseURL: 'http://192.168.1.103:5000',
  headers: {
    Accept: "application/json"
  }
})

export const instanceProducts = axios.create({
  baseURL: `https://multishop-app-mobile-products.onrender.com/`,
  // baseURL: 'http://192.168.1.102:6000',
  headers: {
    Accept: "application/json"
  }
})

export const instanceSincro = axios.create({
  baseURL: `https://multishop-app-mobile-orders.onrender.com/`,
  // baseURL: 'http://192.168.1.102:7000',
  headers: {
    Accept: "application/json"
  }
})
