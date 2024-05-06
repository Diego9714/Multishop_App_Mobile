import {Tabs} from 'expo-router'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { View, Image } from 'react-native'

const Layout = () => {
  
  const settingsNav = {
    headerShown: false,
    tabBarActiveTintColor: '#5B97DC',
    tabBarStyle:{
      borderTopWidth: 1,
      borderTopColor: '#CDCDE0',
      height: 70
    },
    tabBarLabelStyle: {
      fontSize: 15,
      fontWeight: '300',
      marginBottom: 10
    }
  }
  
  return (
    <Tabs screenOptions={settingsNav}>
      <Tabs.Screen name='Home'
        options={{
          tabBarLabel: 'Inicio',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name='home' color={color} size={30} style={{marginTop: 8}} />
          ) 
        }}
      />
      <Tabs.Screen name='Clients'
        options={{
          tabBarLabel: 'Clientes',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name='account-group' color={color} size={30} style={{marginTop: 8}} />
          ) 
        }}
      />
      <Tabs.Screen name='Orders'
        options={{
          tabBarLabel: 'Pedidos',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name='truck' color={color} size={30} style={{marginTop: 8}} />
          ) 
        }}
      />
      <Tabs.Screen name='Products'
        options={{
          tabBarLabel: 'Productos',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name='clipboard-edit-outline' color={color} size={30} style={{marginTop: 8}} />
          ) 
        }}
      />
    </Tabs>
  )
}

export default Layout
