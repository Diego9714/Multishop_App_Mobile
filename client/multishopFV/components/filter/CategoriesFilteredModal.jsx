import React, { useEffect, useState } from 'react';
import { Modal, View, Text, Pressable, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../../styles/BrandFilteredModal.styles';

const CategoriesFilteredModal = ({ visible, onClose, onSave, selectedCategories }) => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [tempSelectedCategories, setTempSelectedCategories] = useState([]);
  const [searchCategory, setSearchCategory] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 10; // Número de elementos por página

  useEffect(() => {
    const getCategories = async () => {
      try {
        const categoriesInfo = await AsyncStorage.getItem('categories');
        const categoriesJson = JSON.parse(categoriesInfo);

        setCategories(categoriesJson || []);
        setFilteredCategories(categoriesJson || []);
      } catch (error) {
        console.error('Error al obtener datos de AsyncStorage:', error);
      }
    };

    getCategories();
  }, []);

  useEffect(() => {
    if (visible) {
      setTempSelectedCategories(selectedCategories); // Establece las categorías seleccionadas al abrir el modal
    }
  }, [visible, selectedCategories]);

  const filterCategories = () => {
    const filtered = categories.filter((category) =>
      category.ncate.toLowerCase().includes(searchCategory.toLowerCase())
    );
    setFilteredCategories(filtered);
  };

  const handleSelectCategory = (ncate) => {
    if (tempSelectedCategories.includes(ncate)) {
      setTempSelectedCategories(tempSelectedCategories.filter((category) => category !== ncate));
    } else {
      setTempSelectedCategories([...tempSelectedCategories, ncate]);
    }
  };

  const renderElements = ({ item }) => {
    const isSelected = tempSelectedCategories.includes(item.ncate);
    return (
      <TouchableOpacity
        style={[
          styles.filterContainer,
          isSelected && styles.selectedFilter,
        ]}
        onPress={() => handleSelectCategory(item.ncate)}
      >
        <Text style={isSelected ? { color: '#38B0DB' } : null}>{item.ncate}</Text>
      </TouchableOpacity>
    );
  };

  const handleSave = async () => {
    onSave(tempSelectedCategories);
    onClose();
  };

  const handleClose = () => {
    setTempSelectedCategories(selectedCategories); // Restaura las categorías seleccionadas al cerrar el modal
    onClose();
  };

  const renderPaginationButtons = () => {
    const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);

    let buttons = [];
    let maxPagesToShow = totalPages > 5 ? 5 : totalPages; // Mostrar máximo 5 páginas si hay más de 5 páginas
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

  return (
    <Modal transparent={true} animationType="fade" visible={visible} onRequestClose={handleClose}>
      <View style={styles.mainContainer}>
        <View style={styles.container}>
          <Text style={styles.titleContainer}>Categorías Disponibles</Text>

          <View style={styles.seekerContainer}>
            <TextInput
              placeholder='Buscar Categoría'
              style={styles.seeker}
              value={searchCategory}
              onChangeText={(text) => setSearchCategory(text)}
            />
            <Pressable onPress={filterCategories}>
              <FontAwesome name="search" size={28} color="#8B8B8B" />
            </Pressable>
          </View>

          <View style={styles.listContainer}>
            <FlatList
              data={filteredCategories.slice((page - 1) * itemsPerPage, page * itemsPerPage)}
              keyExtractor={(item) => item.ccate.toString()}
              renderItem={renderElements}
            />
          </View>

          <View style={styles.paginationContainer}>
            {renderPaginationButtons()}
          </View>

          <Pressable style={styles.buttonModal} onPress={handleSave}>
            <Text style={styles.buttonTextModal}>Seleccionar</Text>
          </Pressable>
          <Pressable style={styles.buttonModalExit} onPress={handleClose}>
            <Text style={styles.buttonTextModal}>Cerrar</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default CategoriesFilteredModal;
