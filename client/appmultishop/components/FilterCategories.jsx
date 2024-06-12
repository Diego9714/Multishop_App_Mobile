import React, { useState , useEffect } from 'react'
import { Text, View, Modal, Button , ScrollView , Pressable} from 'react-native'
import { AntDesign, MaterialIcons, Ionicons, FontAwesome6 } from '@expo/vector-icons'
// Styles
import styles from '../styles/FilterProducts.styles'

const FilterCategories = ({ visible, onClose }) => {
  return (
    <Modal transparent={true} animationType="fade" visible={visible} onRequestClose={onClose}>
      <View style={styles.mainContainer}>
        <View style={styles.container}>
          <Text style={styles.titleContainer}>Filtrar por</Text>

          <Pressable style={styles.filterContainer}>
            <MaterialIcons name="filter-1" size={24} color="black" />
            <Text>Categoria</Text>
          </Pressable>

          <Pressable style={styles.filterContainer}>
            <MaterialIcons name="filter-2" size={24} color="black" />
            <Text>Marca</Text>
          </Pressable>

          <Pressable style={styles.filterContainer}>
            <MaterialIcons name="filter-3" size={24} color="black" />
            <Text>Precio</Text>
          </Pressable>

          <Pressable style={styles.filterContainer}>
            <MaterialIcons name="filter-4" size={24} color="black" />
            <Text>Código</Text>
          </Pressable>

          <View style={styles.sectionButtonsModal}>
            <Pressable style={styles.buttonModal} >
                <Text style={styles.buttonTextModal}>Guardar</Text>
            </Pressable>
            <Pressable style={styles.buttonModalExit} onPress={onClose}>
                <Text style={styles.buttonTextModal}>Salir</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};


export default FilterCategories;
