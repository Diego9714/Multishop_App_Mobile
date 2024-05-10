import axios from "axios"

export const instanceAuth = axios.create({
  // baseURL: `https://multishop-app1-production.up.railway.app/`,
  baseURL: 'http://192.168.1.102:4000',
  headers: {
    Accept: "application/json"
  }
})

export const instanceClient = axios.create({
  // baseURL: `https://multishop-app1-production.up.railway.app/`,
  baseURL: 'http://192.168.1.102:5000',
  headers: {
    Accept: "application/json"
  }
})

export const instanceOrders = axios.create({
  // baseURL: `https://multishop-app1-production.up.railway.app/`,
  baseURL: 'http://192.168.1.100:4001',
  headers: {
    Accept: "application/json"
  }
})

export const instanceProducts = axios.create({
  // baseURL: `https://multishop-app1-production.up.railway.app/`,
  baseURL: 'http://192.168.1.100:4001',
  headers: {
    Accept: "application/json"
  }
})
