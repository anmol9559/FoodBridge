import React, { createContext, useContext, useState, useEffect } from 'react'
import { User, Organization, UserRole } from '../types'
import { AuthContextType, LoginResponseData } from '../types/auth'
import { getMeApi } from '../api/auth.api'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user')
    return saved ? JSON.parse(saved) : null
  })

  const [organization, setOrganization] = useState<Organization | null>(() => {
    const saved = localStorage.getItem('organization')
    return saved ? JSON.parse(saved) : null
  })

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('token')
  })

  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token')
      if (storedToken) {
        try {
          const res = await getMeApi()
          if (res.success && res.data) {
            const fetchedUser = res.data
            setUser(fetchedUser)
            localStorage.setItem('user', JSON.stringify(fetchedUser))
            if (fetchedUser.organization) {
              setOrganization(fetchedUser.organization as unknown as Organization)
              localStorage.setItem('organization', JSON.stringify(fetchedUser.organization))
            }
          }
        } catch {
          // Token expired or invalid
          logout()
        }
      }
      setIsLoading(false)
    }

    initAuth()
  }, [])

  const login = (data: LoginResponseData) => {
    const activeRole: UserRole = data.user?.role || data.role
    const userWithRole: User = {
      ...data.user,
      role: activeRole,
    }

    setToken(data.accessToken)
    setUser(userWithRole)
    setOrganization(data.organization)

    localStorage.setItem('token', data.accessToken)
    localStorage.setItem('user', JSON.stringify(userWithRole))
    if (data.organization) {
      localStorage.setItem('organization', JSON.stringify(data.organization))
    } else {
      localStorage.removeItem('organization')
    }
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    setOrganization(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('organization')
  }

  const refreshUser = async () => {
    if (!token) return
    try {
      const res = await getMeApi()
      if (res.success && res.data) {
        setUser(res.data)
        localStorage.setItem('user', JSON.stringify(res.data))
      }
    } catch {
      logout()
    }
  }

  const currentRole = user?.role || null

  return (
    <AuthContext.Provider
      value={{
        user,
        organization,
        token,
        role: currentRole,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
