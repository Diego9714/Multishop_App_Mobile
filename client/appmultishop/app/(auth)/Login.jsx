// Dependencies
import React, { useState , useContext , useEffect }     from 'react'
import { SafeAreaView }                    from 'react-native-safe-area-context'
import { StatusBar }                       from 'expo-status-bar'
import { 
  View,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Text,
  TouchableOpacity
} from 'react-native'
// Resources
import { images }                         from '../../constants'
import { MaterialIcons }                  from '@expo/vector-icons'
// Styles
import styles                             from '../../styles/login.styles'
// Context
import { UserContext } from '../../context/UserContext'

const Login = () => {

  const { signIn , checkLogin , logoutt } = useContext(UserContext)

  const [username , setUsername ] = useState("")
  const [password , setPassword ] = useState("")

  useEffect(() => {
    checkLogin()
  },[])

  const handleLogin = async ( ) => {
    signIn(username, password)
  }

  return (
    <SafeAreaView>
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
    </SafeAreaView>
  )
}

export default Login
