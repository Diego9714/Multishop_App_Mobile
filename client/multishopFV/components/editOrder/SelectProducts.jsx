// SelectProducts.js
import React, { useState, useEffect, useCallback } from 'react'
import { Text, View, Pressable, Modal, TextInput, ScrollView, Alert, TouchableOpacity, ImageBackground } from 'react-native'
import { AntDesign, FontAwesome, MaterialIcons } from '@expo/vector-icons'
import { LinearGradient }                               from 'expo-linear-gradient'
import AsyncStorage from '@react-native-async-storage/async-storage'
import styles from '../../styles/SelectProducts.styles'
import ModalProduct from '../products/ModalProducts' // Adjust path as necessary
import FilterCategories from '../filter/FilterCategories'
import { images }                                       from '../../constants'
// JWT - Token
import { jwtDecode } from 'jwt-decode'
import { decode } from 'base-64'
global.atob = decode

const SelectProducts = ({ isVisible, onClose, selectedOrder, onSave }) => {
  const [selectedProductsCount, setSelectedProductsCount] = useState(0)
  const [producCant, setproducCant] = useState(0)
  const [products, setProducts] = useState([])
  const [listproducts2, setListProducts2] = useState([])
  const [visibleProducts, setVisibleProducts] = useState([])
  const [searchProduct, setSearchProduct] = useState('')
  const [displaySearchProduct, setDisplaySearchProduct] = useState('')
  const [productQuantities, setProductQuantities] = useState({})
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isProductModalVisible, setIsProductModalVisible] = useState(false)
  const itemsPerPage = 10
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false)
  const [searchCategory, setSearchCategory] = useState([])
  const [searchBrand, setSearchBrand] = useState([])
  const [priceOrder, setPriceOrder] = useState('')
  const [isFiltering, setIsFiltering] = useState(false)
  const [prodExistence, setProdExistence] = useState(null)
  const [initialProductQuantities, setInitialProductQuantities] = useState({})
  const [isTypeSearch, setIsTypeSearch] = useState('')
  const [addedProducts, setAddedProducts] = useState([])

  console.log("addedProducts")
  console.log(addedProducts)

  console.log(selectedOrder.products)


  useEffect(() => {
    const getProducts = async () => {
      const productsInfo = await AsyncStorage.getItem('products')
      const productsJson = JSON.parse(productsInfo)
      const filteredProducts = (productsJson || []).filter(product => product.existencia > 0)
      const allProducts = (productsJson || [])

      setProducts(filteredProducts)
      setListProducts2(allProducts)

    }
    getProducts()
  }, []) 

  useEffect(()=>{
    const getTypeSearch = async() =>{
      let token = await AsyncStorage.getItem('tokenUser')
      const decodedToken = jwtDecode(token)
      const typeSearch = decodedToken.typeSearch

      setIsTypeSearch(typeSearch)
    }

    getTypeSearch()
  }, [])
  
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

  useEffect(() => {
    const initializeProductQuantities = () => {
      const initialQuantities = {}
      selectedOrder.products.forEach(item => {
        initialQuantities[item.codigo] = item.quantity
      })
      setInitialProductQuantities(initialQuantities)
      setProductQuantities(initialQuantities)
      setSelectedProductsCount(Object.keys(initialQuantities).length)
    }
    initializeProductQuantities()
  }, [selectedOrder])

  useEffect(() => {
    let filteredProducts = products.filter(product => product.existencia > 0)

    if (displaySearchProduct.length >= 3) {
      const searchWords = displaySearchProduct.toLowerCase().split(' ')
      filteredProducts = filteredProducts.filter(product =>
        searchWords.every(word => product.descrip.toLowerCase().includes(word))
      )
    }

    const start = (currentPage - 1) * itemsPerPage
    const end = currentPage * itemsPerPage
    const paginatedProducts = filteredProducts.slice(start, end)

    const updatedVisibleProducts = paginatedProducts
    .filter(product => product.existencia > 0)
    .map(product => ({
      ...product,
      quantity: productQuantities[product.codigo] || 0,
      selected: product.codigo in productQuantities
    }))

    setVisibleProducts(updatedVisibleProducts)
  }, [currentPage, products, displaySearchProduct, productQuantities])

  useEffect(() => {
    applyFilters()
  }, [currentPage, products, displaySearchProduct, searchCategory, searchBrand, priceOrder])

  useEffect(() => {
    setIsFiltering(searchCategory.length > 0 || searchBrand.length > 0 || priceOrder !== '')
  }, [searchCategory, searchBrand, priceOrder])

  const openFilterModal = () => {
    setIsFilterModalVisible(true)
  }

  const closeFilterModal = () => {
    setIsFilterModalVisible(false)
  }

  const handleInputChange = (text) => {
    setSearchProduct(text)

    if (isTypeSearch === 2) {
      setDisplaySearchProduct(text)
      setCurrentPage(1)
    }
  }

  const handleSearch = () => {
    if (searchProduct.length === 0) {
      setDisplaySearchProduct('')
      setCurrentPage(1)
      return
    }
  
    if (searchProduct.length < 3) {
      Alert.alert('Por favor ingrese al menos tres letras para buscar')
      return
    }
  
    setDisplaySearchProduct(searchProduct)
    setCurrentPage(1)
  }

  const handleProductSelection = useCallback((product) => {
    const updatedProductQuantities = { ...productQuantities }

    if (!updatedProductQuantities[product.codigo]) {
      updatedProductQuantities[product.codigo] = 1 // Establecer cantidad por defecto a 1
      setSelectedProductsCount(prevCount => prevCount + 1)
    }

    setProductQuantities(updatedProductQuantities)
    setProducts(products.map(p =>
      p.codigo === product.codigo ? { ...p, selected: !p.selected } : p
    ))
  }, [productQuantities, products])

  const handleQuantityChange = useCallback((productId, text) => {
    if (!/^\d*$/.test(text)) { // Permitir cadena vacía para la entrada de cantidad
      Alert.alert('Cantidad no válida', 'Por favor ingrese solo números enteros positivos.')
      return
    }

    const quantity = text === '' ? 0 : parseInt(text, 10)

    const product = products.find(p => p.codigo === productId)
    
    console.log("product handle changed")
    console.log(product)

    // No modificar la existencia del producto en el inventario
    if (prodExistence === 0 && quantity > 0) {
      const updatedProductQuantities = { ...productQuantities }
      const wasSelected = updatedProductQuantities[productId] > 0
  
      updatedProductQuantities[productId] = quantity
  
      if (quantity > 0 && !wasSelected) {
        setSelectedProductsCount(prevCount => prevCount + 1)
      } else if (quantity === 0 && wasSelected) {
        setSelectedProductsCount(prevCount => prevCount - 1)
      }
  
      setProductQuantities(updatedProductQuantities)
      return
    }

    const productOrder = selectedOrder.products.find(p => p.codigo === productId) || { exists: 0 }

    setproducCant(productOrder.exists)

    if (quantity > product.existencia + productOrder.exists) { // Se debe verificar contra la existencia del inventario
      Alert.alert('Cantidad no disponible', `La cantidad ingresada: ${quantity} supera la cantidad existente en el inventario: ${product.existencia}`)
      handleProductDelete(productId)
      return
    }
  
    const updatedProductQuantities = { ...productQuantities }

    const wasSelected = updatedProductQuantities[productId] > 0
    
    updatedProductQuantities[productId] = quantity
    
  
    if (quantity > 0 && !wasSelected) {
      setSelectedProductsCount(prevCount => prevCount + 1)
    
      // Verificar si el producto ya está en el arreglo `addedProducts` comparando por `codigo` o cualquier otro campo
      const existingProduct = addedProducts.find(p => p.codigo === product.codigo);
      console.log("existingProduct");
      console.log(existingProduct);
    
      if (existingProduct) {
        // Si el producto ya existe, actualizar toda su información (no solo la cantidad)
        const updatedProducts = addedProducts.map(p => 
          p.codigo === product.codigo 
            ? { ...p, quantity, exists: producCant, priceUsd: product.precioUsd, priceBs: product.precioBs }
            : p
        );
    
        // Actualizar el estado con el producto actualizado
        setAddedProducts(updatedProducts);
        console.log("Producto actualizado:");
        console.log(existingProduct);

      } else {
        // Si el producto no existe, agregarlo al arreglo
        const addedProduct = {
          codigo: product.codigo,
          descrip: product.descrip,
          exists: producCant,
          quantity,
          priceUsd: product.precioUsd,
          priceBs: product.precioBs,
        }
    
        // Actualizar el estado con el nuevo producto agregado
        setAddedProducts(prevProducts => [...prevProducts, addedProduct]);
        console.log("Producto agregado:");
        console.log(addedProduct);
      }
    }else if (quantity > 0 && wasSelected) {
    
      // Verificar si el producto ya está en el arreglo `addedProducts` comparando por `codigo` o cualquier otro campo
      const existingProduct = addedProducts.find(p => p.codigo === product.codigo);
      console.log("existingProduct");
      console.log(existingProduct);
    
      if (existingProduct) {
        // Si el producto ya existe, actualizar toda su información (no solo la cantidad)
        const updatedProducts = addedProducts.map(p => 
          p.codigo === product.codigo 
            ? { ...p, quantity, exists: producCant, priceUsd: product.precioUsd, priceBs: product.precioBs }
            : p
        );
    
        // Actualizar el estado con el producto actualizado
        setAddedProducts(updatedProducts);
        console.log("Producto actualizado:");
        console.log(existingProduct);

      } else {
        // Si el producto no existe, agregarlo al arreglo
        const addedProduct = {
          codigo: product.codigo,
          descrip: product.descrip,
          exists: producCant,
          quantity,
          priceUsd: product.precioUsd,
          priceBs: product.precioBs,
        }
    
        // Actualizar el estado con el nuevo producto agregado
        setAddedProducts(prevProducts => [...prevProducts, addedProduct]);
        console.log("Producto agregado:");
        console.log(addedProduct);
      }
    }
    else if (quantity === 0 && wasSelected) {
      setSelectedProductsCount(prevCount => prevCount - 1)
    }

    // const selectedProductsWithQuantities = Object.entries(updatedProductQuantities).map(([codigo, quantity]) => {
      
    //   // console.log('codigo')
    //   // console.log(codigo)

    //   // console.log('quantity')
    //   // console.log(quantity)

    //   const product = listproducts2.find(p => p.codigo === codigo)
    //   // .filter
    //   // console.log(product)

    //   // console.log("product exists")
    //   // console.log(producCant)

    //   return {
    //     codigo: product.codigo,
    //     descrip: product.descrip,
    //     exists: producCant,
    //     quantity,
    //     priceUsd: product.precioUsd,
    //     priceBs: product.precioBs,
    //   }
    // })
    // console.log('selectedProductsWithQuantities')
    // console.log(selectedProductsWithQuantities)


    setProductQuantities(updatedProductQuantities)
  }, [productQuantities, products, prodExistence])

  const handleProductDelete = useCallback((productId) => {
    const updatedProductQuantities = { ...productQuantities }
    delete updatedProductQuantities[productId]
    setProductQuantities(updatedProductQuantities)
    setSelectedProductsCount(prevCount => prevCount - 1)
  }, [productQuantities])

  const renderPaginationButtons = () => {
    let filteredProducts = products.slice()

    const minLength = isTypeSearch === 2 ? 1 : 3

    if (displaySearchProduct.length >= minLength) {
      const searchTerms = displaySearchProduct.toLowerCase().split(' ').filter(term => term.length > minLength)
      
      filteredProducts = filteredProducts.filter(product => {
        const productDescrip = product.descrip.toLowerCase()
        return searchTerms.every(term => productDescrip.includes(term))
      })
    }
    if (searchCategory.length > 0 || searchBrand.length > 0) {
      filteredProducts = filteredProducts.filter(product =>
        searchCategory.some(category => product.ncate.includes(category)) ||
        searchBrand.some(brand => product.nmarca.includes(brand))
      )
    }

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)

    // Si no hay búsqueda ni filtros, establecer las páginas por defecto en 5
    const maxPages = (displaySearchProduct.length === 0 && searchCategory.length === 0 && searchBrand.length === 0) ? 5 : totalPages

    let buttons = []
    let startPage = Math.max(1, currentPage - 2)
    let endPage = Math.min(maxPages, startPage + 4)

    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4)
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <Pressable
          key={i}
          style={[styles.pageButton, currentPage === i && styles.pageButtonActive]}
          onPress={() => setCurrentPage(i)}
        >
          <Text style={[styles.pageButtonText, currentPage === i && styles.pageButtonTextActive]}>
            {i}
          </Text>
        </Pressable>
      )
    }
    return buttons
  }

  const handleSaveFilters = (selectedFilters) => {
    console.log('Filtros seleccionados:', selectedFilters)
    setSearchCategory(selectedFilters.selectedCategory || '')
    setSearchBrand(selectedFilters.selectedBrand || '')
    setPriceOrder(selectedFilters.selectedPriceOrder || '')
    setCurrentPage(1) // Reiniciar a la primera página al aplicar filtros
  }

  const applyFilters = () => {
    let filteredProducts = products.slice()

    const minLength = isTypeSearch === 2 ? 1 : 3

    if (displaySearchProduct.length >= minLength) {
      const searchTerms = displaySearchProduct.toLowerCase().split(' ').filter(term => term.length > 0)
      filteredProducts = filteredProducts.filter(product => {
        const productDescrip = product.descrip.toLowerCase()
        return searchTerms.every(term => productDescrip.includes(term))
      })
      
      // Mostrar alerta si no se encontraron productos
      if (filteredProducts.length === 0) {
        Alert.alert('Producto no encontrado', 'No se encontró ningún producto con ese nombre.')
        setSearchProduct('')
        setDisplaySearchProduct('')
        setCurrentPage(1)
        return
      }
    }

    if (searchCategory.length > 0 || searchBrand.length > 0) {
      filteredProducts = filteredProducts.filter(product =>
        searchCategory.some(category => product.ncate.includes(category)) ||
        searchBrand.some(brand => product.nmarca.includes(brand))
      )
    }

    // Ordenar según el precio si se selecciona
    if (priceOrder === 'menor-mayor') {
      filteredProducts = filteredProducts.sort((a, b) => a.precioUsd - b.precioUsd)
    } else if (priceOrder === 'mayor-menor') {
      filteredProducts = filteredProducts.sort((a, b) => b.precioUsd - a.precioUsd)
    }

    // Calcular productos visibles según la paginación
    const start = (currentPage - 1) * itemsPerPage
    const end = start + itemsPerPage
    setVisibleProducts(filteredProducts.slice(start, end))

    // Ajustar página si se filtra y no hay suficientes productos para la página actual
    if (filteredProducts.length > 0 && currentPage > Math.ceil(filteredProducts.length / itemsPerPage)) {
      setCurrentPage(1)
    }
  }


  // const generateSelectedProductJSON = () => {
  //   const selectedProductsWithQuantities = Object.entries(productQuantities).map(([codigo, quantity]) => {
  //     // Buscar el producto correspondiente por su código
  //     const product = listproducts2.find(p => p.codigo === codigo)
  
  //     // Si el producto se está agregando o actualizando, se debe modificar la existencia solo de ese producto
  //     const updatedProduct = {
  //       codigo: product.codigo,
  //       descrip: product.descrip,
  //       exists: producCant,
  //       quantity,
  //       priceUsd: product.precioUsd,
  //       priceBs: product.precioBs,
  //     }
  
  //     return updatedProduct
  //   })
  
  //   console.log('selectedProductsWithQuantities')
  //   console.log(selectedProductsWithQuantities)
  
  //   return selectedProductsWithQuantities
  // }

  const generateSelectedProductJSON = () => {
    // Creamos un array para almacenar los productos finales
    const finalProducts = [];
  
    // Primero, recorremos los productos existentes (selectedOrder.products)
    selectedOrder.products.forEach(product => {
      // Buscamos si el producto ya está en addedProducts (productos agregados)
      const updatedProduct = addedProducts.find(p => p.codigo === product.codigo);
  
      if (updatedProduct) {
        // Si el producto ya está en addedProducts, actualizamos la cantidad y la existencia
        finalProducts.push({
          ...product,
          quantity: updatedProduct.quantity, // Actualizamos la cantidad del producto
          exists: updatedProduct.exists,     // Actualizamos la existencia del producto
          priceUsd: updatedProduct.priceUsd, // Actualizamos el precio en USD
          priceBs: updatedProduct.priceBs,   // Actualizamos el precio en Bs
        });
      } else {
        // Si no está en addedProducts, lo agregamos tal cual
        finalProducts.push(product);
      }
    });
  
    // Ahora agregamos los productos nuevos que no estaban en selectedOrder.products
    addedProducts.forEach(product => {
      // Si el producto no está ya en finalProducts, lo agregamos
      const existsInFinalProducts = finalProducts.some(p => p.codigo === product.codigo);
      if (!existsInFinalProducts) {
        finalProducts.push({
          ...product,
          quantity: product.quantity,
          exists: producCant,
          priceUsd: product.priceUsd,
          priceBs: product.priceBs,
        });
      }
    });
  
    console.log('Final Products:', finalProducts);
  
    return finalProducts;
  };
  

  const handleCancel = () => {
    setProductQuantities(initialProductQuantities)
    setSelectedProductsCount(Object.keys(initialProductQuantities).length)
    onClose()
  }
  

  return (
    <Modal visible={isVisible} animationType="slide">
      <ImageBackground
        source={images.fondo}
        style={styles.gradientBackground}
      >
        <View style={styles.container}>
          <View style={styles.mainTitleContainer}>
            <Text style={styles.mainTitle}>Seleccionar Productos</Text>
          </View>

          <View style={styles.finderContainer}>
            <View style={styles.seekerContainer}>
              <TextInput
                placeholder='Buscar Producto'
                style={styles.seeker}
                value={searchProduct}
                onChangeText={handleInputChange}
              />
              <Pressable onPress={handleSearch}>
                <FontAwesome name="search" size={28} color="#8B8B8B" />
              </Pressable>
            </View>
            <TouchableOpacity onPress={openFilterModal} style={styles.filterContainer}>
              <Text style={styles.textFilter}>Filtrar</Text>
              <MaterialIcons name="filter-alt" size={28} color="white" />
              {isFiltering && (
                <FontAwesome name="circle" size={20} color="red" style={styles.filterIndicator} />
              )}
            </TouchableOpacity>
          </View>

          <FilterCategories
            visible={isFilterModalVisible}
            onClose={closeFilterModal}
            onSave={handleSaveFilters}
          />

          <View style={styles.productContainer}>
            <View style={styles.headerProductContainer}>
              <View style={styles.titleListContainer}>
                <Text style={styles.titleListProduct}>Producto</Text>
                <Text style={styles.titleListActions}>Acciones</Text>
              </View>
            </View>

            <View style={styles.listContainer}>
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

                    {productQuantities[product.codigo] > 0 && (
                      <Pressable
                        style={styles.button}
                        onPress={() => handleProductDelete(product.codigo)}
                      >
                        <MaterialIcons name="delete" size={33} color="#7A7A7B" />
                      </Pressable>
                    )}

                    <View style={styles.buttonMore}>
                    <Pressable
                      onPress={() => {
                        setSelectedProduct(product)
                        setIsProductModalVisible(true)
                      }}
                    >
                      <MaterialIcons name="more-vert" size={33} color="#7A7A7B" />
                    </Pressable>
                    </View>

                  </View>
                </View>
              ))}
              </ScrollView>
            </View>

          </View>

          <View style={styles.pagination}>
            <ScrollView horizontal style={styles.paginationContainer}>
              {renderPaginationButtons()}
            </ScrollView>
          </View>

          <View style={styles.buttonsAction}>
            <Pressable style={styles.buttonExit} onPress={handleCancel}>
              <Text style={styles.buttonText}>Salir</Text>
            </Pressable>
            <Pressable
              style={styles.buttonModal}
              onPress={() => {
                if (Object.keys(productQuantities).length === 0) {
                  Alert.alert('Pedido Vacío', 'Por favor seleccione al menos un producto antes de guardar el pedido.')
                  return
                }
                const selectedProducts = generateSelectedProductJSON()
                onSave(selectedProducts)
                onClose()
              }}
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
        </View>
      </ImageBackground>
    </Modal>
  )
}

export default SelectProducts
