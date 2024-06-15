import React from 'react';
import { Text, View, Pressable, Modal } from 'react-native';
import styles from '../../styles/ListProducts.styles';

const ModalProduct = ({ isVisible, onClose, product }) => {

  if (!product) return null;

  return (
    <Modal visible={isVisible} animationType="fade" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.titleModal}>{product.descrip}</Text>
          <Text style={styles.subtitleModal}>Existencia</Text>
          <View style={styles.modalInfoClient}>
            <Text style={styles.textModal}>{product.existencia}</Text>
          </View>
          <Text style={styles.subtitleModal}>Precio(Bs)</Text>
          <View style={styles.modalInfoClient}>
            <Text style={styles.textModal}>{(product.precioUsd * 36.372).toFixed(2)}</Text>
          </View>
          <Text style={styles.subtitleModal}>Precio(Usd)</Text>
          <View style={styles.modalInfoClient}>
            <Text style={styles.textModal}>{product.precioUsd}</Text>
          </View>
          <Text style={styles.subtitleModal}>Categoría</Text>
          <View style={styles.modalInfoClient}>
            <Text style={styles.textModal}>{product.ncate}</Text>
          </View>
          <View style={styles.sectionButtonsModal}>
            <Pressable style={styles.buttonModalExit} onPress={onClose}>
              <Text style={styles.buttonTextModal}>Salir</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ModalProduct