import React, { useState } from 'react';
import { Text, View, Modal, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import styles from '../styles/FilterProducts.styles';

const FilterCategories = ({ visible, onClose, onSave }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedPriceOrder, setSelectedPriceOrder] = useState(null);

  const [selectedCategoryTemp, setSelectedCategoryTemp] = useState(null);
  const [selectedBrandTemp, setSelectedBrandTemp] = useState(null);
  const [selectedPriceOrderTemp, setSelectedPriceOrderTemp] = useState(null);

  const handleCategorySelect = () => {
    if (selectedCategoryTemp === 'Categoria') {
      setSelectedCategoryTemp(null);
    } else {
      setSelectedCategoryTemp('Categoria');
      setSelectedBrandTemp(null);
    }
  };

  const handleBrandSelect = () => {
    if (selectedBrandTemp === 'Marca') {
      setSelectedBrandTemp(null);
    } else {
      setSelectedBrandTemp('Marca');
      setSelectedCategoryTemp(null);
    }
  };

  const handlePriceOrderSelect = (order) => {
    if (selectedPriceOrderTemp === order) {
      setSelectedPriceOrderTemp(null);
    } else {
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

  return (
    <Modal transparent={true} animationType="fade" visible={visible} onRequestClose={handleClose}>
      <View style={styles.mainContainer}>
        <View style={styles.container}>
          <Text style={styles.titleContainer}>Filtrar por</Text>

          <Pressable
            style={[
              styles.filterContainer,
              selectedCategoryTemp === 'Categoria' && styles.selectedFilter,
            ]}
            onPress={handleCategorySelect}
          >
            <MaterialIcons
              name="filter-1"
              size={24}
              color={selectedCategoryTemp === 'Categoria' ? '#38B0DB' : 'black'}
            />
            <Text
              style={[
                styles.filterText,
                selectedCategoryTemp === 'Categoria' && { color: '#38B0DB' },
              ]}
            >
              Categoria
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.filterContainer,
              selectedBrandTemp === 'Marca' && styles.selectedFilter,
            ]}
            onPress={handleBrandSelect}
          >
            <MaterialIcons
              name="filter-2"
              size={24}
              color={selectedBrandTemp === 'Marca' ? '#38B0DB' : 'black'}
            />
            <Text
              style={[
                styles.filterText,
                selectedBrandTemp === 'Marca' && { color: '#38B0DB' },
              ]}
            >
              Marca
            </Text>
          </Pressable>

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
            <Pressable style={styles.buttonModalExit} onPress={handleClose}>
              <Text style={styles.buttonTextModal}>Salir</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default FilterCategories;
