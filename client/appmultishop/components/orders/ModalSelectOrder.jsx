import React from 'react';
import { Text, View, Modal, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../../styles/ModalSelectOrder.styles';

const ModalSelectOrder = ({ isVisible, onClose, selectedOrder }) => {

  const handleModalSelect = async (action) => {
    if (action === 'Eliminar') {
      try {
        // Eliminar el pedido seleccionado
        const existingOrdersString = await AsyncStorage.getItem('OrdersClient');
        let existingOrders = existingOrdersString ? JSON.parse(existingOrdersString) : [];
        const updatedOrders = existingOrders.filter(order => order.id_order !== selectedOrder.id_order);
        await AsyncStorage.setItem('OrdersClient', JSON.stringify(updatedOrders));
        // console.log('Order deleted:', selectedOrder);
      } catch (error) {
        console.error('Error deleting order:', error);
      }
    } else if (action === 'Editar') {
      // Abre el componente SaveOrder con el pedido seleccionado
      onClose(); // Cierra el modal actual
      setSaveOrderVisible(true); // Activa la visibilidad del modal de SaveOrder
    }
  
    onClose();
  };

  return (
    <Modal visible={isVisible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.container}>
          <Pressable style={styles.modalButton} onPress={() => handleModalSelect('Eliminar')}>
            <Text style={styles.modalButtonText}>Eliminar</Text>
          </Pressable>
          <Pressable style={styles.modalButton} onPress={() => handleModalSelect('Editar')}>
            <Text style={styles.modalButtonText}>Editar</Text>
          </Pressable>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <Text style={styles.modalButtonText}>Salir</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

export default ModalSelectOrder;
