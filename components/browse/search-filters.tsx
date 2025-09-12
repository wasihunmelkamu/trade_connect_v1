"use client"

import type React from "react"

import { useState } from "react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, X, Filter } from "lucide-react"

interface SearchFiltersProps {
  onSearch: (query: string) => void
  onCategoryChange: (category: string | null) => void
  selectedCategory: string | null
  searchQuery: string
}

export function SearchFilters({ onSearch, onCategoryChange, selectedCategory, searchQuery }: SearchFiltersProps) {
  const [localSearch, setLocalSearch] = useState(searchQuery)
  const categories = useQuery(api.categories.getCategories)

  const handleSearch = () => {
    onSearch(localSearch.trim())
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const clearFilters = () => {
    setLocalSearch("")
    onSearch("")
    onCategoryChange(null)
  }

  const hasActiveFilters = searchQuery || selectedCategory

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search posts..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pl-10"

          />
        </div>
        <Button onClick={handleSearch}>Search</Button>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filters:</span>
        </div>

        <Select
          value={selectedCategory || "all"}
          onValueChange={(value) => onCategoryChange(value === "all" ? null : value)}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories?.map((category) => (
              <SelectItem key={category._id} value={category.slug}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={clearFilters}>
            <X className="h-4 w-4 mr-1" />
            Clear Filters
          </Button>
        )}
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {searchQuery && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Search: "{searchQuery}"
              <button className="cursor-pointer" onClick={() => onSearch("")}>
                <X className="h-3 w-3 hover:text-red-500" />

              </button>
            </Badge>
          )}
          {selectedCategory && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Category: {categories?.find((c) => c.slug === selectedCategory)?.name}
              <X className="h-3 w-3 cursor-pointer" onClick={() => onCategoryChange(null)} />
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}
