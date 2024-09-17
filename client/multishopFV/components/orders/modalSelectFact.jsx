import React from 'react'
import { Text, View, Modal, Pressable, StyleSheet } from 'react-native'
import styles from '../../styles/ModalSelectFact.styles'

const ModalSelectFact = ({ isVisible, onClose, onSelect }) => {
  return (
    <Modal visible={isVisible} animationType="fade" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.container}>
          <Text style={styles.modalTitle}>Seleccionar Tipo de Factura</Text>
          <Pressable style={styles.modalButton} onPress={() => onSelect('Factura')}>
            <Text style={styles.modalButtonText}>Factura</Text>
          </Pressable>
          <Pressable style={styles.modalButton} onPress={() => onSelect('Nota')}>
            <Text style={styles.modalButtonText}>Nota</Text>
          </Pressable>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <Text style={styles.modalButtonText}>Salir</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  )
}

export default ModalSelectFact