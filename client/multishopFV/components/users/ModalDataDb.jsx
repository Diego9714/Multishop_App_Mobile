import { Text, View, 
  TextInput, Modal, Pressable }         from 'react-native'
import React, { useState , useEffect }  from 'react'
import AsyncStorage                     from '@react-native-async-storage/async-storage'
// Styles
import styles                           from '../../styles/ModalDataDb.styles'

const ModalDataDb = ({ visible , onClose }) => {
  const [host , setHost]          = useState("")
  const [username , setUsername]  = useState("")
  const [password , setPassword]  = useState("")
  const [database , setDatabase]  = useState("")

  useEffect(() => {
    // Cargar los datos guardados al abrir el modal
    const loadStoredData = async () => {
      try {
        const savedData = await AsyncStorage.getItem("multishopDB")
        if (savedData) {
          const parsedData = JSON.parse(savedData)
          setHost(parsedData.host || "")
          setUsername(parsedData.username || "")
          setPassword(parsedData.password || "")
          setDatabase(parsedData.database || "")
        }
      } catch (error) {
        console.log("Error al cargar los datos guardados", error)
      }
    }

    if (visible) {
      loadStoredData()
    }
  }, [visible])

  const handleSave = async () => {
    if(host, username, password, database){

      const infoDatabase = {
        host: host,
        username: username,
        password: password,
        database: database
      }

      await AsyncStorage.setItem("multishopDB" , JSON.stringify(infoDatabase))
      onClose()
    }
  }

  if (!visible) return null

  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.titleModal}>Ingresa los datos de la Base de Datos</Text>

          <View style={styles.ViewTextInput}>
            <TextInput
              placeholder='Host'
              style={styles.textInput}
              value={host}
              onChangeText={(text) => setHost(text)}
            />
          </View>
          <View style={styles.ViewTextInput}>
            <TextInput
              placeholder='Usuario'
              style={styles.textInput}
              value={username}
              onChangeText={(text) => setUsername(text)}
            />
          </View>
          <View style={styles.ViewTextInput}>
            <TextInput
              placeholder='Contraseña'
              style={styles.textInput}
              value={password}
              onChangeText={(text) => setPassword(text)}
            />
          </View>
          <View style={styles.ViewTextInput}>
            <TextInput
              placeholder='Nombre Base de Datos'
              style={styles.textInput}
              value={database}
              onChangeText={(text) => setDatabase(text)}
            />
          </View>

          <View style={styles.sectionButtonsModal}>
            <Pressable style={styles.buttonModal} onPress={handleSave}>
              <Text style={styles.buttonTextModal}>Guardar</Text>
            </Pressable>
            <Pressable style={styles.buttonModalExit} onPress={onClose}>
              <Text style={styles.buttonTextModal}>Salir</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  )
}

export default ModalDataDb