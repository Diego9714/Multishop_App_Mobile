import React, { useState, useEffect } from 'react';
import { Text, View, Pressable, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../../styles/ListProducts.styles';

const ModalProduct = ({ isVisible, onClose, product }) => {
  const [currency, setCurrency] = useState([]);
  const [cambioBolivares, setCambioBolivares] = useState(null);
  const [cambioDolares, setCambioDolares] = useState(null);
  const [cambioPesos, setCambioPesos] = useState(null);

  useEffect(() => {
    const fetchCurrency = async () => {
      try {
        const storedCurrency = await AsyncStorage.getItem('currency');
        if (storedCurrency !== null) {
          const currencyArray = JSON.parse(storedCurrency);
          setCurrency(currencyArray);

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
    return new Intl.NumberFormat('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(number);
  };

  if (!product) return null;

  return (
    <Modal visible={isVisible} animationType="fade" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.titleModal}>{product.descrip}</Text>
          <Text style={styles.subtitleModal}>Existencia</Text>
          <View style={styles.modalInfoClient}>
            <Text style={styles.textModal}>{product.existencia}</Text>
          </View>
          <Text style={styles.subtitleModal}>Precio(Bs)</Text>
          <View style={styles.modalInfoClient}>
            <Text style={styles.textModal}>{formatNumber(product.precioUsd * cambioBolivares)}</Text>
          </View>
          <Text style={styles.subtitleModal}>Precio(Usd)</Text>
          <View style={styles.modalInfoClient}>
            <Text style={styles.textModal}>{formatNumber(product.precioUsd)}</Text>
          </View>
          <Text style={styles.subtitleModal}>Categoría</Text>
          <View style={styles.modalInfoClient}>
            <Text style={styles.textModal}>{product.ncate}</Text>
          </View>
          <Text style={styles.subtitleModal}>Marca</Text>
          <View style={styles.modalInfoClient}>
            <Text style={styles.textModal}>{product.nmarca}</Text>
          </View>
          <View style={styles.sectionButtonsModal}>
            <Pressable style={styles.buttonModalExit} onPress={onClose}>
              <Text style={styles.buttonTextModal}>Salir</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ModalProduct;
