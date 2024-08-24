import React, { useState } from 'react'
import { Text, View, Modal, Pressable } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import styles from '../../styles/FilterProducts.styles'

const ModalFilterProducts = ({ visible, onClose, onSave }) => {
  // Mantener el estado de los filtros seleccionados
  const [selectedQuantityOrder, setSelectedQuantityOrder] = useState(null)
  const [selectedPriceOrder, setSelectedPriceOrder] = useState(null)
  const [selectedQuantityOrderTemp, setSelectedQuantityOrderTemp] = useState(null)
  const [selectedPriceOrderTemp, setSelectedPriceOrderTemp] = useState(null)

  // Función para manejar la selección del orden de cantidad
  const handleQuantityOrderSelect = (order) => {
    setSelectedQuantityOrderTemp(order === selectedQuantityOrderTemp ? null : order)
    if (order) setSelectedPriceOrderTemp(null)
  }

  // Función para manejar la selección del orden de precio
  const handlePriceOrderSelect = (order) => {
    setSelectedPriceOrderTemp(order === selectedPriceOrderTemp ? null : order)
    if (order) setSelectedQuantityOrderTemp(null)
  }

  // Función para guardar los filtros seleccionados y cerrar el modal
  const handleSave = () => {
    setSelectedQuantityOrder(selectedQuantityOrderTemp)
    setSelectedPriceOrder(selectedPriceOrderTemp)
    onSave({
      selectedQuantityOrder: selectedQuantityOrderTemp,
      selectedPriceOrder: selectedPriceOrderTemp,
    })
    onClose()
  }

  // Función para cerrar el modal sin aplicar cambios
  const handleClose = () => {
    // Restablecer filtros temporales a los activos si no se aplicaron cambios
    setSelectedQuantityOrderTemp(selectedQuantityOrder)
    setSelectedPriceOrderTemp(selectedPriceOrder)
    onClose()
  }

  // Función para limpiar los filtros temporales
  const handleClearFilters = () => {
    setSelectedQuantityOrderTemp(null)
    setSelectedPriceOrderTemp(null)
  }

  return (
    <Modal transparent={true} animationType="fade" visible={visible} onRequestClose={handleClose}>
      <View style={styles.mainContainer}>
        <View style={styles.container}>
          <Text style={styles.titleContainer}>Filtrar por</Text>

          <Pressable
            style={[
              styles.filterContainer,
              selectedQuantityOrderTemp === 'cantidad-menor' && styles.selectedFilter,
            ]}
            onPress={() => handleQuantityOrderSelect('cantidad-menor')}
          >
            <MaterialIcons
              name="filter-1"
              size={24}
              color={selectedQuantityOrderTemp === 'cantidad-menor' ? '#38B0DB' : 'black'}
            />
            <Text
              style={[
                styles.filterText,
                selectedQuantityOrderTemp === 'cantidad-menor' && { color: '#38B0DB' },
              ]}
            >
              De menor a mayor Cantidad Comprada
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.filterContainer,
              selectedQuantityOrderTemp === 'cantidad-mayor' && styles.selectedFilter,
            ]}
            onPress={() => handleQuantityOrderSelect('cantidad-mayor')}
          >
            <MaterialIcons
              name="filter-2"
              size={24}
              color={selectedQuantityOrderTemp === 'cantidad-mayor' ? '#38B0DB' : 'black'}
            />
            <Text
              style={[
                styles.filterText,
                selectedQuantityOrderTemp === 'cantidad-mayor' && { color: '#38B0DB' },
              ]}
            >
              De mayor a menor Cantidad Comprada
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.filterContainer,
              selectedPriceOrderTemp === 'precio-menor' && styles.selectedFilter,
            ]}
            onPress={() => handlePriceOrderSelect('precio-menor')}
          >
            <MaterialIcons
              name="filter-3"
              size={24}
              color={selectedPriceOrderTemp === 'precio-menor' ? '#38B0DB' : 'black'}
            />
            <Text
              style={[
                styles.filterText,
                selectedPriceOrderTemp === 'precio-menor' && { color: '#38B0DB' },
              ]}
            >
              De menor a mayor Total USD
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.filterContainer,
              selectedPriceOrderTemp === 'precio-mayor' && styles.selectedFilter,
            ]}
            onPress={() => handlePriceOrderSelect('precio-mayor')}
          >
            <MaterialIcons
              name="filter-4"
              size={24}
              color={selectedPriceOrderTemp === 'precio-mayor' ? '#38B0DB' : 'black'}
            />
            <Text
              style={[
                styles.filterText,
                selectedPriceOrderTemp === 'precio-mayor' && { color: '#38B0DB' },
              ]}
            >
              De mayor a menor Total USD
            </Text>
          </Pressable>

          <View style={styles.sectionButtonsModal}>
            <Pressable style={styles.buttonModal} onPress={handleSave}>
              <Text style={styles.buttonTextModal}>Aplicar</Text>
            </Pressable>
            <Pressable style={styles.buttonModalExit} onPress={handleClearFilters}>
              <Text style={styles.buttonTextModal}>Limpiar Filtros</Text>
            </Pressable>
            <Pressable style={styles.buttonModalExit} onPress={handleClose}>
              <Text style={styles.buttonTextModal}>Salir</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  )
}

export default ModalFilterProducts
