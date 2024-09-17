// Dependencies
import React from 'react'
import { View } from 'react-native'
// Components
import Navbar from '../../components/Navbar'
import ListClients from '../../components/clients/ListClients'

const Clients = () => {
  return (
    <View>
      <Navbar />
      <ListClients/>
    </View>
  )
}

export default Clients
