import React, { useState, useEffect, useCallback } from 'react';
import { Text, View, FlatList, Pressable, TextInput, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import styles from '../../styles/ListClients.styles';
import ClientModal from './ClientModal';
import {
  getClientsFromStorage,
  filterClientsByName,
  calculateTotalPages,
  paginateClients
} from '../../utils/ListClientsUtils';

const ListClients = () => {
  const [clients, setClients] = useState([]);
  const [visibleClients, setVisibleClients] = useState([]);
  const [isClientModalVisible, setIsClientModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [displaySearchText, setDisplaySearchText] = useState('');
  const [page, setPage] = useState(1);
  const [selectedClient, setSelectedClient] = useState(null);
  const itemsPerPage = 10;
  const defaultMaxPages = 5;

  const resetStates = () => {
    setSearchText('');
    setDisplaySearchText('');
    setPage(1);
    setSelectedClient(null);
    setIsClientModalVisible(false);
  };

  useFocusEffect(
    useCallback(() => {
      resetStates();
      const fetchData = async () => {
        const data = await getClientsFromStorage();
        setClients(data);
      };
      fetchData();
    }, [])
  );

  useEffect(() => {
    const filteredClients = filterClientsByName(clients, displaySearchText);
    setVisibleClients(paginateClients(filteredClients, page, itemsPerPage));

    // Verificar si no se encontraron clientes solo si se realizó una búsqueda activa desde el buscador
    if (searchText !== '' && filteredClients.length === 0) {
      Alert.alert('No se pudo encontrar ningún cliente con ese nombre.');
      setSearchText('');
      setDisplaySearchText('');
      setPage(1);
    }
  }, [clients, displaySearchText, page]);

  const handleSearch = () => {
    if (searchText.length > 0 && searchText.length < 3) {
      Alert.alert('Por favor ingrese al menos tres letras para buscar');
      return;
    }
    setDisplaySearchText(searchText);
    setPage(1);
  };

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
              setSelectedClient(item);
              setIsClientModalVisible(true);
            }}
          >
            <FontAwesome5 name="user-edit" size={24} color="#515151" />
          </Pressable>
        </View>
      </View>
    );
  };

  const renderPaginationButtons = () => {
    const filteredClients = filterClientsByName(clients, displaySearchText);
    const totalPages = calculateTotalPages(filteredClients, itemsPerPage);

    let buttons = [];
    let maxPagesToShow = displaySearchText ? totalPages : Math.min(totalPages, defaultMaxPages);
    let startPage = Math.max(1, page - 2);
    let endPage = Math.min(maxPagesToShow, startPage + 4);

    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <Pressable
          key={i}
          style={[styles.pageButton, page === i && styles.pageButtonActive]}
          onPress={() => setPage(i)}
        >
          <Text style={[styles.pageButtonText, page === i && styles.pageButtonTextActive]}>
            {i}
          </Text>
        </Pressable>
      );
    }
    return buttons;
  };

  return (
    <LinearGradient
    colors={['#ffff', '#9bdef6', '#ffffff', '#9bdef6']}
    style={styles.gradientBackground}
    >
    <View style={styles.list}>
      <View style={styles.titlePage}>
        <Text style={styles.title}>Clientes</Text>
      </View>

      <View style={styles.finderContainer}>
        <View style={styles.seekerContainer}>
          <TextInput
            placeholder='Buscar'
            style={styles.seeker}
            value={searchText}
            onChangeText={(text) => setSearchText(text)}
          />
          <Pressable style={styles.botonSearch} onPress={handleSearch}>
            <FontAwesome5 name="search" size={24} color="#8B8B8B"/>
          </Pressable>
        </View>
        <TouchableOpacity style={styles.filterContainer}>
          <Text style={styles.textFilter}>Filtrar</Text>
          <MaterialIcons name="filter-alt" size={28} color="white" />
        </TouchableOpacity>
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
          isVisibleClientModal={isClientModalVisible}
          selectedClient={selectedClient}
          onClose={() => {
            setIsClientModalVisible(false);
            setSelectedClient(null);
          }}
        />
      )}
    </View>
    </LinearGradient>
  );
};

export default ListClients;
