import React, { useState, useEffect } from 'react'
import { Text, View, FlatList, Pressable, TextInput, ScrollView, TouchableOpacity, Alert, ImageBackground } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { MaterialIcons, FontAwesome } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import ModalProducts from './ModalProducts'
import FilterCategories from '../filter/FilterCategories'
// Styles
import { images } from '../../constants'
import styles from '../../styles/ListProducts.styles'
// JWT - Token
import { jwtDecode }                        from 'jwt-decode'
import { decode }                           from 'base-64'
global.atob = decode

const ListProducts = () => {
  const [products, setProducts] = useState([])
  const [visibleProducts, setVisibleProducts] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false)
  const [searchProduct, setSearchProduct] = useState('')
  const [displaySearchProduct, setDisplaySearchProduct] = useState('')
  const [searchCategory, setSearchCategory] = useState([])
  const [searchBrand, setSearchBrand] = useState([])
  const [priceOrder, setPriceOrder] = useState('')
  const [page, setPage] = useState(1)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const itemsPerPage = 10
  const [isFiltering, setIsFiltering] = useState(false)
  const [isTypeSearch, setIsTypeSearch] = useState('')

  useEffect(() => {
    const getProductsAndCategories = async () => {
      try {
        const productsInfo = await AsyncStorage.getItem('products')
        const productsJson = JSON.parse(productsInfo)
        const filteredProducts = (productsJson || []).filter(product => product.existencia > 0)
        setProducts(filteredProducts)
      } catch (error) {
        console.error('Error al obtener datos de AsyncStorage:', error)
      }
    }
  
    getProductsAndCategories()
  
    const intervalId = setInterval(() => {
      getProductsAndCategories()
    }, 10000)
  
    return () => clearInterval(intervalId)
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
    applyFilters()
  }, [page, products, displaySearchProduct, searchCategory, searchBrand, priceOrder])

  useEffect(() => {
    setIsFiltering(searchCategory.length > 0 || searchBrand.length > 0 || priceOrder !== '')
  }, [searchCategory, searchBrand, priceOrder])


  const applyFilters = () => {
    let filteredProducts = products.slice()

    const minLength = isTypeSearch === 2 ? 1 : 3

    // Filtrar por nombre del producto
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
        setPage(1)
        return
      }
    }

    // Filtrar por categoría o marca seleccionada
    if (searchCategory.length > 0 || searchBrand.length > 0) {
      filteredProducts = filteredProducts.filter(product =>
        searchCategory.some(category => product.ncate.includes(category)) ||
        searchBrand.some(brand => product.nmarca.includes(brand))
      )
    }

    // Ordenar por precio si está seleccionado
    if (priceOrder === 'menor-mayor') {
      filteredProducts = filteredProducts.sort((a, b) => a.precioUsd - b.precioUsd)
    } else if (priceOrder === 'mayor-menor') {
      filteredProducts = filteredProducts.sort((a, b) => b.precioUsd - a.precioUsd)
    }

    // Paginación
    const start = (page - 1) * itemsPerPage
    const end = start + itemsPerPage
    setVisibleProducts(filteredProducts.slice(start, end))

    // Ajustar la página si no hay suficientes productos para la página actual
    if (filteredProducts.length > 0 && page > Math.ceil(filteredProducts.length / itemsPerPage)) {
      setPage(1)
    }
  }

  const handleSaveFilters = (selectedFilters) => {
    setSearchCategory(selectedFilters.selectedCategory || [])
    setSearchBrand(selectedFilters.selectedBrand || [])
    setPriceOrder(selectedFilters.selectedPriceOrder || '')
    setPage(1)
  }

  const handleInputChange = (text) => {
    setSearchProduct(text)

    if (isTypeSearch === 2) { // Búsqueda en tiempo real
      setDisplaySearchProduct(text)
      setPage(1)
    }
  }

  const handleSearch = () => {
    if (searchProduct.length === 0) {
      setDisplaySearchProduct('')
      setPage(1)
      return
    }

    if (searchProduct.length < 3) {
      Alert.alert('Por favor ingrese al menos tres letras para buscar')
      return
    }

    setDisplaySearchProduct(searchProduct)
    setPage(1)
  }

  const renderElements = ({ item }) => {
    return (
      <View style={styles.productItem}>
        <View style={styles.nameProd}>
          <Text>{item.descrip}</Text>
        </View>
        <View style={styles.buttonAction}>
          <Pressable
            style={styles.button}
            onPress={() => {
              setSelectedProduct(item)
              setIsModalVisible(true)
            }}
          >
            <MaterialIcons name="more-vert" size={30} color="#7A7A7B" />
          </Pressable>
        </View>
      </View>
    )
  }

  const renderPaginationButtons = () => {
    let filteredProducts = products.slice()

    const minLength = isTypeSearch === 2 ? 1 : 3

    // Aplicar filtros según la búsqueda, categoría y marca seleccionada
    if (displaySearchProduct.length >= minLength) {
      const searchTerms = displaySearchProduct.toLowerCase().split(' ').filter(term => term.length >= minLength)
      
      filteredProducts = filteredProducts.filter(product => {
        const productDescrip = product.descrip.toLowerCase();
        
        // Buscar coincidencias completas de términos
        return searchTerms.some(term => productDescrip.includes(term));
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
    let startPage = Math.max(1, page - 2)
    let endPage = Math.min(maxPages, startPage + 4)

    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4)
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <Pressable
          key={i}
          style={[styles.pageButton, page === i && styles.pageButtonActive]}
          onPress={() => setPage(i)}
        >
          <Text style={[styles.pageButtonText, page === i && styles.pageButtonTextActive]}>
            {i}
          </Text>
        </Pressable>
      )
    }
    return buttons
  }

  const openFilterModal = () => {
    setIsFilterModalVisible(true)
  }

  const closeFilterModal = () => {
    setIsFilterModalVisible(false)
  }

  return (
    <ImageBackground
      source={images.fondo}
      style={styles.gradientBackground}
    >
      <View style={styles.list}>
        <View style={styles.titlePage}>
          <Text style={styles.title}>Inventario</Text>
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

        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Producto</Text>
              <Text style={styles.headerTitleButton}>Acciones</Text>
            </View>
          </View>
          <View style={styles.listContainer}>
            <FlatList
              data={visibleProducts}
              keyExtractor={(item) => item.codigo}
              renderItem={renderElements}
            />
          </View>
        </View>

        <ScrollView horizontal style={styles.paginationContainer}>
          {renderPaginationButtons()}
        </ScrollView>

        {selectedProduct && (
          <ModalProducts
            isVisible={isModalVisible}
            onClose={() => setIsModalVisible(false)}
            product={selectedProduct}
          />
        )}
      </View>
    </ImageBackground>
  )
}

export default ListProducts
