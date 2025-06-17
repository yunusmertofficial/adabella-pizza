"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export function SearchBar() {
  return (
    <div className="relative max-w-2xl mx-auto">
      <Input
        type="text"
        placeholder="Pizza, kampanya veya malzeme ara..."
        className="pl-4 pr-12 py-3 text-lg border-gray-300 rounded-lg"
      />
      <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
        <Search className="h-5 w-5 text-blue-500" />
      </button>
    </div>
  )
}
