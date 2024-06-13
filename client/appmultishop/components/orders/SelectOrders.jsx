import React, { useState, useEffect, useCallback } from 'react';
import { Text, View, Pressable, ScrollView, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import styles from '../../styles/SelectOrders.styles';
import ModalSelectOrder from './ModalSelectOrder';
import EditOrder from '../editOrder/EditOrder';

const SelectOrders = () => {
  const [orders, setOrders] = useState([]);
  const [storedOrders, setStoredOrders] = useState([]);
  const [visibleOrders, setVisibleOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [selectedOrders, setSelectedOrders] = useState({});
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false); // Estado para el modal EditOrder
  const [isLoaded, setIsLoaded] = useState(false);
  const itemsPerPage = 10;

  const fetchOrders = async () => {
    try {
      const storedOrdersString = await AsyncStorage.getItem('OrdersClient');
      const parsedOrders = storedOrdersString ? JSON.parse(storedOrdersString) : [];
      console.log("parsedOrders")
      console.log(parsedOrders)
      console.log(parsedOrders[0].products)
      setStoredOrders(parsedOrders);
      setIsLoaded(true);
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
    }, 5000);

    return () => clearInterval(intervalId);
  }, [isLoaded, storedOrders]);

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
      updatedSelectedOrders[order.cod_cli] = 1;
    }

    setSelectedOrders(updatedSelectedOrders);
    setOrders(orders.map(o => 
      o.cod_cli === order.cod_cli ? { ...o, selected: !o.selected } : o
    ));
  }, [selectedOrders, orders]);

  const synchronizeOrders = () => {
    const ordersToSync = orders.filter(order => selectedOrders[order.cod_cli]);
    console.log('Orders to synchronize:', ordersToSync);
  };

  const renderPaginationButtons = () => {
    const numberOfPages = Math.ceil(orders.length / itemsPerPage);
    let buttons = [];
    for (let i = 1 ; i <= numberOfPages ; i++) {
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
        console.log('Order deleted:', selectedOrder);
      } catch (error) {
        console.error('Error deleting order:', error);
      }
    } else if (action === 'Editar') {
      setModalVisible(false);
      setEditModalVisible(true); // Abre el modal EditOrder
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
                  <Text>{order.totalUsd} $</Text>
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
                    <Ionicons name="information-circle-sharp" size={34} color="#7A7A7B" />
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

      <ModalSelectOrder 
        isVisible={modalVisible} 
        onClose={() => setModalVisible(false)} 
        onSelect={handleModalSelect} 
        selectedOrder={selectedOrder} 
      />

      {/* Modal para editar el pedido */}
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
    ) }
    </View>
  );
};

export default SelectOrders;
