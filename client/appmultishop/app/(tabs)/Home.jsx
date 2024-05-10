// Dependencies
import React, { useEffect }   from 'react'
import { View }               from 'react-native'
import AsyncStorage           from '@react-native-async-storage/async-storage'
// Components
import CardsHome              from '../../components/CardsHome'
import Navbar                 from '../../components/Navbar'
// JwtDecode
import  {  jwtDecode  }       from  "jwt-decode"  
import { decode }             from "base-64"
global.atob = decode
// Api
import {instanceClient}       from '../../global/api'


const Home = () => {
  useEffect(() => {
    const getAllInfo = async () => {
      try {
        const token = await AsyncStorage.getItem('tokenUser')
        if(token){
          const decodedToken = jwtDecode(token)
          let cod_ven = decodedToken.cod_ven
          getClients(cod_ven)
        }
        
      } catch (error) {
        console.error('Error al obtener el token:', error)
      }
    }

    getAllInfo()
  }, [])

  const getClients = async ( cod_ven ) => {
    try {
      const res = await instanceClient.get(`/api/clients/${cod_ven}`)

      let listClients = res.data.clients

      await AsyncStorage.setItem('clients', JSON.stringify(listClients))

    } catch (error) {
      return error
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
