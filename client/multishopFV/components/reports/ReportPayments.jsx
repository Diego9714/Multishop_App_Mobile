import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, Pressable, ImageBackground, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import styles from '../../styles/ReportVisistsPayment.styles';
import { images } from '../../constants';
import { MaterialIcons, AntDesign } from '@expo/vector-icons';

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

const formatNumber = (number, currency) => {

  console.log(currency)

  // Ensure the number is a valid number and not a string or object
  let numberFormat = typeof number === 'number' ? number : parseFloat(number);

  if (isNaN(numberFormat)) {
    return number; // Return the original value if it's not a valid number
  }

  let formattedNumber = numberFormat.toLocaleString('es-ES', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  switch (currency) {
    case 'dollars':
      return `${formattedNumber} $`;
    case 'pesos':
      return `${formattedNumber} COP`;
    case 'bs':
      return `${formattedNumber} Bs`;
    default:
      return formattedNumber;
  }
};

const ReportPayments = ({ isVisible, onClose }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateType, setDateType] = useState('start');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  console.log(payments)

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

    const filtered = payments.filter(payment => {
      const paymentDate = parseDate(payment.fecha);
      return paymentDate >= formattedStartDate && paymentDate <= formattedEndDate;
    });

    setFilteredPayments(filtered);
    setPage(1);
  };

  const handleReset = () => {
    const today = new Date();
    setStartDate(null);
    setEndDate(null);
    setFilteredPayments(payments);
    setPage(1);
  };

  const updatePayments = async () => {
    const paymentsString = await AsyncStorage.getItem('SyncedClientPass');

    console.log("paymentsString")
    console.log(paymentsString)


    const synchronizedPayments = paymentsString ? JSON.parse(paymentsString) : [];

    if (JSON.stringify(synchronizedPayments) !== JSON.stringify(payments)) {
      setPayments(synchronizedPayments);
      setFilteredPayments((prev) => {
        if (!startDate && !endDate) {
          return synchronizedPayments;
        }
        return prev;
      });
    }
  };

  useEffect(() => {
    if (isVisible) {
      updatePayments();
    }
  }, [isVisible]);

  const applyPagination = () => {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredPayments.slice(start, end);
  };

  const renderPaginationButtons = () => {
    const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
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
            <Text style={styles.mainTitle}>Historial de Abonos</Text>
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
                <Text style={styles.titleListPrice}>Detalles</Text>
              </View>
            </View>

            <ScrollView>
              {applyPagination().length > 0 ? (
                applyPagination().map((payment) => (
                  <View key={payment.id_pass} style={styles.productItem2}>
                    <View style={styles.nameProd}>
                      <Text>{payment.nom_cli}</Text>
                    </View>
                    <View style={styles.priceContainer}>
                      <Text>{payment.fecha}</Text>
                      <Text>{formatNumber(payment.amount, payment.tipoPago)}</Text>
                    </View>
                  </View>
                ))
              ) : (
                <Text style={styles.noOrdersText}></Text>
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

export default ReportPayments;
