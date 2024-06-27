import React from 'react';
import { View, Text, Modal, Pressable } from 'react-native';
// Styles
import styles from '../../styles/ConfirmModal.styles';

const ConfirmModal = ({ isVisible, onConfirm, onCancel }) => {
  return (
    <Modal visible={isVisible} animationType="fade" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.titleModal}>Cerrar sesión</Text>
          <Text style={styles.subtitleModal}>¿Está seguro de querer cerrar la sesión?</Text>
          <View style={styles.sectionButtonsModal}>
            <Pressable style={styles.buttonModal} onPress={onConfirm}>
              <Text style={styles.buttonTextModal}>Sí</Text>
            </Pressable>
            <Pressable style={styles.buttonModalExit} onPress={onCancel}>
              <Text style={styles.buttonTextModal}>No</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmModal;
