// Dependencies
import React, { createContext , useState } from 'react'
import AsyncStorage             from '@react-native-async-storage/async-storage'
import { instanceAuth }         from '../global/api'
import { Alert }                from 'react-native'
import { router }               from 'expo-router'

// Context
export const UserContext = createContext()

export const UserProvider = ({ children }) => {

  const signIn = async (username, password) => {
    try {
      const user = {
        username,
        password
      }

      const res = await instanceAuth.post(`/api/login`, user)
      const token = res.data.tokenUser
      await AsyncStorage.setItem('tokenUser', token)
      router.replace('/(tabs)/Home')

    } catch (error) {
      switch (error.message) {
        case "Request failed with status code 500":
          Alert.alert("Verifica tu usuario y contraseña", "Usuario o contraseña incorrectos")
          break
        case "Request failed with status code 400":
          Alert.alert("Verifica tu usuario y contraseña", "Deben tener al menos 6 digitos")
          break
        default:
          console.error('Error al iniciar sesión:', error)
      }
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
        await AsyncStorage.removeItem('OrdersClient')

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
