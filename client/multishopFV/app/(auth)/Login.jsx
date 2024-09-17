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
  Alert,
  ImageBackground,
  TouchableWithoutFeedback 
} from 'react-native'
import { router } from 'expo-router'
import { FontAwesome } from '@expo/vector-icons';
import { images } from '../../constants'
import { MaterialIcons } from '@expo/vector-icons'
import styles from '../../styles/login.styles'
import { UserContext } from '../../context/UserContext'
import ModalLoaderLogin from '../../components/users/ModalLoaderLogin'
import ModalDataDb from '../../components/users/ModalDataDb'

const Login = () => {
  const { signIn, checkLogin } = useContext(UserContext)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [modalVisible, setModalVisible] = useState(false)
  const [modalMessage, setModalMessage] = useState("Cargando...")
  const [modalStatus, setModalStatus] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [clickCount, setClickCount] = useState(0)
  const [dataDbModalVisible, setDataDbModalVisible] = useState(false)

  useEffect(() => {
    checkLogin()
  }, [])

  useEffect(() => {
    if (clickCount === 5) {
      setDataDbModalVisible(true)
      setClickCount(0)
    }
  }, [clickCount])

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
        <ImageBackground
          source={images.fondo}
          style={styles.gradientBackground}        >
          <View style={styles.container}>
            <View style={styles.containerInfo}>
            <FontAwesome name="user-circle" size={90} color="#FFF" style={styles.iconTop}/>
              <View style={styles.ViewTextInput}>
                <MaterialIcons name="email" size={24} color="#777777" style={styles.icon} />
                <TextInput
                  placeholder='Usuario'
                  style={styles.textInput}
                  value={username}
                  onChangeText={(text) => setUsername(text)}
                />
              </View>
              <View style={styles.ViewTextInput}>
                <MaterialIcons name="lock" size={24} color="#777777" style={styles.icon} />
                <TextInput
                  placeholder='Contraseña'
                  style={styles.textInput}
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={(text) => setPassword(text)}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <MaterialIcons name={showPassword ? "visibility-off" : "visibility"} size={24} color="#777777" />
                </TouchableOpacity>
              </View>
              <StatusBar style="auto" />

              <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Iniciar Sesión</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.imgContainer}>
              <TouchableWithoutFeedback onPress={() => setClickCount(prev => prev + 1)}>
                <Image source={images.logo} resizeMode="contain" style={styles.logo} />
              </TouchableWithoutFeedback >
            </View>

          </View>
        </ImageBackground>
      </ScrollView>

      <ModalDataDb 
        visible={dataDbModalVisible}
        onClose={() => setDataDbModalVisible(false)}
      />

      <ModalLoaderLogin visible={modalVisible} message={modalMessage} status={modalStatus} />
    </KeyboardAvoidingView>
  )
}

export default Login
