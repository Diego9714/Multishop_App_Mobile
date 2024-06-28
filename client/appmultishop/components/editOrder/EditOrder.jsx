import React, { useState, useEffect } from 'react';
import { Text, View, Modal, Pressable, ScrollView, Alert } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../../styles/EditOrder.js';
import ModalEditProd from './modalEditProd';
import EditSelectFact from './EditSelectFact';
import SelectProducts from './SelectProducts';

const EditOrder = ({ isVisible, onClose, selectedOrder }) => {
  const [order, setOrder] = useState(null);
  const [originalOrder, setOriginalOrder] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isInvoiceModalVisible, setIsInvoiceModalVisible] = useState(false);
  const [invoiceType, setInvoiceType] = useState(null);
  const [totalUSD, setTotalUSD] = useState(0);
  const [totalBS, setTotalBS] = useState(0);
  const [isSelectProductsModalVisible, setIsSelectProductsModalVisible] = useState(false);
  const [cambioBolivares, setCambioBolivares] = useState(null);
  const [cambioDolares, setCambioDolares] = useState(null);
  const [cambioPesos, setCambioPesos] = useState(null);
  const [pdfUri, setPdfUri] = useState(null);

  useEffect(() => {
    const fetchCurrency = async () => {
      try {
        const storedCurrency = await AsyncStorage.getItem('currency');
        if (storedCurrency !== null) {
          const currencyArray = JSON.parse(storedCurrency);
          // console.log('Currency from asyncStorage:', currencyArray);

          // Buscar y almacenar el valor de cambio para cada moneda
          const bolivares = currencyArray.find(item => item.moneda === 'Bolivares');
          const dolares = currencyArray.find(item => item.moneda === 'Dolares');
          const pesos = currencyArray.find(item => item.moneda === 'Pesos');

          if (bolivares) {
            setCambioBolivares(bolivares.cambio);
            // console.log('Valor de cambio para Bolivares:', bolivares.cambio);
          }
          if (dolares) {
            setCambioDolares(dolares.cambio);
            // console.log('Valor de cambio para Dolares:', dolares.cambio);
          }
          if (pesos) {
            setCambioPesos(pesos.cambio);
            // console.log('Valor de cambio para Pesos:', pesos.cambio);
          }
        }
      } catch (error) {
        console.error('Error fetching currency from asyncStorage', error);
      }
    };

    fetchCurrency();
  }, []);

  const formatNumber = (number) => {
    return number.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  useEffect(() => {
    if (selectedOrder) {
      setOrder({ ...selectedOrder });
      setOriginalOrder({ ...selectedOrder });
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
      if (!order || !order.products || order.products.length === 0) {
        Alert.alert('Agrega al menos un producto antes de guardar.');
        return;
      }

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

  const handleCancelEdit = () => {
    setOrder({ ...originalOrder });
    updateTotal(originalOrder.products);
    onClose();
  };

  const handleGenerateAndSharePdf = async () => {
    if (!order || !order.products || order.products.length === 0) {
      Alert.alert('Agrega al menos un producto antes de guardar.');
      return;
    }

    const htmlContent = `
    <html>
    <head>
      <style>
        *{
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: Arial, sans-serif;
          background-color: #EFEFEF;
          padding: 15px;
        }
        .container {
          margin-top: 20px;
          padding: 20px;
        }
        .mainTitle {
          font-size: 22px;
          font-weight: bold;
          color: #373A40;
          text-align: center;
          margin-top: 10px;
          margin-bottom: 10px;
        }
        .detailedClientContainer {
          margin-top: 20px;
          margin-bottom: 20px;
          padding: 20px;
          background-color: #798CA0;
          border-radius: 20px;
          box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.3);
        }
        .nameInputDetailedClient{
          color: #FFFFFF;
          margin-left: 20px;
        }
        .infoClientContainer {
          margin: 10px;
          padding: 10px;
          background-color: #EFEFEF;
          border-radius: 20px;
          box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.3);
        }
        .textDetailedClient {
          color: #373A40;
        }
        .ProductContainer {
          background-color: #FFFFFF;
          border-radius: 20px;
          margin-top: 20px;
        }
        .headerProductContainer {
          background-color: #64a8d6;
          border-top-left-radius: 20px;
          border-top-right-radius: 20px;
          padding: 15px;
          margin-bottom: 10px;
        }
        .titleListContainer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px;
        }
        .titleListProduct{
          width: 50%;
          text-align: center;
          color: #FFFFFF;
        }
        .titleListQuantity{
          width: 25%;
          text-align: center;
          color: #FFFFFF;
        }
        .titleListPrice{
          width: 25%;
          text-align: center;
          color: #FFFFFF;
        }
        .selectedProductItem {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom-width: 1px;
          border-bottom-color: #ddd;
        }
        .nameProduct {
          width: 50%;
          text-align: center;
        }
        .quantityProduct, .priceProduct {
          width: 25%;
          text-align: center;
        }
        .exchangeRateContainer {
          display: flex;
          width: 100%;
          flex-direction: row;
          justify-content: center;
          margin-top: 35px;
          margin-bottom: 35px;
          gap: 20px;
        }
        .exchangeRateText {
          color: gray;
        }
        .containerPrice {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: 10px;
          margin-bottom: 10px;
        }
        .containerTitlePrice {
          width: 25%;
          text-align: left;
        }
        .titlePrice {
          font-size: 20px;
          margin-top: 10px;
        }
        .textPrice {
          font-size: 15px;
          margin-top: 10px;
        }
        .containerNote {
          width: 100%;
          margin-top: 30px;
        }
        .noteOrder {
          color: gray;
          text-align: justify;
        }      </style>
    </head>
    <body>
      <div class="container">
        <div class="mainTitle">Datos del Cliente</div>
        <div class="detailedClientContainer">
          <a class="nameInputDetailedClient">Nombre:</a>
          <div class="infoClientContainer">
            <div class="textDetailedClient">${order.nom_cli}</div>
          </div>
          <a class="nameInputDetailedClient">Rif:</a>
          <div class="infoClientContainer">
            <div class="textDetailedClient">${order.cod_cli}</div>
          </div>
          <a class="nameInputDetailedClient">Teléfono:</a>
          <div class="infoClientContainer">
            <div class="textDetailedClient">${order.tlf_cli}</div>
          </div>
          <a class="nameInputDetailedClient">Dirección:</a>
          <div class="infoClientContainer">
            <div class="textDetailedClient">${order.dir_cli}</div>
          </div>
          <a class="nameInputDetailedClient">Fecha del Pedido:</a>
          <div class="infoClientContainer">
            <div class="textDetailedClient">${fechaFormateada}</div>
          </div>
        </div>
        <div class="mainTitle">Tipo de Factura</div>
        <div class="detailedClientContainer">
          <div class="infoClientContainer">
            <div class="textDetailedClient">${selectedOrder.tipfac}</div>
          </div>
        </div>
        <div class="mainTitle">Productos Seleccionados</div>
        <div class="ProductContainer">
          <div class="headerProductContainer">
            <div class="titleListContainer">
              <div class="titleListProduct">Producto</div>
              <div class="titleListQuantity">Cantidad</div>
              <div class="titleListPrice">Precio</div>
            </div>
          </div>
          ${order.products.map(product => `
            <div class="selectedProductItem">
              <div class="nameProduct">${product.descrip}</div>
              <div class="quantityProduct">${product.quantity}</div>
              <div class="priceProduct">${formatNumber(product.quantity * product.priceUsd)}</div>
            </div>
          `).join('')}
        </div>
        <div class="exchangeRateContainer">
          <div class="exchangeRateText">Cambio USD: ${cambioDolares}</div>
          <div class="exchangeRateText">Cambio Bs.: ${cambioBolivares}</div>
        </div>
        <div class="containerPrice">
          <div class="containerTitlePrice">
            <div class="titlePrice">Total</div>
          </div>
          <div class="textPrice">USD : ${formatNumber(totalUSD)}</div>
          <div class="textPrice">Bs. : ${formatNumber(totalUSD * cambioBolivares)}</div>
          <div class="textPrice">Pesos : ${formatNumber(totalUSD * cambioPesos)}</div>
        </div>
        <div class="containerNote">
          <div class="noteOrder">Nota: Esta pre orden es considerada un presupuesto, por lo tanto los precios y las existencias están sujetas a cambios sin previo aviso.</div>
        </div>
      </div>
    </body>
    </html>`;
    
    try {
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      setPdfUri(uri);
      await Sharing.shareAsync(uri, { mimeType: 'application/pdf', UTI: '.pdf' });
    } catch (error) {
      console.error('Error generando o compartiendo el PDF:', error);
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
                <Text style={styles.nameInputDetailedClient}>Rif:</Text>
                <View style={styles.infoClientContainer}>
                  <Text style={styles.textDetailedClient}>{order.cod_cli}</Text>
                </View>
                <Text style={styles.nameInputDetailedClient}>Teléfono:</Text>
                <View style={styles.infoClientContainer}>
                  <Text style={styles.textDetailedClient}>{order.tlf_cli}</Text>
                </View>
                <Text style={styles.nameInputDetailedClient}>Dirección:</Text>
                <View style={styles.infoClientContainer}>
                  <Text style={styles.textDetailedClient}>{order.dir_cli}</Text>
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
                <Pressable
                  style={styles.infoClientContainer}
                  onPress={() => setIsInvoiceModalVisible(true)}
                >
                  <Text style={styles.textDetailedClient}>
                    {invoiceType ? invoiceType : selectedOrder.tipfac}
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

              <View style={styles.exchangeRateContainer}>
            <Text style={styles.exchangeRateText}>Cambio USD : {cambioDolares}</Text>
            <Text style={styles.exchangeRateText}>Cambio Bs. : {cambioBolivares}</Text>
            {/* <Text style={styles.exchangeRateText}>Cambio Pesos: {cambioPesos}</Text> */}
          </View>

              <View style={styles.containerPrice}>
                <View style={styles.containerTitlePrice}>
                  <Text style={styles.titlePrice}>Total: </Text>
                </View>
                <Text style={styles.textPrice}>USD : {formatNumber(totalUSD)}</Text>
                <Text style={styles.textPrice}>Bs. : {formatNumber(totalUSD * 36.372)}</Text>
                <Text style={styles.textPrice}>Pesos : {formatNumber(totalUSD * 3700)}</Text>
              </View>

              <View style={styles.containerNote}>
                <Text style={styles.noteOrder}>Nota: Esta pre orden es considerada un presupuesto, por lo tanto los precios y las existencias están sujetas a cambios sin previo aviso.</Text>
              </View>
              <View style={styles.selectProdContainer}>
                <Pressable style={styles.otherButton} onPress={() => setIsSelectProductsModalVisible(true)}>
                  <Text style={styles.buttonText}>Agregar otros Productos</Text>
                </Pressable>
              </View>

              <View style={styles.containerButton}>
                <Pressable onPress={saveOrder} style={styles.otherButton}>
                  <Text style={styles.buttonText}>Guardar</Text>
                </Pressable>
                <Pressable onPress={handleGenerateAndSharePdf} style={styles.otherButton}>
                  <Text style={styles.buttonText}>PDF</Text>
                </Pressable>
                <Pressable onPress={handleCancelEdit} style={styles.closeButton}>
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
          onDeleteProduct={() => handleProductDelete(selectedProduct.codigo)}
        />
      )}

      <SelectProducts
        isVisible={isSelectProductsModalVisible}
        onClose={() => setIsSelectProductsModalVisible(false)}
        selectedOrder={order}
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
