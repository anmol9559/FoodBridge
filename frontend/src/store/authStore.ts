import { useState, useEffect } from 'react'
import { User, UserRole } from '../types'

// Demo initial state (Default to RESTAURANT role for developer preview)
const DEFAULT_USER: User = {
  id: 'usr_demo_123',
  firstName: 'Jane',
  lastName: 'Doe',
  email: 'jane@greenbites.com',
  role: 'RESTAURANT',
  organizationId: 'org_demo_restaurant',
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('demo_user')
    return saved ? JSON.parse(saved) : DEFAULT_USER
  })

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('token') || 'demo_mock_jwt_token'
  })

  useEffect(() => {
    if (user) {
      localStorage.setItem('demo_user', JSON.stringify(user))
    } else {
      localStorage.removeItem('demo_user')
    }
  }, [user])

  const setRole = (role: UserRole) => {
    if (!user) return
    const updated = { ...user, role }
    setUser(updated)
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
    localStorage.removeItem('demo_user')
  }

  const loginMock = (newUser: User, newToken: string) => {
    setUser(newUser)
    setToken(newToken)
    localStorage.setItem('token', newToken)
  }

  return {
    user,
    token,
    role: user?.role || null,
    isAuthenticated: !!user,
    setRole,
    logout,
    loginMock,
  }
}
