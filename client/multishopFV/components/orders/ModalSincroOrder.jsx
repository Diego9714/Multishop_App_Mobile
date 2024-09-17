import React, { useEffect, useRef } from 'react'
import { View, Text, Modal, ActivityIndicator, Pressable, FlatList, Animated, Easing } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import styles from '../../styles/ModalSincroOrder.styles'

const ModalSincroOrder = ({ isVisible, onClose, synchronizedOrders, unsynchronizedOrders, isLoading }) => {
  const scaleValue = useRef(new Animated.Value(0)).current
  const opacityValue = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (isVisible && !isLoading) {
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
    } else {
      scaleValue.setValue(0)
      opacityValue.setValue(0)
    }
  }, [isVisible, isLoading])

  const renderItem = ({ item }) => (
    <View style={styles.orderItem}>
      <Text style={styles.orderText}>{item.nom_cli}</Text>
      <Text style={styles.orderText}>Total a pagar: {item.totalUsd.toFixed(2)} $</Text>
    </View>
  )

  return (
    <Modal visible={isVisible} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {isLoading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color="#002e60" />
              <Text style={styles.loaderText}>Sincronizando pedidos...</Text>
            </View>
          ) : (
            <>
              {synchronizedOrders.length > 0 && synchronizedOrders.length === 0 ? (
                <>
                  <Text style={styles.titleModal}>Pedidos No Sincronizados</Text>
                  <Animated.View style={{ transform: [{ scale: scaleValue }], opacity: opacityValue }}>
                    <AntDesign name="closecircle" size={48} color="#FF4D4F" />
                  </Animated.View>
                </>
              ) : unsynchronizedOrders.length > 0 ? (
                <>
                  <Text style={styles.titleModal}>Pedidos No Sincronizados</Text>
                  <Animated.View style={{ transform: [{ scale: scaleValue }], opacity: opacityValue }}>
                    <AntDesign name="closecircle" size={48} color="#FF4D4F" />
                  </Animated.View>
                </>
              ) : (
                <>
                  <Text style={styles.titleModal}>Pedidos Sincronizados con Éxito</Text>
                  <Animated.View style={{ transform: [{ scale: scaleValue }], opacity: opacityValue }}>
                    <AntDesign name="checkcircle" size={48} color="#38B0DB" />
                  </Animated.View>
                </>
              )}
              <Pressable style={styles.buttonModalExit} onPress={onClose}>
                <Text style={styles.buttonTextModal}>Salir</Text>
              </Pressable>
            </>
          )}
        </View>
      </View>
    </Modal>
  )
}

export default ModalSincroOrder
