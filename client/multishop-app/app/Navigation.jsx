import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

// Screens
import Home from './screens/Home'
import Clients from './screens/Clients'
import Orders from './screens/Orders'
import Products from './screens/Products'


const Tab = createBottomTabNavigator()
const HomeStackNavigator = createNativeStackNavigator()

const MyStack = () => {
  return (
    <HomeStackNavigator.Navigator>
      <HomeStackNavigator.Screen 
        name='Home' 
        component={Home}
        options={{
          headerShown: false
        }}
      />
    </HomeStackNavigator.Navigator>
  )
}

const MyTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName='Home'
      screenOptions={{
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
      }}
    >
      <Tab.Screen 
        name='Home' 
        component={Home}
        options={{
          tabBarLabel: 'Inicio',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name='home' color={color} size={30} style={{marginTop: 8}} />
          )
        }}
      />
      <Tab.Screen 
        name='Clients' 
        component={Clients}
        options={{
          tabBarLabel: 'Clients',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name='account-group' color={color} size={30} style={{marginTop: 8}} />
          )
        }}
      />
      <Tab.Screen 
        name='Orders' 
        component={Orders}
        options={{
          tabBarLabel: 'Pedidos',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name='truck' color={color} size={30} style={{marginTop: 8}} />
          ),
          // headerShown: false
        }} 
      />
      <Tab.Screen 
        name='Products' 
        component={Products}
        options={{
          tabBarLabel: 'Productos',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name='clipboard-edit-outline' color={color} size={30} style={{marginTop: 8}} />
          )
        }} 
      />
    </Tab.Navigator>
  )
}

const Navigation = () => {
  return (
    <NavigationContainer>
      <MyTabs />
    </NavigationContainer>
  )
}

export default Navigation