import React, { useState, useEffect } from 'react'; 
import { View, Text, Modal, Pressable, TextInput, Alert } from 'react-native';
import styles from '../../styles/ModalEditProd.styles';

const EditProd = ({ isVisible, selectedProduct, onClose, onQuantityChange, onDeleteProduct }) => {
  const [quantity, setQuantity] = useState(selectedProduct?.quantity || 0);

  useEffect(() => {
    if (selectedProduct) {
      setQuantity(selectedProduct.quantity);
    }
  }, [selectedProduct]);

  const handleQuantityChange = (text) => {
    const newQuantity = parseInt(text, 10) || 0;

    if (newQuantity > selectedProduct.exists) {
      Alert.alert('Cantidad no disponible', 'La cantidad ingresada supera la cantidad existente en el inventario.');
      return;
    }

    setQuantity(newQuantity);
    if (onQuantityChange) {
      onQuantityChange(selectedProduct.codigo, newQuantity);
    }
  };

  const handleSave = () => {
    if (quantity > selectedProduct.exists) {
      Alert.alert('Cantidad no disponible', 'La cantidad ingresada supera la cantidad existente en el inventario.');
      return;
    }

    if (onQuantityChange) {
      onQuantityChange(selectedProduct.codigo, quantity);
    }
    onClose(); // Cerrar el modal después de guardar
  };

  const handleDeleteProduct = () => {
    if (onDeleteProduct) {
      onDeleteProduct(selectedProduct.codigo); // Llama a onDeleteProduct con el código del producto
    }
    onClose(); // Cerrar el modal después de eliminar
  };

  return (
    <Modal visible={isVisible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.titleModal}>{selectedProduct.descrip}</Text>
          <Text style={styles.subtitleModal}>Existencia</Text>
          <View style={styles.modalInfoClient}>
            <TextInput style={styles.textModal} editable={false}>
              {selectedProduct?.exists - quantity}
            </TextInput>
          </View>
          <Text style={styles.subtitleModal}>Cantidad Seleccionada</Text>
          <View style={styles.modalInfoClient}>
            <TextInput
              style={styles.textModal}
              keyboardType="numeric"
              value={quantity.toString()}
              onChangeText={handleQuantityChange}
            />
          </View>
          <Text style={styles.subtitleModal}>Precio(Bs)</Text>
          <View style={styles.modalInfoClient}>
            <Text style={styles.textModal}>{selectedProduct.priceBs}</Text>
          </View>
          <Text style={styles.subtitleModal}>Precio(Usd)</Text>
          <View style={styles.modalInfoClient}>
            <Text style={styles.textModal}>{selectedProduct.priceUsd}</Text>
          </View>
          
          <View style={styles.sectionButtonsModal}>
            <Pressable onPress={handleSave} style={styles.buttonModal}>
              <Text style={styles.buttonTextModal}>Guardar</Text>
            </Pressable>

            <Pressable onPress={handleDeleteProduct} style={styles.buttonModalExit}>
              <Text style={styles.buttonTextModal}>Eliminar</Text>
            </Pressable>
          </View>

          <Pressable onPress={onClose} style={styles.buttonModalExit}>
            <Text style={styles.buttonTextModal}>Salir</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

export default EditProd;
