import React, { useState, useEffect } from 'react';
import { Text, View, FlatList, Pressable, TextInput, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import ModalProducts from './ModalProducts';
import styles from '../../styles/ListProducts.styles';

const ListProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchProduct, setSearchProduct] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [page, setPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const itemsPerPage = 10;

  useEffect(() => {
    const getProductsAndCategories = async () => {
      const productsInfo = await AsyncStorage.getItem('products');
      const productsJson = JSON.parse(productsInfo);
      setProducts(productsJson || []);

      const categoriesInfo = await AsyncStorage.getItem('categories');
      const categoriesJson = JSON.parse(categoriesInfo);
      setCategories(categoriesJson || []);
    };
    getProductsAndCategories();
  }, []);

  useEffect(() => {
    const filteredProducts = products.filter(product =>
      product.descrip.toLowerCase().includes(searchProduct.toLowerCase()) &&
      product.ncate.toLowerCase().includes(searchCategory.toLowerCase())
    );
    const start = (page - 1) * itemsPerPage;
    const end = page * itemsPerPage;
    setVisibleProducts(filteredProducts.slice(start, end));
  }, [page, products, searchProduct, searchCategory]);

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
            <Ionicons name="add-outline" size={30} color="black" />
          </Pressable>
        </View>
      </View>
    );
  };

  const renderPaginationButtons = () => {
    const filteredProducts = products.filter(product =>
      product.descrip.toLowerCase().includes(searchProduct.toLowerCase()) &&
      product.ncate.toLowerCase().includes(searchCategory.toLowerCase())
    );
    const numberOfPages = Math.ceil(filteredProducts.length / itemsPerPage);
    let buttons = [];
    for (let i = 1; i <= numberOfPages; i++) {
      buttons.push(
        <Pressable
          key={i}
          style={[styles.pageButton, page === i && styles.pageButtonActive]}
          onPress={() => setPage(i)}
        >
          <Text style={styles.pageButtonText}>{i}</Text>
        </Pressable>
      );
    }
    return buttons;
  };

  return (
    <View style={styles.list}>
      <View style={styles.titlePage}>
        <Text style={styles.title}>Inventario</Text>
        <View style={styles.ViewTextInput}>
          <TextInput
            placeholder='Buscar Producto'
            style={styles.textInput}
            value={searchProduct}
            onChangeText={(text) => {
              setSearchProduct(text);
              setPage(1); // Reset to the first page whenever a search is made
            }}
          />
          <FontAwesome name="search" size={24} color="black" />
        </View>
        <View style={styles.ViewSearchFilter}>
          <TextInput
            placeholder='Buscar Producto'
            style={styles.textInput}
            value={searchProduct}
            onChangeText={(text) => {
              setSearchProduct(text);
              setPage(1); // Reset to the first page whenever a search is made
            }}
          />
          <FontAwesome name="search" size={28} color="black" />
        </View>
      </View>

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
  );
};

export default ListProducts;
