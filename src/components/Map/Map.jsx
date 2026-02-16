'use client'

import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

export default function Map({ listings }) {
  const mapContainerRef = useRef(null)
  const mapRef = useRef(null)
  const markersRef = useRef([])

  useEffect(() => {
    if (!listings?.length) return
    if (!mapContainerRef.current) return
    if (mapRef.current) return

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [listings[0].lon, listings[0].lat],
      zoom: 10,
    })

    const bounds = new mapboxgl.LngLatBounds()

    listings.forEach((listing) => {
      const lngLat = [listing.lon, listing.lat]

      bounds.extend(lngLat)

      const marker = new mapboxgl.Marker()
        .setLngLat(lngLat)
        .setPopup(
          new mapboxgl.Popup({ offset: 18 }).setHTML(`
            <div style="font-weight:600;">
              $${Number(listing.price).toLocaleString()}
            </div>
            <div style="font-size:12px; opacity:.85;">
              ${listing.address}, ${listing.city}
            </div>
          `)
        )
        .addTo(mapRef.current)

      markersRef.current.push(marker)
    })

    // auto zoom to show all listings
    mapRef.current.fitBounds(bounds, {
      padding: 60,
      maxZoom: 14,
    })

    return () => {
      markersRef.current.forEach((m) => m.remove())
      markersRef.current = []
      mapRef.current?.remove()
      mapRef.current = null
    }
  }, [listings])

  return (
    <div className="w-full">
      <div ref={mapContainerRef} className="h-125 w-full rounded-2xl" />
    </div>
  )
}
