import { useState, createContext, useEffect } from 'react'
/** Partager les props entre les composants */
export const UserContext = createContext()

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const loggedInUser = localStorage.getItem('user')
    if (loggedInUser) {
      authenticateUser(loggedInUser)
    }
  }, [])

  const authenticateUser = (userData) => {
    const userDataJson = JSON.parse(userData)
    setUser(userDataJson)
    setIsAuthenticated(true)
  }

  return (
    <UserContext.Provider
      value={{ user, isAuthenticated, authenticateUser, setIsAuthenticated }}
    >
      {children}
    </UserContext.Provider>
  )
}
