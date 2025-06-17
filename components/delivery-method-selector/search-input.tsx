"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { Search, MapPin } from "lucide-react";
import { AddressSuggestion } from "@/types/delivery-method-selector";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSuggestionSelect: (suggestion: AddressSuggestion) => void;
  suggestions: AddressSuggestion[];
  showSuggestions: boolean;
  isSearching: boolean;
  placeholder: string;
}

export function SearchInput({
  value,
  onChange,
  onSuggestionSelect,
  suggestions,
  showSuggestions,
  isSearching,
  placeholder,
}: SearchInputProps) {
  const [localSuggestions, setLocalSuggestions] = useState<AddressSuggestion[]>(
    []
  );
  const [localShowSuggestions, setLocalShowSuggestions] = useState(false);
  const [localIsSearching, setLocalIsSearching] = useState(false);
  const [userIsTyping, setUserIsTyping] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Search addresses
  const searchAddresses = useCallback(
    async (query: string) => {
      if (!query || query.length < 2 || !userIsTyping) {
        setLocalSuggestions([]);
        setLocalShowSuggestions(false);
        return;
      }

      setLocalIsSearching(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            query
          )}&limit=5&accept-language=tr&countrycodes=tr`
        );

        if (response.ok) {
          const data = await response.json();
          const formattedSuggestions: AddressSuggestion[] = data.map(
            (item: any, index: number) => ({
              id: `${index}`,
              text: item.display_name,
              latitude: Number.parseFloat(item.lat),
              longitude: Number.parseFloat(item.lon),
            })
          );

          setLocalSuggestions(formattedSuggestions);
          setLocalShowSuggestions(formattedSuggestions.length > 0);
        }
      } catch (error) {
        console.error("Address search error:", error);
        setLocalSuggestions([]);
        setLocalShowSuggestions(false);
      } finally {
        setLocalIsSearching(false);
      }
    },
    [userIsTyping]
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchAddresses(value);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [value, searchAddresses]);

  // Click outside to hide suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setLocalShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSuggestionSelect = (suggestion: AddressSuggestion) => {
    onChange(suggestion.text);
    setLocalShowSuggestions(false);
    onSuggestionSelect(suggestion);
  };

  return (
    <div className="relative">
      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
      <input
        ref={searchInputRef}
        type="text"
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setUserIsTyping(true);
        }}
        onFocus={() => {
          if (userIsTyping && localSuggestions.length > 0) {
            setLocalShowSuggestions(true);
          }
        }}
      />

      {localShowSuggestions && localSuggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 z-50 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto"
        >
          {localSuggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
              onClick={() => handleSuggestionSelect(suggestion)}
            >
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-900 leading-relaxed">
                  {suggestion.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {localIsSearching && (
        <div className="absolute right-3 top-3">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
        </div>
      )}
    </div>
  );
}
