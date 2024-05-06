import { StyleSheet, Text, View, Image }  from 'react-native'
import React                              from 'react'
import MaterialCommunityIcons             from 'react-native-vector-icons/MaterialCommunityIcons'
import styles                             from '../styles/Navbar.styles'

// Components
import { images }                         from '../constants'


const Navbar = () => {
  return (
    <View style={styles.container}>
      <Image 
        source={images.logo} 
        style={styles.logo}
      />
      <MaterialCommunityIcons name="cloud-download" size={35} color="#5B97DC" style={{ marginLeft: 115 }} />
    </View>
  )
}

export default Navbar