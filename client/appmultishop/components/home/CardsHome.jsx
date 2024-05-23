import React                              from 'react'
import { Text, View , TouchableOpacity  } from 'react-native'
import { MaterialIcons }                  from '@expo/vector-icons';
import { useNavigation }                  from '@react-navigation/native';
import MaterialCommunityIcons             from 'react-native-vector-icons/MaterialCommunityIcons'
import styles                             from '../../styles/CardsHome.style'

// // Screens
import Clients                            from '../../app/(tabs)/Clients'
import Orders                             from '../../app/(tabs)/Orders'
import Products                           from '../../app/(tabs)/Products'

const CardsHome = () => {

  const navigation = useNavigation()

  const handlePress = (screenName) => {
    navigation.navigate(screenName)
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.cardContainer} activeOpacity={0.7} useNativeDriver={true} onPress={() => handlePress(Clients)}>
        <MaterialCommunityIcons name='account-group' color="#5B97DC" size={80} />
        <Text style={styles.title}>Clientes</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.cardContainer} activeOpacity={0.7} useNativeDriver={true} onPress={() => handlePress(Orders)}>
        <MaterialCommunityIcons name='truck' color="#5B97DC" size={80} />
        <Text style={styles.title}>Pedidos</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.cardContainer} activeOpacity={0.7} useNativeDriver={true} onPress={() => handlePress(Products)}>
        <MaterialCommunityIcons name='clipboard-edit-outline' color="#5B97DC" size={80} />
        <Text style={styles.title}>Productos</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.cardContainer} activeOpacity={0.7} useNativeDriver={true}>
      <MaterialIcons name="query-stats" size={80} color="#5B97DC" />
        <Text style={styles.title}>Reporte</Text>
      </TouchableOpacity>
    </View>
  )
}

export default CardsHome
