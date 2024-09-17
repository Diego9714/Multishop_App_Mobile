import React from 'react';
import { Text, View, Modal, Pressable } from 'react-native';
import styles from '../../styles/ModalSelectOrder.styles';

const ModalSelectOrder = ({ isVisible, onClose, onSelect, selectedOrder, onViewOrder }) => {

  const handleModalSelect = (action) => {
    if (selectedOrder) {
      if (action === 'Ver') {
        onViewOrder(selectedOrder)
      } else {
        onSelect(action, selectedOrder);
      }
    }
    onClose();
  };

  const formatNumber = (number) => {
    let numberFormat = JSON.parse(number)
    return numberFormat.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  return (
    <Modal visible={isVisible && !!selectedOrder} animationType="fade" transparent={true}>
      {selectedOrder && (
        <View style={styles.modalContainer}>
          <View style={styles.container}>
            <Text style={styles.modalTitle}>{selectedOrder.id_order}</Text>
            <Text style={styles.modalTitle}>{selectedOrder.fecha}</Text>
            <Text style={styles.modalTitle}>{formatNumber(selectedOrder.totalUsd)}</Text>

            <Pressable style={styles.modalButton} onPress={() => handleModalSelect('Ver')}>
              <Text style={styles.modalButtonText}>Ver</Text>
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
