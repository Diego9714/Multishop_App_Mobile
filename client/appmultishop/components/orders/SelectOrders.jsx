import React, { useState, useEffect, useCallback } from 'react';
import { Text, View, Pressable, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign, MaterialIcons, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import styles from '../../styles/SelectOrders.styles';

const SelectOrders = () => {
  const [orders, setOrders] = useState([]);
  const [storedOrders, setStoredOrders] = useState([]);
  const [visibleOrders, setVisibleOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [selectedOrders, setSelectedOrders] = useState({});
  const itemsPerPage = 10;

  const fetchOrders = async () => {
    try {
      const storedOrdersString = await AsyncStorage.getItem('OrdersClient');
      const parsedOrders = storedOrdersString ? JSON.parse(storedOrdersString) : [];
      setStoredOrders(parsedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  useEffect(() => {
    fetchOrders();

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
  }, [storedOrders]);

  useEffect(() => {
    if (JSON.stringify(storedOrders) !== JSON.stringify(orders)) {
      setOrders(storedOrders);
      console.log('Orders updated:', storedOrders);
    }
  }, [storedOrders]);

  useEffect(() => {
    const start = (page - 1) * itemsPerPage;
    const end = page * itemsPerPage;
    const paginatedOrders = orders.slice(start, end);

    const updatedVisibleOrders = paginatedOrders.map(order => ({
      ...order,
      selected: order.cod_cli in selectedOrders && selectedOrders[order.cod_cli] > 0
    }));

    setVisibleOrders(updatedVisibleOrders);
  }, [page, orders, selectedOrders]);

  const handleOrderSelection = useCallback((order) => {
    const updatedSelectedOrders = { ...selectedOrders };

    if (order.selected) {
      order.selected = false;
      delete updatedSelectedOrders[order.cod_cli];
    } else {
      order.selected = true;
      updatedSelectedOrders[order.cod_cli] = 1; // Establecer cantidad por defecto a 1
    }

    setSelectedOrders(updatedSelectedOrders);
    setOrders(orders.map(o => 
      o.cod_cli === order.cod_cli ? { ...o, selected: !o.selected } : o
    ));
  }, [selectedOrders, orders]);

  const synchronizeOrders = () => {
    const ordersToSync = orders.filter(order => selectedOrders[order.cod_cli]);
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
                    onPress={() => {
                      // Aquí puedes agregar la lógica para ver más detalles del pedido
                    }}
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
          disabled={Object.keys(selectedOrders).length === 0}
        >
          <Text style={styles.textButtonSincro}>Sincronizar</Text>
          <MaterialCommunityIcons 
            name="cloud-upload" 
            size={35} 
            color="#f1f1f1"
          />
        </Pressable>
      </View>
    </View>
  );
};

export default SelectOrders;
