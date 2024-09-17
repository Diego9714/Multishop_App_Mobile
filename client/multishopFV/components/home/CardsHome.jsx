import React , {useState}                 from 'react'
import { Text, View , TouchableOpacity ,
  ImageBackground }                       from 'react-native'
import { MaterialIcons }                  from '@expo/vector-icons'
import { useNavigation }                  from '@react-navigation/native'
import MaterialCommunityIcons             from 'react-native-vector-icons/MaterialCommunityIcons'
import { LinearGradient }                 from 'expo-linear-gradient';
// Styles
import { images }                         from '../../constants'
import styles                             from '../../styles/CardsHome.styles'
// Screens
import Clients                            from '../../app/(tabs)/Clients'
import Orders                             from '../../app/(tabs)/Orders'
import Products                           from '../../app/(tabs)/Products'
// Components
import ModalSelectReport                  from '../../components/reports/ModalSelectReport'

const CardsHome = () => {
  const [isModalSelectReportVisible, setIsModalSelectReportVisible] = useState(false)

  const navigation = useNavigation()

  const handlePress = (screenName) => {
    navigation.navigate(screenName)
  }

    // Report
    const openModalSelectReport = () => {
      setIsModalSelectReportVisible(true)
    }
  
    const closeModalSelectReport = () => {
      setIsModalSelectReportVisible(false)
    }

  return (
    <ImageBackground
      source={images.fondo}
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

      
          <TouchableOpacity style={styles.cardContainer} activeOpacity={0.7} onPress={openModalSelectReport} useNativeDriver={true}>
            <MaterialIcons name="query-stats" size={80} color="#38B0DB" />
            <Text style={styles.title}>Reportes</Text>
          </TouchableOpacity>
        </View>

        <ModalSelectReport
        isModalSelectReportVisible={isModalSelectReportVisible}
        onClose={closeModalSelectReport}
      />
    </View>
    </ImageBackground>
  )
}

export default CardsHome
