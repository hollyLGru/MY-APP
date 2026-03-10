'use client'

import { useEffect, useMemo, useState } from 'react'
import PopUp from '@/components/Map/Popup'
import logo from '@/data/images/logo.png'

export default function ListingsGrid({ listings }) {
  const [location, setLocation] = useState(null)

  const getDistanceInMiles = (lat1, lng1, lat2, lng2) => {
    lat1 = Number(lat1)
    lng1 = Number(lng1)
    lat2 = Number(lat2)
    lng2 = Number(lng2)

    const earthRadiusMiles = 3958.8

    const toRadians = (value) => {
      return (value * Math.PI) / 180
    }

    const dLat = toRadians(lat2 - lat1)
    const dLng = toRadians(lng2 - lng1)

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2)

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const distance = earthRadiusMiles * c

    return distance.toString().split('.')[0]
  }

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setLocation({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      })
    })
  }, [])

  const nearestListings = useMemo(() => {
    if (!listings.length) return []

    if (!location || location === 'utah') {
      return listings.slice(0, 30)
    }

    return listings
      .filter((listing) => listing.lat && listing.lon)
      .map((listing) => ({
        ...listing,
        distance: getDistanceInMiles(
          location.lat,
          location.lng,
          Number(listing.lat),
          Number(listing.lon)
        ),
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 30)
  }, [listings, location])

  if (!location) {
    return <div className="p-10 text-center">Finding horses near you...</div>
  }

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-8">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-gray-400">
            Nearby rides
          </p>
          <h2 className="text-3xl font-semibold text-gray-900">
            {nearestListings.length} horses near you
          </h2>
        </div>
      </div>

      {!nearestListings.length ? (
        <div className="rounded-2xl border border-dashed border-pink-200 bg-white p-12 text-center text-gray-500">
          No nearby horses found.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {nearestListings.map((listing) => (
            <div
              key={listing.id}
              //   onClick={() => setSelectedListing(listing)}

              role="button"
              tabIndex={0}
              className="cursor-pointer rounded-2xl transition hover:-translate-y-1"
            >
              <PopUp listing={listing} />

              <p className="mt-2 px-2 text-sm text-gray-500">
                {listing.distance} miles away
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
