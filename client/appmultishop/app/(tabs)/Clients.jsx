// Dependencies
import React, { useState, useEffect } from 'react';
import { View } from 'react-native'; // Importa FlatList en lugar de FlashList
// Components
import Navbar from '../../components/Navbar'
import ListClients from '../../components/clients/ListClients'


const Clients = () => {

  return (
    <View>

      <Navbar />
      <ListClients/>

    </View>
  );
};

export default Clients;
