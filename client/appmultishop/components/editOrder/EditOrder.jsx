import React, { useState, useEffect } from 'react';
import { Text, View, Modal, Pressable, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../../styles/EditOrder.js';
import ModalEditProd from '../orders/modalEditProd';
import EditSelectFact from './EditSelectFact';
import SelectProducts from './SelectProducts';

const EditOrder = ({ isVisible, onClose, selectedOrder }) => {
  const [order, setOrder] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isInvoiceModalVisible, setIsInvoiceModalVisible] = useState(false);
  const [invoiceType, setInvoiceType] = useState(null);
  const [totalUSD, setTotalUSD] = useState(0);
  const [totalBS, setTotalBS] = useState(0);
  const [isSelectProductsModalVisible, setIsSelectProductsModalVisible] = useState(false);

  useEffect(() => {
    if (selectedOrder) {
      setOrder(selectedOrder);
      updateTotal(selectedOrder.products);
    }
  }, [selectedOrder]);

  const updateTotal = (products) => {
    let totalUSD = 0;
    let totalBS = 0;

    products.forEach(product => {
      totalUSD += product.quantity * product.priceUsd;
      totalBS += product.quantity * product.priceBs;
    });

    setTotalUSD(totalUSD);
    setTotalBS(totalBS);
  };

  const handleProductQuantityChange = (productId, newQuantity) => {
    if (order && order.products) {
      const updatedProducts = order.products.map(product =>
        product.codigo === productId ? { ...product, quantity: newQuantity } : product
      );
      setOrder({ ...order, products: updatedProducts });
      updateTotal(updatedProducts);
    }
  };

  const handleProductDelete = (productId) => {
    if (order && order.products) {
      const updatedProducts = order.products.filter(product => product.codigo !== productId);
      setOrder({ ...order, products: updatedProducts });
      updateTotal(updatedProducts);
    }
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
  };

  const handleInvoiceSelection = (type) => {
    setInvoiceType(type);
    setIsInvoiceModalVisible(false);
  };

  const saveOrder = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('OrdersClient');
      if (jsonValue !== null) {
        let ordersClient = JSON.parse(jsonValue);
        
        const updatedOrders = ordersClient.map(orderItem => {
          if (orderItem.id_order === order.id_order) {
            return {
              ...orderItem,
              products: order.products,
              totalUsd: totalUSD,
              totalBs: totalBS
            };
          }
          return orderItem;
        });
  
        await AsyncStorage.setItem('OrdersClient', JSON.stringify(updatedOrders));
        onClose();
      }
    } catch (error) {
      console.error('Error al obtener/modificar el arreglo de OrdersClient:', error);
    }
  };
  
  const fechaFormateada = order && order.fecha ? new Date(order.fecha).toISOString().split('T')[0] : '';

  return (
    <Modal visible={isVisible} animationType="slide">
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {order ? (
            <View style={styles.content}>
              <View style={styles.mainTitleContainer}>
                <Text style={styles.mainTitle}>Datos del Cliente</Text>
              </View>

              <View style={styles.detailedClientContainer}>
                <Text style={styles.nameInputDetailedClient}>Nombre:</Text>
                <View style={styles.infoClientContainer}>
                  <Text style={styles.textDetailedClient}>{order.nom_cli}</Text>
                </View>
                <Text style={styles.nameInputDetailedClient}>Cédula:</Text>
                <View style={styles.infoClientContainer}>
                  <Text style={styles.textDetailedClient}>{order.cod_cli}</Text>
                </View>
                <Text style={styles.nameInputDetailedClient}>Fecha del Pedido:</Text>
                <View style={styles.infoClientContainer}>
                  <Text style={styles.textDetailedClient}>{fechaFormateada}</Text>
                </View>
              </View>

              <View style={styles.mainTitleContainer}>
                <Text style={styles.mainTitle}>Tipo de Factura</Text>
              </View>

              <View style={styles.detailedClientContainerFac}>
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

                <View>
                  {order.products && order.products.map((product, index) => (
                    <Pressable key={index} style={styles.selectedProductItem} onPress={() => handleEditProduct(product)}>
                      <Text style={styles.nameProduct}>{product.descrip}</Text>
                      <Text style={styles.quantityProduct}>{product.quantity}</Text>
                      <Text style={styles.priceProduct}>{product.priceUsd}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              <View style={styles.containerPrice}>
                <Text style={styles.textPrice}>Total: </Text>
                <Text style={styles.textPrice}>USD : {totalUSD.toFixed(2)}</Text>
                <Text style={styles.textPrice}>BS : {totalBS.toFixed(2)}</Text>
              </View>

              <View style={styles.containerNote}>
                <Text style={styles.noteOrder}>Nota: Esta pre orden es considerada un presupuesto, por lo tanto los precios están sujetos a cambios sin previo aviso.</Text>
              </View>

              <View style={styles.selectProdContainer}>
                <Pressable style={styles.otherButton} onPress={() => setIsSelectProductsModalVisible(true)}>
                  <Text style={styles.buttonText}>Productos</Text>
                </Pressable>
              </View>

              <View style={styles.containerButton}>
                <Pressable onPress={saveOrder} style={styles.otherButton}>
                  <Text style={styles.buttonText}>Guardar</Text>
                </Pressable>
                <Pressable style={styles.otherButton}>
                  <Text style={styles.buttonText}>Pdf</Text>
                </Pressable>
                <Pressable onPress={onClose} style={styles.closeButton}>
                  <Text style={styles.buttonText}>Salir</Text>
                </Pressable>
              </View>
            </View>
          ) : (
            <Text>No se ha seleccionado ningún pedido.</Text>
          )}
        </ScrollView>
      </View>

      <EditSelectFact
        isVisible={isInvoiceModalVisible}
        onClose={() => setIsInvoiceModalVisible(false)}
        onSelect={handleInvoiceSelection}
      />

      {selectedProduct && (
        <ModalEditProd
          isVisible={true}
          selectedProduct={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onQuantityChange={handleProductQuantityChange}
          onDeleteProduct={handleProductDelete}
        />
      )}

      <SelectProducts
        isVisible={isSelectProductsModalVisible}
        onClose={() => setIsSelectProductsModalVisible(false)}
        selectedOrder={order} // Pasar el pedido seleccionado a SelectProducts
        onSave={(newProducts) => {
          setOrder({ ...order, products: newProducts });
          updateTotal(newProducts);
          setIsSelectProductsModalVisible(false);
        }}
      />
    </Modal>
  );
};

export default EditOrder;

