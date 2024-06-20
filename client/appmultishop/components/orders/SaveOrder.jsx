import React, { useState, useEffect } from 'react';
import { Text, View, Modal, Pressable, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import ModalSelectFact from './modalSelectFact';
import ModalEditProd from './modalEditProd';
import ModalOrderSaved from './ModalOrderSaved';
import styles from '../../styles/SaveOrder.styles';
import { jwtDecode } from 'jwt-decode';
import { decode } from 'base-64';
global.atob = decode;

const SaveOrder = ({ isVisible, onClose, client, order, onQuantityChange, onDeleteProduct }) => {
  const [isProductModalVisible, setIsProductModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [invoiceType, setInvoiceType] = useState(null);
  const [isInvoiceModalVisible, setIsInvoiceModalVisible] = useState(false);
  const [isOrderSavedModalVisible, setIsOrderSavedModalVisible] = useState(false);
  const [products, setProducts] = useState([]);
  const [totalPriceUsd, setTotalPriceUsd] = useState(0);
  const [totalPriceBs, setTotalPriceBs] = useState(0);
  const navigation = useNavigation();

  useEffect(() => {
    if (order && order.products) {
      setProducts(order.products);
    }
  }, [order]);

  const openProductModal = (product) => {
    setSelectedProduct(product);
    setIsProductModalVisible(true);
  };

  const closeProductModal = () => {
    setIsProductModalVisible(false);
    setSelectedProduct(null);
  };

  const handleInvoiceSelection = (type) => {
    setInvoiceType(type);
    setIsInvoiceModalVisible(false);
  };

  const handleProductQuantityChange = (productId, newQuantity) => {
    onQuantityChange(productId, newQuantity);
    const updatedProducts = products.map(product =>
      product.codigo === productId ? { ...product, quantity: newQuantity } : product
    );
    setProducts(updatedProducts);
  };

  const handleProductDelete = (productId) => {
    const updatedProducts = products.filter(product => product.codigo !== productId);
    setProducts(updatedProducts);
  
    if (onDeleteProduct) {
      onDeleteProduct(productId);
    }
    closeProductModal();
  };

  useEffect(() => {
    if (products && products.length > 0) {
      let totalUsd = 0;
      let totalBs = 0;
      products.forEach(product => {
        totalUsd += product.quantity * product.priceUsd;
        totalBs += product.quantity * product.priceBs;
      });
      setTotalPriceUsd(parseFloat(totalUsd.toFixed(2)));
      setTotalPriceBs(parseFloat(totalBs.toFixed(2)));
    } else {
      setTotalPriceUsd(0);
      setTotalPriceBs(0);
    }
  }, [products]);

  const handlePress = (screenName) => {
    navigation.navigate(screenName);
  };

  const generateRandomProductId = () => {
    const randomNumber = Math.floor(Math.random() * 100000);
    const timestamp = Date.now();
    return `${timestamp}-${randomNumber}`;
  };

  const handleSaveOrder = async () => {
    if (!invoiceType) {
      Alert.alert('Error', 'Debe seleccionar el tipo de factura');
      return;
    }
  
    if (products.length === 0) {
      Alert.alert('Error', 'Debe seleccionar al menos un producto');
      return;
    }

    let token = await AsyncStorage.getItem('tokenUser')
    
    const decodedToken = jwtDecode(token)

    const orderData = {
      id_order: generateRandomProductId(),
      id_scli: client.id_scli,
      cod_cli: client.cod_cli,
      nom_cli: client.nom_cli,
      cod_ven : decodedToken.cod_ven,
      products: products.map(product => ({
        codigo: product.codigo,
        descrip: product.descrip,
        exists: product.exists,
        quantity: product.quantity,
        priceUsd: product.priceUsd,
        priceBs: (product.priceUsd * 36.372).toFixed(2),
      })),
      tipfac: invoiceType,
      totalUsd: totalPriceUsd,
      totalBs: (totalPriceUsd * 36.372).toFixed(2),
      fecha: new Date().toISOString(),
    };

    try {
      const existingOrders = await AsyncStorage.getItem('OrdersClient');
      const orders = existingOrders ? JSON.parse(existingOrders) : [];
      orders.push(orderData);
      await AsyncStorage.setItem('OrdersClient', JSON.stringify(orders));
      
      setIsOrderSavedModalVisible(true);  // Mostrar el modal de confirmación

    } catch (error) {
      console.error('Error saving order:', error);
    }
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
            <Text style={styles.nameInputDetailedClient}>Rif:</Text>
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
                <Pressable key={index} style={styles.selectedProductItem} onPress={() => openProductModal(product)}>
                  <Text style={styles.nameProduct}>{product.descrip}</Text>
                  <Text style={styles.quantityProduct}>{product.quantity}</Text>
                  <Text style={styles.priceProduct}>{(product.quantity * product.priceUsd).toFixed(2)}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
          
          <View style={styles.containerPrice}>
            <View style={styles.containerTitlePrice}>
              <Text style={styles.titlePrice}>Total</Text>
            </View>
            <Text style={styles.textPrice}>USD : {totalPriceUsd}</Text>
            <Text style={styles.textPrice}>Bs. : {(totalPriceUsd * 36.372).toFixed(2)}</Text>
            <Text style={styles.textPrice}>Pesos : {(totalPriceUsd.toFixed(2) * 3700).toFixed(2)}</Text>
          </View>

          <View style={styles.containerNote}>
            <Text style={styles.noteOrder}>Nota: Esta pre orden es considerada un presupuesto, por lo tanto los precios y las existencias estan sujetas a cambios sin previo aviso.</Text>
          </View>

          <View style={styles.containerButton}>
            <Pressable onPress={handleSaveOrder} style={styles.otherButton}>
              <Text style={styles.buttonText}>Guardar</Text>
            </Pressable>
            <Pressable style={styles.otherButton}>
              <Text style={styles.buttonText}>Pdf</Text>
            </Pressable>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Text style={styles.buttonText}>Regresar</Text>
            </Pressable>
          </View>
        </ScrollView>

        {selectedProduct && (
          <ModalEditProd
            isVisible={isProductModalVisible}
            selectedProduct={selectedProduct}
            onClose={closeProductModal}
            onQuantityChange={handleProductQuantityChange}
            onDeleteProduct={handleProductDelete}
          />
        )}

        <ModalSelectFact
          isVisible={isInvoiceModalVisible}
          onClose={() => setIsInvoiceModalVisible(false)}
          onSelect={handleInvoiceSelection}
        />

        <ModalOrderSaved
          isVisible={isOrderSavedModalVisible}
          onClose={() => setIsOrderSavedModalVisible(false)}
          onOrderSaved={() => {
            setIsOrderSavedModalVisible(false);
            handlePress('Home');
          }}
        />
      </View>
    </Modal>
  );
};

export default SaveOrder;
