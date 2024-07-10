// Dependencies
import React, { useState, useEffect } from 'react';
import { Text, View, Modal, 
Pressable, ScrollView, Alert }        from 'react-native';
import AsyncStorage                   from '@react-native-async-storage/async-storage';
import { useNavigation }              from '@react-navigation/native';
import { LinearGradient }             from 'expo-linear-gradient';
// Modals And Components
import ModalSelectFact                from './modalSelectFact';
import ModalEditProd                  from './modalEditProd';
import ModalOrderSaved                from './ModalOrderSaved';
// Styles
import styles                         from '../../styles/SaveOrder.styles';
// PDF
import * as Print                     from 'expo-print';
import * as Sharing                   from 'expo-sharing';
// Token - JWT
import { jwtDecode }                  from 'jwt-decode';
import { decode }                     from 'base-64';
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
  const [cambioBolivares, setCambioBolivares] = useState(null);
  const [cambioDolares, setCambioDolares] = useState(null);
  const [cambioPesos, setCambioPesos] = useState(null);
  const [pdfUri, setPdfUri] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    if (order && order.products) {
      setProducts(order.products);
    }
  }, [order]);

  useEffect(() => {
    const fetchCurrency = async () => {
      try {
        const storedCurrency = await AsyncStorage.getItem('currency');
        if (storedCurrency !== null) {
          const currencyArray = JSON.parse(storedCurrency);
          const bolivares = currencyArray.find(item => item.moneda === 'Bolivares');
          const dolares = currencyArray.find(item => item.moneda === 'Dolares');
          const pesos = currencyArray.find(item => item.moneda === 'Pesos');

          if (bolivares) {
            setCambioBolivares(bolivares.cambio);
          }
          if (dolares) {
            setCambioDolares(dolares.cambio);
          }
          if (pesos) {
            setCambioPesos(pesos.cambio);
          }
        }
      } catch (error) {
        console.error('Error fetching currency from asyncStorage', error);
      }
    };

    fetchCurrency();
  }, []);

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

  const formatNumber = (number) => {
    return number.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

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

    let token = await AsyncStorage.getItem('tokenUser');
    const decodedToken = jwtDecode(token);

    const orderData = {
      id_order: generateRandomProductId(),
      id_scli: client.id_scli,
      cod_cli: client.cod_cli,
      nom_cli: client.nom_cli,
      tlf_cli: client.tel_cli,
      dir_cli: client.dir1_cli,
      cod_ven: decodedToken.cod_ven,
      products: products.map(product => ({
        codigo: product.codigo,
        descrip: product.descrip,
        exists: product.quantity, // Recalcular la existencia
        quantity: product.quantity,
        priceUsd: product.priceUsd,
        priceBs: (product.priceUsd * cambioBolivares).toFixed(2),
      })),
      tipfac: invoiceType,
      totalUsd: parseFloat(totalPriceUsd),
      totalBs: parseFloat((totalPriceUsd * cambioBolivares).toFixed(2)),
      fecha: new Date().toISOString(),
    };

    try {
      const existingOrders = await AsyncStorage.getItem('OrdersClient');
      const orders = existingOrders ? JSON.parse(existingOrders) : [];
      orders.push(orderData);
      await AsyncStorage.setItem('OrdersClient', JSON.stringify(orders));

      // Actualizar existencias en la lista de productos
      const productsInfo = await AsyncStorage.getItem('products');
      const productList = productsInfo ? JSON.parse(productsInfo) : [];

      const updatedProductList = productList.map(prod => {
        const orderedProduct = products.find(p => p.codigo === prod.codigo);
        // console.log(orderedProduct)
        if (orderedProduct) {

          // console.log(prod.existencia - orderedProduct.quantity)

          // console.log(`Producto encontrado y actualizado: ${prod.descrip}, Existencia actual: ${prod.exists}, Cantidad ordenada: ${orderedProduct.quantity}`);
          return { ...prod, existencia: prod.existencia - orderedProduct.quantity };

        }
        return prod;
      });

      await AsyncStorage.setItem('products', JSON.stringify(updatedProductList));

      setIsOrderSavedModalVisible(true); // Mostrar el modal de confirmación
    } catch (error) {
      console.error('Error saving order:', error);
    }
  };

  const handleGenerateAndSharePdf = async () => {
    if (!invoiceType) {
      Alert.alert('Error', 'Debe seleccionar el tipo de factura');
      return;
    }

    if (products.length === 0) {
      Alert.alert('Error', 'Debe seleccionar al menos un producto');
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
          background: linear-gradient(to right, #ffff, #9bdef6, #ffffff, #9bdef6);
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
          background-color: rgba(255, 255, 255, 0.5);
          border-radius: 20px;
          box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.3);
        }
        .nameInputDetailedClient{
          color: #4d4d4d;
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
          background-color: rgba(255, 255, 255, 0.5);
          border-radius: 20px;
          margin-top: 20px;
        }
        .headerProductContainer {
          background-color: #38B0DB;
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
        }      
  </style>
    </head>
    <body>
      <div class="container">
        <div class="mainTitle">Datos del Cliente</div>
        <div class="detailedClientContainer">
          <a class="nameInputDetailedClient">Nombre:</a>
          <div class="infoClientContainer">
            <div class="textDetailedClient">${client.nom_cli}</div>
          </div>
          <a class="nameInputDetailedClient">Rif:</a>
          <div class="infoClientContainer">
            <div class="textDetailedClient">${client.rif_cli}</div>
          </div>
          <a class="nameInputDetailedClient">Teléfono:</a>
          <div class="infoClientContainer">
            <div class="textDetailedClient">${client.tel_cli}</div>
          </div>
          <a class="nameInputDetailedClient">Dirección:</a>
          <div class="infoClientContainer">
            <div class="textDetailedClient">${client.dir1_cli}</div>
          </div>
        </div>
        <div class="mainTitle">Tipo de Factura</div>
        <div class="detailedClientContainer">
          <div class="infoClientContainer">
            <div class="textDetailedClient">${invoiceType ? invoiceType : '--- Seleccionar ---'}</div>
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
          ${products.map(product => `
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
          <div class="textPrice">USD : ${formatNumber(totalPriceUsd)}</div>
          <div class="textPrice">Bs. : ${formatNumber(totalPriceUsd * cambioBolivares)}</div>
          <div class="textPrice">Pesos : ${formatNumber(totalPriceUsd * cambioPesos)}</div>
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
  
  const handleSharePdf = async () => {
    if (!pdfUri) {
      console.error('No hay un archivo PDF para compartir.');
      return;
    }

    try {
      await Sharing.shareAsync(pdfUri, { mimeType: 'application/pdf', UTI: '.pdf' });
    } catch (error) {
      console.error('Error al compartir el PDF:', error);
    }
  };

  return (
    <Modal visible={isVisible} animationType="slide">
      <LinearGradient
      colors={['#ffff', '#9bdef6', '#ffffff', '#9bdef6']}
      style={styles.gradientBackground}
      >
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
                  <Text style={styles.priceProduct}>{formatNumber(product.quantity * product.priceUsd)}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          <View style={styles.exchangeRateContainer}>
            <Text style={styles.exchangeRateText}>Cambio USD: {cambioDolares}</Text>
            <Text style={styles.exchangeRateText}>Cambio Bs.: {cambioBolivares}</Text>
          </View>

          <View style={styles.containerPrice}>
            <View style={styles.containerTitlePrice}>
              <Text style={styles.titlePrice}>Total</Text>
            </View>
            <Text style={styles.textPrice}>USD : {formatNumber(totalPriceUsd)}</Text>
            <Text style={styles.textPrice}>Bs. : {formatNumber(totalPriceUsd * cambioBolivares)}</Text>
            <Text style={styles.textPrice}>Pesos : {formatNumber(totalPriceUsd * cambioPesos)}</Text>
          </View>

          <View style={styles.containerNote}>
            <Text style={styles.noteOrder}>Nota: Esta pre orden es considerada un presupuesto, por lo tanto los precios y las existencias están sujetas a cambios sin previo aviso.</Text>
          </View>

          <View style={styles.containerButton}>
            <Pressable onPress={handleSaveOrder} style={styles.otherButton}>
              <Text style={styles.buttonText}>Guardar</Text>
            </Pressable>

            <Pressable onPress={handleGenerateAndSharePdf} style={styles.otherButton}>
              <Text style={styles.buttonText}>PDF</Text>
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
      </LinearGradient>
    </Modal>
  );
};

export default SaveOrder;
