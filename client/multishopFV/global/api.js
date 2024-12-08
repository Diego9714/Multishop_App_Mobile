import axios from "axios"

export const instanceAuth = axios.create({
  baseURL: `https://multishopappmobile-auth-production.up.railway.app`,
  headers: {
    Accept: "application/json"
  }
})

export const instanceClient = axios.create({
  baseURL: 'https://multishopappmobile-clients-production.up.railway.app',
  headers: {
    Accept: "application/json"
  }
})

export const instanceProducts = axios.create({
  baseURL: 'https://multishopappmobile-products-production.up.railway.app',
  headers: {
    Accept: "application/json"
  }
})

export const instanceSincro = axios.create({
  baseURL: 'https://multishopappmobile-orders-production.up.railway.app',
  headers: {
    Accept: "application/json"
  }
})
