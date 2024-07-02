// Dependencies
import React, { createContext , useState } from 'react'
import AsyncStorage             from '@react-native-async-storage/async-storage'
import { instanceAuth }         from '../global/api'
import { router }               from 'expo-router'

// Context
export const UserContext = createContext()

export const UserProvider = ({ children }) => {

  const signIn = async (username, password) => {
    try {
      const user = { username, password }
      const res = await instanceAuth.post(`/api/login`, user)
      const token = res.data.tokenUser
      await AsyncStorage.setItem('tokenUser', token)
      return { status: 200, message: "Acceso concedido" }
    } catch (error) {
      let message = ""
      switch (error.message) {
        case "Request failed with status code 500":
          message = "Usuario o contraseña incorrectos"
          break
        case "Request failed with status code 400":
          message = "Deben tener al menos 6 dígitos"
          break
        default:
          message = "Error de red"
      }
      return { status: error.response?.status || 500, message }
    }
  }

  const checkLogin = async () => {
    try {
      const token = await AsyncStorage.getItem('tokenUser')

      if(token){
        router.replace('/(tabs)/Home')
      }

    } catch (error) {
      return error
    }
  }

  const logout = async () => {    
    try {

      let token = await AsyncStorage.getItem('tokenUser')
      
      if(token){
        await AsyncStorage.removeItem('tokenUser')
        await AsyncStorage.removeItem('products')
        await AsyncStorage.removeItem('categories')
        await AsyncStorage.removeItem('brands')
        await AsyncStorage.removeItem('clients')
        await AsyncStorage.removeItem('currency')

        router.replace('/(auth)/Login')
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }

  return (
    <UserContext.Provider
      value={{
        signIn,
        checkLogin,
        logout
      }}
    >
      {children}
    </UserContext.Provider>
  )
}
