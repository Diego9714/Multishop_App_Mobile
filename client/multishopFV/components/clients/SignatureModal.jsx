import React, { useState } from 'react';
import { Modal, Text, View, Pressable, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Svg, Path } from 'react-native-svg';

const { height, width } = Dimensions.get('window');

const SignatureModal = ({ isVisible, onClose }) => {
  const [paths, setPaths] = useState([]);
  const [currentPath, setCurrentPath] = useState([]);
  const [isClearButtonClicked, setClearButtonClicked] = useState(false);

  const onTouchEnd = () => {
    // Save the current path and reset it
    setPaths([...paths, currentPath.join(' ')]);
    setCurrentPath([]);
    setClearButtonClicked(false);
  };

  const onTouchMove = (event) => {
    const locationX = event.nativeEvent.locationX;
    const locationY = event.nativeEvent.locationY;

    if (currentPath.length === 0) {
      setCurrentPath([`M${locationX.toFixed(0)},${locationY.toFixed(0)}`]);
    } else {
      setCurrentPath([...currentPath, `L${locationX.toFixed(0)},${locationY.toFixed(0)}`]);
    }
  };

  const handleClearButtonClick = () => {
    setPaths([]);
    setCurrentPath([]);
    setClearButtonClicked(true);
  };

  return (
    <Modal visible={isVisible} animationType="fade" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.titleModal}>Firma del Cliente</Text>
          <View
            style={styles.svgContainer}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <Svg height={height * 0.7} width={width * 0.9}>
              {/* Render all saved paths */}
              {paths.map((path, index) => (
                <Path
                  key={`path-${index}`}
                  d={path}
                  stroke="#38B0DB"
                  fill="transparent"
                  strokeWidth={3}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              ))}
              {/* Render the current drawing path */}
              {currentPath.length > 0 && (
                <Path
                  d={currentPath.join(' ')}
                  stroke="#38B0DB"
                  fill="transparent"
                  strokeWidth={3}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              )}
            </Svg>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.buttonModal} onPress={handleClearButtonClick}>
              <Text style={styles.clearButtonText}>Limpiar</Text>
            </TouchableOpacity>
            <Pressable style={styles.buttonModalExit} onPress={onClose}>
              <Text style={styles.buttonTextModal}>Cerrar</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  titleModal: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center'
  },
  svgContainer: {
    height: height * 0.7, // Updated height to 0.7 of the screen height
    width: width * 0.9,
    borderColor: 'black',
    backgroundColor: 'white',
    borderWidth: 1,
  },
  clearButton: {
    marginTop: 10,
    backgroundColor: 'black',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginRight: 10,
  },
  clearButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 10
  },
  buttonModal: {
    marginTop: 10,
    width: 100,
    height: 40,
    backgroundColor: "#38B0DB",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonModalExit: {
    marginTop: 10,
    width: 100,
    height: 40,
    backgroundColor: "#E72929",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonTextModal: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SignatureModal;
