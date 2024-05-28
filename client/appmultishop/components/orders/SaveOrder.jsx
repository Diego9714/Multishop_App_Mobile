import React from 'react';
import { StyleSheet, Text, View, Modal, Pressable, ScrollView } from 'react-native';
import styles from '../../styles/SaveOrder.styles';

const SaveOrder = ({ isVisible, onClose, client }) => {
  return (
    <Modal visible={isVisible} animationType="slide">
      <View style={styles.container}>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.mainTitleContainer}>
            <Text style={styles.mainTitle}>Datos del Cliente</Text>
          </View>

          <View style={styles.detailedClientContainer}>
            <Text style={styles.nameInputDetailedClient}>Nombre:</Text>
            <View style={styles.infoClientContainer}>
              <Text style={styles.textDetailedClient}>{client.nom_cli}</Text>
            </View>
            <Text style={styles.nameInputDetailedClient}>Cédula:</Text>
            <View style={styles.infoClientContainer}>
              <Text style={styles.textDetailedClient}>{client.rif_cli}</Text>
            </View>
            <Text style={styles.nameInputDetailedClient}>Teléfono:</Text>
            <View style={styles.infoClientContainer}>
              <Text style={styles.textDetailedClient}>{client.tel_cli}</Text>
            </View>
            <Text style={styles.nameInputDetailedClient}>Dirección:</Text>
            <View style={styles.infoClientContainer}>
              <Text style={styles.textDetailedClient}>{client.dir1_cli}</Text>
            </View>
          </View>

          <View style={styles.mainTitleContainer}>
            <Text style={styles.mainTitle}>Tipo de Factura</Text>
          </View>

          <View style={styles.detailedClientContainer}>
            <Pressable style={styles.infoClientContainer}>
              <Text style={styles.textDetailedClient}> --- Seleccionar --- </Text>
            </Pressable>
          </View>

          <View style={styles.mainTitleContainer}>
            <Text style={styles.mainTitle}>Productos Seleccionados</Text>
          </View>

          <Pressable onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Salir</Text>
          </Pressable>
        </ScrollView>

      </View>
    </Modal>
  );
};

export default SaveOrder;
