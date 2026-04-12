/// <reference types="@types/google.maps" />
'use client'

import { useEffect, useRef, useState } from 'react'
import { Input } from 'antd'

type Place = {
  displayName: string
  formattedAddress: string
  location: { lat: number; lng: number }
}

type Props = {
  onPlaceSelect?: (place: Place) => void
  value?: string
  onChange?: (value: string) => void
}

export default function PlaceAutocomplete({ onPlaceSelect, onChange, value }: Props) {
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [inputValue, setInputValue] = useState(value ?? '')
  const sessionToken = useRef<any>(null)

  /* initialize session token. required for autocomplete and billing */
  useEffect(() => {
    const initToken = async () => {
      const { AutocompleteSessionToken } = await google.maps.importLibrary('places') as any
      sessionToken.current = new AutocompleteSessionToken()
    }
    initToken()
  }, [])

  /* handle input changes and fetch autocomplete suggestions */
  const handleInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setInputValue(val)

    if (!val) return setSuggestions([])

    const { AutocompleteSuggestion } = await google.maps.importLibrary('places') as any
    const { suggestions } = await AutocompleteSuggestion.fetchAutocompleteSuggestions({
      input: val,
      sessionToken: sessionToken.current,
      language: 'en',
    })
    setSuggestions(suggestions)
  }

  /* handle suggestion selection, fetch place details */
  const handleSelect = async (suggestion: any) => {
    const place = suggestion.placePrediction.toPlace()
    await place.fetchFields({ fields: ['displayName', 'formattedAddress', 'location'] })
    const placeJSON = place.toJSON() as Place

    setInputValue(placeJSON.displayName)
    setSuggestions([])
    onChange?.(placeJSON.displayName)
    onPlaceSelect?.(placeJSON)
  }

    return (
    <div style={{ position: 'relative' }}>
      <Input
        value={inputValue}
        onChange={handleInput}
        placeholder="e.g. Eiffel Tower"
      />
      {suggestions.length > 0 && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          background: '#fff',
          border: '1px solid #d9d9d9',
          borderRadius: 8,
          zIndex: 1000,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        }}>
          {suggestions.map((s: any, i: number) => (
            <div
              key={i}
              onClick={() => handleSelect(s)}
              style={{
                padding: '8px 12px',
                cursor: 'pointer',
                fontSize: 14,
                borderBottom: i < suggestions.length - 1 ? '1px solid #f0f0f0' : 'none',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#f7f6f6')}
              onMouseLeave={e => (e.currentTarget.style.background = '#fff')}
            >
              {s.placePrediction.text.toString()}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}