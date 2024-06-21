import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Modal, Animated, Easing, Pressable, FlatList } from 'react-native';
import styles from '../../styles/ModalSincroOrder.styles';
import { Feather } from '@expo/vector-icons';

const ModalSincroOrder = ({ isVisible, onClose, synchronizedOrders, unsynchronizedOrders, initialTimer }) => {
  const [timer, setTimer] = useState(initialTimer);
  const [showOrders, setShowOrders] = useState(false);
  const rotateValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let animation = Animated.loop(
      Animated.timing(rotateValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    if (isVisible) {
      animation.start();

      const countdown = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 1) {
            clearInterval(countdown);
            setShowOrders(true);
            animation.stop(); // Stop the animation when countdown is complete
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);

      return () => {
        clearInterval(countdown);
        animation.stop();
      };
    } else {
      rotateValue.setValue(0);
      animation.stop();
    }
  }, [isVisible, onClose]);

  const rotate = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const renderItem = ({ item }) => {
    return (
      <View style={styles.orderItem}>
        <Text style={styles.orderText}>{item.nom_cli}</Text>
        <Text style={styles.orderText}>Total a pagar: {item.totalUsd.toFixed(2)} $</Text>
      </View>
    );
  };

  return (
    <Modal visible={isVisible} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.titleModal}>{showOrders ? 'Pedidos Sincronizados:' : 'Sincronizando...'}</Text>
          {!showOrders && (
            <>
              <Animated.View style={[styles.timerContainer, { transform: [{ rotate }] }]}>
                <Feather name="loader" size={24} color="black" style={styles.loadingIcon} />
              </Animated.View>
              <Text style={styles.timerText}>{timer}</Text>
            </>
          )}
          {showOrders && (
            <>
              <FlatList
                data={synchronizedOrders}
                renderItem={renderItem}
                keyExtractor={(item) => item.id_order.toString()}
                ListEmptyComponent={<Text style={styles.subtitleModal}>No hay pedidos sincronizados</Text>}
              />
              <Text style={styles.titleModal}>Pedidos No Sincronizados:</Text>
              <FlatList
                data={unsynchronizedOrders}
                renderItem={renderItem}
                keyExtractor={(item) => item.id_order.toString()}
                ListEmptyComponent={<Text style={styles.subtitleModal}>No hay pedidos no sincronizados</Text>}
              />
              <Pressable style={styles.buttonModalExit} onPress={onClose}>
                <Text style={styles.buttonTextModal}>Salir</Text>
              </Pressable>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default ModalSincroOrder;
