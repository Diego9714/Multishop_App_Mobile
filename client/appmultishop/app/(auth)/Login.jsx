// Dependencies
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
  Platform
} from 'react-native'
// Resources
import { images } from '../../constants'
import { MaterialIcons } from '@expo/vector-icons'
// Styles
import styles from '../../styles/Login.styles'
// Context
import { UserContext } from '../../context/UserContext'

const Login = () => {

  const { signIn, checkLogin, logoutt } = useContext(UserContext)

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  useEffect(() => {
    checkLogin()
  }, [])

  const handleLogin = async () => {
    signIn(username, password)
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
    </KeyboardAvoidingView>
  )
}

export default Login
