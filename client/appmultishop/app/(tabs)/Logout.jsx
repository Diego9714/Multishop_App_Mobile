import React, { useEffect, useContext } from 'react'
import { UserContext }                  from '../../context/UserContext'

const Logout = () => {
  const { logout } = useContext(UserContext)

  useEffect(() => {
    logout()
  }, [])

}

export default Logout
