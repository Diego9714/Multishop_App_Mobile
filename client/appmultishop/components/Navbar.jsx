import React, { useState, useEffect, useRef } from 'react';
import { View, Image, Modal, Text, Pressable, Animated, Easing, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { AntDesign, Feather } from '@expo/vector-icons';
// Components 
import { getAllInfo } from '../utils/NavbarUtils';
// Styles
import styles from '../styles/Navbar.styles';
import { images } from '../constants';

const Navbar = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [retry, setRetry] = useState(false); // Nuevo estado para manejar reintentos

  const scaleValue = useRef(new Animated.Value(0)).current;
  const opacityValue = useRef(new Animated.Value(0)).current;
  const rotateValue = useRef(new Animated.Value(0)).current; // Valor para la animación de rotación

  const handleClose = () => {
    setMessage('');
    setSuccess(false);
    setRetry(false); // Reinicia el estado de reintento al cerrar el modal
  };

  const handleGetAllInfo = async () => {
    setLoading(true);
    setMessage('');
    setSuccess(false);
    setRetry(false); // Reinicia el estado de reintento

    try {
      const { success, error } = await getAllInfo(setLoading, setMessage);

      if (success) {
        setSuccess(true);
        setMessage('Información actualizada con éxito.');
        startAnimation();
      } else {
        setMessage(error || 'Información no actualizada.');
        setRetry(true); // Establece el estado de reintento si hubo un error
      }
    } catch (error) {
      setMessage('Error al actualizar la información.');
      setRetry(true); // Establece el estado de reintento en caso de excepción
    }
  };

  const startAnimation = () => {
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
      Animated.loop(
        Animated.timing(rotateValue, {
          toValue: 1,
          duration: 1000, // Duración de una rotación completa
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start()
    ]).start();
  };

  useEffect(() => {
    if (loading) {
      startAnimation();
    } else {
      // Reset values if modal is not visible
      scaleValue.setValue(0);
      opacityValue.setValue(0);
      rotateValue.setValue(0);
    }
  }, [loading]);

  const rotate = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Image source={images.logo} style={styles.logo} />
      <MaterialCommunityIcons
        name="cloud-download"
        size={35}
        color="#38B0DB"
        style={{ marginLeft: 115 }}
        onPress={handleGetAllInfo}
      />
      <Modal transparent={true} animationType="fade" visible={loading || message !== ''}>
        <View style={styles.modalBackground}>
          <View style={styles.activityIndicatorWrapper}>
            {loading ? (
              <Animated.View style={[styles.loaderContainer, { transform: [{ rotate }] }]}>
                <Feather name="loader" size={40} color="black" style={styles.loadingText} />
              </Animated.View>
            ) : (
              <>
                <Text style={styles.messageInfo}>{message}</Text>
                {success && (
                  <Animated.View style={{ transform: [{ scale: scaleValue }], opacity: opacityValue }}>
                    <AntDesign name="checkcircle" size={48} color="#38B0DB" />
                  </Animated.View>
                )}
                <View style={styles.buttonContainer}>
                  {success ? (
                    <Pressable style={styles.buttonModalExit} onPress={handleClose}>
                      <Text style={styles.buttonTextModal}>Salir</Text>
                    </Pressable>
                  ) : (
                    <>
                      {retry && (
                        <Pressable style={styles.buttonModal} onPress={handleGetAllInfo}>
                          <Text style={styles.buttonTextModal}>Reintentar</Text>
                        </Pressable>
                      )}
                      <Pressable style={styles.buttonModalExit} onPress={handleClose}>
                        <Text style={styles.buttonTextModal}>Salir</Text>
                      </Pressable>
                    </>
                  )}
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Navbar;
