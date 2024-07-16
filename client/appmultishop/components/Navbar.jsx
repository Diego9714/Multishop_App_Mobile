// Dependencies
import React, { useState, useEffect, useRef }     from 'react'
import { View, Image, ActivityIndicator, Modal, 
Text, Pressable, Animated, Easing }               from 'react-native'
import MaterialCommunityIcons                     from 'react-native-vector-icons/MaterialCommunityIcons'
import { AntDesign }                              from '@expo/vector-icons'
// Components 
import { getAllInfo }                             from '../utils/NavbarUtils'
// Styles
import styles                                     from '../styles/Navbar.styles'
import { images }                                 from '../constants'

const Navbar = () => {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState(false)

  const scaleValue = useRef(new Animated.Value(0)).current
  const opacityValue = useRef(new Animated.Value(0)).current

  const handleClose = () => {
    setMessage('')
  }

  const handleGetAllInfo = async () => {
    setLoading(true)
    setMessage('')
    setSuccess(false)
    try {
      await getAllInfo(setLoading, setMessage)
      setSuccess(true)
      startAnimation()
    } catch (error) {
      setSuccess(false)
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
    ]).start();
  };

  useEffect(() => {
    if (success) {
      startAnimation();
    }
  }, []);

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
              <ActivityIndicator size="large" color="#0000ff" animating={loading} />
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
                      <Pressable style={styles.buttonModal} onPress={handleGetAllInfo}>
                        <Text style={styles.buttonTextModal}>Reintentar</Text>
                      </Pressable>
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
