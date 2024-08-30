import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, Pressable, ImageBackground, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import styles from '../../styles/ReportVisistsPayment.styles';
import { images } from '../../constants';
import { MaterialIcons, AntDesign, FontAwesome5, FontAwesome6 } from '@expo/vector-icons';

const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const parseDate = (dateString) => {
  const [day, month, year] = dateString.split('/').map(Number);
  return new Date(year, month - 1, day);
};

const ReportVisits = ({ isVisible, onClose }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateType, setDateType] = useState('start');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [visits, setVisits] = useState([]);
  const [filteredVisits, setFilteredVisits] = useState([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const handleDateChange = (event, selectedDate) => {
    if (event.type === 'dismissed') {
      setShowDatePicker(false);
      return;
    }

    if (selectedDate) {
      if (dateType === 'start') {
        setStartDate(selectedDate);
      } else {
        setEndDate(selectedDate);
      }
      setShowDatePicker(false);
    }
  };

  const handleSelectDate = (type) => {
    setDateType(type);
    setShowDatePicker(true);
  };

  const handleFilter = () => {
    if (!startDate || !endDate) {
      Alert.alert('Error', 'Debes seleccionar ambas fechas.');
      return;
    }

    const formattedStartDate = startDate ? new Date(startDate) : new Date();
    formattedStartDate.setHours(0, 0, 0, 0);

    const formattedEndDate = endDate ? new Date(endDate) : new Date();
    formattedEndDate.setHours(23, 59, 59, 999);

    if (formattedEndDate < formattedStartDate) {
      Alert.alert('Error', 'La fecha final debe ser igual o posterior a la fecha inicial.');
      return;
    }

    const filtered = visits.filter(visit => {
      const visitDate = parseDate(visit.fecha);
      return visitDate >= formattedStartDate && visitDate <= formattedEndDate;
    });

    setFilteredVisits(filtered);
    setPage(1);
  };

  const handleReset = () => {
    const today = new Date();
    setStartDate(null);
    setEndDate(null);
    setFilteredVisits(visits);
    setPage(1);
  };

  const updateVisits = async () => {
    const visitString = await AsyncStorage.getItem('SyncedClientVisits');
    const synchronizedVisits = visitString ? JSON.parse(visitString) : [];

    if (JSON.stringify(synchronizedVisits) !== JSON.stringify(visits)) {
      setVisits(synchronizedVisits);
      setFilteredVisits((prev) => {
        if (!startDate && !endDate) {
          return synchronizedVisits;
        }
        return prev;
      });
    }
  };

  useEffect(() => {
    if (isVisible) {
      updateVisits();
    }
  }, [isVisible]);

  const applyPagination = () => {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredVisits.slice(start, end);
  };

  const renderPaginationButtons = () => {
    const totalPages = Math.ceil(filteredVisits.length / itemsPerPage);
    const buttons = [];

    for (let i = 1; i <= totalPages; i++) {
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
    <Modal
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
      animationType="slide"
      onDismiss={() => setShowDatePicker(false)}
    >
      <ImageBackground source={images.fondo} style={styles.gradientBackground}>
        <View style={styles.container}>
          <View style={styles.mainTitleContainer}>
            <Text style={styles.mainTitle}>Historial de Visitas</Text>
          </View>

          <View style={styles.dateSelectorsContainer}>
            <TouchableOpacity style={styles.buttonDate} onPress={() => handleSelectDate('start')}>
              <AntDesign name="calendar" size={24} color="#6b6b6b" />
              <Text style={styles.buttonTextDate}>
                {startDate ? formatDate(startDate) : 'Fecha de inicio'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonDate} onPress={() => handleSelectDate('end')}>
              <AntDesign name="calendar" size={24} color="#6b6b6b" />
              <Text style={styles.buttonTextDate}>
                {endDate ? formatDate(endDate) : 'Fecha de fin'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonSearch} onPress={handleFilter}>
              <MaterialIcons name="search" size={25} color="#6b6b6b" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonSearch} onPress={handleReset}>
              <MaterialIcons name="restore" size={24} color="#6b6b6b" />
            </TouchableOpacity>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={dateType === 'start' ? startDate || new Date() : endDate || new Date()}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}

          <View style={styles.productContainer}>
            <View style={styles.headerProductContainer}>
              <View style={styles.titleListContainer}>
                <Text style={styles.titleListClient}>Nombre</Text>
                <Text style={styles.titleListPrice}>Fecha</Text>
              </View>
            </View>

            <ScrollView>
              {applyPagination().length > 0 ? (
                applyPagination().map((visit) => (
                  <View key={visit.id_visit} style={styles.productItem}>
                    <View style={styles.nameProd}>
                      <Text>{visit.nom_cli}</Text>
                    </View>
                    <View style={styles.priceContainer}>
                      <Text>{formatDate(new Date(visit.fecha))}</Text>
                    </View>
                    <View style={styles.buttonAction}>
                      <View style={styles.buyIdentifier}>
                        {/* <FontAwesome6 name="money-bill-trend-up" size={20} color="black" /> */}
                        {/* <MaterialIcons name="attach-money" size={28} color="#fff" /> */}
                        <MaterialIcons name="money-off" size={28} color="#fff" />
                      </View>
                      {/* <AntDesign name="truck" size={28} color="#707070" /> */}
                      {/* <FontAwesome5 name="truck" size={20} color="#707070" /> */}
                      {/* <MaterialIcons name="location-pin" size={24} color="#707070" /> */}
                    </View>
                  </View>
                ))
              ) : (
                <Text style={styles.noOrdersText}>No se encontraron visitas</Text>
              )}
            </ScrollView>
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
      </ImageBackground>
    </Modal>
  );
};

export default ReportVisits;
