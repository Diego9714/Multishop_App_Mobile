import React, { useState, useEffect } from 'react';
import { Text, View, FlatList, Pressable, TextInput, ScrollView, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import ModalProducts from './ModalProducts';
import FilterCategories from '../FilterCategories';
import styles from '../../styles/ListProducts.styles';

const ListProducts = () => {
  const [products, setProducts] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [searchProduct, setSearchProduct] = useState('');
  const [displaySearchProduct, setDisplaySearchProduct] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  const [searchBrand, setSearchBrand] = useState('');
  const [priceOrder, setPriceOrder] = useState('');
  const [page, setPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const itemsPerPage = 10;

  useEffect(() => {
    const getProductsAndCategories = async () => {
      try {
        const productsInfo = await AsyncStorage.getItem('products');
        const productsJson = JSON.parse(productsInfo);
        setProducts(productsJson || []);
      } catch (error) {
        console.error('Error al obtener datos de AsyncStorage:', error);
      }
    };

    getProductsAndCategories(); // Siempre obtener los productos al inicio

  }, []); // Dependencia vacía para cargar una sola vez al inicio

  useEffect(() => {
    applyFilters();
  }, [page, products, displaySearchProduct, searchCategory, searchBrand, priceOrder]);

  const applyFilters = () => {
    let filteredProducts = products.slice(); // Copia de los productos para no modificar el estado original

    // Aplicar filtros según la búsqueda y categoría o marca seleccionada
    if (displaySearchProduct.length >= 3) {
      const searchTerms = displaySearchProduct.toLowerCase().split(' ').filter(term => term.length > 0);

      if (searchCategory) {
        filteredProducts = filteredProducts.filter(product =>
          searchTerms.every(term => product.ncate.toLowerCase().includes(term))
        );
      } else if (searchBrand) {
        filteredProducts = filteredProducts.filter(product =>
          searchTerms.every(term => product.nmarca.toLowerCase().includes(term))
        );
      } else {
        filteredProducts = filteredProducts.filter(product =>
          searchTerms.every(term => product.descrip.toLowerCase().includes(term))
        );
      }
    }

    // Ordenar según el precio si se selecciona
    if (priceOrder === 'menor-mayor') {
      filteredProducts = filteredProducts.sort((a, b) => a.precioUsd - b.precioUsd);
    } else if (priceOrder === 'mayor-menor') {
      filteredProducts = filteredProducts.sort((a, b) => b.precioUsd - a.precioUsd);
    }

    // Calcular productos visibles según la paginación
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    setVisibleProducts(filteredProducts.slice(start, end));

    // Mostrar alerta si no hay productos encontrados por marca o categoría
    if ((searchCategory || searchBrand) && filteredProducts.length === 0) {
      Alert.alert('Productos no encontrados', 'No se encontraron productos para la categoría o marca seleccionada.');
      setSearchCategory('');
      setSearchBrand('');
      setPage(1);
    }

    // Ajustar página si se filtra y no hay suficientes productos para la página actual
    if (filteredProducts.length > 0 && page > Math.ceil(filteredProducts.length / itemsPerPage)) {
      setPage(1);
    }
  };

  const handleSaveFilters = (selectedFilters) => {
    console.log('Filtros seleccionados:', selectedFilters);
    setSearchCategory(selectedFilters.selectedCategory || '');
    setSearchBrand(selectedFilters.selectedBrand || '');
    setPriceOrder(selectedFilters.selectedPriceOrder || '');
    setPage(1); // Reiniciar a la primera página al aplicar filtros
  };

  const handleSearch = () => {
    if (searchProduct.length > 0 && searchProduct.length < 3) {
      Alert.alert('Por favor ingrese al menos tres letras para buscar');
      return;
    }

    // Realizar búsqueda según el texto ingresado
    const searchTerms = searchProduct.toLowerCase().split(' ').filter(term => term.length > 0);

    if (searchCategory) {
      setDisplaySearchProduct(searchProduct);
      setSearchCategory(searchCategory);
    } else if (searchBrand) {
      setDisplaySearchProduct(searchProduct);
      setSearchBrand(searchBrand);
    } else {
      const filteredProducts = products.filter(product =>
        searchTerms.every(term => product.descrip.toLowerCase().includes(term))
      );

      if (filteredProducts.length === 0) {
        Alert.alert('Producto no encontrado', 'El producto buscado no existe.');
        setSearchProduct('');
        setDisplaySearchProduct('');
        setPage(1); // Reiniciar a la primera página si no se encuentran productos
        return;
      }

      setDisplaySearchProduct(searchProduct);
    }
    setPage(1); // Reiniciar a la primera página después de la búsqueda
  };

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
              setSelectedProduct(item);
              setIsModalVisible(true);
            }}
          >
            <MaterialIcons name="more-vert" size={30} color="#7A7A7B" />
          </Pressable>
        </View>
      </View>
    );
  };

  const renderPaginationButtons = () => {
    const searchTerms = displaySearchProduct.toLowerCase().split(' ').filter(term => term.length > 0);
    let filteredProducts = products.slice(); // Copia de los productos para no modificar el estado original
  
    // Aplicar filtros según la búsqueda y categoría o marca seleccionada
    if (displaySearchProduct.length >= 3) {
      if (searchCategory) {
        filteredProducts = filteredProducts.filter(product =>
          searchTerms.every(term => product.ncate.toLowerCase().includes(term))
        );
      } else if (searchBrand) {
        filteredProducts = filteredProducts.filter(product =>
          searchTerms.every(term => product.nmarca.toLowerCase().includes(term))
        );
      } else {
        filteredProducts = filteredProducts.filter(product =>
          searchTerms.every(term => product.descrip.toLowerCase().includes(term))
        );
      }
    }
  
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  
    let buttons = [];
    let maxPagesToShow = displaySearchProduct ? totalPages : 5; // Mostrar máximo 5 páginas si no hay búsqueda
    let startPage = Math.max(1, page - 2);
    let endPage = Math.min(maxPagesToShow, startPage + 4);
  
    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4);
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
      );
    }
    return buttons;
  };
  

  const openFilterModal = () => {
    setIsFilterModalVisible(true);
  };

  const closeFilterModal = () => {
    setIsFilterModalVisible(false);
  };

  return (
    <LinearGradient
    colors={['#ffff', '#9bdef6', '#ffffff', '#9bdef6']}
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
              onChangeText={(text) => setSearchProduct(text)}
            />
            <Pressable onPress={handleSearch}>
              <FontAwesome name="search" size={28} color="#8B8B8B" />
            </Pressable>
          </View>
          <TouchableOpacity onPress={openFilterModal} style={styles.filterContainer}>
            <Text style={styles.textFilter}>Filtrar</Text>
            <MaterialIcons name="filter-alt" size={28} color="white" />
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
    </LinearGradient>
  );
};

export default ListProducts;
