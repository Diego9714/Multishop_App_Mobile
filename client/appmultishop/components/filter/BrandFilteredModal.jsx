import React, { useEffect, useState } from 'react';
import { Modal, View, Text, Pressable, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../../styles/BrandFilteredModal.styles';

const BrandFilteredModal = ({ visible, onClose, onSave, selectedBrands }) => {
  const [brands, setBrands] = useState([]);
  const [filteredBrands, setFilteredBrands] = useState([]);
  const [tempSelectedBrands, setTempSelectedBrands] = useState([]);
  const [searchBrand, setSearchBrand] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 10; // Número de elementos por página

  useEffect(() => {
    const getBrands = async () => {
      try {
        const brandsInfo = await AsyncStorage.getItem('brands');
        const brandsJson = JSON.parse(brandsInfo);

        setBrands(brandsJson || []);
        setFilteredBrands(brandsJson || []);
      } catch (error) {
        console.error('Error al obtener datos de AsyncStorage:', error);
      }
    };

    getBrands();
  }, []);

  useEffect(() => {
    if (visible) {
      setTempSelectedBrands(selectedBrands);
    }
  }, [visible]);

  const filterBrands = () => {
    const filtered = brands.filter((brand) =>
      brand.nmarca.toLowerCase().includes(searchBrand.toLowerCase())
    );
    setFilteredBrands(filtered);
  };

  const handleSelectBrand = (nmarca) => {
    if (tempSelectedBrands.includes(nmarca)) {
      setTempSelectedBrands(tempSelectedBrands.filter((brand) => brand !== nmarca));
    } else {
      setTempSelectedBrands([...tempSelectedBrands, nmarca]);
    }
  };

  const renderElements = ({ item }) => {
    const isSelected = tempSelectedBrands.includes(item.nmarca);
    return (
      <TouchableOpacity
        style={[
          styles.filterContainer,
          isSelected && styles.selectedFilter,
        ]}
        onPress={() => handleSelectBrand(item.nmarca)}
      >
        <Text style={isSelected ? { color: '#38B0DB' } : null}>{item.nmarca}</Text>
      </TouchableOpacity>
    );
  };

  const handleSave = async () => {
    onSave(tempSelectedBrands);
    onClose();
  };

  const handleClose = () => {
    setTempSelectedBrands(selectedBrands);
    onClose();
  };

  const renderPaginationButtons = () => {
    const totalPages = Math.ceil(filteredBrands.length / itemsPerPage);

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
          <Text style={styles.titleContainer}>Marcas Disponibles</Text>

          <View style={styles.seekerContainer}>
            <TextInput
              placeholder='Buscar Marca'
              style={styles.seeker}
              value={searchBrand}
              onChangeText={(text) => setSearchBrand(text)}
            />
            <Pressable onPress={filterBrands}>
              <FontAwesome name="search" size={28} color="#8B8B8B" />
            </Pressable>
          </View>

          <View style={styles.listContainer}>
            <FlatList
              data={filteredBrands.slice((page - 1) * itemsPerPage, page * itemsPerPage)}
              keyExtractor={(item) => item.cmarca.toString()}
              renderItem={renderElements}
            />
          </View>

          <View style={styles.paginationContainer}>
            {renderPaginationButtons()}
          </View>

          <Pressable style={styles.buttonModal} onPress={handleSave}>
            <Text style={styles.buttonTextModal}>Guardar</Text>
          </Pressable>
          <Pressable style={styles.buttonModalExit} onPress={handleClose}>
            <Text style={styles.buttonTextModal}>Cerrar</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default BrandFilteredModal;
