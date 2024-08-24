import React, { useState, useEffect } from 'react';
import { Text, View, Modal, Pressable, ScrollView, Alert, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import styles from '../../styles/EditOrder.js';
import { images } from '../../constants';

const ViewOrder = ({ isVisible, onClose, selectedOrder }) => {
  const [order, setOrder] = useState(null);
  const [totalUSD, setTotalUSD] = useState(0);
  const [totalBS, setTotalBS] = useState(0);
  const [pdfUri, setPdfUri] = useState(null);
  const [company, setCompany] = useState([]);
  const [cambioBolivares, setCambioBolivares] = useState(1); // Default value or fetch from another source
  const [cambioDolares, setCambioDolares] = useState(1); // Default value or fetch from another source

  useEffect(() => {
    if (selectedOrder) {
      setOrder({ ...selectedOrder });
      updateTotal(selectedOrder.products);
    }
  }, [selectedOrder]);

  useEffect(()=>{
    const getCompany = async() =>{
      let company = await AsyncStorage.getItem('company')
      setCompany(company)
    }

    getCompany()

    const intervalId = setInterval(() => {
      getCompany();
    }, 3000);

    return () => clearInterval(intervalId);
  }, [])

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

  const formatNumber = (number) => {
    return number.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const generatePdfFileName = () => {
    return `Pedido_${selectedOrder.id_order}.pdf`;
  };

  const handleGenerateAndSharePdf = async () => {
    if (!order || !order.products || order.products.length === 0) {
      Alert.alert('Agrega al menos un producto antes de guardar.');
      return;
    }

    let dataCompany = JSON.parse(company)

    // console.log(dataCompany[0].rif_emp)

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
              <td class="datePdf">Fecha: ${order.fecha}</td>
            </tr>

            <tr class="date">
              <td colspan="2"><strong>${dataCompany[0].rif_emp}</strong></td>
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
              <td class="tipfac"><strong>Orden de Pedido</strong></td>
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
                    <td class="totales" colspan="2"><strong>Totales</strong></td>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="item" colspan="2">USD:</td>
                    <td class="item">${formatNumber(totalUSD)}</td>
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

  return (
    <Modal visible={isVisible} animationType="slide">
      <ImageBackground
        source={images.fondo}
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
                </View>

                <View style={styles.detailedClientContainerFac}>
                  <View
                    style={styles.infoClientContainer}
                    >
                    <Text style={styles.textDetailedClient}>
                      {order.tipfac}
                    </Text>
                  </View>
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
                      <View key={index} style={styles.selectedProductItem}>
                        <Text style={styles.nameProduct}>{product.descrip}</Text>
                        <Text style={styles.quantityProduct}>{product.quantity}</Text>
                        <Text style={styles.priceProduct}>{product.priceUsd}</Text>
                      </View>
                    ))}
                  </View>
                  </View>

                  <View style={styles.containerPrice}>
                    <View style={styles.containerTitlePrice}>
                      <Text style={styles.titlePrice}>Total: </Text>
                    </View>
                    <Text style={styles.textPrice}>USD : {formatNumber(totalUSD)}</Text>
                  </View>


                  <View style={styles.containerNote}>
                  <Text style={styles.noteOrder}>Nota: Esta pre orden es considerada un presupuesto, por lo tanto los precios y las existencias están sujetas a cambios sin previo aviso.</Text>
                </View>

                <View style={styles.containerButton}>
                  <Pressable onPress={onClose} style={styles.closeButton}>
                    <Text style={styles.buttonText}>Salir</Text>
                  </Pressable>
                  <Pressable onPress={handleGenerateAndSharePdf} style={styles.otherButton}>
                    <Text style={styles.buttonText}>PDF</Text>
                  </Pressable>
                </View>

              </View>
            ) : (
              <Pressable onPress={onClose} style={styles.closeButton}>
                <Text style={styles.buttonText}>Salir</Text>
              </Pressable>
          
            )}
          </ScrollView>
        </View>
      </ImageBackground>
    </Modal>
  );
};

export default ViewOrder;
