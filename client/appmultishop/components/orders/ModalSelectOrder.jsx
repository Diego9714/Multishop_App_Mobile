import React from 'react';
import { Text, View, Modal, Pressable } from 'react-native';
import styles from '../../styles/ModalSelectOrder.styles';

const ModalSelectOrder = ({ isVisible, onClose, onSelect, selectedOrder }) => {

  const handleModalSelect = async (action) => {
    if (action === 'Eliminar' && selectedOrder) {
      onSelect('Eliminar', selectedOrder);
    } else if (action === 'Editar' && selectedOrder) {
      onSelect('Editar', selectedOrder);
      console.log(selectedOrder)
    }
    
    onClose();
  };

  return (
    <Modal visible={isVisible && !!selectedOrder} animationType="slide" transparent={true}>
      {selectedOrder && (
        <View style={styles.modalContainer}>
          <View style={styles.container}>
            <Text style={styles.modalTitle}>{selectedOrder.nom_cli}</Text>
            <Text style={styles.modalTitle}>{selectedOrder.totalUsd}$</Text>

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
      )}
    </Modal>
  );
}

export default ModalSelectOrder;
