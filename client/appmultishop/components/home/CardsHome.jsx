import React                              from 'react'
import { Text, View , TouchableOpacity  } from 'react-native'
import { MaterialIcons }                  from '@expo/vector-icons'
import { useNavigation }                  from '@react-navigation/native'
import MaterialCommunityIcons             from 'react-native-vector-icons/MaterialCommunityIcons'
import { LinearGradient }                 from 'expo-linear-gradient';
import styles                             from '../../styles/CardsHome.styles'

// // Screens
import Clients                            from '../../app/(tabs)/Clients'
import Orders                             from '../../app/(tabs)/Orders'
import Products                           from '../../app/(tabs)/Products'

const CardsHome = () => {

  const navigation = useNavigation()

  const handlePress = (screenName) => {
    navigation.navigate(screenName)
  }

  return (
    <LinearGradient
      colors={['#ffff', '#9bdef6', '#ffffff', '#9bdef6']}
      style={styles.gradientBackground}
    >
    <View style={styles.mainContainer}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.cardContainer} activeOpacity={0.7} useNativeDriver={true} onPress={() => handlePress(Clients)}>
            {/* <MaterialCommunityIcons name='account-group' color="#38B0DB" size={80} /> */}
            <MaterialCommunityIcons name='truck' color="#38B0DB" size={80} />
            <Text style={styles.title}>Pedidos</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cardContainer} activeOpacity={0.7} useNativeDriver={true} onPress={() => handlePress(Orders)}>
            {/* <MaterialCommunityIcons name='truck' color="#38B0DB" size={80} /> */}
            <MaterialCommunityIcons name="cloud-upload" color="#38B0DB" size={80}/>
            <Text style={styles.title}>Enviar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cardContainer} activeOpacity={0.7} useNativeDriver={true} onPress={() => handlePress(Products)}>
            <MaterialCommunityIcons name='clipboard-edit-outline' color="#38B0DB" size={80} />
            <Text style={styles.title}>Productos</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cardContainer} activeOpacity={0.7} useNativeDriver={true}>
          <MaterialIcons name="query-stats" size={80} color="#38B0DB" />
            <Text style={styles.title}>Reportes</Text>
          </TouchableOpacity>
        </View>
    </View>
    </LinearGradient>
  )
}

export default CardsHome
