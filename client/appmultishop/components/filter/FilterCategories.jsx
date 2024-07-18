import React, { useState } from 'react';
import { Text, View, Modal, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import styles from '../../styles/FilterProducts.styles';
import BrandFilteredModal from './BrandFilteredModal';
import CategoriesFilteredModal from './CategoriesFilteredModal';

const FilterCategories = ({ visible, onClose, onSave }) => {
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState([]);
  const [selectedPriceOrder, setSelectedPriceOrder] = useState(null);

  const [selectedCategoryTemp, setSelectedCategoryTemp] = useState([]);
  const [selectedBrandTemp, setSelectedBrandTemp] = useState([]);
  const [selectedPriceOrderTemp, setSelectedPriceOrderTemp] = useState(null);

  const [brandFilteredModalVisible, setBrandFilteredModalVisible] = useState(false);
  const [categoriesFilteredModalVisible, setCategoriesFilteredModalVisible] = useState(false);

  const handleCategorySelect = () => {
    setSelectedCategoryTemp(selectedCategory);
    setCategoriesFilteredModalVisible(true);
  };

  const handleBrandSelect = () => {
    setSelectedBrandTemp(selectedBrand);
    setBrandFilteredModalVisible(true);
  };

  const handlePriceOrderSelect = (order) => {
    if (selectedPriceOrderTemp === order) {
      // Deshabilitar la selección si ya está seleccionada
      setSelectedPriceOrderTemp(null);
    } else {
      // Seleccionar la nueva opción
      setSelectedPriceOrderTemp(order);
    }
  };
  

  const handleSave = () => {
    setSelectedCategory(selectedCategoryTemp);
    setSelectedBrand(selectedBrandTemp);
    setSelectedPriceOrder(selectedPriceOrderTemp);

    onSave({
      selectedCategory: selectedCategoryTemp,
      selectedBrand: selectedBrandTemp,
      selectedPriceOrder: selectedPriceOrderTemp,
    });

    onClose();
  };

  const handleClose = () => {
    setSelectedCategoryTemp(selectedCategory);
    setSelectedBrandTemp(selectedBrand);
    setSelectedPriceOrderTemp(selectedPriceOrder);
    onClose();
  };

  const handleClearFilters = () => {
    setSelectedCategoryTemp([]);
    setSelectedBrandTemp([]);
    setSelectedPriceOrderTemp(null);
  };

  return (
    <Modal transparent={true} animationType="fade" visible={visible} onRequestClose={handleClose}>
      <View style={styles.mainContainer}>
        <View style={styles.container}>
          <Text style={styles.titleContainer}>Filtrar por</Text>

          <Pressable
            style={[
              styles.filterContainer,
              selectedCategoryTemp.length > 0 && styles.selectedFilter,
            ]}
            onPress={handleCategorySelect}
          >
            <MaterialIcons
              name="filter-1"
              size={24}
              color={selectedCategoryTemp.length > 0 ? '#38B0DB' : 'black'}
            />
            <Text
              style={[
                styles.filterText,
                selectedCategoryTemp.length > 0 && { color: '#38B0DB' },
              ]}
            >
              Categoría
            </Text>
          </Pressable>

          {selectedCategoryTemp.length > 0 && (
            <View style={styles.selectedItemsContainer}>
              {selectedCategoryTemp.map((category) => (
                <Text key={category} style={styles.selectedItem}>
                  {category}
                </Text>
              ))}
            </View>
          )}

          <Pressable
            style={[
              styles.filterContainer,
              selectedBrandTemp.length > 0 && styles.selectedFilter,
            ]}
            onPress={handleBrandSelect}
          >
            <MaterialIcons
              name="filter-2"
              size={24}
              color={selectedBrandTemp.length > 0 ? '#38B0DB' : 'black'}
            />
            <Text
              style={[
                styles.filterText,
                selectedBrandTemp.length > 0 && { color: '#38B0DB' },
              ]}
            >
              Marca
            </Text>
          </Pressable>

          {selectedBrandTemp.length > 0 && (
            <View style={styles.selectedItemsContainer}>
              {selectedBrandTemp.map((brand) => (
                <Text key={brand} style={styles.selectedItem}>
                  {brand}
                </Text>
              ))}
            </View>
          )}

          <Pressable
            style={[
              styles.filterContainer,
              selectedPriceOrderTemp === 'menor-mayor' && styles.selectedFilter,
            ]}
            onPress={() => handlePriceOrderSelect('menor-mayor')}
          >
            <MaterialIcons
              name="filter-3"
              size={24}
              color={selectedPriceOrderTemp === 'menor-mayor' ? '#38B0DB' : 'black'}
            />
            <Text
              style={[
                styles.filterText,
                selectedPriceOrderTemp === 'menor-mayor' && { color: '#38B0DB' },
              ]}
            >
              Precio Menor a Mayor
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.filterContainer,
              selectedPriceOrderTemp === 'mayor-menor' && styles.selectedFilter,
            ]}
            onPress={() => handlePriceOrderSelect('mayor-menor')}
          >
            <MaterialIcons
              name="filter-4"
              size={24}
              color={selectedPriceOrderTemp === 'mayor-menor' ? '#38B0DB' : 'black'}
            />
            <Text
              style={[
                styles.filterText,
                selectedPriceOrderTemp === 'mayor-menor' && { color: '#38B0DB' },
              ]}
            >
              Precio Mayor a Menor
            </Text>
          </Pressable>

          <View style={styles.sectionButtonsModal}>
            <Pressable style={styles.buttonModal} onPress={handleSave}>
              <Text style={styles.buttonTextModal}>Guardar</Text>
            </Pressable>
            <Pressable style={styles.buttonModalExit} onPress={handleClearFilters}>
              <Text style={styles.buttonTextModal}>Borrar Filtros</Text>
            </Pressable>
            <Pressable style={styles.buttonModalExit} onPress={handleClose}>
              <Text style={styles.buttonTextModal}>Salir</Text>
            </Pressable>
          </View>
        </View>
      </View>

      <BrandFilteredModal
        visible={brandFilteredModalVisible}
        onClose={() => setBrandFilteredModalVisible(false)}
        onSave={(selectedBrands) => {
          setSelectedBrandTemp(selectedBrands);
          setSelectedBrand(selectedBrands);
        }}
        selectedBrands={selectedBrandTemp}
      />

      <CategoriesFilteredModal
        visible={categoriesFilteredModalVisible}
        onClose={() => setCategoriesFilteredModalVisible(false)}
        onSave={(selectedCategories) => {
          setSelectedCategoryTemp(selectedCategories);
          setSelectedCategory(selectedCategories);
        }}
        selectedCategories={selectedCategoryTemp}
      />
    </Modal>
  );
};

export default FilterCategories;
