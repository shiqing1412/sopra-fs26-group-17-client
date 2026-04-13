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

export default function PlaceAutocomplete({ onPlaceSelect, onChange, value }: Readonly<Props>) {
  const [suggestions, setSuggestions] = useState<google.maps.places.AutocompleteSuggestion[]>([])
  const [inputValue, setInputValue] = useState(value ?? '')
  const sessionToken = useRef<google.maps.places.AutocompleteSessionToken | null>(null)

  /* initialize session token. required for autocomplete and billing */
  useEffect(() => {
    const initToken = async () => {
      const { AutocompleteSessionToken } = await google.maps.importLibrary('places') as google.maps.PlacesLibrary
      sessionToken.current = new AutocompleteSessionToken()
    }
    initToken()
  }, [])

  /* handle input changes and fetch autocomplete suggestions */
  const handleInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setInputValue(val)

    if (!val) return setSuggestions([])

    const { AutocompleteSuggestion, AutocompleteSessionToken  } = await google.maps.importLibrary('places') as google.maps.PlacesLibrary
    if (!sessionToken.current) {
      sessionToken.current = new AutocompleteSessionToken()
    }
    const { suggestions } = await AutocompleteSuggestion.fetchAutocompleteSuggestions({
      input: val,
      sessionToken: sessionToken.current,
      language: 'en',
    })
    setSuggestions(suggestions)
  }

  /* handle suggestion selection, fetch place details */
  const handleSelect = async (suggestion: google.maps.places.AutocompleteSuggestion) => {
    if (!suggestion.placePrediction) return;
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
          {suggestions.map((s: google.maps.places.AutocompleteSuggestion) => {
            if (!s.placePrediction) return null;
            return (
              <button
                key={s.placePrediction.placeId}
                type="button"
                onClick={() => handleSelect(s)}
                onKeyDown={e => e.key === 'Enter' && handleSelect(s)}
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  padding: '8px 12px',
                  fontSize: 14,
                  border: 'none',
                  borderBottom: '1px solid #f0f0f0',
                  background: '#fff',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = '#f7f6f6')}
                onMouseLeave={e => (e.currentTarget.style.background = '#fff')}
              >
              {s.placePrediction.text.toString()}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}