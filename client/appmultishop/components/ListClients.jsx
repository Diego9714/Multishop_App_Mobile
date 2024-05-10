import React, { useState, useEffect } from 'react';
import { Text, View, FlatList, Pressable, Modal, TextInput, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';

import styles from '../styles/ListClients.styles';

const ListClients = () => {
  const [clients, setClients] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const getClients = async () => {
      const info = await AsyncStorage.getItem('clients');
      const infoJson = JSON.parse(info);
      setClients(infoJson || []);
    };
    getClients();
  }, []);

  const renderElements = ({ item }) => {
    return (
      <View style={styles.clientItem}>
        <View style={styles.nameClient}>
          <Text style={styles.textClient}>{item.nom_cli}</Text>
        </View>
        <View style={styles.tlfClient}>
          <Text>{item.tel_cli}</Text>
        </View>
        <View style={styles.buttonAction}>
          <Pressable style={styles.button} onPress={() => setIsModalVisible(true)}>
            <Ionicons name="add-outline" size={30} color="black" />
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.list}>
      <View style={styles.titlePage}>
        <Text style={styles.title}>Clientes</Text>
        <View style={styles.ViewTextInput}>
          <TextInput placeholder='Buscar' style={styles.textInput} />
          <FontAwesome name="search" size={24} color="black" />
        </View>
      </View>

      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Nombre</Text>
            <Text style={styles.headerTitle}>Teléfono</Text>
            <Text style={styles.headerTitle}>Acciones</Text>
          </View>
        </View>
        <View style={styles.listContainer}>
          <FlatList
            data={clients}
            keyExtractor={(item) => item.cod_cli}
            renderItem={renderElements}
            initialNumToRender={20}
          />
        </View>
      </View>

      <Modal visible={isModalVisible} animationType="fade" transparent={true} >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.titleModal}>Datos del Cliente</Text>
            <Text>Nombre: </Text>
            <Text>Cédula:</Text>
            <Text>Teléfono:</Text>
            <Text>Dirección:</Text>
            <Button title="salir" color="red" onPress={() => setIsModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ListClients;
