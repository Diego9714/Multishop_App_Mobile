// ModalOrderSaved.jsx
import React from 'react';
import { View, Text, Modal, Pressable, Animated, Easing } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import styles from '../../styles/ModalOrderSaved.styles';

const ModalOrderSaved = ({ isVisible, onClose, onOrderSaved }) => {
  const scaleValue = new Animated.Value(0);
  const opacityValue = new Animated.Value(0);

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
  }

  return (
    <Modal visible={isVisible} animationType="fade" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.titleModal}>Pedido Guardado con Éxito!</Text>

          <Animated.View style={{ transform: [{ scale: scaleValue }], opacity: opacityValue }}>
            <AntDesign name="checkcircle" size={48} color="#38B0DB" />
          </Animated.View>

          <Text style={styles.subtitleModal}>Su pedido ha sido guardado correctamente.</Text>

          <Pressable style={styles.buttonModalExit} onPress={() => {
            if (onOrderSaved) {
              onOrderSaved();
            }
          }}>
            <Text style={styles.buttonTextModal}>Cerrar</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default ModalOrderSaved;
