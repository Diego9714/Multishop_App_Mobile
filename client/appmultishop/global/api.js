import axios from "axios"

export const instanceAuth = axios.create({
  // baseURL: `https://multishop-app-mobile-auth.onrender.com`,
  baseURL: 'http://192.168.0.105:4000',
  headers: {
    Accept: "application/json"
  }
})

export const instanceClient = axios.create({
  // baseURL: 'https://multishop-app-mobile-clients.onrender.com',
  baseURL: 'http://192.168.0.105:5000',
  headers: {
    Accept: "application/json"
  }
})

export const instanceProducts = axios.create({
  // baseURL: `https://multishop-app1-production.up.railway.app/`,
  baseURL: 'http://192.168.0.105:6000',
  headers: {
    Accept: "application/json"
  }
})
