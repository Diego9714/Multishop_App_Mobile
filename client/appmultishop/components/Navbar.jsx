import React, { useState } from 'react'
import { View, Image, ActivityIndicator, Modal, Text, Pressable } from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import styles from '../styles/Navbar.styles'
import AsyncStorage from '@react-native-async-storage/async-storage'
// Api
import { instanceClient, instanceProducts } from '../global/api'
// Components
import { images } from '../constants'
// JwtDecode
import  {  jwtDecode  }       from  "jwt-decode"  
import { decode }             from "base-64"
global.atob = decode

const Navbar = () => {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const getClients = async (cod_ven) => {
    try {
      const res = await instanceClient.get(`/api/clients/${cod_ven}`)
      let listClients = res.data.clients
      await AsyncStorage.setItem('clients', JSON.stringify(listClients))
    } catch (error) {
      console.error('Error al obtener los clientes:', error)
      throw error
    }
  }

  const getProducts = async () => {
    try {
      const res = await instanceProducts.get(`/api/products`)
      let listProducts = res.data.products
      await AsyncStorage.setItem('products', JSON.stringify(listProducts))
    } catch (error) {
      console.error('Error al obtener los productos:', error)
      throw error
    }
  }

  const getCategories = async () => {
    try {
      const res = await instanceProducts.get(`/api/categories`)
      let listCategories = res.data.categories
      await AsyncStorage.setItem('categories', JSON.stringify(listCategories))
    } catch (error) {
      console.error('Error al obtener las categorías:', error)
      throw error
    }
  }

  const getBrands = async () => {
    try {
      const res = await instanceProducts.get(`/api/brands`)
      let listbrands = res.data.brands
      await AsyncStorage.setItem('brands', JSON.stringify(listbrands))
    } catch (error) {
      console.error('Error al obtener las marcas:', error)
      throw error
    }
  }

  const getAllInfo = async () => {
    setLoading(true)
    setMessage('')
    const timeoutId = setTimeout(() => {
      setLoading(false)
      setMessage('Tiempo de espera agotado. Intenta nuevamente.')
    }, 5000)

    try {
      const token = await AsyncStorage.getItem('tokenUser')
      if (token) {
        const decodedToken = jwtDecode(token)
        let cod_ven = decodedToken.cod_ven

        await Promise.all([getClients(cod_ven), getProducts(), getCategories(), getBrands()])
        clearTimeout(timeoutId)
        setLoading(false)
        setMessage('Información actualizada correctamente.')
      } else {
        clearTimeout(timeoutId)
        setLoading(false)
        setMessage('No se encontró el token del usuario.')
      }
    } catch (error) {
      clearTimeout(timeoutId)
      setLoading(false)
      setMessage('Error al actualizar la información.')
    }
  }

  const handleClose = () => {
    setMessage('');
  }

  return (
    <View style={styles.container}>
      <Image 
        source={images.logo} 
        style={styles.logo}
      />
      <MaterialCommunityIcons 
        name="cloud-download" 
        size={35} 
        color="#5B97DC" 
        style={{ marginLeft: 115 }} 
        onPress={getAllInfo}
      />
      <Modal
        transparent={true}
        animationType="fade"
        visible={loading || message !== ''}
      >
        <View style={styles.modalBackground}>
          <View style={styles.activityIndicatorWrapper}>
            {loading ? (
              <ActivityIndicator size="large" color="#0000ff" animating={loading} />
            ) : (
              <>
                <Text style={styles.message}>{message}</Text>
                <View style={styles.buttonContainer}>

                  <Pressable style={styles.buttonModal} onPress={getAllInfo}>
                    <Text style={styles.buttonTextModal}>Reintentar</Text>
                  </Pressable>

                  <Pressable style={styles.buttonModalExit} onPress={handleClose}>
                    <Text style={styles.buttonTextModal}>Salir</Text>
                  </Pressable>

                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  )
}
export default Navbar
