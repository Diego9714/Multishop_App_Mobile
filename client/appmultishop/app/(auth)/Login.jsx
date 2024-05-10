// Dependencies
import React, { useState , useEffect }     from 'react'
import { SafeAreaView }                    from 'react-native-safe-area-context'
import { StatusBar }                       from 'expo-status-bar'
import {instanceAuth}                            from '../../global/api'
import AsyncStorage                        from '@react-native-async-storage/async-storage'
import { router }                          from 'expo-router'
import { 
  View,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Pressable,
  Text,
  Alert,
  TouchableOpacity
} from 'react-native'
// Resources
import { images }                         from '../../constants'
import { MaterialIcons }                  from '@expo/vector-icons'
// Styles
import styles                             from '../../styles/login.styles'
// Context


const Login = () => {

  const [username , setUsername ] = useState("")
  const [password , setPassword ] = useState("")
  
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const token = await AsyncStorage.getItem('tokenUser')
        // const token = await AsyncStorage.removeItem('tokenUser')

        if(token){
          router.replace('/(tabs)/Home')
        }
      } catch (error) {
        return error
      }
    }
    checkLogin()
  },[])

  const handleLogin = async ( ) => {
    try {
      const user = {
        username,
        password
      }
  
      const res = await instanceAuth.post(`/api/login`, user)
      const token = res.data.tokenUser
      await AsyncStorage.setItem('tokenUser', token)
      router.replace('/(tabs)/Home')

    } catch (error) {
      switch(error.message){
        case "Request failed with status code 500":
          Alert.alert("Verifica tu usuario y contraseña", "Usuario o contraseña incorrectos")
          break
        case "Request failed with status code 400":
          Alert.alert("Verifica tu usuario y contraseña", "Deben tener al menos 6 digitos",)
          break
      }
    }
  }

  return (
    // <SafeAreaView>
      <KeyboardAvoidingView>
        <View style={styles.container}>
          <Image source={images.logo} resizeMode="contain" style={styles.logo} />
          <View style={styles.ViewTextInput}>
            <MaterialIcons name="email" size={24} color="#777777" style={styles.icon} />
            <TextInput 
              placeholder='usuario'
              style={styles.textInput} 
              value={username}
              onChangeText={(text)=> setUsername(text)}
              />
          </View>
          <View style={styles.ViewTextInput}>
            <MaterialIcons name="lock" size={24} color="#777777" style={styles.icon} />
            <TextInput 
              placeholder='contraseña'
              style={styles.textInput}
              secureTextEntry={true}
              value={password}
              onChangeText={(text)=> setPassword(text)}
            />
          </View>
          <StatusBar style="auto" />

          <TouchableOpacity 
            style={styles.button}
            onPress={handleLogin}
          >
            <Text style={styles.buttonText} >Ingresar</Text>
          </TouchableOpacity>

        </View>
      </KeyboardAvoidingView>
    // </SafeAreaView>
  )
}

export default Login
