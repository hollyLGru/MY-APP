'use client'

import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import { createRoot } from 'react-dom/client'
import 'mapbox-gl/dist/mapbox-gl.css'
import ImageContainer from '@/components/ImageContainer'

export default function Map({ listings }) {
  const mapContainerRef = useRef(null)
  const mapRef = useRef(null)

  // keep marker + react root for cleanup
  const markersRef = useRef([])

  // init map ONCE
  useEffect(() => {
    if (!mapContainerRef.current) return
    if (mapRef.current) return

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [listings[0].lon, listings[0].lat],
      zoom: 10,
    })

    return () => {
      markersRef.current.forEach(({ marker, root }) => {
        if (root) root.unmount()
        marker.remove()
      })
      markersRef.current = []
      mapRef.current?.remove()
      mapRef.current = null
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    if (!listings?.length) return

    markersRef.current.forEach(({ marker, root }) => {
      if (root) root.unmount()
      marker.remove()
    })
    markersRef.current = []

    const bounds = new mapboxgl.LngLatBounds()

    listings.forEach((listing) => {
      const lngLat = [listing.lon, listing.lat]
      bounds.extend(lngLat)

      const popupEl = document.createElement('div')
      const root = createRoot(popupEl)

      root.render(<ImageContainer image={listing?.images[0]} />)

      const popup = new mapboxgl.Popup({ offset: 18 }).setDOMContent(popupEl)

      const marker = new mapboxgl.Marker()
        .setLngLat(lngLat)
        .setPopup(popup)
        .addTo(map)

      markersRef.current.push({ marker, root })
    })

    map.fitBounds(bounds, {
      padding: 60,
      maxZoom: 14,
    })
  }, [listings])

  return (
    <div className="md:mx-4">
      <div id="mapWrapper">
        <div
          id="map"
          className="relative w-full"
          ref={mapContainerRef}
          style={{ height: '700px' }}
        />
      </div>
    </div>
  )
}
