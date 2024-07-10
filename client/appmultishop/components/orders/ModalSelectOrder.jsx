// Dependencies
import React from 'react';
import { Text, View, Modal, Pressable } from 'react-native';
// Styles
import styles from '../../styles/ModalSelectOrder.styles';

const ModalSelectOrder = ({ isVisible, onClose, onSelect, selectedOrder }) => {

  const handleModalSelect = async (action) => {
    if (action === 'Eliminar' && selectedOrder) {
      onSelect('Eliminar', selectedOrder);
    } else if (action === 'Editar' && selectedOrder) {
      onSelect('Editar', selectedOrder);
    }
    
    onClose();
  };

  const formatNumber = (number) => {
    return number.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <Modal visible={isVisible && !!selectedOrder} animationType="fade" transparent={true}>
      {selectedOrder && (
        <View style={styles.modalContainer}>
          <View style={styles.container}>
            <Text style={styles.modalTitle}>{selectedOrder.nom_cli}</Text>
            <Text style={styles.modalTitle}>{formatNumber(selectedOrder.totalUsd)}$</Text>

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
