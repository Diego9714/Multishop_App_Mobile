import React, { useState, useEffect } from 'react';
import { View, Text, Modal, Pressable, TextInput } from 'react-native';
import styles from '../../styles/modalEditProd.styles';

const ModalEditProd = ({ isVisible, selectedProduct, onClose, onQuantityChange, onDeleteProduct }) => {
  const [quantity, setQuantity] = useState(selectedProduct?.quantity || 0);

  useEffect(() => {
    if (selectedProduct) {
      setQuantity(selectedProduct.quantity);
    }
  }, [selectedProduct]);

  const handleQuantityChange = (text) => {
    const newQuantity = parseInt(text, 10) || 0;
    setQuantity(newQuantity);
    if (onQuantityChange) {
      onQuantityChange(selectedProduct.codigo, newQuantity);
    }
  };

  const handleDeleteProduct = () => {
    if (onDeleteProduct) {
      onDeleteProduct(selectedProduct.codigo); // Llama a onDeleteProduct con el código del producto
    }
  };

  return (
    <Modal visible={isVisible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.container}>

          <Text style={styles.modalTitle}>Información detallada del producto</Text>
          
          <View style={styles.detailedClientContainer}>
            
            <Text style={styles.nameInputDetailedClient}>Descripción:</Text>
            <View style={styles.infoClientContainer}>
              <Text style={styles.textDetailedClient}>{selectedProduct?.descrip}</Text>
            </View>

            <Text style={styles.nameInputDetailedClient}>Cantidad Seleccionada:</Text>
            <View style={styles.infoClientContainer}>
              <TextInput
                style={styles.textDetailedClient}
                keyboardType="numeric"
                value={quantity.toString()}
                onChangeText={handleQuantityChange}
              />
            </View>

            <Text style={styles.nameInputDetailedClient}>Precio (Usd):</Text>
            <View style={styles.infoClientContainer}>
              <Text style={styles.textDetailedClient}>{selectedProduct?.priceUsd}</Text>
            </View>

            <Text style={styles.nameInputDetailedClient}>Existencia:</Text>
            <View style={styles.infoClientContainer}>
              <Text style={styles.textDetailedClient}>{selectedProduct?.exists - quantity}</Text>
            </View>

          </View>

          <Pressable onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Cerrar</Text>
          </Pressable>

          <Pressable onPress={handleDeleteProduct} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Eliminar Producto</Text>
          </Pressable>
          
        </View>
      </View>
    </Modal>
  );
}

export default ModalEditProd;
