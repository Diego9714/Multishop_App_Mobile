import React, { useState, useEffect } from 'react';
import { View, Image, ActivityIndicator, Modal, Text, Pressable, FlatList } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from '../styles/Navbar.styles';
import { getAllInfo } from '../utils/NavbarUtils'; // Importa la función de utilidad
import { images } from '../constants';

const Navbar = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [syncedVisits, setSyncedVisits] = useState([]);
  const [unsyncedVisits, setUnsyncedVisits] = useState([]);

  useEffect(() => {
    if (message === 'Información actualizada y visitas sincronizadas.') {
      setUnsyncedVisits([]); // Limpia las visitas no sincronizadas si todas se sincronizaron
    }
  }, [message]);

  const handleClose = () => {
    setMessage('');
    setSyncedVisits([]); // Vacía el estado de visitas sincronizadas al cerrar el modal
    setUnsyncedVisits([]); // Vacía el estado de visitas no sincronizadas al cerrar el modal
  };
  

  const handleGetAllInfo = async () => {
    setLoading(true);
    setMessage('');
    setSuccess(false);
    try {
      await getAllInfo(setLoading, setMessage, handleSyncVisits); // Llama a getAllInfo con handleSyncVisits como callback
      setSuccess(true); // Indica éxito si la información se actualiza correctamente
    } catch (error) {
      setSuccess(false); // Maneja errores en la actualización de información
    }
  };

  const handleSyncVisits = async (visitsSynced, syncedVisitsList, unsyncedVisitsList) => {
    if (visitsSynced) {
      setMessage('Información actualizada y visitas sincronizadas.');
    } else {
      setMessage('Información actualizada.');
    }
    setSyncedVisits(syncedVisitsList); // Actualiza el estado con las visitas sincronizadas
    setUnsyncedVisits(unsyncedVisitsList); // Actualiza el estado con las visitas no sincronizadas
  };

  const renderItem = ({ item }) => {
    const fechaFormateada = item.fecha ? new Date(item.fecha).toLocaleString() : '';
    return (
      <View style={styles.orderItem}>
        <Text style={styles.orderText}>{item.nom_cli}</Text>
        <Text style={styles.orderText}>{fechaFormateada}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Image source={images.logo} style={styles.logo} />
      <MaterialCommunityIcons
        name="cloud-download"
        size={35}
        color="#38B0DB"
        style={{ marginLeft: 115 }}
        onPress={handleGetAllInfo}
      />
      <Modal transparent={true} animationType="fade" visible={loading || message !== ''}>
        <View style={styles.modalBackground}>
          <View style={styles.activityIndicatorWrapper}>
            {loading ? (
              <ActivityIndicator size="large" color="#0000ff" animating={loading} />
            ) : (
              <>
                <Text style={styles.messageInfo}>{message}</Text>
                {syncedVisits.length > 0 ? (
                  <>
                    <Text style={styles.message}>Visitas Sincronizadas</Text>
                    <FlatList
                      data={syncedVisits}
                      renderItem={renderItem}
                      keyExtractor={(item, index) => index.toString()}
                      ListEmptyComponent={<Text style={styles.message}>No hay visitas sincronizadas</Text>}
                    />
                  </>
                ) : null}
                {unsyncedVisits.length > 0 ? (
                  <>
                    <Text style={styles.message}>Visitas No Sincronizadas</Text>
                    <FlatList
                      data={unsyncedVisits}
                      renderItem={renderItem}
                      keyExtractor={(item, index) => index.toString()}
                      ListEmptyComponent={<Text style={styles.message}>No hay visitas no sincronizadas</Text>}
                    />
                  </>
                ) : null}
                <View style={styles.buttonContainer}>
                  {success ? (
                    <Pressable style={styles.buttonModalExit} onPress={handleClose}>
                      <Text style={styles.buttonTextModal}>Salir</Text>
                    </Pressable>
                  ) : (
                    <>
                      <Pressable style={styles.buttonModal} onPress={handleGetAllInfo}>
                        <Text style={styles.buttonTextModal}>Reintentar</Text>
                      </Pressable>
                      <Pressable style={styles.buttonModalExit} onPress={handleClose}>
                        <Text style={styles.buttonTextModal}>Salir</Text>
                      </Pressable>
                    </>
                  )}
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Navbar;
