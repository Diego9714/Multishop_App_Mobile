import React, { useContext }  from 'react';
import {Tabs}                 from 'expo-router'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { MaterialIcons }      from '@expo/vector-icons';
import { UserProvider }       from '../../context/UserContext'

const Layout = () => {

  const settingsNav = {
    headerShown: false,
    tabBarActiveTintColor: '#38B0DB',
    tabBarStyle: {
      borderTopWidth: 1,
      borderTopColor: '#CDCDE0',
      height: 70,
    },
    tabBarLabelStyle: {
      fontSize: 15,
      fontWeight: '300',
      marginBottom: 10,
      justifyContent: 'space-between', // Asegura el uso de espacio entre los elementos
    }
  };

  return (
    <UserProvider>
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
            tabBarLabel: 'Pedidos',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name='truck' color={color} size={30} style={{marginTop: 8}} />
            ) 
          }}
        />
        <Tabs.Screen name='Orders'
          options={{
            tabBarLabel: 'Enviar',
            tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="cloud-upload" color={color} size={30} style={{marginTop: 8}}/>
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
        <Tabs.Screen name='Logout'
          options={{
            tabBarLabel: 'Salir',
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="logout" size={30} color={color} style={{marginTop: 8}}/>
            ) 
          }}
        />
      </Tabs>
    </UserProvider>
)
}

export default Layout
