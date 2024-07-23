// SelectProducts.js
import React, { useState, useEffect, useCallback } from 'react';
import { Text, View, Pressable, Modal, TextInput, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { AntDesign, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient }                               from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../../styles/SelectProducts.styles';
import ModalProduct from '../products/ModalProducts'; // Adjust path as necessary
import FilterCategories from '../filter/FilterCategories';
// JWT - Token
import { jwtDecode } from 'jwt-decode';
import { decode } from 'base-64';
global.atob = decode;

const SelectProducts = ({ isVisible, onClose, selectedOrder, onSave }) => {
  const [selectedProductsCount, setSelectedProductsCount] = useState(0);
  const [products, setProducts] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [searchProduct, setSearchProduct] = useState('');
  const [displaySearchProduct, setDisplaySearchProduct] = useState('');
  const [productQuantities, setProductQuantities] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isProductModalVisible, setIsProductModalVisible] = useState(false);
  const itemsPerPage = 10;
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [searchCategory, setSearchCategory] = useState([]);
  const [searchBrand, setSearchBrand] = useState([]);
  const [priceOrder, setPriceOrder] = useState('');
  const [isFiltering, setIsFiltering] = useState(false);
  const [prodExistence, setProdExistence] = useState(null);

  useEffect(() => {
    const getProducts = async () => {
      const productsInfo = await AsyncStorage.getItem('products');
      const productsJson = JSON.parse(productsInfo);
      const filteredProducts = (productsJson || []).filter(product => product.existencia > 0);
      setProducts(filteredProducts);
    };
    getProducts();
  }, []); 
  
  useEffect(() => {
    const getExistence = async () => {
      try {
        const token = await AsyncStorage.getItem('tokenUser');
        const decodedToken = jwtDecode(token);
        const prodExists = decodedToken.prodExistence;
        setProdExistence(prodExists);
      } catch (error) {
        console.error('Error al obtener datos de AsyncStorage:', error);
      }
    };

    getExistence();
  }, []);


  useEffect(() => {
    const initializeProductQuantities = () => {
      const initialQuantities = {};
      selectedOrder.products.forEach(item => {
        initialQuantities[item.codigo] = item.quantity;
      });
      setProductQuantities(initialQuantities);
      setSelectedProductsCount(Object.keys(initialQuantities).length);
    };
    initializeProductQuantities();
  }, [selectedOrder]);

  useEffect(() => {
    let filteredProducts = products.filter(product => product.existencia > 0);

    if (displaySearchProduct.length >= 3) {
      const searchWords = displaySearchProduct.toLowerCase().split(' ');
      filteredProducts = filteredProducts.filter(product =>
        searchWords.every(word => product.descrip.toLowerCase().includes(word))
      );
    }

    const start = (currentPage - 1) * itemsPerPage;
    const end = currentPage * itemsPerPage;
    const paginatedProducts = filteredProducts.slice(start, end);

    const updatedVisibleProducts = paginatedProducts.map(product => ({
      ...product,
      quantity: productQuantities[product.codigo] || 0,
      selected: product.codigo in productQuantities
    }));

    setVisibleProducts(updatedVisibleProducts);
  }, [currentPage, products, displaySearchProduct, productQuantities]);

  useEffect(() => {
    applyFilters();
  }, [currentPage, products, displaySearchProduct, searchCategory, searchBrand, priceOrder]);

  useEffect(() => {
    setIsFiltering(searchCategory.length > 0 || searchBrand.length > 0 || priceOrder !== '');
  }, [searchCategory, searchBrand, priceOrder]);


  const openFilterModal = () => {
    setIsFilterModalVisible(true);
  };

  const closeFilterModal = () => {
    setIsFilterModalVisible(false);
  };

  const handleSearch = () => {
    if (searchProduct.length === 0) {
      setDisplaySearchProduct('');
      setCurrentPage(1);
      return;
    }
  
    if (searchProduct.length < 3) {
      Alert.alert('Por favor ingrese al menos tres letras para buscar');
      return;
    }
  
    setDisplaySearchProduct(searchProduct);
    setCurrentPage(1);
  };

  const handleProductSelection = useCallback((product) => {
    const updatedProductQuantities = { ...productQuantities };

    if (!updatedProductQuantities[product.codigo]) {
      updatedProductQuantities[product.codigo] = 1; // Establecer cantidad por defecto a 1
      setSelectedProductsCount(prevCount => prevCount + 1);
    }

    setProductQuantities(updatedProductQuantities);
    setProducts(products.map(p =>
      p.codigo === product.codigo ? { ...p, selected: !p.selected } : p
    ));
  }, [productQuantities, products]);

  const handleQuantityChange = useCallback((productId, text) => {
    if (!/^\d*$/.test(text)) { // Allow empty string for quantity input
      Alert.alert('Cantidad no válida', 'Por favor ingrese solo números enteros positivos.');
      return;
    }
  
    const quantity = text === '' ? 0 : parseInt(text, 10);
    const product = products.find(p => p.codigo === productId);
  
    // Allow any quantity greater than 0 if prodExistence is 0
    if (prodExistence === 0 && quantity > 0) {
      const updatedProductQuantities = { ...productQuantities };
      updatedProductQuantities[productId] = quantity;
  
      if (quantity > 0) {
        if (!product.selected) {
          product.selected = true;
          setSelectedProductsCount(prevCount => prevCount + 1);
        }
      } else {
        if (product.selected) {
          product.selected = false;
          setSelectedProductsCount(prevCount => Math.max(prevCount - 1, 0));
        }
      }
  
      setProductQuantities(updatedProductQuantities);
      setProducts(products.map(p =>
        p.codigo === productId ? { ...p, selected: quantity > 0 } : p
      ));
      return;
    }
  
    // Standard quantity check
    if (quantity > product.existencia) {
      Alert.alert('Cantidad no disponible', `La cantidad ingresada: ${quantity} supera la cantidad existente en el inventario: ${product.existencia}`);
      handleProductDelete(productId); // Deselect the product and clear the quantity if it exceeds the stock
      return;
    }
  
    const updatedProductQuantities = { ...productQuantities };
    updatedProductQuantities[productId] = quantity;
  
    if (quantity > 0) {
      if (!product.selected) {
        product.selected = true;
        setSelectedProductsCount(prevCount => prevCount + 1);
      }
    } else {
      if (product.selected) {
        product.selected = false;
        setSelectedProductsCount(prevCount => Math.max(prevCount - 1, 0));
      }
    }
  
    setProductQuantities(updatedProductQuantities);
    setProducts(products.map(p =>
      p.codigo === productId ? { ...p, selected: quantity > 0 } : p
    ));
  }, [productQuantities, products, prodExistence]);
  

  const handleProductDelete = useCallback((productId) => {
    const updatedProductQuantities = { ...productQuantities };
    delete updatedProductQuantities[productId];
    setProductQuantities(updatedProductQuantities);
    setSelectedProductsCount(prevCount => prevCount - 1);
  }, [productQuantities]);

  const renderPaginationButtons = () => {
    let filteredProducts = products.slice()

    if (displaySearchProduct.length >= 3) {
      const searchTerm = displaySearchProduct.toLowerCase();
      filteredProducts = filteredProducts.filter(product =>
        product.descrip.toLowerCase().includes(searchTerm)
      );
    }
    if (searchCategory.length > 0 || searchBrand.length > 0) {
      filteredProducts = filteredProducts.filter(product =>
        searchCategory.some(category => product.ncate.includes(category)) ||
        searchBrand.some(brand => product.nmarca.includes(brand))
      );
    }

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    // Si no hay búsqueda ni filtros, establecer las páginas por defecto en 5
    const maxPages = (displaySearchProduct.length === 0 && searchCategory.length === 0 && searchBrand.length === 0) ? 5 : totalPages;

    let buttons = [];
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(maxPages, startPage + 4);

    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4);
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
      );
    }
    return buttons;
  };

  const handleSaveFilters = (selectedFilters) => {
    console.log('Filtros seleccionados:', selectedFilters);
    setSearchCategory(selectedFilters.selectedCategory || '');
    setSearchBrand(selectedFilters.selectedBrand || '');
    setPriceOrder(selectedFilters.selectedPriceOrder || '');
    setCurrentPage(1); // Reiniciar a la primera página al aplicar filtros
  };

  const applyFilters = () => {
    let filteredProducts = products.slice()

    if (displaySearchProduct.length >= 3) {
      const searchTerm = displaySearchProduct.toLowerCase();
      filteredProducts = filteredProducts.filter(product =>
        product.descrip.toLowerCase().includes(searchTerm)
      );

      // Mostrar alerta si no se encontraron productos
      if (filteredProducts.length === 0) {
        Alert.alert('Producto no encontrado', 'No se encontró ningún producto con ese nombre.');
        setSearchProduct('');
        setDisplaySearchProduct('');
        setCurrentPage(1);
        return;
      }
    }

    if (searchCategory.length > 0 || searchBrand.length > 0) {
      filteredProducts = filteredProducts.filter(product =>
        searchCategory.some(category => product.ncate.includes(category)) ||
        searchBrand.some(brand => product.nmarca.includes(brand))
      );
    }

    // Ordenar según el precio si se selecciona
    if (priceOrder === 'menor-mayor') {
      filteredProducts = filteredProducts.sort((a, b) => a.precioUsd - b.precioUsd);
    } else if (priceOrder === 'mayor-menor') {
      filteredProducts = filteredProducts.sort((a, b) => b.precioUsd - a.precioUsd);
    }

    // Calcular productos visibles según la paginación
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    setVisibleProducts(filteredProducts.slice(start, end));

    // Ajustar página si se filtra y no hay suficientes productos para la página actual
    if (filteredProducts.length > 0 && currentPage > Math.ceil(filteredProducts.length / itemsPerPage)) {
      setCurrentPage(1);
    }
  };

  const generateSelectedProductJSON = () => {
    const selectedProductsWithQuantities = Object.entries(productQuantities).map(([codigo, quantity]) => {
      const product = products.find(p => p.codigo === codigo);
      return {
        codigo: product.codigo,
        descrip: product.descrip,
        exists: product.existencia,
        quantity,
        priceUsd: product.precioUsd,
        priceBs: product.precioBs,
      };
    });

    return selectedProductsWithQuantities;
  };

  return (
    <Modal visible={isVisible} animationType="slide">
      <LinearGradient
      colors={['#ffff', '#9bdef6', '#ffffff', '#9bdef6']}
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
                onChangeText={setSearchProduct}
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
                    {productQuantities[product.codigo] > 0 && (
                      <Pressable
                        style={styles.button}
                        onPress={() => handleProductDelete(product.codigo)}
                      >
                        <MaterialIcons name="delete" size={30} color="#7A7A7B" />
                      </Pressable>
                    )}
                    <Pressable
                      style={styles.buttonMore}
                      onPress={() => {
                        setSelectedProduct(product);
                        setIsProductModalVisible(true);
                      }}
                    >
                      <MaterialIcons name="more-vert" size={30} color="#7A7A7B" />
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
              onPress={() => {
                if (Object.keys(productQuantities).length === 0) {
                  Alert.alert('Pedido Vacío', 'Por favor seleccione al menos un producto antes de guardar el pedido.');
                  return;
                }
                const selectedProducts = generateSelectedProductJSON();
                onSave(selectedProducts);
                onClose();
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
      </LinearGradient>
    </Modal>
  );
};

export default SelectProducts;
