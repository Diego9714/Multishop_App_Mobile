import React , {useEffect, useState} from 'react'
import { View, Text, Modal, Pressable } from 'react-native'
import * as Location from 'expo-location';
// Styles
import styles from '../../styles/ConfirmModal.styles'

const ConfirmModal = ({ isVisible, onConfirm, onCancel }) => {
  const [location, setLocation] = useState(null) // Nueva variable para la ubicación
  const [errorMsg, setErrorMsg] = useState(null)

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        setErrorMsg('Permiso de ubicación denegado')
        return
      }

      let location = await Location.getCurrentPositionAsync({})
      setLocation(location)
      console.log(location)
    })()
  }, [])

  const handleConfirm = () => {
    if (location) {
      onConfirm(location) // Pasar la ubicación al confirmar
    } else {
      // Manejar el caso de error si no hay ubicación disponible
      setErrorMsg('Ubicación no disponible')
    }
  }

  return (
    <Modal visible={isVisible} animationType="fade" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.titleModal}>Confirmar Visita</Text>
          <Text style={styles.subtitleModal}>¿Está seguro de que desea registrar esta visita?</Text>
          <View style={styles.sectionButtonsModal}>
            <Pressable style={styles.buttonModal} onPress={handleConfirm}>
              <Text style={styles.buttonTextModal}>Sí</Text>
            </Pressable>
            <Pressable style={styles.buttonModalExit} onPress={onCancel}>
              <Text style={styles.buttonTextModal}>No</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  )
}

export default ConfirmModal
