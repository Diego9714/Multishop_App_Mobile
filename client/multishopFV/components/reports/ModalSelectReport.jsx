import React, { useState } from 'react'
import { View, Text, Modal, Pressable } from 'react-native'
// Components Modal
import ReportProducts from './ReportProducts'
import ReportOrders from './ReportOrders'
import ReportVisits from './ReportVisits'
import ReportPayments from './ReportPayments'
// Styles
import styles from '../../styles/ModalSelectReport.styles'

const ModalSelectReport = ({ isModalSelectReportVisible, onClose }) => {
  const [isReportOrdersModalVisible, setIsReportOrdersModalVisible] = useState(false)
  const [isReportVisitsModalVisible, setIsReportVisitsModalVisible] = useState(false)
  const [isReportPaymentsModalVisible, setIsReportPaymentsModalVisible] = useState(false)
  const [isReportProductsModalVisible, setIsReportProductsModalVisible] = useState(false)

  // Open Report Orders Modal
  const openReportOrdersModal = () => {
    setIsReportOrdersModalVisible(true)
  }

  const closeReportOrdersModal = () => {
    setIsReportOrdersModalVisible(false)
  }

  // Open Report Visits Modal
  const openReportVisitsModal = () => {
    setIsReportVisitsModalVisible(true)
  }

  const closeReportVisitsModal = () => {
    setIsReportVisitsModalVisible(false)
  }

  // Open Report Payments Modal
  const openReportPaymentsModal = () => {
    setIsReportPaymentsModalVisible(true)
  }

  const closeReportPaymentsModal = () => {
    setIsReportPaymentsModalVisible(false)
  }

  // Open Report Products Modal
  const openReportProductsModal = () => {
    setIsReportProductsModalVisible(true)
  }

  const closeReportProductsModal = () => {
    setIsReportProductsModalVisible(false)
  }

  return (
    <View style={styles.container}>
      <Modal
        visible={isModalSelectReportVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={onClose}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.titleModal}>Selecciona un Reporte</Text>
            
            <View style={styles.sectionButtonsModal}>
              <Pressable style={styles.buttonModal} onPress={openReportOrdersModal}>
                <Text style={styles.buttonTextModal}>Pedidos</Text>
              </Pressable>

              <Pressable style={styles.buttonModal} onPress={openReportProductsModal}>
                <Text style={styles.buttonTextModal}>Productos</Text>
              </Pressable>

              <Pressable style={styles.buttonModal} onPress={openReportVisitsModal}>
                <Text style={styles.buttonTextModal}>Visitas</Text>
              </Pressable>

              <Pressable style={styles.buttonModal} onPress={openReportPaymentsModal}>
                <Text style={styles.buttonTextModal}>Abonos</Text>
              </Pressable>

              <Pressable style={styles.buttonModalExit} onPress={onClose}>
                <Text style={styles.buttonTextModal}>Salir</Text>
              </Pressable>            
            </View>
          </View>
        </View>
      </Modal>

      {/* Report Products Modal */}
      <ReportProducts
        isVisible={isReportProductsModalVisible}
        onClose={closeReportProductsModal}
      />

      {/* Report Orders Modal */}
      <ReportOrders
        isVisible={isReportOrdersModalVisible}
        onClose={closeReportOrdersModal}
      />

      {/* Report Visits Modal */}
      <ReportVisits
        isVisible={isReportVisitsModalVisible}
        onClose={closeReportVisitsModal}
      />

      {/* Report Payments Modal */}
      <ReportPayments
        isVisible={isReportPaymentsModalVisible}
        onClose={closeReportPaymentsModal}
      />

    </View>
  )
}

export default ModalSelectReport
