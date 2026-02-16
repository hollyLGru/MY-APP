'use client'

import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

export default function Map({ listing }) {
  const mapContainerRef = useRef(null)
  const mapRef = useRef(null)
  const markerRef = useRef(null)

  useEffect(() => {
    if (!listing) return
    if (!mapContainerRef.current) return
    if (mapRef.current) return // prevent re-init on re-render
    mapboxgl.accessToken =
      'pk.eyJ1IjoiaGxncnVkb3ZpY2giLCJhIjoiY21scGk0eXBmMWdneTNrb2YydW45bjJrcyJ9.5u2EX2h28HrX57iv_UEe-w'

    // Mapbox expects [lng, lat]
    const center = [listing.lon, listing.lat]

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center,
      zoom: 12,
    })

    markerRef.current = new mapboxgl.Marker()
      .setLngLat(center)
      .setPopup(
        new mapboxgl.Popup({ offset: 18 }).setHTML(`
          <div style="font-weight:600;">$${Number(listing.price).toLocaleString()}</div>
          <div style="font-size:12px; opacity:.85;">${listing.address}, ${listing.city}</div>
        `)
      )
      .addTo(mapRef.current)

    // Optional: open popup by default
    markerRef.current.togglePopup()

    return () => {
      markerRef.current?.remove()
      mapRef.current?.remove()
      mapRef.current = null
    }
  }, [listing])

  return (
    <div className="w-full">
      <div ref={mapContainerRef} className="h-125 w-full rounded-2xl" />
    </div>
  )
}
