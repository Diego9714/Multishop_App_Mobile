import React, { useEffect, useRef, useState } from 'react'
import { View, Text, Modal, Pressable, Animated, Easing } from 'react-native'
import { AntDesign } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
// Styles
import styles from '../../styles/ModalVisit.styles'

const VisitModal = ({ isVisible, onClose, client }) => {
  const [visitStatus, setVisitStatus] = useState('') // Estado para el mensaje de estado de la visita
  const scaleValue = useRef(new Animated.Value(0)).current
  const opacityValue = useRef(new Animated.Value(0)).current

  const generateRandomProductId = () => {
    const randomNumber = Math.floor(Math.random() * 100000)
    const timestamp = Date.now()
    return `${timestamp}-${randomNumber}`
  }

  useEffect(() => {
    const regVisit = async (client) => {
      try {
        const visit = {
          id_visit: generateRandomProductId(),
          id_scli: client.id_scli,
          cod_cli: client.cod_cli,
          nom_cli: client.nom_cli,
          fecha: new Date().toISOString(), // Guarda la fecha y hora exacta en formato ISO8601
        }

        const existingVisits = await AsyncStorage.getItem('ClientVisits')

        const visits = existingVisits ? JSON.parse(existingVisits) : []

        // Verificar si ya existe una visita para este cliente en la misma fecha
        const today = new Date().toISOString().split('T')[0]
        const existingVisit = visits.find(
          (v) => v.id_scli === client.id_scli && v.fecha.split('T')[0] === today
        )

        if (existingVisit) {
          setVisitStatus('Ya se ha registrado una visita para este cliente hoy.')
        } else {
          visits.push(visit)
          await AsyncStorage.setItem('ClientVisits', JSON.stringify(visits))
          setVisitStatus('Visita registrada con éxito!')
        }
      } catch (error) {
        setVisitStatus(`Visita no registrada - ${error}`)
      }
    }

    if (isVisible) {
      regVisit(client)
    }
  }, [isVisible, client])

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
      ]).start()
    } else {
      // Reset values if modal is not visible
      scaleValue.setValue(0)
      opacityValue.setValue(0)
      setVisitStatus('') // Resetear el mensaje cuando se cierra el modal
    }
  }, [isVisible])

  return (
    <Modal visible={isVisible} animationType="fade" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.titleModal}>
            {visitStatus === 'Visita registrada con éxito!' ? 'Visita Registrada con Éxito!' : 'Visita no registrada'}
          </Text>

          <Animated.View style={{ transform: [{ scale: scaleValue }], opacity: opacityValue }}>
            {visitStatus === 'Visita registrada con éxito!' ? (
              <AntDesign name="checkcircle" size={48} color="#06D001" />
            ) : (
              <AntDesign name="closecircle" size={48} color="#E72929" />
            )}
          </Animated.View>

          <Text style={styles.subtitleModal}>
            {visitStatus || `La visita para el cliente ${client.nom_cli} se ha registrado exitosamente.`}
          </Text>

          <Pressable style={styles.buttonModalExit} onPress={onClose}>
            <Text style={styles.buttonTextModal}>Cerrar</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  )
}

export default VisitModal
