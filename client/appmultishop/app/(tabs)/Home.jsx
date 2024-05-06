import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CardsHome from '../../components/CardsHome'
import Navbar from '../../components/Navbar'

const Home = () => {
  return (
    <View>
      <Navbar/>
      <CardsHome/>
    </View>
  )
}

export default Home