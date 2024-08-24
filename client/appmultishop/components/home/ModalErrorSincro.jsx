import React, { useRef, useEffect } from 'react';
import { View, Text, Modal, Pressable, StyleSheet, Animated, Easing } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import styles from '../../styles/Navbar.styles';

const ModalErrorSincro = ({ visible, onClose, onRetry }) => {
  const scaleValue = useRef(new Animated.Value(0)).current;
  const opacityValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
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
      // Reset values when modal is not visible
      scaleValue.setValue(0);
      opacityValue.setValue(0);
    }
  }, [visible]);

  return (
    <Modal transparent={true} animationType="fade" visible={visible}>
      <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
          <Text style={styles.messageInfo}>La información no pudo ser recibida, intenta sincronizar nuevamente.</Text>
          <Animated.View style={{ transform: [{ scale: scaleValue }], opacity: opacityValue }}>
            <AntDesign name="closecircle" size={40} color="red" style={styles.icon} />
          </Animated.View>
          <View style={styles.buttonContainer}>
            <Pressable style={styles.buttonModalExit} onPress={onClose}>
              <Text style={styles.buttonTextModal}>Salir</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ModalErrorSincro;
