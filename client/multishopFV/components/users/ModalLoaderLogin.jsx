import React, { useEffect, useRef } from 'react'
import { View, Text, Modal, Animated, Easing, StyleSheet } from 'react-native'
import { AntDesign , Feather  } from '@expo/vector-icons'

const ModalLoaderLogin = ({ visible, message, status }) => {
  const scaleValue = useRef(new Animated.Value(0)).current
  const opacityValue = useRef(new Animated.Value(0)).current
  const rotateValue = useRef(new Animated.Value(0)).current // Valor para la animación de rotación

  useEffect(() => {
    if (visible) {
      // Animaciones de escala y opacidad para el mensaje
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
      ]).start()

      // Animación de rotación para el loader
      Animated.loop(
        Animated.timing(rotateValue, {
          toValue: 1,
          duration: 1000, // Duración de una rotación completa
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start()
    } else {
      // Reset values if modal is not visible
      scaleValue.setValue(0)
      opacityValue.setValue(0)
      rotateValue.setValue(0)
    }
  }, [visible])

  const rotate = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  })

  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Animated.View style={{ transform: [{ scale: scaleValue }], opacity: opacityValue }}>
            {status === 200 ? (
              <AntDesign name="checkcircle" size={48} color="#06D001" />
            ) : status !== null ? (
              <AntDesign name="closecircle" size={48} color="#E72929" />
            ) : (
              <Animated.View style={[styles.loaderContainer, { transform: [{ rotate }] }]}>
                {/* <Text style={styles.loadingText}>🔄</Text> */}
                <Feather name="loader" size={24} color="black" style={styles.loadingText} />
              </Animated.View>
            )}
          </Animated.View>
          <Text style={styles.modalMessage}>{message}</Text>
        </View>
      </View>
    </Modal>
  )
}

export default ModalLoaderLogin

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalMessage: {
    marginTop: 20,
    fontSize: 16,
    textAlign: 'center',
  },
  loaderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 48, // Ajustar tamaño del texto o ícono del loader
    color: '#777',
  },
})
