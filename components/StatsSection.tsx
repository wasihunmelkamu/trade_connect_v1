"use client"

import { useStats } from "@/lib/stats-context"
import { TrendingUp } from "lucide-react"

export function StatsSection() {
  const { stats } = useStats()

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M+"
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K+"
    }
    return num.toString()
  }

  return (
    <section className="py-20 bg-muted">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <TrendingUp className="h-6 w-6 text-primary mr-2" />
            <span className="text-sm font-medium text-muted-foreground">Live Statistics</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Growing Every Day</h2>
          <p className="text-lg text-muted-foreground">Join our thriving marketplace community</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="bg-background rounded-lg p-8 shadow-sm">
            <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
              {formatNumber(stats.activeSuppliers)}
            </div>
            <div className="text-lg text-muted-foreground">Active Suppliers</div>
            <div className="text-sm text-green-600 mt-2">↗ Growing daily</div>
          </div>
          <div className="bg-background rounded-lg p-8 shadow-sm">
            <div className="text-4xl md:text-5xl font-bold text-secondary mb-2">
              {formatNumber(stats.productsListed)}
            </div>
            <div className="text-lg text-muted-foreground">Products Listed</div>
            <div className="text-sm text-green-600 mt-2">↗ Updated live</div>
          </div>
          <div className="bg-background rounded-lg p-8 shadow-sm">
            <div className="text-4xl md:text-5xl font-bold text-accent mb-2">
              {formatNumber(stats.successfulConnections)}
            </div>
            <div className="text-lg text-muted-foreground">Successful Connections</div>
            <div className="text-sm text-green-600 mt-2">↗ Real-time updates</div>
          </div>
        </div>
      </div>
    </section>
  )
}
