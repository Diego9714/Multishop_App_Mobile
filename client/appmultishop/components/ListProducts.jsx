import React, { useState, useEffect } from 'react';
import { Text, View, FlatList, Pressable, Modal, TextInput, Button, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';

import styles from '../styles/ListProducts.styles';

const ListClients = () => {
  const [products, setProducts] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const getProducts = async () => {
      const info = await AsyncStorage.getItem('products');
      const infoJson = JSON.parse(info);
      setProducts(infoJson || []);
    };
    getProducts();
  }, [])

  const renderElements = ({ item }) => {
    return (
      <View style={styles.productItem}>
        <View style={styles.nameProd}>
          <Text style={styles.textClient}>{item.descrip}</Text>
        </View>
        <View style={styles.exitsProd}>
          <Text>{item.existencia}</Text>
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
        <Text style={styles.title}>Inventario</Text>
        <View style={styles.ViewTextInput}>
          <TextInput placeholder='Buscar' style={styles.textInput} />
          <FontAwesome name="search" size={24} color="black" />
        </View>
      </View>

      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Producto</Text>
            <Text style={styles.headerTitle}>Existencia</Text>
            <Text style={styles.headerTitle}>Acciones</Text>
          </View>
        </View>
        <View style={styles.listContainer}>
          <FlatList
            data={products}
            keyExtractor={(item) => item.codigo}
            renderItem={renderElements}
            initialNumToRender={20}
          />
        </View>
      </View>

      <Modal visible={isModalVisible} animationType="fade" transparent={true} >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.titleModal}>Datos del Producto</Text>
            {/* Nombre */}
            <View style={styles.modalInfoClient}>
              <Text style={styles.textModal}>Tacometro CGS - G125 Digital</Text>
            </View>
            {/* Grupo */}
            <View style={styles.modalInfoClient}>
              <Text style={styles.textModal}>Grupo</Text>
            </View>
            {/* Marca */}
            <View style={styles.modalInfoClient}>
              <Text style={styles.textModal}>Marca</Text>
            </View>
            {/* Precio */}
            <View style={styles.modalInfoClient}>
              <Text style={styles.textModal}>Precio</Text>
            </View>

            <View style={styles.sectionButtonsModal}>
              <Pressable style={styles.buttonModalExit} onPress={() => setIsModalVisible(false)}>
                <Text style={styles.buttonTextModal}>
                  Salir
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ListClients;
