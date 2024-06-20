import React, { useEffect, useRef, useState } from 'react';
import { Text, TextInput, View, Pressable, Modal, TouchableOpacity, Animated, Easing } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

  const scaleValue = useRef(new Animated.Value(0)).current;
  const opacityValue = useRef(new Animated.Value(0)).current;

  const handleAmountChange = (text) => {
    // Only allow numbers greater than 0 and no signs
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
      let token = await AsyncStorage.getItem('tokenUser')

      const decodedToken = jwtDecode(token)

      const passUser = {
        id_pass: generateRandomProductId(),
        id_scli: client.id_scli,
        cod_cli: client.cod_cli,
        nom_cli: client.nom_cli,
        cod_ven : decodedToken.cod_ven,
        monto: amount,
        tipoPago: paymentType, // Updated to save payment type
        tasaPago: 3500,
        fecha: new Date().toISOString(), // Guarda la fecha y hora exacta en formato ISO8601
      };

      console.log(passUser)

      const existingPass = await AsyncStorage.getItem('ClientPass');
      const pass = existingPass ? JSON.parse(existingPass) : [];

      pass.push(passUser);
      await AsyncStorage.setItem('ClientPass', JSON.stringify(pass));
      setPassStatus('Abono registrado con éxito!');
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
      // Reset values if modal is not visible
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
