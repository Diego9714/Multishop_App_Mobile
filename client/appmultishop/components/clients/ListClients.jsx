import React, { useState, useEffect } from 'react'
import { Text, View, FlatList, Pressable, TextInput, ScrollView } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Ionicons } from '@expo/vector-icons'
import { FontAwesome } from '@expo/vector-icons'
import styles from '../../styles/ListClients.styles'

// Components
import ClientModal from './ClientModal'

const ListClients = () => {
  const [clients, setClients] = useState([])
  const [visibleClients, setVisibleClients] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [searchClient, setSearchClient] = useState("")
  const [page, setPage] = useState(1)
  const [selectedClient, setSelectedClient] = useState(null)
  const itemsPerPage = 10

  useEffect(() => {
    const getClients = async () => {
      const info = await AsyncStorage.getItem('clients')
      const infoJson = JSON.parse(info)
      setClients(infoJson || [])
    }
    getClients()
  }, [])

  useEffect(() => {
    const filteredClients = clients.filter(client =>
      client.nom_cli.toLowerCase().includes(searchClient.toLowerCase())
    )
    const start = (page - 1) * itemsPerPage
    const end = page * itemsPerPage
    setVisibleClients(filteredClients.slice(start, end))
  }, [page, clients, searchClient])

  const renderElements = ({ item }) => {
    return (
      <View style={styles.clientItem}>
        <View style={styles.nameClient}>
          <Text style={styles.textClient}>{item.nom_cli}</Text>
        </View>
        <View style={styles.buttonAction}>
          <Pressable
            style={styles.button}
            onPress={() => {
              setSelectedClient(item)
              setIsModalVisible(true)
            }}
          >
            <Ionicons name="add-outline" size={30} color="black" />
          </Pressable>
        </View>
      </View>
    );
  };

  const renderPaginationButtons = () => {
    const filteredClients = clients.filter(client =>
      client.nom_cli.toLowerCase().includes(searchClient.toLowerCase())
    );
    const numberOfPages = Math.ceil(filteredClients.length / itemsPerPage);
    let buttons = [];
    for (let i = 1; i <= numberOfPages; i++) {
      buttons.push(
        <Pressable
          key={i}
          style={[styles.pageButton, page === i && styles.pageButtonActive]}
          onPress={() => setPage(i)}
        >
          <Text style={styles.pageButtonText}>{i}</Text>
        </Pressable>
      );
    }
    return buttons;
  };

  return (
    <View style={styles.list}>
      <View style={styles.titlePage}>
        <Text style={styles.title}>Clientes</Text>
        <View style={styles.ViewTextInput}>
          <TextInput
            placeholder='Buscar'
            style={styles.textInput}
            value={searchClient}
            onChangeText={(text) => {
              setSearchClient(text);
              setPage(1); // Reset to the first page whenever a search is made
            }}
          />
          <FontAwesome name="search" size={24} color="#8B8B8B" />
        </View>
      </View>

      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <View style={styles.header}>
            <Text style={styles.headerTitleName}>Nombre</Text>
            <Text style={styles.headerTitleButton}>Acciones</Text>
          </View>
        </View>
        <View style={styles.listContainer}>
          <FlatList
            data={visibleClients}
            keyExtractor={(item) => item.cod_cli}
            renderItem={renderElements}
          />
        </View>
      </View>

      <ScrollView horizontal style={styles.paginationContainer}>
        {renderPaginationButtons()}
      </ScrollView>

      {selectedClient && (
        <ClientModal
          isModalVisible={isModalVisible}
          selectedClient={selectedClient}
          onClose={() => setIsModalVisible(false)}
        />
      )}
    </View>
  );
};

export default ListClients;
