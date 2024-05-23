import React, { useState } from 'react';
import { View, Text, Modal, ScrollView, Pressable } from 'react-native';
import styles from '../../styles/ListClients.styles';
import SelectProducts from '../orders/SelectProducts';

const ClientModal = ({ isModalVisible, selectedClient, onClose }) => {
  const [isSelectProductsModalVisible, setIsSelectProductsModalVisible] = useState(false);

  const openSelectProductsModal = () => {
    setIsSelectProductsModalVisible(true);
  };

  const closeSelectProductsModal = () => {
    setIsSelectProductsModalVisible(false);
  };

  if (!selectedClient) return null;

  return (
    <Modal visible={isModalVisible} animationType="fade" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.titleModal}>{selectedClient.nom_cli}</Text>

          <Text style={styles.subtitleModal}>Cedula</Text>
          <View style={styles.modalInfoClient}>
            <Text style={styles.textModal}>{selectedClient.rif_cli}</Text>
          </View>

          <Text style={styles.subtitleModal}>Teléfono</Text>
          <View style={styles.modalInfoClient}>
            <Text style={styles.textModal}>{selectedClient.tel_cli}</Text>
          </View>

          <Text style={styles.subtitleModal}>Dirección</Text>
          <View style={styles.modalInfoClientButton}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
              <Text style={styles.textModalDirecction}>{selectedClient.dir1_cli}</Text>
            </ScrollView>
          </View>

          <View style={styles.sectionButtonsModal}>
            <Pressable style={styles.buttonModal} onPress={openSelectProductsModal}>
              <Text style={styles.buttonTextModal}>Realizar Pedido</Text>
            </Pressable>
            <Pressable style={styles.buttonModal}>
              <Text style={styles.buttonTextModal}>Registrar Visita</Text>
            </Pressable>
            <Pressable style={styles.buttonModalExit} onPress={onClose}>
              <Text style={styles.buttonTextModal}>Salir</Text>
            </Pressable>
          </View>
        </View>
      </View>

      <SelectProducts 
        isVisible={isSelectProductsModalVisible} 
        onClose={closeSelectProductsModal} 
        client={selectedClient} 
      />
    </Modal>
  );
};

export default ClientModal;
