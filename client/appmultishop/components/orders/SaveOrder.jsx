import React, { useState, useEffect } from 'react';
import { Text, View, Modal, Pressable, ScrollView } from 'react-native';
import ModalSelectFact from './modalSelectFact';
import ModalEditProd from './modalEditProd';
import styles from '../../styles/SaveOrder.styles';

const SaveOrder = ({ isVisible, onClose, client, order, onQuantityChange, onDeleteProduct, updateProductQuantities }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [invoiceType, setInvoiceType] = useState(null);
  const [isInvoiceModalVisible, setIsInvoiceModalVisible] = useState(false);
  const [products, setProducts] = useState([]);

  // console.log(order)

  useEffect(() => {
    if (order && order.products) {
      setProducts(order.products);
    }
  }, [order]);

  const openModal = (product) => {
    setSelectedProduct(product);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedProduct(null);
  };

  const handleInvoiceSelection = (type) => {
    setInvoiceType(type);
    setIsInvoiceModalVisible(false);
  };

const handleQuantityChange = (productId, newQuantity) => {
  onQuantityChange(productId, newQuantity); // Llama a la función pasada desde SelectProducts
  updateProductQuantities(productId, newQuantity); // Llama a la función para actualizar cantidades

  // Actualizar la lista de productos en SelectProducts
  const updatedProducts = products.map(product =>
    product.codigo === productId ? { ...product, quantity: newQuantity } : product
  );
  setProducts(updatedProducts);
};
  const handleDeleteProduct = (productId) => {
    // Eliminar el producto de la lista local de productos
    const updatedProducts = products.filter(product => product.codigo !== productId);
    setProducts(updatedProducts);
  
    // Llamar a la función onDeleteProduct pasando el ID del producto
    if (onDeleteProduct) {
      onDeleteProduct(productId);
      // console.log("onDeleteProduct llamado");
    }
    
    // Cerrar el modal después de eliminar el producto
    closeModal();
  };
  
  

  return (
    <Modal visible={isVisible} animationType="slide">
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.mainTitleContainer}>
            <Text style={styles.mainTitle}>Datos del Cliente</Text>
          </View>

          <View style={styles.detailedClientContainer}>
            <Text style={styles.nameInputDetailedClient}>Nombre:</Text>
            <View style={styles.infoClientContainer}>
              <Text style={styles.textDetailedClient}>{client.nom_cli}</Text>
            </View>
            <Text style={styles.nameInputDetailedClient}>Cédula:</Text>
            <View style={styles.infoClientContainer}>
              <Text style={styles.textDetailedClient}>{client.rif_cli}</Text>
            </View>
            <Text style={styles.nameInputDetailedClient}>Teléfono:</Text>
            <View style={styles.infoClientContainer}>
              <Text style={styles.textDetailedClient}>{client.tel_cli}</Text>
            </View>
            <Text style={styles.nameInputDetailedClient}>Dirección:</Text>
            <View style={styles.infoClientContainer}>
              <Text style={styles.textDetailedClient}>{client.dir1_cli}</Text>
            </View>
          </View>

          <View style={styles.mainTitleContainer}>
            <Text style={styles.mainTitle}>Tipo de Factura</Text>
          </View>

          <View style={styles.detailedClientContainer}>
            <Pressable style={styles.infoClientContainer} onPress={() => setIsInvoiceModalVisible(true)}>
              <Text style={styles.textDetailedClient}>
                {invoiceType ? invoiceType : '--- Seleccionar ---'}
              </Text>
            </Pressable>
          </View>

          <View style={styles.mainTitleContainer}>
            <Text style={styles.mainTitle}>Productos Seleccionados</Text>
          </View>
          
          <View style={styles.ProductContainer}>
            <View style={styles.headerProductContainer}>
              <View style={styles.titleListContainer}>
                <Text style={styles.titleListProduct}>Producto</Text>
                <Text style={styles.titleListQuantity}>Cantidad</Text>
                <Text style={styles.titleListPrice}>Precio</Text>
              </View>
            </View>

            <ScrollView>
              {products && products.map((product, index) => (
                <Pressable key={index} style={styles.selectedProductItem} onPress={() => openModal(product)}>
                  <Text style={styles.nameProduct}>{product.descrip}</Text>
                  <Text style={styles.quantityProduct}>{product.quantity}</Text>
                  <Text style={styles.priceProduct}>{product.priceUsd}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
          
          <Pressable onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Salir</Text>
          </Pressable>
        </ScrollView>

        <ModalEditProd
          isVisible={modalVisible}
          selectedProduct={selectedProduct}
          onClose={closeModal}
          onQuantityChange={handleQuantityChange}
          onDeleteProduct={handleDeleteProduct} // Pasar la función de eliminación de producto
        />

        <ModalSelectFact
          isVisible={isInvoiceModalVisible}
          onClose={() => setIsInvoiceModalVisible(false)}
          onSelect={handleInvoiceSelection}
        />
      </View>
    </Modal>
  );
}

export default SaveOrder;
