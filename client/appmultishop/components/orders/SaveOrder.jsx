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
      body {
        font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
        text-align: center;
        background-color: #f0f0f0;
        padding: 20px;
        margin: 0;
      }
    
      .invoice-box {
        max-width: 800px;
        margin: auto;
        background-color: #fff;
        border: 1px solid #ccc;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        font-size: 16px;
        line-height: 24px;
        padding: 30px;
      }
    
      .grid-container {
        width: 100%;
        border-collapse: collapse;
      }
    
      .grid-container td {
        padding: 10px;
        border: 1px solid #ddd;
        text-align: center;
      }
    
      .grid-container .information {
        background-color: #f2f2f2;
      }
    
      .grid-container .heading {
        background-color: #f2f2f2;
        font-weight: bold;
        text-align: center;
      }
    
      .grid-container .details td:first-child {
        font-weight: bold;
      }
    
      .grid-container .item td:nth-child(2),
      .grid-container .total td:nth-child(2) {
        font-weight: bold;
      }
    
      .grid-container .note {
        font-style: italic;
        color: #777;
        text-align: center;
      }
    </style>
    </head>
    <body>
      <div class="invoice-box">
          <table class="grid-container">
              <tr class="information">
                  <td colspan="3">
                      Fecha: ${new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                  </td>
              </tr>
              
              <tr class="heading">
                  <td colspan="3">
                      Datos del Cliente
                  </td>
              </tr>
              
              <tr class="details">
                  <td>Nombre:</td>
                  <td colspan="2">${client.nom_cli}</td>
              </tr>
              <tr class="details">
                  <td>Rif:</td>
                  <td colspan="2">${client.rif_cli}</td>
              </tr>
              <tr class="details">
                  <td>Teléfono:</td>
                  <td colspan="2">${client.tel_cli}</td>
              </tr>
              <tr class="details">
                  <td>Dirección:</td>
                  <td colspan="2">${client.dir1_cli}</td>
              </tr>
    
              <tr class="heading">
                  <td colspan="3">
                      Tipo de Factura
                  </td>
              </tr>
              <tr class="details">
                  <td colspan="3">${invoiceType ? invoiceType : '--- Seleccionar ---'}</td>
              </tr>
    
              <tr class="heading">
                  <td>Producto</td>
                  <td>Cantidad</td>
                  <td>Precio</td>
              </tr>
              ${products.map(product => `
              <tr class="item">
                  <td>${product.descrip}</td>
                  <td>${product.quantity}</td>
                  <td>${formatNumber(product.priceUsd)}</td>
              </tr>
              `).join('')}
              
              <tr class="heading">
                  <td colspan="3">
                      Tipos de Cambio
                  </td>
              </tr>
              <tr class="details">
                  <td>Tasa COP:</td>
                  <td colspan="2">${cambioDolares}</td>
              </tr>
              <tr class="details">
                  <td>Tasa USD:</td>
                  <td colspan="2">${cambioBolivares}</td>
              </tr>
              
              <tr class="heading">
                  <td colspan="3">Totales</td>
              </tr>
              <tr class="total">
                  <td>USD:</td>
                  <td colspan="2">${formatNumber(totalPriceUsd)}</td>
              </tr>
              <tr class="total">
                  <td>Bs.:</td>
                  <td colspan="2">${formatNumber(totalPriceUsd * cambioBolivares)}</td>
              </tr>
              <tr class="total">
                  <td>Pesos:</td>
                  <td colspan="2">${formatNumber(totalPriceUsd * cambioPesos)}</td>
              </tr>
              
              <tr class="note">
                  <td colspan="3">
                      Nota: Esta pre orden es considerada un presupuesto, por lo tanto los precios y las existencias están sujetas a cambios sin previo aviso.
                  </td>
              </tr>
          </table>
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
            <Text style={styles.mainTitleOne}>Finalizar Pedido</Text>
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
            <Text style={styles.exchangeRateText}>Tasa COP: {cambioDolares}</Text>
            <Text style={styles.exchangeRateText}>Tasa USD: {cambioBolivares}</Text>
          </View>

          <View style={styles.containerPrice}>
            <View style={styles.containerTitlePrice}>
              <Text style={styles.titlePrice}>Totales</Text>
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
