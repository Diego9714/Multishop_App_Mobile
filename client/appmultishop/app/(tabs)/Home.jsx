// Dependencies
import React, { useEffect }   from 'react'
import { View }               from 'react-native'
import AsyncStorage           from '@react-native-async-storage/async-storage'
// Components
import CardsHome              from '../../components/home/CardsHome'
import Navbar                 from '../../components/Navbar'
// JwtDecode
import  {  jwtDecode  }       from  "jwt-decode"  
import { decode }             from "base-64"
global.atob = decode
// Api
import {instanceClient, instanceProducts}       from '../../global/api'


const Home = () => {
  useEffect(() => {
    const getAllInfo = async () => {
      try {
        const token = await AsyncStorage.getItem('tokenUser')
        if (token) {
          const decodedToken = jwtDecode(token)
          let cod_ven = decodedToken.cod_ven

          const clientsStored = await AsyncStorage.getItem('clients')
          const productsStored = await AsyncStorage.getItem('products')
          const categoriesStored = await AsyncStorage.getItem('categories')
          const brandsStored = await AsyncStorage.getItem('brands')
          const currencyStored = await AsyncStorage.getItem('currency')

          if (!clientsStored) {
            getClients(cod_ven)
          }
          if (!productsStored) {
            getProducts()
          }
          if (!categoriesStored) {
            getCategories()
          }
          if (!brandsStored) {
            getBrands()
          }
          if (!currencyStored) {
            getCurrency()
          }
        }
      } catch (error) {
        console.error('Error al obtener el token:', error)
      }
    }
    getAllInfo()
  }, [])

  const getClients = async (cod_ven) => {
    try {
      const res = await instanceClient.get(`/api/clients/${cod_ven}`)
      let listClients = res.data.clients
      await AsyncStorage.setItem('clients', JSON.stringify(listClients))
    } catch (error) {
      console.error('Error al obtener los clientes:', error)
    }
  }

  const getProducts = async () => {
    try {
      const res = await instanceProducts.get(`/api/products`)
      let listProducts = res.data.products
      await AsyncStorage.setItem('products', JSON.stringify(listProducts))
    } catch (error) {
      console.error('Error al obtener los productos:', error)
    }
  }

  const getCategories = async () => {
    try {
      const res = await instanceProducts.get(`/api/categories`)
      let listCategories = res.data.categories
      await AsyncStorage.setItem('categories', JSON.stringify(listCategories))
    } catch (error) {
      console.error('Error al obtener las categorías:', error)
    }
  }

  const getBrands = async () => {
    try {
      const res = await instanceProducts.get(`/api/brands`)
      let listBrands = res.data.brands
      await AsyncStorage.setItem('brands', JSON.stringify(listBrands))
    } catch (error) {
      console.error('Error al obtener las marcas:', error)
    }
  }

  const getCurrency = async () => {
    try {
      const res = await instanceProducts.get(`/api/currency`)
      let listCurrency = res.data.currency
      await AsyncStorage.setItem('currency', JSON.stringify(listCurrency))
    } catch (error) {
      console.error('Error al obtener el cambio de las monedas:', error)
    }
  }

  return (
    <View>
      <Navbar />
      <CardsHome />
    </View>
  )
}

export default Home
