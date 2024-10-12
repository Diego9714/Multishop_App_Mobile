import axios from "axios"

export const instanceAuth = axios.create({
  baseURL: `https://multishop-app-mobile-auth.onrender.com`,
  // baseURL: 'http://192.168.1.106:4000',
  headers: {
    Accept: "application/json"
  }
})

export const instanceClient = axios.create({
  baseURL: 'https://multishop-app-mobile-clients.onrender.com',
  // baseURL: 'http://192.168.1.106:5000',
  headers: {
    Accept: "application/json"
  }
})

export const instanceProducts = axios.create({
  baseURL: 'https://multishop-app-mobile-clients.onrender.com',
  // baseURL: 'http://192.168.1.106:6000',
  headers: {
    Accept: "application/json"
  }
})

export const instanceSincro = axios.create({
  baseURL: 'https://multishop-app-mobile-clients.onrender.com',
  // baseURL: 'http://192.168.1.106:7000',
  headers: {
    Accept: "application/json"
  }
})
