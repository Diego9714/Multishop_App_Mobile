import React, { useState, useEffect, useCallback } from 'react';
import { Text, View, Pressable, ScrollView, Modal, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import styles from '../../styles/SelectOrders.styles';
import ModalSelectOrder from './ModalSelectOrder';
import ModalSincroOrder from './ModalSincroOrder';
import EditOrder from '../editOrder/EditOrder';
// Api
import { instanceSincro } from '../../global/api';

const SelectOrders = () => {
  const [orders, setOrders] = useState([]);
  const [storedOrders, setStoredOrders] = useState([]);
  const [visibleOrders, setVisibleOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [selectedOrders, setSelectedOrders] = useState({});
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [synchronizedOrders, setSynchronizedOrders] = useState([]);
  const [unsynchronizedOrders, setUnsynchronizedOrders] = useState([]);
  const [modalSincroVisible, setModalSincroVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('Sincronizando...');
  const [modalStatus, setModalStatus] = useState(null);
  const [timer, setTimer] = useState(10); // Initial timer value
  const itemsPerPage = 10;

  const fetchOrders = async () => {
    try {
      const storedOrdersString = await AsyncStorage.getItem('OrdersClient');
      const parsedOrders = storedOrdersString ? JSON.parse(storedOrdersString) : [];
      setStoredOrders(parsedOrders);
      setIsLoaded(true);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  useEffect(() => {
    fetchOrders();
    const intervalId = setInterval(fetchOrders, 5000);
    return () => clearInterval(intervalId);
  }, []);

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
      selected: selectedOrders[order.id_order] || false
    }));

    setVisibleOrders(updatedVisibleOrders);
  }, [page, orders, selectedOrders]);

  const handleOrderSelection = useCallback((order) => {
    const updatedSelectedOrders = { ...selectedOrders };

    if (order.selected) {
      order.selected = false;
      delete updatedSelectedOrders[order.id_order];
    } else {
      order.selected = true;
      updatedSelectedOrders[order.id_order] = true;
    }

    setSelectedOrders(updatedSelectedOrders);
    setOrders(orders.map(o => 
      o.id_order === order.id_order ? { ...o, selected: !o.selected } : o
    ));
  }, [selectedOrders, orders]);

  const synchronizeOrders = async () => {
    const ordersToSync = orders.filter(order => selectedOrders[order.id_order]);
    console.log('Orders to sync:', ordersToSync);
  
    let responseReceived = false;
  
    const timeoutId = setTimeout(() => {
      if (!responseReceived) {
        setUnsynchronizedOrders(ordersToSync);
        setModalMessage("Tiempo de espera agotado. Inténtelo de nuevo.");
        setModalStatus(500);
      }
    }, 10000);
  
    try {
      setModalSincroVisible(true); // Open the modal immediately
      setModalMessage("Sincronizando...");
      setModalStatus(null);
      const response = await instanceSincro.post('/api/register/order', { order: ordersToSync });
      responseReceived = true;
      clearTimeout(timeoutId);
      console.log('Synchronization response:', response.data);
  
      if (response.status === 200) {
        const { processOrder } = response.data;
        const completed = processOrder.completed || [];
        const existing = processOrder.existing || [];
        const notCompleted = processOrder.notCompleted || [];
  
        // console.log('Completed orders:', completed);
        // console.log('Existing orders:', existing);
        // console.log('Not completed orders:', notCompleted);
  
        const processedOrderIds = new Set([
          ...completed.map(order => order.id_order),
          ...existing.map(order => order.id_order)
        ]);
  
        console.log('Processed order IDs:', processedOrderIds);
  
        const updatedOrders = orders.filter(order => !processedOrderIds.has(order.id_order));
        setOrders(updatedOrders);
        setStoredOrders(updatedOrders);
  
        setSynchronizedOrders(completed);
        setUnsynchronizedOrders(notCompleted);
  
        setSelectedOrders({});
        setModalMessage("Sincronización completa");
        setModalStatus(200);
  
        const storedOrders = await AsyncStorage.getItem('OrdersClient');
        const parsedStoredOrders = storedOrders ? JSON.parse(storedOrders) : [];
        const remainingStoredOrders = parsedStoredOrders.filter(order => !processedOrderIds.has(order.id_order));
  
        await AsyncStorage.setItem('OrdersClient', JSON.stringify(remainingStoredOrders));
      }
    } catch (error) {
      console.error('Error synchronizing orders:', error);
      setModalMessage("Error al sincronizar pedidos");
      setModalStatus(500);
      // Update synchronizedOrders and unsynchronizedOrders even if there's an error
      setSynchronizedOrders([]);
      setUnsynchronizedOrders(ordersToSync);
    } finally {
      setTimeout(() => {
        setModalSincroVisible(false);
  
        // Desmarcar los pedidos que no se sincronizaron
        const unsyncedOrderIds = unsynchronizedOrders.map(order => order.id_order);
        const updatedSelectedOrders = { ...selectedOrders };
        unsyncedOrderIds.forEach(orderId => {
          delete updatedSelectedOrders[orderId];
        });
        setSelectedOrders(updatedSelectedOrders);
      }, 4000); // Close the modal after 4 seconds
    }
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

  const handleOrderDetails = (order) => {
    setSelectedOrder(order);
    setModalVisible(true);
  };

  const handleModalSelect = async (action, product) => {
    if (action === 'Eliminar') {
      try {
        const updatedOrders = orders.filter(o => o.id_order !== selectedOrder.id_order);
        setOrders(updatedOrders);
        setStoredOrders(updatedOrders);
        await AsyncStorage.setItem('OrdersClient', JSON.stringify(updatedOrders));
      } catch (error) {
        console.error('Error deleting order:', error);
      }
    } else if (action === 'Editar') {
      setModalVisible(false);
      setEditModalVisible(true);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.titlePage}>
        <Text style={styles.title}>Pedidos por Sincronizar</Text>
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
                  <Text>{order.totalUsd.toFixed(2)} $</Text>
                </View>
                <View style={styles.buttonAction}>
                  <Pressable
                    style={styles.button}
                    onPress={() => handleOrderSelection(order)}
                  >
                    {order.selected ? (
                      <MaterialIcons name="check-box" size={32} color="#7A7A7B" />
                    ) : (
                      <MaterialIcons name="check-box-outline-blank" size={32} color="#7A7A7B" />
                    )}
                  </Pressable>
                  <Pressable
                    style={styles.button}
                    onPress={() => handleOrderDetails(order)}
                  >
                    <MaterialIcons name="more-vert" size={30} color="#7A7A7B" />
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

      <ModalSincroOrder 
        isVisible={modalSincroVisible} 
        onClose={() => setModalSincroVisible(false)} 
        synchronizedOrders={synchronizedOrders} 
        unsynchronizedOrders={unsynchronizedOrders} 
        initialTimer={timer} // Use the timer state here
      />

      <ModalSelectOrder 
        isVisible={modalVisible} 
        onClose={() => setModalVisible(false)} 
        onSelect={handleModalSelect} 
        selectedOrder={selectedOrder} 
      />

      <Modal
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
        animationType="slide"
      >
      </Modal>
      
      {selectedOrder && (
        <EditOrder
          isVisible={editModalVisible}
          selectedOrder={selectedOrder}
          onClose={() => setEditModalVisible(false)}
        />
      )}
    </View>
  );
};

export default SelectOrders;
