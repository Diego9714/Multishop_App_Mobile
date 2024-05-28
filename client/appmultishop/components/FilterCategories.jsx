import React, { useState , useEffect } from 'react'
import { Text, View, Modal, Button , ScrollView , Pressable} from 'react-native'
import styles from '../styles/FilterProducts.styles'

const FilterCategories = ({ visible, onClose }) => {
  return (
    <Modal transparent={true} animationType="fade" visible={visible} onRequestClose={onClose}>
      <View style={styles.mainContainer}>
        <View style={styles.container}>
          <Text>Filter Categories</Text>
          <Button title="Cerrar" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};


export default FilterCategories;
