import React, { useState, useEffect } from 'react';
import { Modal, View, Text, ScrollView, Pressable, ImageBackground, TouchableOpacity, TextInput, FlatList, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../../styles/ReportProdModal.styles';
import { images } from '../../constants';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import ModalFilterProducts from './ModalFilterProducts';

const ReportProducts = ({ isVisible, onClose }) => {
  const [products, setProducts] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const [filters, setFilters] = useState({
    selectedPriceOrder: null,
    selectedQuantityOrder: null,
  });
  const [searchProduct, setSearchProduct] = useState('');
  const [displaySearchProduct, setDisplaySearchProduct] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const [isFiltering, setIsFiltering] = useState(false);

  useEffect(() => {
    fetchOrders();

    const intervalId = setInterval(() => {
      fetchOrders();
    }, 10000)
  
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    applyFilters();
  }, [page, products, displaySearchProduct, filters]);

  useEffect(() => {
    setIsFiltering(filters.selectedPriceOrder !== null || filters.selectedQuantityOrder !== null);
  }, [filters.selectedPriceOrder, filters.selectedQuantityOrder]);

  const fetchOrders = async () => {
    try {
      const synchronizedOrdersString = await AsyncStorage.getItem('SynchronizedOrders');
      const synchronizedOrders = synchronizedOrdersString ? JSON.parse(synchronizedOrdersString) : [];
      aggregateProducts(synchronizedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const aggregateProducts = (orders) => {
    const productMap = {};
  
    orders.forEach(order => {
      order.products.forEach(product => {
        if (productMap[product.codigo]) {
          productMap[product.codigo].quantity += product.quantity;
        } else {
          productMap[product.codigo] = { ...product };
        }
      });
    });
  
    let allProducts = Object.values(productMap);
  
    // Filtrar por precio
    if (filters.selectedPriceOrder) {
      allProducts.sort((a, b) => {
        const priceA = a.quantity * a.priceUsd;
        const priceB = b.quantity * b.priceUsd;
        if (filters.selectedPriceOrder === 'precio-menor') {
          return priceA - priceB;
        } else if (filters.selectedPriceOrder === 'precio-mayor') {
          return priceB - priceA;
        }
        return 0;
      });
    }
  
    setProducts(allProducts);
  };

  const applyFilters = () => {
    let filteredProducts = products.slice();
  
    // Filtrar por nombre del producto
    if (displaySearchProduct.length >= 3) {
      const searchTerms = displaySearchProduct.toLowerCase().split(' ').filter(term => term.length > 0);
      filteredProducts = filteredProducts.filter(product => {
        const productDescrip = product.descrip.toLowerCase();
        return searchTerms.every(term => productDescrip.includes(term));
      });
  
      if (filteredProducts.length === 0) {
        Alert.alert('Producto no encontrado', 'No se encontró ningún producto con ese nombre.');
        setSearchProduct('');
        setDisplaySearchProduct('');
        setPage(1);
        return;
      }
    }
  
    // Filtrar por precio
    if (filters.selectedPriceOrder) {
      filteredProducts.sort((a, b) => {
        const priceA = a.quantity * a.priceUsd;
        const priceB = b.quantity * b.priceUsd;
        if (filters.selectedPriceOrder === 'precio-menor') {
          return priceA - priceB;
        } else if (filters.selectedPriceOrder === 'precio-mayor') {
          return priceB - priceA;
        }
        return 0;
      });
    }
  
    // Aplicar el filtro de cantidad
    if (filters.selectedQuantityOrder) {
      filteredProducts.sort((a, b) => {
        if (filters.selectedQuantityOrder === 'cantidad-menor') {
          return a.quantity - b.quantity;
        } else if (filters.selectedQuantityOrder === 'cantidad-mayor') {
          return b.quantity - a.quantity;
        }
        return 0;
      });
    }
  
    // Paginación
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    setVisibleProducts(filteredProducts.slice(start, end));
  
    if (filteredProducts.length > 0 && page > Math.ceil(filteredProducts.length / itemsPerPage)) {
      setPage(1);
    }
  };

  const handleFilterPress = () => {
    setFilterModalVisible(true);
  };

  const handleSaveFilters = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleSearch = () => {
    if (searchProduct.length === 0) {
      setDisplaySearchProduct('');
      setPage(1);
      return;
    }

    if (searchProduct.length < 3) {
      Alert.alert('Por favor ingrese al menos tres letras para buscar');
      return;
    }

    setDisplaySearchProduct(searchProduct);
    setPage(1);
  };

  const renderElements = ({ item }) => (
    <View style={styles.productItem}>
      <View style={styles.nameProd}>
        <Text>{item.descrip}</Text>
      </View>
      <View style={styles.priceContainer}>
        <Text>{item.quantity}</Text>
      </View>
      <View style={styles.buttonAction}>
        <Text>{(item.quantity * item.priceUsd).toFixed(2).replace('.', ',')}</Text>
      </View>
    </View>
  );

  const renderPaginationButtons = () => {
    const totalPages = Math.min(Math.ceil(products.length / itemsPerPage), 5);

    let buttons = [];
    let startPage = Math.max(1, page - 2);
    let endPage = Math.min(totalPages, startPage + 4);

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

  return (
    <Modal transparent={true} visible={isVisible} onRequestClose={onClose} animationType="slide">
      <ImageBackground source={images.fondo} style={styles.gradientBackground}>
        <View style={styles.container}>
          <View style={styles.mainTitleContainer}>
            <Text style={styles.mainTitle}>Historial de Productos</Text>
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
            <TouchableOpacity style={styles.filterContainer} onPress={handleFilterPress}>
              <Text style={styles.textFilter}>Filtrar</Text>
              <MaterialIcons name="filter-alt" size={28} color="white" />
              {isFiltering && (
                <FontAwesome name="circle" size={20} color="red" style={styles.filterIndicator} />
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.productContainer}>
            <View style={styles.headerProductContainer}>
              <View style={styles.titleListContainer}>
                <Text style={styles.titleListClient}>Producto</Text>
                <Text style={styles.titleListPrice}>Cantidad</Text>
                <Text style={styles.titleListActions}>Total (USD)</Text>
              </View>
            </View>

            <FlatList
              data={visibleProducts}
              keyExtractor={(item) => item.codigo}
              renderItem={renderElements}
            />
          </View>

          <View style={styles.paginationContainer}>
            {renderPaginationButtons()}
          </View>

          <View style={styles.buttonsAction}>
            <Pressable style={styles.buttonExit} onPress={onClose}>
              <Text style={styles.buttonText}>Salir</Text>
            </Pressable>
          </View>
        </View>
        <ModalFilterProducts
          visible={isFilterModalVisible}
          onClose={() => setFilterModalVisible(false)}
          onSave={handleSaveFilters}
          initialFilters={filters}
        />
      </ImageBackground>
    </Modal>
  );
};

export default ReportProducts;
