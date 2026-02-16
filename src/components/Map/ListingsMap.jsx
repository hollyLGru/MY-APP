'use client'

import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import { createRoot } from 'react-dom/client'
import 'mapbox-gl/dist/mapbox-gl.css'
import PopUp from '@/components/Map/Popup'

export default function ListingsMap({ listings = [] } = {}) {
  const mapContainerRef = useRef(null)
  const mapRef = useRef(null)

  // shared popup infra
  const popupRef = useRef(null)
  const popupRootRef = useRef(null)

  // built-in Map for id -> listing lookup
  const listingByIdRef = useRef(new Map())

  const SOURCE_ID = 'listings'
  const LAYER_ID = 'listings-houses'

  const buildListingsGeoJSON = (arr) => {
    const byId = new Map()

    const features = (arr || [])
      .filter((l) => Number.isFinite(l.lon) && Number.isFinite(l.lat))
      .map((l) => {
        const listingId = l.id ?? l.listing_id ?? l.slug ?? `${l.lon},${l.lat}`
        byId.set(String(listingId), l)

        return {
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [l.lon, l.lat] },
          properties: { listingId: String(listingId) },
        }
      })

    listingByIdRef.current = byId
    return { type: 'FeatureCollection', features }
  }

  // init map once
  useEffect(() => {
    if (!mapContainerRef.current) return
    if (mapRef.current) return

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [listings[0].lon, listings[0].lat],
      zoom: 10,
    })

    mapRef.current = map

    // shared popup mount
    const popupEl = document.createElement('div')
    popupRootRef.current = createRoot(popupEl)
    popupRef.current = new mapboxgl.Popup({
      offset: 18,
      closeButton: true,
      closeOnClick: true,
      maxWidth: '320px',
    }).setDOMContent(popupEl)

    const onLoad = async () => {
      // source + layer
      if (!map.getSource(SOURCE_ID)) {
        map.addSource(SOURCE_ID, {
          type: 'geojson',
          data: { type: 'FeatureCollection', features: [] },
        })
      }

      if (!map.getLayer(LAYER_ID)) {
        map.addLayer({
          id: LAYER_ID,
          type: 'circle',
          source: SOURCE_ID,
          paint: {
            'circle-radius': 7,
            'circle-stroke-width': 2,
            'circle-opacity': 0.9,
          },
        })

        map.on('click', LAYER_ID, (e) => {
          const feature = e.features && e.features[0]
          if (!feature) return

          const id = feature.properties?.listingId
          const listing = listingByIdRef.current.get(String(id))
          if (!listing) return

          popupRootRef.current.render(<PopUp listing={listing} />)
          popupRef.current.setLngLat(e.lngLat).addTo(map)
        })

        map.on('mouseenter', LAYER_ID, () => {
          map.getCanvas().style.cursor = 'pointer'
        })
        map.on('mouseleave', LAYER_ID, () => {
          map.getCanvas().style.cursor = ''
        })
      }

      // initial setData + fit
      const fc = buildListingsGeoJSON(listings)
      const src = map.getSource(SOURCE_ID)
      if (src) src.setData(fc)

      if (fc.features.length) {
        const bounds = new mapboxgl.LngLatBounds()
        fc.features.forEach((f) => bounds.extend(f.geometry.coordinates))
        map.fitBounds(bounds, { padding: 60, maxZoom: 14 })
      }
    }

    map.on('load', onLoad)

    return () => {
      map.off('load', onLoad)

      try {
        popupRootRef.current?.unmount?.()
      } catch {}
      popupRef.current?.remove()

      map.remove()
      mapRef.current = null
    }
  }, []) // init once

  // update source when listings change
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    const src = map.getSource(SOURCE_ID)
    if (!src) return

    const fc = buildListingsGeoJSON(listings)
    src.setData(fc)

    if (fc.features.length) {
      const bounds = new mapboxgl.LngLatBounds()
      fc.features.forEach((f) => bounds.extend(f.geometry.coordinates))
      map.fitBounds(bounds, { padding: 60, maxZoom: 14 })
    }
  }, [listings])

  return (
    <div className="md:mx-4">
      <div id="mapWrapper">
        <div id="map" className="w-screen h-[80vh]" ref={mapContainerRef} />
      </div>
    </div>
  )
}
