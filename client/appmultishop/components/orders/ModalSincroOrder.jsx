import React, { useEffect } from 'react';
import { View, Text, Modal, StyleSheet, Button, Pressable, FlatList } from 'react-native';
import styles from '../../styles/ModalSincroOrder.styles';

const ModalSincroOrder = ({ isVisible, onClose, synchronizedOrders, unsynchronizedOrders }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  const renderItem = ({ item }) => {
    return (
      <View style={styles.orderItem}>
        <Text style={styles.orderText}>{item.nom_cli}</Text>
        <Text style={styles.orderText}>Total a pagar: {item.totalUsd.toFixed(2)} $</Text>
      </View>
    );
  };

  return (
    <Modal visible={isVisible} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.titleModal}>Pedidos Sincronizados:</Text>
          <FlatList
            data={synchronizedOrders}
            renderItem={renderItem}
            keyExtractor={(item) => item.id_order.toString()}
            ListEmptyComponent={<Text style={styles.subtitleModal}>No hay pedidos sincronizados</Text>}
          />
          <Text style={styles.titleModal}>Pedidos No Sincronizados:</Text>
          <FlatList
            data={unsynchronizedOrders}
            renderItem={renderItem}
            keyExtractor={(item) => item.id_order.toString()}
            ListEmptyComponent={<Text style={styles.subtitleModal}>No hay pedidos no sincronizados</Text>}
          />
          <Pressable style={styles.buttonModalExit} onPress={onClose}>
            <Text style={styles.buttonTextModal}>Salir</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default ModalSincroOrder;
