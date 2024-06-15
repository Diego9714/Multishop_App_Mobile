import React, { useState, useEffect } from 'react';
import { Text, View, FlatList, Pressable, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign, MaterialIcons, Ionicons, FontAwesome } from '@expo/vector-icons';
import ModalProducts from './ModalProducts';
import FilterCategories from '../FilterCategories';
import styles from '../../styles/ListProducts.styles';

const ListProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [searchProduct, setSearchProduct] = useState('');
  const [displaySearchProduct, setDisplaySearchProduct] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  const [page, setPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const itemsPerPage = 10;
  const defaultMaxPages = 5;

  useEffect(() => {
    const getProductsAndCategories = async () => {
      const productsInfo = await AsyncStorage.getItem('products');
      const productsJson = JSON.parse(productsInfo);
      setProducts(productsJson || []);

      const categoriesInfo = await AsyncStorage.getItem('categories');
      const categoriesJson = JSON.parse(categoriesInfo);
      setCategories(categoriesJson || []);

      const brandsInfo = await AsyncStorage.getItem('brands');
      const brandsJson = JSON.parse(brandsInfo);
      setBrands(brandsJson || []);
    };
    getProductsAndCategories();
  }, []);

  useEffect(() => {
    let filteredProducts = products;

    if (displaySearchProduct.length >= 3) {
      filteredProducts = filteredProducts.filter(product =>
        product.descrip.toLowerCase().includes(displaySearchProduct.toLowerCase())
      );
    }

    if (searchCategory.length > 0) {
      filteredProducts = filteredProducts.filter(product =>
        product.ncate.toLowerCase().includes(searchCategory.toLowerCase())
      );
    }

    const start = (page - 1) * itemsPerPage;
    const end = page * itemsPerPage;
    setVisibleProducts(filteredProducts.slice(start, end));
  }, [page, products, displaySearchProduct, searchCategory]);

  const handleSearch = () => {
    if (searchProduct.length > 0 && searchProduct.length < 3) {
      alert('Por favor ingrese al menos tres letras para buscar');
      return;
    }
    setDisplaySearchProduct(searchProduct);
    setPage(1);
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
            {/* <Ionicons name="information" size={34} color="#515151" /> */}
            <MaterialIcons name="more-vert" size={30} color="#7A7A7B" />
          </Pressable>
        </View>
      </View>
    );
  };

  const renderPaginationButtons = () => {
    const filteredProducts = products.filter(product =>
      product.descrip.toLowerCase().includes(displaySearchProduct.toLowerCase())
    );
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    let buttons = [];
    let maxPagesToShow = displaySearchProduct ? totalPages : Math.min(totalPages, defaultMaxPages);
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
          <Text style={styles.pageButtonText}>{i}</Text>
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

      <FilterCategories visible={isFilterModalVisible} onClose={closeFilterModal} />

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
