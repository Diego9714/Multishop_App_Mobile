import {children, createContext , useState} from 'react'

export const UserContext = createContext()

export const UserProvider = ({children}) => {

  const [user , setUser] = useState(null)

  const signIn = () => {
      
  }

  return(
    <UserContext.Provider
      value={{
        signIn
      }}
    >
      {children}
    </UserContext.Provider>
  )
}