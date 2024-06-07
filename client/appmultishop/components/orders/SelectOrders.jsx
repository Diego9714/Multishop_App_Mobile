import React, { useState, useEffect, useCallback } from 'react';
import { Text, View, Pressable, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import styles from '../../styles/SelectOrders.styles';
import ModalSelectOrder from './ModalSelectOrder';

const SelectOrders = () => {
  const [orders, setOrders] = useState([]);
  const [storedOrders, setStoredOrders] = useState([]);
  const [visibleOrders, setVisibleOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const itemsPerPage = 10;

  const fetchOrders = async () => {
    try {
      const storedOrdersString = await AsyncStorage.getItem('OrdersClient');
      const parsedOrders = storedOrdersString ? JSON.parse(storedOrdersString) : [];
      setStoredOrders(parsedOrders);
      setIsLoaded(true); // Marcar como cargado
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  useEffect(() => {
    if (!isLoaded) {
      fetchOrders();
    }

    const intervalId = setInterval(async () => {
      try {
        const storedOrdersString = await AsyncStorage.getItem('OrdersClient');
        const parsedOrders = storedOrdersString ? JSON.parse(storedOrdersString) : [];
        if (JSON.stringify(parsedOrders) !== JSON.stringify(storedOrders)) {
          setStoredOrders(parsedOrders);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    }, 5000); // Check for updates every 5 seconds

    return () => clearInterval(intervalId);
  }, [isLoaded, storedOrders]); // Include isLoaded in the dependency array

  useEffect(() => {
    if (JSON.stringify(storedOrders) !== JSON.stringify(orders)) {
      setOrders(storedOrders);
    }
  }, [storedOrders]);

  useEffect(() => {
    const start = (page - 1) * itemsPerPage;
    const end = page * itemsPerPage;
    const paginatedOrders = orders.slice(start, end);

    const updatedVisibleOrders = paginatedOrders.map(order => ({
      ...order,
      selected: order === selectedOrder
    }));

    setVisibleOrders(updatedVisibleOrders);
  }, [page, orders, selectedOrder]);

  const handleOrderSelection = useCallback((order) => {
    setSelectedOrder(order);
  }, []);

  const handleOrderDetails = (order) => {
    setSelectedOrder(order);
    setModalVisible(true); // Abrir el modal cuando se selecciona un pedido
  };

  const synchronizeOrders = () => {
    const ordersToSync = orders.filter(order => order === selectedOrder);
    console.log('Orders to synchronize:', ordersToSync);
    // Aquí puedes agregar la lógica para sincronizar los pedidos
  };

  const renderPaginationButtons = () => {
    const numberOfPages = Math.ceil(orders.length / itemsPerPage);
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
    <View style={styles.mainContainer}>
      <View style={styles.mainTitleContainer}>
        <Text style={styles.mainTitle}>Pedidos</Text>
      </View>

      <View style={styles.listOrderContainer}>
        <View style={styles.headerProductContainer}>
          <View style={styles.titleListContainer}>
            <Text style={styles.titleListClient}>Cliente</Text>
            <Text style={styles.titleListPrice}>Total a pagar</Text>
            <Text style={styles.titleListActions}>Acciones</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          {visibleOrders.length > 0 ? (
            visibleOrders.map((order, index) => (
              <View key={index} style={styles.orderItem}>
                <View style={styles.nameProd}>
                  <Text>{order.nom_cli}</Text>
                </View>
                <View style={styles.priceContainer}>
                  <Text>{order.totalUsd} $</Text>
                </View>
                <View style={styles.buttonAction}>
                  <Pressable
                    style={styles.button}
                    onPress={() => handleOrderSelection(order)}
                  >
                    {order.selected ? (
                      <Ionicons name="remove-outline" size={30} color="black" />
                    ) : (
                      <Ionicons name="add-outline" size={30} color="black" />
                    )}
                  </Pressable>
                  <Pressable
                    style={styles.button}
                    onPress={() => handleOrderDetails(order)} // Aquí se llama a handleOrderDetails
                  >
                    <MaterialIcons name="info-outline" size={30} color="black" />
                  </Pressable>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.noOrdersText}>No hay pedidos disponibles</Text>
          )}
        </ScrollView>
      </View>

      <View style={styles.paginationContainer}>
        {renderPaginationButtons()}
      </View>

      <View style={styles.buttonsAction}>
        <Pressable
          style={styles.buttonSincro}
          onPress={synchronizeOrders}
          disabled={!selectedOrder}
        >
          <Text style={styles.textButtonSincro}>Sincronizar</Text>
          <MaterialCommunityIcons 
            name="cloud-upload" 
            size={35} 
            color="#f1f1f1"
          />
        </Pressable>
      </View>

      <ModalSelectOrder 
        isVisible={modalVisible} 
        onClose={() => setModalVisible(false)} 
        selectedOrder={selectedOrder} // Pasa el pedido seleccionado al modal
      />
    </View>
  );
};

export default SelectOrders;

