import React, { useState } from 'react';
import { View, Text, Modal, ScrollView, Pressable } from 'react-native';
// Components Modal
import SelectProducts from '../orders/SelectProducts';
import VisitModal from './VisitModal';
import ConfirmModal from './ConfirmModal';
import ModalPass from './ModalPass'; // Importa el nuevo componente para el modal de abono
// Styles
import styles from '../../styles/ListClients.styles';

const ClientModal = ({ isVisibleClientModal, selectedClient, onClose }) => {
  const [isSelectProductsModalVisible, setIsSelectProductsModalVisible] = useState(false);
  const [isOpenVisitModal, setIsOpenVisitModal] = useState(false);
  const [isConfirmVisitModalVisible, setIsConfirmVisitModalVisible] = useState(false);
  const [isModalPassVisible, setIsModalPassVisible] = useState(false); // Nuevo estado para controlar la visibilidad del modal de abono
  const [visitLocation, setVisitLocation] = useState(null); // Estado para la ubicación de la visita

  // Visit Modal
  const openVisitModal = () => {
    setIsConfirmVisitModalVisible(true);
  }

  const closeVisitModal = () => {
    setIsOpenVisitModal(false);
  }

  // Confirm Visit Modal
  const openConfirmVisitModal = () => {
    setIsConfirmVisitModalVisible(true);
  }

  const closeConfirmVisitModal = () => {
    setIsConfirmVisitModalVisible(false);
  }

  const handleConfirmVisit = (location) => {
    setVisitLocation(location); // Guardar la ubicación cuando se confirme
    setIsConfirmVisitModalVisible(false);
    setIsOpenVisitModal(true);
  }

  // Select Products Modal
  const openSelectProductsModal = () => {
    setIsSelectProductsModalVisible(true);
  };

  const closeSelectProductsModal = () => {
    setIsSelectProductsModalVisible(false);
  };

  // Abono Modal
  const openModalPass = () => {
    setIsModalPassVisible(true);
  };

  const closeModalPass = () => {
    setIsModalPassVisible(false);
  };

  if (!selectedClient) return null;

  return (
    <Modal visible={isVisibleClientModal} animationType="fade" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.titleModal}>{selectedClient.nom_cli}</Text>

          <Text style={styles.subtitleModal}>Rif</Text>
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
            <Pressable style={styles.buttonModal} onPress={openVisitModal}>
              <Text style={styles.buttonTextModal}>Registrar Visita</Text>
            </Pressable>
            <Pressable style={styles.buttonModal} onPress={openModalPass}>
              <Text style={styles.buttonTextModal}>Registrar Abono</Text>
            </Pressable>
            <Pressable style={styles.buttonModalExit} onPress={onClose}>
              <Text style={styles.buttonTextModal}>Salir</Text>
            </Pressable>
          </View>
        </View>
      </View>

      {selectedClient && (
        <SelectProducts
          isVisible={isSelectProductsModalVisible}
          onClose={closeSelectProductsModal}
          client={selectedClient}
        />
      )}

      {selectedClient && (
        <ConfirmModal
          isVisible={isConfirmVisitModalVisible}
          onConfirm={handleConfirmVisit}
          onCancel={closeConfirmVisitModal}
        />
      )}

      {selectedClient && (
        <VisitModal
          isVisible={isOpenVisitModal}
          onClose={closeVisitModal}
          client={selectedClient}
          location={visitLocation} // Pasar la ubicación a VisitModal
        />
      )}

      {selectedClient && (
        <ModalPass
          isVisible={isModalPassVisible}
          onClose={closeModalPass}
          client={selectedClient}
        />
      )}
    </Modal>
  );
};

export default ClientModal;
