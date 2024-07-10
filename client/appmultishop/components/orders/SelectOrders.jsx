// Dependencies
import React, { useState, useEffect, useCallback }          from 'react';
import { Text, View, Pressable, ScrollView, 
Modal, Alert, ActivityIndicator }                           from 'react-native';
import AsyncStorage                                         from '@react-native-async-storage/async-storage';
import { Ionicons, MaterialIcons, MaterialCommunityIcons }  from '@expo/vector-icons';
import { LinearGradient }                                   from 'expo-linear-gradient';
// Styles
import styles                                               from '../../styles/SelectOrders.styles';
// Modals And Components
import ModalSelectOrder                                     from './ModalSelectOrder';
import ModalSincroOrder                                     from './ModalSincroOrder';
import EditOrder                                            from '../editOrder/EditOrder';
// JWT - Token
import { jwtDecode }                                        from 'jwt-decode';
import { decode }                                           from 'base-64';
global.atob = decode;

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
  const [modalSincroVisible, setModalSincroVisible] = useState(false); // Variable de estado para controlar la visibilidad del modal
  const [clientsOrder, setClientsOrder] = useState([]); // Define clientsOrder state
  const [isLoading, setIsLoading] = useState(false);  // Estado del loader
  const itemsPerPage = 10;
  const [codVen, setCodVen] = useState(null);  // Estado para almacenar el cod_ven del usuario

  const formatNumber = (number) => {
    return number.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const fetchOrders = async () => {
    try {
      const storedOrdersString = await AsyncStorage.getItem('OrdersClient');
      const token = await AsyncStorage.getItem('tokenUser');
      const decodedToken = jwtDecode(token);
      const cod_ven = decodedToken.cod_ven;
      setCodVen(cod_ven);  // Guardar cod_ven en el estado

      const parsedOrders = storedOrdersString ? JSON.parse(storedOrdersString) : [];
      const filteredOrders = parsedOrders.filter(order => order.cod_ven === cod_ven); // Filtrar los pedidos
      setStoredOrders(filteredOrders);
      setIsLoaded(true);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  useEffect(() => {
    const fetchClientsOrder = async () => {
      try {
        const storedClientsOrderString = await AsyncStorage.getItem('ClientsOrder');
        const token = await AsyncStorage.getItem('tokenUser');
        const decodedToken = jwtDecode(token);
        const cod_ven = decodedToken.cod_ven;

        const parsedClientsOrder = storedClientsOrderString ? JSON.parse(storedClientsOrderString) : [];
        setClientsOrder(parsedClientsOrder);
      } catch (error) {
        console.error('Error fetching clientsOrder:', error);
      }
    };

    fetchClientsOrder();
  }, []);

  useEffect(() => {
    if (!isLoaded) {
      fetchOrders();
    }

    const intervalId = setInterval(async () => {
      try {
        const storedOrdersString = await AsyncStorage.getItem('OrdersClient');
        const parsedOrders = storedOrdersString ? JSON.parse(storedOrdersString) : [];
        if (JSON.stringify(parsedOrders) !== JSON.stringify(storedOrders)) {
          const filteredOrders = parsedOrders.filter(order => order.cod_ven === codVen); // Filtrar los pedidos
          setStoredOrders(filteredOrders);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    }, 5000);

    return () => clearInterval(intervalId);
  }, [isLoaded, storedOrders, codVen]);

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
    console.log('Orders to sync:', ordersToSync[0].products);

    setIsLoading(true);  // Inicia el loader
    setModalSincroVisible(true);  // Abre el modal de sincronización
    const timer = setTimeout(() => {
      setIsLoading(false);
      setUnsynchronizedOrders(ordersToSync);  // Marca todos los pedidos como no sincronizados
    }, 10000);  // 10 segundos de espera

    try {
      const response = await instanceSincro.post('/api/register/order', { order: ordersToSync });
      console.log('Synchronization response:', response.data);

      if (response.status === 200) {
        clearTimeout(timer);
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

        const storedOrders = await AsyncStorage.getItem('OrdersClient');
        const parsedStoredOrders = storedOrders ? JSON.parse(storedOrders) : [];

        const remainingStoredOrders = parsedStoredOrders.filter(order => !processedOrderIds.has(order.id_order));
        await AsyncStorage.setItem('OrdersClient', JSON.stringify(remainingStoredOrders));
      }
    } catch (error) {
      console.error('Error synchronizing orders:', error);
      if (error.response && error.response.status === 500) {
        const ordersToMarkAsNotCompleted = ordersToSync.map(order => ({
          ...order,
          status: 'Not completed'
        }));
        setUnsynchronizedOrders(ordersToMarkAsNotCompleted);
      }
    } finally {
      setIsLoading(false);  // Detiene el loader
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
          <Text style={[styles.pageButtonText, page === i && styles.pageButtonTextActive]}>
            {i}
          </Text>
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
  
        // Recuperar el pedido eliminado y sus productos
        const deletedOrder = orders.find(o => o.id_order === selectedOrder.id_order);
        
        // Actualizar existencias en la lista de productos
        const productsInfo = await AsyncStorage.getItem('products');
        const productList = productsInfo ? JSON.parse(productsInfo) : [];
  
        const updatedProductList = productList.map(prod => {
          const deletedProduct = deletedOrder.products.find(p => p.codigo === prod.codigo);
          if (deletedProduct) {
            return {
              ...prod,
              existencia: prod.existencia + deletedProduct.quantity
            };
          }
          return prod;
        });
  
        await AsyncStorage.setItem('products', JSON.stringify(updatedProductList));

        // Actualizar los pedidos almacenados
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
    <LinearGradient
    colors={['#ffff', '#9bdef6', '#ffffff', '#9bdef6']}
    style={styles.gradientBackground}
    >
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
                    <Text>{formatNumber(order.totalUsd)} $</Text>
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
          isLoading={isLoading}  // Pasar el estado del loader al modal
        />

        <ModalSelectOrder 
          isVisible={modalVisible} 
          onClose={() => setModalVisible(false)} 
          onSelect={handleModalSelect} 
          selectedOrder={selectedOrder}
          animationType="fade"
        />

        <Modal
          visible={editModalVisible}
          onRequestClose={() => setEditModalVisible(false)}
          animationType="fade"
        >
        </Modal>
        
        {selectedOrder && (
          <EditOrder
            isVisible={editModalVisible}
            selectedOrder={selectedOrder}
            onClose={() => setEditModalVisible(false)}
            animationType="fade"
          />
        )}
      </View>
    </LinearGradient>
  );
};

export default SelectOrders;
