import {Stack} from 'expo-router'
import {UserProvider} from '../../context/UserContext'

const Layout = () => {
  return (
    <UserProvider>
      <Stack>
        <Stack.Screen name='Login' options={{headerShown:false}}/>
      </Stack>
    </UserProvider>
  )
}

export default Layout
