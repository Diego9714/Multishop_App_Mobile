import React, { useState, useEffect, useCallback } from 'react';
import { Text, View, Pressable, Modal, TextInput, ScrollView, Alert } from 'react-native';
import { AntDesign, FontAwesome , MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../../styles/SelectProducts.styles';
import ModalProduct from '../products/ModalProducts'; // Importing ModalProduct component

const SelectProducts = ({ isVisible, onClose, selectedOrder }) => {
  const [selectedProductsCount, setSelectedProductsCount] = useState(0);
  const [products, setProducts] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [searchProduct, setSearchProduct] = useState("");
  const [productQuantities, setProductQuantities] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null); // State to manage selected product
  const [isProductModalVisible, setIsProductModalVisible] = useState(false); // State to control visibility of product modal
  const itemsPerPage = 10;

  useEffect(() => {
    const getProducts = async () => {
      const productsInfo = await AsyncStorage.getItem('products');
      const productsJson = JSON.parse(productsInfo);
      setProducts(productsJson || []);
    };
    getProducts();
  }, []);

  useEffect(() => {
    const filteredProducts = products.filter(product =>
      product.descrip.toLowerCase().includes(searchProduct.toLowerCase())
    );

    const totalItems = filteredProducts.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    setTotalPages(totalPages);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const visibleProducts = filteredProducts.slice(startIndex, endIndex);

    // Mark products from selectedOrder as selected
    const updatedVisibleProducts = visibleProducts.map(product => ({
      ...product,
      quantity: productQuantities[product.codigo] || 0,
      selected: selectedOrder.products.some(item => item.codigo === product.codigo)
    }));

    setVisibleProducts(updatedVisibleProducts);
  }, [products, searchProduct, currentPage, productQuantities, selectedOrder]);

  const handleProductSelection = useCallback((product) => {
    const updatedProductQuantities = { ...productQuantities };

    if (product.selected) {
      product.selected = false;
      setSelectedProductsCount(prevCount => prevCount - 1);
      delete updatedProductQuantities[product.codigo];
    } else {
      product.selected = true;
      setSelectedProductsCount(prevCount => prevCount + 1);
      updatedProductQuantities[product.codigo] = 1; // Set default quantity to 1
    }

    setProductQuantities(updatedProductQuantities);
    setProducts(products.map(p =>
      p.codigo === product.codigo ? { ...p, selected: !p.selected } : p
    ));
  }, [productQuantities, products]);

  const handleQuantityChange = useCallback((productId, text) => {
    const quantity = parseInt(text, 10) || 0;
    const product = products.find(p => p.codigo === productId);

    if (isNaN(quantity)) {
      return;
    }

    const updatedProductQuantities = { ...productQuantities };
    updatedProductQuantities[productId] = quantity;

    if (quantity === 0) {
      delete updatedProductQuantities[productId];
      setSelectedProductsCount(prevCount => prevCount - 1);
    } else {
      setSelectedProductsCount(prevCount => {
        const product = products.find(p => p.codigo === productId);
        return product.selected ? prevCount : prevCount + 1;
      });
    }

    setProductQuantities(updatedProductQuantities);
  }, [productQuantities, products]);

  const handleProductDelete = useCallback((productId) => {
    const updatedProductQuantities = { ...productQuantities };
    delete updatedProductQuantities[productId];
    setProductQuantities(updatedProductQuantities);

    setSelectedProductsCount(prevCount => prevCount - 1);

    // Remove product from selectedOrder
    const updatedProducts = selectedOrder.products.filter(product => product.codigo !== productId);
    const updatedOrder = { ...selectedOrder, products: updatedProducts };
    // Call function to save changes in selectedOrder
    handleSaveOrder(updatedOrder);
  }, [productQuantities, selectedOrder, handleSaveOrder]);

  const handleSaveOrder = useCallback((order) => {
    // Here you can save the updated order to AsyncStorage or send it to the server
    // For demonstration, let's just log the updated order
    console.log("Updated Order:", order);
  }, []);

  const renderPaginationButtons = () => {
    const itemsPerPage = 10;
    const totalItems = 50;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const buttons = [];
    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <Pressable
          key={i}
          style={[styles.pageButton, currentPage === i && styles.pageButtonActive]}
          onPress={() => setCurrentPage(i)}
        >
          <Text style={styles.pageButtonText}>{i}</Text>
        </Pressable>
      );
    }
    return buttons;
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
              onChangeText={setSearchProduct}
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
                      <AntDesign name="pluscircle" size={26} color="#7A7A7B" />
                    ) : (
                      <AntDesign name="minuscircle" size={26} color="#7A7A7B" />
                    )}
                  </Pressable>
                  <Pressable
                    style={styles.button}
                    onPress={() => {
                      setSelectedProduct(product);
                      setIsProductModalVisible(true);
                    }}
                  >
                    <FontAwesome name="info-circle" size={24} color="#7A7A7B" />
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
