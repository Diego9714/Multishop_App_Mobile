// SelectProducts.js
import React, { useState, useEffect, useCallback } from 'react';
import { Text, View, Pressable, Modal, TextInput, ScrollView, Alert } from 'react-native';
import { AntDesign, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../../styles/SelectProducts.styles';
import ModalProduct from '../products/ModalProducts'; // Adjust path as necessary

const SelectProducts = ({ isVisible, onClose, selectedOrder, onSave }) => {
  const [selectedProductsCount, setSelectedProductsCount] = useState(0);
  const [products, setProducts] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [searchProduct, setSearchProduct] = useState('');
  const [displaySearchProduct, setDisplaySearchProduct] = useState('');
  const [productQuantities, setProductQuantities] = useState({});
  const [currentPage, setCurrentPage] = useState(1); // Changed from `page` to `currentPage`
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isProductModalVisible, setIsProductModalVisible] = useState(false);
  const itemsPerPage = 10;
  const defaultMaxPages = 5;

  useEffect(() => {
    const getProducts = async () => {
      const productsInfo = await AsyncStorage.getItem('products');
      const productsJson = JSON.parse(productsInfo);
      setProducts(productsJson || []);
    };
    getProducts();
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
    let filteredProducts = products;

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

  const handleSearch = () => {
    if (searchProduct.length > 0 && searchProduct.length < 3) {
      Alert.alert('Por favor ingrese al menos tres letras para buscar');
      return;
    }

    const searchWords = searchProduct.toLowerCase().split(' ');
    const filteredProducts = products.filter(product =>
      searchWords.every(word => product.descrip.toLowerCase().includes(word))
    );

    if (filteredProducts.length === 0) {
      Alert.alert('Producto no encontrado', 'El producto buscado no existe.');
      setSearchProduct('');
      setDisplaySearchProduct('');
      setCurrentPage(1); // Changed from `setPage(1)` to `setCurrentPage(1)`
      return;
    }

    setDisplaySearchProduct(searchProduct);
    setCurrentPage(1); // Changed from `setPage(1)` to `setCurrentPage(1)`
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
    if (!/^\d+$/.test(text) || parseInt(text) < 1) {
      Alert.alert('Cantidad no válida', 'Por favor ingrese solo números enteros positivos mayores que cero.');
      return;
    }

    const quantity = parseInt(text, 10);
    const product = products.find(p => p.codigo === productId);

    if (quantity > product.existencia) {
      Alert.alert('Cantidad no disponible', 'La cantidad ingresada supera la cantidad existente en el inventario.');
      return;
    }

    const updatedProductQuantities = { ...productQuantities };
    updatedProductQuantities[productId] = quantity;

    setProductQuantities(updatedProductQuantities);
    setSelectedProductsCount(Object.keys(updatedProductQuantities).length);
  }, [productQuantities, products]);

  const handleProductDelete = useCallback((productId) => {
    const updatedProductQuantities = { ...productQuantities };
    delete updatedProductQuantities[productId];
    setProductQuantities(updatedProductQuantities);
    setSelectedProductsCount(prevCount => prevCount - 1);
  }, [productQuantities]);

  const renderPaginationButtons = () => {
    const searchWords = displaySearchProduct.toLowerCase().split(' ');
    const filteredProducts = products.filter(product =>
      searchWords.every(word => product.descrip.toLowerCase().includes(word))
    );
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    let buttons = [];
    let maxPagesToShow = displaySearchProduct ? totalPages : Math.min(totalPages, defaultMaxPages);
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(maxPagesToShow, startPage + 4);

    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <Pressable
          key={i}
          style={[styles.pageButton, currentPage === i && styles.pageButtonActive]}
          onPress={() => setCurrentPage(i)} // Changed from `setPage(i)` to `setCurrentPage(i)`
        >
          <Text style={styles.pageButtonText}>{i}</Text>
        </Pressable>
      );
    }
    return buttons;
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
    </Modal>
  );
};

export default SelectProducts;
