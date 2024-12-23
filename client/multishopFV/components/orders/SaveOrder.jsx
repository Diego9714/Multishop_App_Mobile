// Dependencies
import React, { useState, useEffect } from 'react'
import { Text, View, Modal, Pressable, ScrollView, 
  Alert, ImageBackground }            from 'react-native'
import AsyncStorage                   from '@react-native-async-storage/async-storage'
import { useNavigation }              from '@react-navigation/native'
import * as Location                  from 'expo-location'
// Modals And Components
import ModalSelectFact                from './modalSelectFact'
import ModalEditProd                  from './modalEditProd'
import ModalOrderSaved                from './ModalOrderSaved'
// Styles
import styles                         from '../../styles/SaveOrder.styles'
import { images }                     from '../../constants'
// PDF
import * as Print                     from 'expo-print'
import * as Sharing                   from 'expo-sharing'
import * as FileSystem                from 'expo-file-system'
// Token - JWT
import { jwtDecode }                  from 'jwt-decode'
import { decode }                     from 'base-64'
global.atob = decode

const SaveOrder = ({ isVisible, onClose, client, order, onQuantityChange, onDeleteProduct }) => {
  const [isProductModalVisible, setIsProductModalVisible] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [invoiceType, setInvoiceType] = useState(null)
  const [isInvoiceModalVisible, setIsInvoiceModalVisible] = useState(false)
  const [isOrderSavedModalVisible, setIsOrderSavedModalVisible] = useState(false)
  const [products, setProducts] = useState([])
  const [totalPriceUsd, setTotalPriceUsd] = useState(0)
  const [totalPriceBs, setTotalPriceBs] = useState(0)
  const [cambioBolivares, setCambioBolivares] = useState(null)
  const [cambioDolares, setCambioDolares] = useState(null)
  const [cambioPesos, setCambioPesos] = useState(null)
  const [pdfUri, setPdfUri] = useState(null)
  const navigation = useNavigation()
  const [company, setCompany] = useState([])
  const [location, setLocation] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        setErrorMsg('Permiso de ubicación denegado')
        return
      }

      let location = await Location.getCurrentPositionAsync({})
      setLocation(location)
    })()
  }, [])

  useEffect(() => {
    if (order && order.products) {
      setProducts(order.products)
    }
  }, [order])

  useEffect(()=>{
    const getCompany = async() =>{
      let company = await AsyncStorage.getItem('company')
      setCompany(company)
    }

    getCompany()
  }, [])

  useEffect(() => {
    const fetchCurrency = async () => {
      try {
        const storedCurrency = await AsyncStorage.getItem('currency')
        if (storedCurrency !== null) {
          const currencyArray = JSON.parse(storedCurrency)
          const bolivares = currencyArray.find(item => item.moneda === 'Bolivares')
          const dolares = currencyArray.find(item => item.moneda === 'Dolares')
          const pesos = currencyArray.find(item => item.moneda === 'Pesos')

          if (bolivares) {
            setCambioBolivares(bolivares.cambio)
          }
          if (dolares) {
            setCambioDolares(dolares.cambio)
          }
          if (pesos) {
            setCambioPesos(pesos.cambio)
          }
        }
      } catch (error) {
        console.error('Error fetching currency from asyncStorage', error)
      }
    }

    fetchCurrency()
  }, [])

  const openProductModal = (product) => {
    setSelectedProduct(product)
    setIsProductModalVisible(true)
  }

  const closeProductModal = () => {
    setIsProductModalVisible(false)
    setSelectedProduct(null)
  }

  const handleInvoiceSelection = (type) => {
    setInvoiceType(type)
    setIsInvoiceModalVisible(false)
  }

  const handleProductQuantityChange = (productId, newQuantity) => {
    onQuantityChange(productId, newQuantity)
    const updatedProducts = products.map(product =>
      product.codigo === productId ? { ...product, quantity: newQuantity } : product
    )
    setProducts(updatedProducts)
  }

  const handleProductDelete = (productId) => {
    const updatedProducts = products.filter(product => product.codigo !== productId)
    setProducts(updatedProducts)

    if (onDeleteProduct) {
      onDeleteProduct(productId)
    }
    closeProductModal()
  }

  useEffect(() => {
    if (products && products.length > 0) {
      let totalUsd = 0
      let totalBs = 0
      products.forEach(product => {
        totalUsd += product.quantity * product.priceUsd
        totalBs += product.quantity * product.priceBs
      })
      setTotalPriceUsd(parseFloat(totalUsd.toFixed(2)))
      setTotalPriceBs(parseFloat(totalBs.toFixed(2)))
    } else {
      setTotalPriceUsd(0)
      setTotalPriceBs(0)
    }
  }, [products])

  const formatNumber = (number) => {
    return number.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  const handlePress = (screenName) => {
    navigation.navigate(screenName)
  }

  const generateRandomProductId = () => {
    const randomNumber = Math.floor(Math.random() * 100000)
    const timestamp = Date.now()
    return `${timestamp}-${randomNumber}`
  }

  const handleSaveOrder = async () => {
    if (!invoiceType) {
      Alert.alert('Error', 'Debe seleccionar el tipo de factura')
      return
    }
  
    if (products.length === 0) {
      Alert.alert('Error', 'Debe seleccionar al menos un producto')
      return
    }
  
    let token = await AsyncStorage.getItem('tokenUser')
    const decodedToken = jwtDecode(token)

    let prodExistence = decodedToken.prodExistence

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    };
  
    const fecha = new Date().toISOString();
    const formattedDate = formatDate(fecha);
  
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
        exists: product.quantity,
        quantity: product.quantity,
        priceUsd: product.priceUsd,
        priceBs: (product.priceUsd * cambioBolivares).toFixed(2),
      })),
      tipfac: invoiceType,
      totalUsd: parseFloat(totalPriceUsd),
      totalBs: parseFloat((totalPriceUsd * cambioBolivares).toFixed(2)),
      fecha: formattedDate,
      prodExistence : prodExistence,
      ubicacion: location ? { lat: location.coords.latitude, lon: location.coords.longitude } : null
    }

    try {
      const existingOrders = await AsyncStorage.getItem('OrdersClient')
      const orders = existingOrders ? JSON.parse(existingOrders) : []
      orders.push(orderData)
      await AsyncStorage.setItem('OrdersClient', JSON.stringify(orders))
  
      // Actualizar existencias en la lista de productos solo si prodExistence != 0
      if (prodExistence !== 0) {
        const productsInfo = await AsyncStorage.getItem('products')
        const productList = productsInfo ? JSON.parse(productsInfo) : []
  
        const updatedProductList = productList.map(prod => {
          const orderedProduct = products.find(p => p.codigo === prod.codigo)
          if (orderedProduct) {
            return { ...prod, existencia: prod.existencia - orderedProduct.quantity }
          }
          return prod
        })
  
        await AsyncStorage.setItem('products', JSON.stringify(updatedProductList))
      }
  
      setIsOrderSavedModalVisible(true) // Mostrar el modal de confirmación
    } catch (error) {
      console.error('Error saving order:', error)
    }
  }
  

  const generatePdfFileName = () => {
    return `Pedido_${generateRandomProductId()}.pdf`
  }
  

  const handleGenerateAndSharePdf = async () => {
    if (!invoiceType) {
      Alert.alert('Error', 'Debe seleccionar el tipo de factura')
      return
    }
  
    if (products.length === 0) {
      Alert.alert('Error', 'Debe seleccionar al menos un producto')
      return
    }

    let dataCompany = JSON.parse(company)
  
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
        background-color: #f2f2f2;
      }
      
      .datePdf{
        text-align: right;
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
      
      .itemProd{
        text-align: left;
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
              <td><strong>${dataCompany[0].nom_emp}</strong></td>
              <td class="datePdf">Fecha: ${new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}</td>
            </tr>
    
            <tr class="date">
              <td colspan="2"><strong>${dataCompany[0].rif_emp}</strong></td>
            </tr>
            
            <td colspan="2"/>
            <tr>
              <td class="clientData"><strong>Datos del Cliente</strong></td>
              <td class="orderNro"><strong>Pedido Nro: ${generateRandomProductId()}</strong></td>
            </tr>
          </thead>
          <tbody>
            <tr>
                <td><strong>Nombre:</strong> ${client.nom_cli}</td>
                <td></td>
            </tr>
            <tr>
                <td><strong>Rif:</strong> ${client.cod_cli}</td>
                <td></td>
            </tr>
            <tr>
              <td><strong>Teléfono:</strong> ${client.tel_cli}</td>
              <td></td>
            </tr>
            <tr>
              <td><strong>Dirección:</strong> ${client.dir1_cli}</td>
              <td class="tipfac"><strong>Tipo de Factura:</strong> ${invoiceType ? invoiceType : '--- Seleccionar ---'} 
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
              ${products.map(product => `
                <tr>
                    <td class="itemProd">${product.descrip}</td>
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
                  <td class="item">${formatNumber(totalPriceUsd)}</td>
              </tr>
              <tr>
                  <td><strong>Tasa USD:</strong> ${cambioBolivares}</td>
                  <td class="item">Bs.:</td>
                  <td class="item">${formatNumber(totalPriceUsd * cambioBolivares)}</td>
              </tr>
              <tr>
                <td></td>
                <td class="item">Pesos:</td>
                <td class="item">${formatNumber(totalPriceUsd * cambioPesos)}</td>
              </tr>
          </tbody>
      </table>
        <p class="note">
          Nota: ${dataCompany[0].noteOrder}
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

  return (
    <Modal visible={isVisible} animationType="slide">
      <ImageBackground
        source={images.fondo}
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
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Text style={styles.buttonText}>Regresar</Text>
            </Pressable>

            <Pressable onPress={handleGenerateAndSharePdf} style={styles.otherButton}>
              <Text style={styles.buttonText}>PDF</Text>
            </Pressable>

            <Pressable onPress={handleSaveOrder} style={styles.otherButton}>
              <Text style={styles.buttonText}>Guardar</Text>
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
      </ImageBackground>
    </Modal>
  );
};

export default SaveOrder;
