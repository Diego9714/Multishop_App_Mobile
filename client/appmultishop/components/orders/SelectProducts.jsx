import React, { useState, useEffect, useCallback } from 'react'
import { Text, View, Pressable, Modal, TextInput, ScrollView } from 'react-native'
import { AntDesign, MaterialIcons, Ionicons, FontAwesome } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import ModalProduct from '../products/ModalProducts'
import SaveOrder from './SaveOrder'
import styles from '../../styles/SelectProducts.styles'

const SelectProducts = ({ isVisible, onClose, client }) => {
  const [selectedProductsCount, setSelectedProductsCount] = useState(0)
  const [products, setProducts] = useState([])
  const [visibleProducts, setVisibleProducts] = useState([])
  const [searchProduct, setSearchProduct] = useState("")
  const [page, setPage] = useState(1)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isProductModalVisible, setIsProductModalVisible] = useState(false)
  const [isSaveOrderModalVisible, setIsSaveOrderModalVisible] = useState(false)
  const [productQuantities, setProductQuantities] = useState({})
  const itemsPerPage = 10

  useEffect(() => {
    const getProducts = async () => {
      const productsInfo = await AsyncStorage.getItem('products')
      const productsJson = JSON.parse(productsInfo)
      setProducts(productsJson || [])
    }
    getProducts()
  }, [])

  useEffect(() => {
    let filteredProducts = products

    if (searchProduct.length >= 3) {
      filteredProducts = filteredProducts.filter(product =>
        product.descrip.toLowerCase().includes(searchProduct.toLowerCase())
      )
    }

    const start = (page - 1) * itemsPerPage
    const end = page * itemsPerPage
    const paginatedProducts = filteredProducts.slice(start, end)

    const updatedVisibleProducts = paginatedProducts.map(product => ({
      ...product,
      quantity: productQuantities[product.codigo] || 0,
      selected: product.codigo in productQuantities && productQuantities[product.codigo] > 0
    }))

    setVisibleProducts(updatedVisibleProducts)
  }, [page, products, searchProduct, productQuantities])

  const handleProductSelection = useCallback((product) => {
    const updatedProductQuantities = { ...productQuantities }
  
    if (product.selected) {
      product.selected = false
      setSelectedProductsCount(prevCount => prevCount - 1)
      delete updatedProductQuantities[product.codigo]
    } else {
      product.selected = true
      setSelectedProductsCount(prevCount => prevCount + 1)
      updatedProductQuantities[product.codigo] = 1  // Establecer cantidad por defecto a 1
    }
  
    setProductQuantities(updatedProductQuantities)
    setProducts(products.map(p => 
      p.codigo === product.codigo ? { ...p, selected: !p.selected } : p
    ))
  }, [productQuantities, products])

  const handleQuantityChange = useCallback((productId, text) => {
    const quantity = parseInt(text, 10) || 0
  
    if (isNaN(quantity)) {
      return
    }
  
    const updatedProductQuantities = { ...productQuantities }
    updatedProductQuantities[productId] = quantity
  
    if (quantity === 0) {
      delete updatedProductQuantities[productId]
    }
  
    setProductQuantities(updatedProductQuantities)
  }, [productQuantities])

  const handleProductDelete = useCallback((productId) => {
    const updatedProductQuantities = { ...productQuantities }
    delete updatedProductQuantities[productId]
    setProductQuantities(updatedProductQuantities)
  
    const updatedProducts = products.map(product =>
      product.codigo === productId ? { ...product, selected: false } : product
    )
    setProducts(updatedProducts)
    setSelectedProductsCount(prevCount => prevCount - 1)
  }, [productQuantities, products])

  const generateSelectedProductJSON = () => {
    const selectedProducts = products.filter(product => product.selected)
    const selectedProductsWithQuantities = selectedProducts.map(product => ({
      codigo: product.codigo,
      descrip: product.descrip,
      exists: product.existencia,
      quantity: productQuantities[product.codigo] || 0,
      priceUsd: product.precioUsd,
      priceBs: product.precioBs,
    }))

    const order = {
      cod_cli: client.cod_cli,
      nom_cli: client.nom_cli,
      products: selectedProductsWithQuantities
    }

    return order
  }

  const renderPaginationButtons = () => {
    const filteredProducts = products.filter(product =>
      product.descrip.toLowerCase().includes(searchProduct.toLowerCase())
    )
    const numberOfPages = Math.ceil(filteredProducts.length / itemsPerPage)
    let buttons = []
    for (let i = 1 ; i <= numberOfPages ; i++) {
      buttons.push(
        <Pressable
        key={i}
        style={[styles.pageButton, page === i && styles.pageButtonActive]}
        onPress={() => setPage(i)}
      >
        <Text style={styles.pageButtonText}>{i}</Text>
      </Pressable>
    )
  }
  return buttons
}

return (
  <Modal visible={isVisible} animationType="slide">
    <View style={styles.container}>
      <View style={styles.mainTitleContainer}>
        <Text style={styles.mainTitle}>Seleccionar Productos</Text>
      </View>

      <View style={styles.mainSubtitleContainer}>
        <Text style={styles.mainSubtitle}>Cliente: {client.nom_cli}</Text>
      </View>

      <View style={styles.finderContainer}>
        <View style={styles.seekerContainer}>
          <TextInput
            placeholder='Buscar Producto'
            style={styles.seeker}
            onChangeText={text => setSearchProduct(text)}
          />
          <FontAwesome name="search" size={28} color="#8B8B8B" />
        </View>
        <Text style={styles.textFilter}>Filtrar</Text>
        <MaterialIcons name="filter-alt" size={28} color="white" />
      </View>

      <View style={styles.productContainer}>
        <View style={styles.headerProductContainer}>
          <View style={styles.titleListContainer}>
            <Text style={styles.titleListProduct}>Producto</Text>
            <Text style={styles.titleListCant}>Cantidad</Text>
            <Text style={styles.titleListActions}>Acciones</Text>
          </View>
        </View>

        <ScrollView>
          {visibleProducts.map((product, index) => (
            <View key={index} style={styles.productItem}>
              <View style={styles.nameProd}>
                <Text>{product.descrip}</Text>
              </View>
              <View style={styles.quantityContainer}>
                <TextInput
                  style={styles.quantityInput}
                  keyboardType="numeric"
                  placeholder="Cantidad"
                  value={String(productQuantities[product.codigo] || '')}
                  onChangeText={text => handleQuantityChange(product.codigo, text)}
                />
              </View>
              <View style={styles.buttonAction}>
                <Pressable
                  style={styles.button}
                  onPress={() => handleProductSelection(product)}
                >
                  {product.selected ? (
                    <Ionicons name="remove-outline" size={30} color="black" />
                  ) : (
                    <Ionicons name="add-outline" size={30} color="black" />
                  )}
                </Pressable>
                <Pressable
                  style={styles.button}
                  onPress={() => {
                    setSelectedProduct(product)
                    setIsProductModalVisible(true)
                  }}
                >
                  <MaterialIcons name="info-outline" size={30} color="black" />
                </Pressable>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      <View style={styles.pagination}>
        <ScrollView horizontal style={styles.paginationContainer}>
          {renderPaginationButtons()}
        </ScrollView>
      </View>

      <View style={styles.buttonsAction}>
        <Pressable style={styles.buttonExit} onPress={onClose}>
          <Text style={styles.buttonText}>Salir</Text>
        </Pressable>
        <Pressable
          style={styles.buttonModal}
          onPress={() => setIsSaveOrderModalVisible(true)}
        >
          <Text style={styles.buttonTextSave}>Guardar</Text>
          <AntDesign name="shoppingcart" size={26} color="white" />
          <View style={styles.counterContainer}>
            <Text style={styles.counterText}>{selectedProductsCount}</Text>
          </View>
        </Pressable>
      </View>

      {selectedProduct && (
        <ModalProduct
          isVisible={isProductModalVisible}
          onClose={() => setIsProductModalVisible(false)}
          product={selectedProduct}
        />
      )}

      <SaveOrder
        isVisible={isSaveOrderModalVisible}
        onClose={() => setIsSaveOrderModalVisible(false)}
        client={client}
        order={generateSelectedProductJSON()}
        onQuantityChange={handleQuantityChange}
        onDeleteProduct={handleProductDelete}
      />
    </View>
  </Modal>
)
}

export default SelectProducts
