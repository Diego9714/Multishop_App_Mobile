// Dependencies
import React, { useEffect, useRef, useState } from 'react';
import { Text, TextInput, View, Pressable,
Modal, TouchableOpacity, Animated, Easing } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Token - JWT 
import { jwtDecode } from 'jwt-decode';
import { decode } from 'base-64';
global.atob = decode;
// Styles
import styles from '../../styles/ModalPass.styles';

const ModalPass = ({ isVisible, onClose, client }) => {
  const [amount, setAmount] = useState('');
  const [paymentType, setPaymentType] = useState('');
  const [passStatus, setPassStatus] = useState('');
  const [isSaveEnabled, setIsSaveEnabled] = useState(false);
  const [cambioBolivares, setCambioBolivares] = useState(null);
  const [cambioDolares, setCambioDolares] = useState(null);
  const [cambioPesos, setCambioPesos] = useState(null);

  const scaleValue = useRef(new Animated.Value(0)).current;
  const opacityValue = useRef(new Animated.Value(0)).current;

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

  const handleAmountChange = (text) => {
    const numericText = text.replace(/[^0-9]/g, '');
    if (numericText !== '' && numericText !== '0') {
      setAmount(numericText);
    } else {
      setAmount('');
    }
  };

  const generateRandomProductId = () => {
    const randomNumber = Math.floor(Math.random() * 100000);
    const timestamp = Date.now();
    return `${timestamp}-${randomNumber}`;
  };

  const regPass = async () => {
    if (!amount || !paymentType) {
      setPassStatus('Por favor ingrese el monto y seleccione el tipo de moneda.');
      return;
    }

    try {
      let token = await AsyncStorage.getItem('tokenUser');
      const decodedToken = jwtDecode(token);

      const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      };
    
      const fecha = new Date().toISOString();
      const formattedDate = formatDate(fecha);

      const passUser = {
        id_pass: generateRandomProductId(),
        id_scli: client.id_scli,
        cod_cli: client.cod_cli,
        nom_cli: client.nom_cli,
        cod_ven: decodedToken.cod_ven,
        monto: amount,
        tipoPago: paymentType,
        tasaPago: paymentType === 'dollars' ? cambioDolares : (paymentType === 'bs' ? cambioBolivares : cambioPesos),
        fecha: formattedDate
      };

      // console.log(passUser);

      const existingPass = await AsyncStorage.getItem('ClientPass');
      const pass = existingPass ? JSON.parse(existingPass) : [];

      pass.push(passUser);
      await AsyncStorage.setItem('ClientPass', JSON.stringify(pass));
      setPassStatus('Abono registrado con éxito!');
      setAmount(''); // Reset the amount input
      setTimeout(() => {
        setPassStatus('');
      }, 3000); // Clear the status message after 3 seconds
    } catch (error) {
      setPassStatus(`Abono no registrado - ${error}`);
    }
  };

  useEffect(() => {
    setIsSaveEnabled(amount !== '' && paymentType !== '');
  }, [amount, paymentType]);

  useEffect(() => {
    if (isVisible) {
      Animated.parallel([
        Animated.spring(scaleValue, {
          toValue: 1,
          friction: 2,
          tension: 150,
          useNativeDriver: true,
        }),
        Animated.timing(opacityValue, {
          toValue: 1,
          duration: 500,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleValue.setValue(0);
      opacityValue.setValue(0);
      setPassStatus(''); // Reset the message when the modal closes
    }
  }, [isVisible]);

  return (
    <Modal visible={isVisible} animationType="fade" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.titleModal}>Registrar Abono</Text>

          <Text style={styles.message}>Cliente: {client.nom_cli}</Text>
          <Text style={styles.message}>Rif: {client.rif_cli}</Text>

          <TextInput
            style={styles.input}
            value={amount}
            onChangeText={handleAmountChange}
            keyboardType="numeric"
            placeholder="Ingrese el monto"
          />

          <View style={styles.radioContainer}>
            <TouchableOpacity
              style={[styles.radioButton, paymentType === 'dollars' && styles.radioButtonSelected]}
              onPress={() => setPaymentType('dollars')}
            >
              <Text style={styles.radioText}>Dólares</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.radioButton, paymentType === 'bs' && styles.radioButtonSelected]}
              onPress={() => setPaymentType('bs')}
            >
              <Text style={styles.radioText}>Bs</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.radioButton, paymentType === 'pesos' && styles.radioButtonSelected]}
              onPress={() => setPaymentType('pesos')}
            >
              <Text style={styles.radioText}>Pesos</Text>
            </TouchableOpacity>
          </View>

          {passStatus ? (
            <Animated.View style={{ transform: [{ scale: scaleValue }], opacity: opacityValue }}>
              <Text style={styles.statusMessage}>{passStatus}</Text>
            </Animated.View>
          ) : null}

          <View style={styles.sectionButtonsModal}>
            <Pressable
              style={[styles.buttonModal, isSaveEnabled ? null : styles.disabledButton]}
              onPress={regPass}
              disabled={!isSaveEnabled}
            >
              <Text style={styles.buttonTextModal}>
                Guardar
              </Text>
            </Pressable>

            <Pressable style={styles.buttonModalExit} onPress={onClose}>
              <Text style={styles.buttonTextModal}>Salir</Text>
            </Pressable>
          </View>

        </View>
      </View>
    </Modal>
  );
};

export default ModalPass;
