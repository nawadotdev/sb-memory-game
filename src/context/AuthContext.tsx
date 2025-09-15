"use client"

import { IUser } from "@/models/User.model"
import { createContext, useContext, useEffect, useState } from "react"

type AuthContextType = {
    user: IUser | null
    isAuthenticating: boolean
    token: string | null
    login: () => void
    logout: () => void
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    isAuthenticating: true,
    token: null,
    login: () => {},
    logout: () => {},
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<IUser | null>(null)
    const [isAuthenticating, setIsAuthenticating] = useState(true)
    const [token, setToken] = useState<string | null>(null)
    useEffect(() => {
        const fetchUser = async () => {
            try{
                const response = await fetch("/api/auth/me")
                if(response.ok){
                    const { user, token } = await response.json()
                    setUser(user)
                    setToken(token)
                    setUser(user)
                } else {
                    setUser(null)
                }
            } catch {
                setUser(null)
            } finally {
                setIsAuthenticating(false)
            }
        }
        fetchUser()
    }, [])

    const login = () => {
        window.location.href = "/api/auth/redirect/discord"
    }

    const logout = () => {
        window.location.href = "/api/auth/logout"
    }

    return <AuthContext.Provider value={{ user, isAuthenticating, login, logout, token }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}