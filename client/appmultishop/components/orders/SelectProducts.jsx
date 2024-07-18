// Dependencies
import { Text, View, Pressable, Modal, 
  TextInput, ScrollView, Alert , TouchableOpacity }     from 'react-native';
import React, { useState, useEffect, useCallback }      from 'react';
import { AntDesign, MaterialIcons, FontAwesome }        from '@expo/vector-icons';
import AsyncStorage                                     from '@react-native-async-storage/async-storage';
import { LinearGradient }                               from 'expo-linear-gradient';
// Modals And Components
import ModalProduct                                     from '../products/ModalProducts';
import SaveOrder                                        from './SaveOrder';
import FilterCategories                                 from '../filter/FilterCategories';
// Styles
import styles                                           from '../../styles/SelectProducts.styles';

const SelectProducts = ({ isVisible, onClose, client }) => {
  const [selectedProductsCount, setSelectedProductsCount] = useState(0);
  const [products, setProducts] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [searchProduct, setSearchProduct] = useState('');
  const [displaySearchProduct, setDisplaySearchProduct] = useState('');
  const [page, setPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isProductModalVisible, setIsProductModalVisible] = useState(false);
  const [isSaveOrderModalVisible, setIsSaveOrderModalVisible] = useState(false);
  const [productQuantities, setProductQuantities] = useState({});
  const itemsPerPage = 10;
  const defaultMaxPages = 5;
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [searchCategory, setSearchCategory] = useState([]);
  const [searchBrand, setSearchBrand] = useState([]);
  const [priceOrder, setPriceOrder] = useState('');
  const [isFiltering, setIsFiltering] = useState(false);

  useEffect(() => {
    const getProducts = async () => {
      const productsInfo = await AsyncStorage.getItem('products');
      const productsJson = JSON.parse(productsInfo);
      setProducts(productsJson || []);
    };
    getProducts();
  }, []);

  useEffect(() => {
    let filteredProducts = products;

    if (displaySearchProduct.length >= 3) {
      const searchWords = displaySearchProduct.toLowerCase().split(' ');
      filteredProducts = filteredProducts.filter(product =>
        searchWords.every(word => product.descrip.toLowerCase().includes(word))
      );
    }

    const start = (page - 1) * itemsPerPage;
    const end = page * itemsPerPage;
    const paginatedProducts = filteredProducts.slice(start, end);

    const updatedVisibleProducts = paginatedProducts.map(product => ({
      ...product,
      quantity: productQuantities[product.codigo] || 0,
      selected: product.codigo in productQuantities
    }));

    setVisibleProducts(updatedVisibleProducts);
  }, [page, products, displaySearchProduct, productQuantities]);

  useEffect(() => {
    applyFilters();
  }, [page, products, displaySearchProduct, searchCategory, searchBrand, priceOrder]);

  useEffect(() => {
    setIsFiltering(searchCategory.length > 0 || searchBrand.length > 0 || priceOrder !== '');
  }, [searchCategory, searchBrand, priceOrder]);

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

  const handleProductSelection = useCallback((product) => {
    const updatedProductQuantities = { ...productQuantities };

    if (product.selected) {
      product.selected = false;
      setSelectedProductsCount(prevCount => Math.max(prevCount - 1, 0));
      delete updatedProductQuantities[product.codigo];
    } else {
      product.selected = true;
      setSelectedProductsCount(prevCount => prevCount + 1);
      updatedProductQuantities[product.codigo] = 0; // Initialize with 0 quantity
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

    if (quantity > product.existencia) {
      Alert.alert('Cantidad no disponible', `La cantidad ingresada: ${quantity} , supera la cantidad existente en el inventario : ${product.existencia}`);
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
  }, [productQuantities, products]);

  const handleProductDelete = useCallback((productId) => {
    const updatedProductQuantities = { ...productQuantities };
    const wasSelected = productQuantities[productId] > 0;
    delete updatedProductQuantities[productId];
    setProductQuantities(updatedProductQuantities);

    const updatedProducts = products.map(product =>
      product.codigo === productId ? { ...product, selected: false } : product
    );
    setProducts(updatedProducts);

    if (wasSelected) {
      setSelectedProductsCount(prevCount => Math.max(prevCount - 1, 0));
    }
  }, [productQuantities, products]);

  const generateSelectedProductJSON = () => {
    const selectedProducts = products.filter(product => product.selected);
    const selectedProductsWithQuantities = selectedProducts.map(product => ({
      codigo: product.codigo,
      descrip: product.descrip,
      exists: product.existencia,
      quantity: productQuantities[product.codigo] || 0,
      priceUsd: product.precioUsd,
      priceBs: (product.precioUsd * 36.372).toFixed(2),
    }));

    const order = {
      nom_cli: client.nom_cli,
      cod_cli: client.cod_cli,
      tlf_cli: client.tel_cli,
      dir_cli: client.dir1_cli,
      products: selectedProductsWithQuantities
    };

    return order;
  };

  const validateOrder = () => {
    const selectedProducts = products.filter(product => product.selected);
    for (const product of selectedProducts) {
      if (productQuantities[product.codigo] === 0) {
        Alert.alert('Error', 'No se pueden seleccionar productos con cantidad 0.');
        return false;
      }
    }
    return true;
  };

  const renderPaginationButtonsProducts = () => {
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
    let startPage = Math.max(1, page - 2);
    let endPage = Math.min(maxPages, startPage + 4);

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

  const handleSaveFilters = (selectedFilters) => {
    console.log('Filtros seleccionados:', selectedFilters);
    setSearchCategory(selectedFilters.selectedCategory || '');
    setSearchBrand(selectedFilters.selectedBrand || '');
    setPriceOrder(selectedFilters.selectedPriceOrder || '');
    setPage(1); // Reiniciar a la primera página al aplicar filtros
  };

  const applyFilters = () => {
    let filteredProducts = products.slice();
  
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
        setPage(1);
        return;
      }
    }
  
    // Filtrar por categoría o marca seleccionada
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
  
    // Paginación
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    setVisibleProducts(filteredProducts.slice(start, end));

    // Ajustar la página si no hay suficientes productos para la página actual
    if (filteredProducts.length > 0 && page > Math.ceil(filteredProducts.length / itemsPerPage)) {
      setPage(1);
    }
  };

  return (
    <Modal visible={isVisible} animationType="slide">
      <LinearGradient
      colors={['#ffff', '#9bdef6', '#ffffff', '#9bdef6']}
      style={styles.gradientBackground}
      >
        <View style={styles.container}>
          <View style={styles.mainTitleContainer}>
            <Text style={styles.mainTitle}>Selección de Productos</Text>
          </View>

          <View style={styles.mainSubtitleContainer}>
            <Text style={styles.mainSubtitle}>Cliente: {client.nom_cli}</Text>
          </View>

          <View style={styles.finderContainer}>
            <View style={styles.seekerContainer}>
              <TextInput
                placeholder='Buscar Producto'
                style={styles.seeker}
                value={searchProduct}
                onChangeText={text => setSearchProduct(text)}
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
              {renderPaginationButtonsProducts()}
            </ScrollView>
          </View>

          <View style={styles.buttonsAction}>
            <Pressable style={styles.buttonExit} onPress={onClose}>
              <Text style={styles.buttonText}>Salir</Text>
            </Pressable>
            <Pressable
              style={[styles.buttonModal, { opacity: selectedProductsCount < 1 ? 0.5 : 1 }]}
              onPress={() => {
                if (selectedProductsCount >= 1 && validateOrder()) {
                  setIsSaveOrderModalVisible(true);
                }
              }}
              disabled={selectedProductsCount < 1}
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
      </LinearGradient>
    </Modal>
  );
};

export default SelectProducts;
