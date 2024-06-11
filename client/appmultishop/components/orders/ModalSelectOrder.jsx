import React from 'react';
import { Text, View, Modal, Pressable } from 'react-native';
import styles from '../../styles/ModalSelectOrder.styles';

const ModalSelectOrder = ({ isVisible, onClose, onSelect, selectedOrder }) => {

  const handleModalSelect = async (action) => {
    if (action === 'Eliminar' && selectedOrder) {
      // Aquí se maneja la lógica para eliminar el pedido
      onSelect('Eliminar', selectedOrder);
    } else if (action === 'Editar') {
      // Aquí se maneja la lógica para editar el pedido
      onSelect('Editar', selectedOrder);
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
