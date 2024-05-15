import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
// Components
import Navbar from '../../components/Navbar'
import ListProducts from '../../components/ListProducts';


const Products = () => {
  return (
    <View>
      <Navbar/>
      <ListProducts/>
    </View>
  )
}

export default Products

const styles = StyleSheet.create({})