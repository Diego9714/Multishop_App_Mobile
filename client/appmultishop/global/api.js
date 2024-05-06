import axios from "axios"

const instance = axios.create({
  // baseURL: `https://multishop-app1-production.up.railway.app/`,
  baseURL: 'http://192.168.1.105:4001',
  headers: {
    Accept: "application/json"
  }
})

export default instance