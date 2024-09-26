import React, { useState } from 'react'
import { Modal, Text, View, Pressable, StyleSheet, Dimensions, TouchableOpacity, Alert } from 'react-native'
import { Svg, Path } from 'react-native-svg'
import AsyncStorage from '@react-native-async-storage/async-storage'
// JWT - TOKEN
import { jwtDecode } from 'jwt-decode'
import { decode } from 'base-64'
global.atob = decode

const { height, width } = Dimensions.get('window')

const SignatureModal = ({ isVisible, onClose, paymentIds, client, onSignatureSaved }) => {
  const [paths, setPaths] = useState([])
  const [currentPath, setCurrentPath] = useState([])
  const [isSaveDisabled, setIsSaveDisabled] = useState(false) // Nuevo estado para habilitar/deshabilitar botones

  const onTouchEnd = () => {
    setPaths([...paths, currentPath.join(' ')])
    setCurrentPath([])
  }

  const onTouchMove = (event) => {
    const locationX = event.nativeEvent.locationX
    const locationY = event.nativeEvent.locationY

    if (currentPath.length === 0) {
      setCurrentPath([`M${locationX.toFixed(0)},${locationY.toFixed(0)}`])
    } else {
      setCurrentPath([...currentPath, `L${locationX.toFixed(0)},${locationY.toFixed(0)}`])
    }
  }

  const handleClearButtonClick = () => {
    setPaths([])
    setCurrentPath([])
  }

  const generateRandomProductId = () => {
    const randomNumber = Math.floor(Math.random() * 100000);
    const timestamp = Date.now();
    return `${timestamp}-${randomNumber}`;
  };

  const handleSaveSignature = async () => {
    if (paths.length === 0) {
      Alert.alert("Firma vacía", "Por favor, firma antes de guardar.")
      return
    }

    const signatureData = paths
    // console.log("Coordenadas de la firma:", signatureData)

    let token = await AsyncStorage.getItem('tokenUser')
    const decodedToken = jwtDecode(token)

    const formatDate = (dateString) => {
      const date = new Date(dateString)
      const day = String(date.getDate()).padStart(2, '0')
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const year = date.getFullYear()
      return `${day}/${month}/${year}`
    }
  
    const fecha = new Date().toISOString()
    const formattedDate = formatDate(fecha)

    const signUser = {
      id_signature: generateRandomProductId(),
      id_scli: client.id_scli,
      cod_cli: client.cod_cli,
      nom_cli: client.nom_cli,
      cod_ven: decodedToken.cod_ven,
      img_signature: signatureData,
      cod_payments: paymentIds,
      fecha: formattedDate,
    }

    const existingSignature = await AsyncStorage.getItem('SignaturePass')
    const signature = existingSignature ? JSON.parse(existingSignature) : []

    signature.push(signUser)
    await AsyncStorage.setItem('SignaturePass', JSON.stringify(signature))

    onSignatureSaved()

    setIsSaveDisabled(true);
    onClose();
  }

  return (
    <Modal visible={isVisible} animationType="fade" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.titleModal}>Firma del Cliente</Text>
          <View
            style={styles.svgContainer}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <Svg height={height * 0.7} width={width * 0.9}>
              {paths.map((path, index) => (
                <Path
                  key={`path-${index}`}
                  d={path}
                  stroke="#38B0DB"
                  fill="transparent"
                  strokeWidth={3}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              ))}
              {currentPath.length > 0 && (
                <Path
                  d={currentPath.join(' ')}
                  stroke="#38B0DB"
                  fill="transparent"
                  strokeWidth={3}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              )}
            </Svg>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.buttonModal} onPress={handleClearButtonClick}>
              <Text style={styles.buttonTextModal}>Limpiar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonModal} onPress={handleSaveSignature} disabled={isSaveDisabled}>
              <Text style={styles.buttonTextModal}>Guardar</Text>
            </TouchableOpacity>
            <Pressable style={styles.buttonModalExit} onPress={onClose} disabled={isSaveDisabled}>
              <Text style={styles.buttonTextModal}>Cerrar</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  titleModal: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center'
  },
  svgContainer: {
    height: height * 0.7,
    width: width * 0.9,
    borderColor: 'black',
    backgroundColor: 'white',
    borderWidth: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 10
  },
  buttonModal: {
    marginTop: 10,
    width: 100,
    height: 40,
    backgroundColor: "#38B0DB",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonModalExit: {
    marginTop: 10,
    width: 100,
    height: 40,
    backgroundColor: "#E72929",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonTextModal: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
})

export default SignatureModal
