"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface StatsData {
  activeSuppliers: number
  productsListed: number
  successfulConnections: number
}

interface StatsContextType {
  stats: StatsData
  incrementSuppliers: () => void
  incrementProducts: (count?: number) => void
  incrementConnections: () => void
}

const StatsContext = createContext<StatsContextType | undefined>(undefined)

export function StatsProvider({ children }: { children: React.ReactNode }) {
  const [stats, setStats] = useState<StatsData>({
    activeSuppliers: 10247,
    productsListed: 52891,
    successfulConnections: 108456,
  })

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => ({
        activeSuppliers: prev.activeSuppliers + Math.floor(Math.random() * 3),
        productsListed: prev.productsListed + Math.floor(Math.random() * 5),
        successfulConnections: prev.successfulConnections + Math.floor(Math.random() * 8),
      }))
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const incrementSuppliers = () => {
    setStats((prev) => ({
      ...prev,
      activeSuppliers: prev.activeSuppliers + 1,
    }))
  }

  const incrementProducts = (count = 1) => {
    setStats((prev) => ({
      ...prev,
      productsListed: prev.productsListed + count,
    }))
  }

  const incrementConnections = () => {
    setStats((prev) => ({
      ...prev,
      successfulConnections: prev.successfulConnections + 1,
    }))
  }

  return (
    <StatsContext.Provider value={{ stats, incrementSuppliers, incrementProducts, incrementConnections }}>
      {children}
    </StatsContext.Provider>
  )
}

export function useStats() {
  const context = useContext(StatsContext)
  if (context === undefined) {
    throw new Error("useStats must be used within a StatsProvider")
  }
  return context
}
