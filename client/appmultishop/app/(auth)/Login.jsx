import React, { useState, useContext, useEffect } from 'react'
import { StatusBar } from 'expo-status-bar'
import {
  View,
  TextInput,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TouchableOpacity,
  Platform,
  Alert
} from 'react-native'
import { router }               from 'expo-router'

import { images } from '../../constants'
import { MaterialIcons } from '@expo/vector-icons'
import styles from '../../styles/Login.styles'
import { UserContext } from '../../context/UserContext'
import ModalLoaderLogin from '../../components/users/ModalLoaderLogin'

const Login = () => {
  const { signIn, checkLogin } = useContext(UserContext)

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [modalVisible, setModalVisible] = useState(false)
  const [modalMessage, setModalMessage] = useState("Cargando...")
  const [modalStatus, setModalStatus] = useState(null)

  useEffect(() => {
    checkLogin()
  }, [])

  const handleLogin = async () => {
    if (username && password) {
      setModalVisible(true)
      setModalMessage("Cargando...")
      setModalStatus(null)

      const loginPromise = signIn(username, password)
      const timeoutPromise = new Promise((resolve) => setTimeout(resolve, 10000))

      const response = await Promise.race([loginPromise, timeoutPromise])

      if (response) {
        setModalMessage(response.message)
        setModalStatus(response.status)
      } else {
        setModalMessage("Tiempo de espera agotado. Inténtelo de nuevo.")
        setModalStatus(500)
      }

      setTimeout(() => {
        setModalVisible(false)
        if (response && response.status === 200) {
          router.replace('/(tabs)/Home')
        }
      }, 4000)
    } else {
      Alert.alert('Error', 'Por favor, complete todos los campos')
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          <View style={styles.imgContainer}>
            <Image source={images.logo} resizeMode="contain" style={styles.logo} />
          </View>

          <View style={styles.containerInfo}>
            <View style={styles.containerWelcome}>
              <Text style={styles.textWelcome}>Bienvenido</Text>
              <Text style={styles.textDescription}>Por favor, ingresa tus datos para iniciar sesión</Text>
            </View>
            <View style={styles.ViewTextInput}>
              <MaterialIcons name="email" size={24} color="#777777" style={styles.icon} />
              <TextInput
                placeholder='usuario'
                style={styles.textInput}
                value={username}
                onChangeText={(text) => setUsername(text)}
              />
            </View>
            <View style={styles.ViewTextInput}>
              <MaterialIcons name="lock" size={24} color="#777777" style={styles.icon} />
              <TextInput
                placeholder='contraseña'
                style={styles.textInput}
                secureTextEntry={true}
                value={password}
                onChangeText={(text) => setPassword(text)}
              />
            </View>
            <StatusBar style="auto" />

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Ingresar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <ModalLoaderLogin visible={modalVisible} message={modalMessage} status={modalStatus} />
    </KeyboardAvoidingView>
  )
}

export default Login
