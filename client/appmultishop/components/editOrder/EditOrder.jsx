import React, { useState, useEffect } from 'react';
import { Text, View, Modal, Pressable, ScrollView, Alert } from 'react-native';
import { LinearGradient }             from 'expo-linear-gradient';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem                from 'expo-file-system';
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
        product.codigo === productId ? { ...product, quantity: newQuantity} : product
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
  
        if (order.prodExistence !== 0) {
        // Actualizar existencias en la lista de productos
        const productsInfo = await AsyncStorage.getItem('products');
        const productList = productsInfo ? JSON.parse(productsInfo) : [];
  
        // Obtener la lista original de productos del pedido
        const originalOrder = ordersClient.find(orderItem => orderItem.id_order === order.id_order);

        // Comparar productos eliminados
        const deletedProducts = originalOrder.products.filter(
          origProd => !order.products.find(newProd => newProd.codigo === origProd.codigo)
        );

        // Actualizar existencias en la lista de productos
        const updatedProductList = productList.map(prod => {
          const orderedProduct = order.products.find(p => p.codigo === prod.codigo);
          if (orderedProduct) {

            return {
              ...prod,
              existencia: (orderedProduct.exists + prod.existencia) - orderedProduct.quantity
            };
          } else {
            // Si el producto fue eliminado, restaurar la existencia
            const isDeleted = deletedProducts.some(delProd => delProd.codigo === prod.codigo);
            if (isDeleted) {

              // console.log(prod.existencia + originalOrder.products.find(p => p.codigo === prod.codigo).quantity)

              return {
                ...prod,
                existencia: prod.existencia + originalOrder.products.find(p => p.codigo === prod.codigo).quantity
              };
            }
          }
          return prod;
        });

        await AsyncStorage.setItem('products', JSON.stringify(updatedProductList));

  
        // Actualizar existencias en los productos del pedido
        const updatedOrderProducts = order.products.map(product => {
          const prodInStorage = productList.find(p => p.codigo === product.codigo);
          if (prodInStorage) {
            return { ...product, exists: product.quantity };
          }
          return product;
        });
  
        const finalUpdatedOrders = updatedOrders.map(orderItem => {
          if (orderItem.id_order === order.id_order) {
            return {
              ...orderItem,
              products: updatedOrderProducts
            };
          }
          return orderItem;
        });
  
        await AsyncStorage.setItem('OrdersClient', JSON.stringify(finalUpdatedOrders));
        }
  
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

  const generatePdfFileName = () => {
    return `Pedido_${selectedOrder.id_order}.pdf`;
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
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
    }
    
    .receipt {
      max-width: 800px;
      margin: 20px auto;
      background-color: #fff;
      padding: 20px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    
    .date td{
      text-align: right;
    
      background-color: #f2f2f2;
    }
    
    
    .clientData{
      text-align: left;
      background-color: #f2f2f2;
    }
    
    .title{
      text-align: center;
      background-color: #f2f2f2;
    }
    
    .title , .orderNro, .tiposCambio , .totales{
      background-color: #f2f2f2;
    }
    
    .orderNro , .tipfac{
      text-align: right;
    }
    
    .item{
      text-align: center;
    }
    
    .table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    
    .table td {
      border: 1px solid #ddd;
      padding: 8px;
    }
    
    .table th {
      background-color: #f2f2f2;
    }
    
    .note {
      font-size: 12px;
      color: #666;
      text-align: center;
    }
    </style>
    </head>
    <body>
      <div class="receipt">
        <table class="table">
          <thead>
            <tr class="date">
              <td colspan="2">Fecha: ${fechaFormateada}</td>
            </tr>
            <td colspan="2"/>
            <tr>
              <td class="clientData"><strong>Datos del Cliente</strong></td>
              <td class="orderNro"><strong>Pedido Nro: ${selectedOrder.id_order}</strong></td>
            </tr>
          </thead>
          <tbody>
            <tr>
                <td><strong>Nombre:</strong> ${order.nom_cli}</td>
                <td></td>
            </tr>
            <tr>
                <td><strong>Rif:</strong> ${order.cod_cli}</td>
                <td></td>
            </tr>
            <tr>
              <td><strong>Teléfono:</strong> ${order.tlf_cli}</td>
              <td></td>
            </tr>
            <tr>
              <td><strong>Dirección:</strong> ${order.dir_cli}</td>
              <td class="tipfac"><strong>Tipo de Factura:</strong> ${selectedOrder.tipfac}</td>
            </tr>
              </tr>
          </tbody>
        </table>
        <table class="table">
            <thead>
                <tr>
                    <td class="title"><strong>Producto</strong></td>
                    <td class="title"><strong>Cantidad</strong></td>
                    <td class="title"><strong>Precio</strong></td>
                    <td class="title"><strong>Subtotal</strong></td>
                </tr>
            </thead>
    
            <tbody>
              ${order.products.map(product => `
                <tr>
                    <td class="item">${product.descrip}</td>
                    <td class="item">${product.quantity}</td>
                    <td class="item">${formatNumber(product.priceUsd)}</td>
                    <td class="item">${formatNumber(product.quantity * product.priceUsd)}</td>
                </tr>
                `).join('')}
                </tr>
            </tbody>
        </table>
        <table class="table">
            <thead>
                <tr>
                    <td class="tiposCambio"><strong>Tipos de Cambio</strong></td>
                    <td class="totales" colspan="2"><strong>Totales</strong></td>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><strong>Tasa COP:</strong> ${cambioDolares}</td>
                    <td class="item">USD:</td>
                    <td class="item">${formatNumber(totalUSD)}</td>
                </tr>
                <tr>
                    <td><strong>Tasa USD:</strong> ${cambioBolivares}</td>
                    <td class="item">Bs.:</td>
                    <td class="item">${formatNumber(totalUSD * cambioBolivares)}</td>
                </tr>
                <tr>
                  <td></td>
                  <td class="item">Pesos:</td>
                  <td class="item">${formatNumber(totalUSD * cambioPesos)}</td>
                </tr>
            </tbody>
        </table>
        <p class="note">
          Nota: Esta pre orden es considerada un presupuesto, por lo tanto los precios y las existencias están sujetas a cambios sin previo aviso.
        </p>
      </div>
    </body>
    </html>`;
    
    try {
      const fileName = generatePdfFileName(); // Obtén el nombre del archivo personalizado
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      
      // Renombra el archivo PDF
      const fileUriWithName = `${uri.substring(0, uri.lastIndexOf('/') + 1)}${fileName}`;
      await FileSystem.moveAsync({
        from: uri,
        to: fileUriWithName,
      });
  
      setPdfUri(fileUriWithName);
      await Sharing.shareAsync(fileUriWithName, { mimeType: 'application/pdf', UTI: '.pdf' });
    } catch (error) {
      console.error('Error generando o compartiendo el PDF:', error);
    }
  };

  const fechaFormateada = order && order.fecha ? new Date(order.fecha).toISOString().split('T')[0] : '';

  return (
    <Modal visible={isVisible} animationType="slide">
      <LinearGradient
      colors={['#ffff', '#9bdef6', '#ffffff', '#9bdef6']}
      style={styles.gradientBackground}
      >
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
              <Text style={styles.exchangeRateText}>Tasa COP: {cambioDolares}</Text>
              <Text style={styles.exchangeRateText}>Tasa USD: {cambioBolivares}</Text>
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
                  <Pressable onPress={handleCancelEdit} style={styles.closeButton}>
                    <Text style={styles.buttonText}>Salir</Text>
                  </Pressable>
                  <Pressable onPress={handleGenerateAndSharePdf} style={styles.otherButton}>
                    <Text style={styles.buttonText}>PDF</Text>
                  </Pressable>
                  <Pressable onPress={saveOrder} style={styles.otherButton}>
                    <Text style={styles.buttonText}>Guardar</Text>
                  </Pressable>
                </View>
              </View>
            ) : (
              <Text>No se ha seleccionado ningún pedido.</Text>
            )}
          </ScrollView>

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

        </View>
      </LinearGradient>
    </Modal>
  );
};

export default EditOrder;
