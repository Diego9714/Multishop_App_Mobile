import React, { useState, useEffect } from 'react'
import { View, Text, Modal, Pressable, TextInput, Alert } from 'react-native'
import styles from '../../styles/modalEditProd.styles'
import AsyncStorage from '@react-native-async-storage/async-storage'
// JWT - Token
import { jwtDecode } from 'jwt-decode'
import { decode } from 'base-64'
global.atob = decode

const ModalEditProd = ({ isVisible, selectedProduct, onClose, onQuantityChange, onDeleteProduct }) => {
  const [quantity, setQuantity] = useState(selectedProduct?.quantity || 0)
  const [originalQuantity, setOriginalQuantity] = useState(selectedProduct?.quantity || 0)
  const [exist, setExist] = useState('')
  const [prodExistence, setProdExistence] = useState(null)

  useEffect(() => {
    const fetchProductExistence = async () => {
      try {
        const productsInfo = await AsyncStorage.getItem('products')
        const productList = productsInfo ? JSON.parse(productsInfo) : []
        const product = productList.find(prod => prod.codigo === selectedProduct.codigo)
        
        if (product) {
          setExist(product.existencia.toString())
        }
      } catch (error) {
        console.error('Error fetching product existence from AsyncStorage:', error)
      }
    }

    if (selectedProduct) {
      setQuantity(selectedProduct.quantity.toString())
      fetchProductExistence()
    }
  }, [selectedProduct])

  useEffect(() => {
    if (selectedProduct) {
      setQuantity(selectedProduct.quantity)
      setOriginalQuantity(selectedProduct.quantity)
    }
  }, [selectedProduct])

  useEffect(() => {
    const getExistence = async () => {
      try {
        const token = await AsyncStorage.getItem('tokenUser')
        const decodedToken = jwtDecode(token)
        const prodExists = decodedToken.prodExistence
        setProdExistence(prodExists)
      } catch (error) {
        console.error('Error al obtener datos de AsyncStorage:', error)
      }
    }

    getExistence()
  }, [])

  const handleQuantityChange = (text) => {
    // Eliminar caracteres no numéricos
    const sanitizedText = text.replace(/[^0-9]/g, '')
    const newQuantity = parseInt(sanitizedText, 10) || 0


    if(prodExistence == 0){
      if (isNaN(newQuantity) || newQuantity <= 0) {
        setQuantity('')
      }else{
        setQuantity(newQuantity.toString())
      }
    }else{
      if (isNaN(newQuantity) || newQuantity <= 0) {
        setQuantity('')
      }
      if (newQuantity > selectedProduct.exists) {
        Alert.alert('Cantidad no disponible', 'La cantidad ingresada supera la cantidad existente en el inventario.')
        setQuantity(originalQuantity) // Revertir a la cantidad original
        return
      }
  
      setQuantity(newQuantity)
    }
  }

  const handleSave = () => {
    const newQuantity = parseInt(quantity, 10)

    if(prodExistence == 0){
      if (isNaN(newQuantity) || newQuantity <= 0) {
        Alert.alert('Cantidad no válida', 'La cantidad seleccionada debe ser mayor que 0.')
        return
      }

      if (onQuantityChange) {
        onQuantityChange(selectedProduct.codigo, newQuantity)
      }
    }else{
      if (isNaN(newQuantity) || newQuantity <= 0) {
        Alert.alert('Cantidad no válida', 'La cantidad seleccionada debe ser mayor que 0.')
        return
      }
  
      if (newQuantity > parseInt(exist, 10) + selectedProduct.exists) {
        Alert.alert('Cantidad no disponible', 'La cantidad ingresada supera la cantidad existente en el inventario.')
        return
      }
  
      if (onQuantityChange) {
        onQuantityChange(selectedProduct.codigo, newQuantity)
      }
    }
    onClose() // Cerrar el modal después de guardar
  }

  const handleDeleteProduct = () => {
    if (onDeleteProduct) {
      onDeleteProduct(selectedProduct.codigo) // Llama a onDeleteProduct con el código del producto
    }
  }

  const handleClose = () => {
    setQuantity(originalQuantity) // Revertir a la cantidad original antes de cerrar
    onClose()
  }

  return (
    <Modal visible={isVisible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.titleModal}>{selectedProduct.descrip}</Text>
          {prodExistence == 1 && (
            <>
              <Text style={styles.subtitleModal}>Existencia</Text>
              <View style={styles.modalInfoClient}>
                <TextInput style={styles.textModal} editable={false} value={exist} />
              </View>
            </>
          )}
          <Text style={styles.subtitleModal}>Cantidad Seleccionada</Text>
          <View style={styles.modalInfoClient}>
            <TextInput
              style={styles.textModal}
              keyboardType="numeric"
              value={quantity.toString()}
              onChangeText={handleQuantityChange}
            />
          </View>
          <Text style={styles.subtitleModal}>Precio(Bs)</Text>
          <View style={styles.modalInfoClient}>
            {/* <Text style={styles.textModal}>{selectedProduct.priceBs}</Text> */}
            <Text style={styles.textModal}>{(selectedProduct.priceUsd * 36.372).toFixed(2)}</Text>
          </View>
          <Text style={styles.subtitleModal}>Precio(Usd)</Text>
          <View style={styles.modalInfoClient}>
            <Text style={styles.textModal}>{selectedProduct.priceUsd}</Text>
          </View>

          <View style={styles.sectionButtonsModal}>
            <Pressable onPress={handleSave} style={styles.buttonModal}>
              <Text style={styles.buttonTextModal}>Guardar</Text>
            </Pressable>

            <Pressable onPress={handleDeleteProduct} style={styles.buttonModalExit}>
              <Text style={styles.buttonTextModal}>Eliminar</Text>
            </Pressable>
          </View>

          <Pressable onPress={handleClose} style={styles.buttonModalExit}>
            <Text style={styles.buttonTextModal}>Salir</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  )
}

export default ModalEditProd
