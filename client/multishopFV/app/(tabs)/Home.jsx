import React, { useEffect, useState }       from 'react'
import { View }                             from 'react-native'
import AsyncStorage                         from '@react-native-async-storage/async-storage'
import { NavigationContainer }              from '@react-navigation/native'
// import { createStackNavigator }             from '@react-navigation/stack'
import { createStackNavigator } from '@react-navigation/stack';

import ModalErrorSincro                     from '../../components/home/ModalErrorSincro'
import CardsHome                            from '../../components/home/CardsHome'
import Navbar                               from '../../components/Navbar'
import { instanceClient, instanceProducts } from '../../global/api'
// JWT - Token
import { jwtDecode }                        from 'jwt-decode'
import { decode }                           from 'base-64'
global.atob = decode

const Stack = createStackNavigator()

const storeData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`Error storing ${key}:`, error)
    throw error
  }
}

const getProducts = async (signal) => {
  try {
    const storedData = await AsyncStorage.getItem('products')
    if (storedData){
      return { success: true }
    }

    const dbCredentials = await AsyncStorage.getItem("multishopDB")
    const parsedDbCredentials = JSON.parse(dbCredentials)

    const res = await instanceProducts.post(`/api/products`, {parsedDbCredentials}, { signal })
    const listProducts = res.data.products || []
    await storeData('products', listProducts)
    return { success: true }
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('Request to get products was aborted.')
    } else {
      console.error('Error fetching products:', error)
    }
    return { success: false, error }
  }
}

const getCategories = async (signal) => {
  try {
    const storedData = await AsyncStorage.getItem('categories')
    if (storedData){
      return { success: true }
    }

    const dbCredentials = await AsyncStorage.getItem("multishopDB")
    const parsedDbCredentials = JSON.parse(dbCredentials)

    const res = await instanceProducts.post(`/api/categories`, {parsedDbCredentials}, { signal })
    const listCategories = res.data.categories || []
    await storeData('categories', listCategories)
    return { success: true }
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('Request to get categories was aborted.')
    } else {
      console.error('Error fetching categories:', error)
    }
    return { success: false, error }
  }
}

const getBrands = async (signal) => {
  try {
    const storedData = await AsyncStorage.getItem('brands')
    if (storedData){
      return { success: true }
    }

    const dbCredentials = await AsyncStorage.getItem("multishopDB")
    const parsedDbCredentials = JSON.parse(dbCredentials)

    const res = await instanceProducts.post(`/api/brands`, {parsedDbCredentials}, { signal })
    const listBrands = res.data.brands || []
    await storeData('brands', listBrands)
    return { success: true }
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('Request to get brands was aborted.')
    } else {
      console.error('Error fetching brands:', error)
    }
    return { success: false, error }
  }
}

const getCurrency = async (signal) => {
  try {
    const storedData = await AsyncStorage.getItem('currency')
    if (storedData){
      return { success: true }
    }

    const dbCredentials = await AsyncStorage.getItem("multishopDB")
    const parsedDbCredentials = JSON.parse(dbCredentials)

    const res = await instanceProducts.post(`/api/currency`, {parsedDbCredentials}, { signal })
    const listCurrency = res.data.currency || []
    await storeData('currency', listCurrency)
    return { success: true }
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('Request to get currency was aborted.')
    } else {
      console.error('Error fetching currency:', error)
    }
    return { success: false, error }
  }
}

const getCompany = async (signal) => {
  try {
    const storedData = await AsyncStorage.getItem('company')
    if (storedData){
      return { success: true }
    }

    const dbCredentials = await AsyncStorage.getItem("multishopDB")
    const parsedDbCredentials = JSON.parse(dbCredentials)

    const res = await instanceProducts.post(`/api/company`, {parsedDbCredentials} , { signal })
    const listCompany = res.data.company || []
    await storeData('company', listCompany)
    return { success: true }
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('Request to get company was aborted.')
    } else {
      console.error('Error fetching company:', error)
    }
    return { success: false, error }
  }
}

const getClients = async (signal) => {
  try {
    const storedData = await AsyncStorage.getItem('clients')
    if (storedData){
      return { success: true }
    }

    let token = await AsyncStorage.getItem('tokenUser')
    const decodedToken = jwtDecode(token)
    let cod_ven = decodedToken.cod_ven

    const dbCredentials = await AsyncStorage.getItem("multishopDB")
    const parsedDbCredentials = JSON.parse(dbCredentials)

    const res = await instanceClient.post(`/api/clients/${cod_ven}`, {parsedDbCredentials} , { signal })
    const listClients = res.data.clients || []
    await storeData('clients', listClients)
    return { success: true }
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('Request to get clients was aborted.')
    } else {
      console.error('Error fetching clients:', error)
    }
    return { success: false, error }
  }
}

const getOrdersSync = async (signal) => {
  try {
    const storedData = await AsyncStorage.getItem('SynchronizedOrders')
    if (storedData){
      return { success: true }
    }

    let token = await AsyncStorage.getItem('tokenUser')
    const decodedToken = jwtDecode(token)
    let cod_ven = decodedToken.cod_ven

    const dbCredentials = await AsyncStorage.getItem("multishopDB")
    const parsedDbCredentials = JSON.parse(dbCredentials)

    const res = await instanceProducts.post(`/api/orders/${cod_ven}`, {parsedDbCredentials} , { signal })
    const listorders = res.data.orders || []
    await storeData('SynchronizedOrders', listorders)
    return { success: true }
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('Request to get orders was aborted.')
    } else {
      console.error('Error fetching orders:', error)
    }
    return { success: false, error }
  }
}

const getVisits = async (signal) => {
  try {
    const storedData = await AsyncStorage.getItem('SyncedClientVisits')
    if (storedData){
      return { success: true }
    }

    let token = await AsyncStorage.getItem('tokenUser')
    const decodedToken = jwtDecode(token)
    let cod_ven = decodedToken.cod_ven

    const dbCredentials = await AsyncStorage.getItem("multishopDB")
    const parsedDbCredentials = JSON.parse(dbCredentials)

    const res = await instanceProducts.post(`/api/visits/${cod_ven}`, {parsedDbCredentials}, { signal })
    const listvisits = res.data.visits || []
    await storeData('SyncedClientVisits', listvisits)
    return { success: true }
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('Request to get visits was aborted.')
    } else {
      console.error('Error fetching visits:', error)
    }
    return { success: false, error }
  }
}

const getPayments = async (signal) => {
  try {
    const storedData = await AsyncStorage.getItem('SyncedClientPass')
    if (storedData){
      return { success: true }
    }

    let token = await AsyncStorage.getItem('tokenUser')
    const decodedToken = jwtDecode(token)
    let cod_ven = decodedToken.cod_ven

    const dbCredentials = await AsyncStorage.getItem("multishopDB")
    const parsedDbCredentials = JSON.parse(dbCredentials)

    const res = await instanceProducts.post(`/api/payments/${cod_ven}`, {parsedDbCredentials}, { signal })
    const listPayments = res.data.payments || []
    await storeData('SyncedClientPass', listPayments)
    return { success: true }
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('Request to get payments was aborted.')
    } else {
      console.error('Error fetching payments:', error)
    }
    return { success: false, error }
  }
}

const getAllInfo = async (setLoading, setMessage, setShowErrorModal) => {
  setLoading(true)
  setMessage('')
  setShowErrorModal(false)

  const controller = new AbortController()
  const { signal } = controller

  const timeoutId = setTimeout(() => {
    controller.abort()
    setLoading(false)
    setMessage('Tiempo de espera agotado. Intenta nuevamente.')
    setShowErrorModal(true)
  }, 5000)

  try {
    const token = await AsyncStorage.getItem('tokenUser')
    if (token) {

      const results = await Promise.all([
        getProducts(signal),
        getCategories(signal),
        getCurrency(signal),
        getCompany(signal),
        getClients(signal),
        getOrdersSync(signal),
        getVisits(signal),
        getPayments(signal),
        getBrands(signal)
      ])

      clearTimeout(timeoutId)
      setLoading(false)

      const allSuccessful = results.every(result => result.success)

      if (allSuccessful) {
        return { success: true }
      } else {
        setShowErrorModal(true)
        return { success: false, error: 'Información no recibida.' }
      }
    } else {
      clearTimeout(timeoutId)
      setLoading(false)
      return { success: false, error: 'No se encontró el token del usuario.' }
    }
  } catch (error) {
    clearTimeout(timeoutId)
    setLoading(false)
    setShowErrorModal(true)
    return { success: false, error: 'Error al actualizar la información.' }
  }
}

// Home Component
const Home = () => {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [abortController, setAbortController] = useState(null)

  const handleRetry = async () => {
    setShowErrorModal(false)
    const result = await getAllInfo(setLoading, setMessage, setShowErrorModal)
    if (!result.success) {
      setMessage(result.error)
      setShowErrorModal(true)
    }
  }

  const handleCloseModal = () => {
    setShowErrorModal(false)
  }

  useEffect(() => {
    const fetchData = async () => {
      const controller = new AbortController()
      setAbortController(controller)
      const result = await getAllInfo(setLoading, setMessage, setShowErrorModal)
      if (!result.success) {
        setMessage(result.error)
        setShowErrorModal(true)
      }
    }
    fetchData()

    return () => {
      if (abortController) {
        abortController.abort()
      }
    }
  }, [])

  return (
    // <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="Home" 
          options={{ headerShown: false }}
        >
          {() => (
            <View>
              <Navbar />
              <CardsHome />
              <ModalErrorSincro
                visible={showErrorModal}
                onClose={handleCloseModal}
                onRetry={handleRetry}
                message={message}
              />
            </View>
          )}
        </Stack.Screen>
      </Stack.Navigator>
    // </NavigationContainer>
  );
}  

export default Home