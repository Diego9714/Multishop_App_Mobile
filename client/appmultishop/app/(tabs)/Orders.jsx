import { Text, View }   from 'react-native'
import React            from 'react'
import Navbar           from '../../components/Navbar'
// Components
import SelectOrders     from '../../components/orders/SelectOrders'

const Orders = () => {
  return (
    <View>
      <Navbar />
      <SelectOrders />
    </View>
  )
}

export default Orders
