'use client'

import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import { createRoot } from 'react-dom/client'
import 'mapbox-gl/dist/mapbox-gl.css'
import PopUp from '@/components/Map/Popup'

export default function Map({ listings = [] } = {}) {
  const mapContainerRef = useRef(null)
  const mapRef = useRef(null)

  // shared popup infra
  const popupRef = useRef(null)
  const popupRootRef = useRef(null)

  // IMPORTANT: avoid name collision with this component being named Map()
  const listingByIdRef = useRef(new globalThis.Map())

  // state refs for hover/selection
  const hoveredIdRef = useRef(null)
  const selectedIdRef = useRef(null)

  // if listings arrive before map/source exists
  const pendingFcRef = useRef({ type: 'FeatureCollection', features: [] })

  const SOURCE_ID = 'listings'
  const DOT_LAYER = 'listings-dot'
  const HOVER_LAYER = 'listings-hover'
  const SELECTED_LAYER = 'listings-selected'
  const PRICE_LAYER = 'listings-price'

  const buildListingsGeoJSON = (arr) => {
    const byId = new globalThis.Map()

    const features = (arr || [])
      .filter((l) => Number.isFinite(l.lon) && Number.isFinite(l.lat))
      .map((l) => {
        const listingId = l.id ?? l.listing_id ?? l.slug ?? `${l.lon},${l.lat}`

        byId.set(String(listingId), l)

        return {
          type: 'Feature',
          id: String(listingId), // ✅ required for feature-state hover
          geometry: {
            type: 'Point',
            coordinates: [l.lon, l.lat],
          },
          properties: {
            listingId: String(listingId),
            priceLabel: l.price ? `$${Number(l.price).toLocaleString()}` : '',
          },
        }
      })

    listingByIdRef.current = byId
    return { type: 'FeatureCollection', features }
  }

  const fitToFeatures = (map, fc) => {
    if (!fc?.features?.length) return
    const bounds = new mapboxgl.LngLatBounds()
    fc.features.forEach((f) => bounds.extend(f.geometry.coordinates))
    map.fitBounds(bounds, { padding: 60, maxZoom: 14 })
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

    // shared popup mount point
    const popupEl = document.createElement('div')
    popupRootRef.current = createRoot(popupEl)
    popupRef.current = new mapboxgl.Popup({
      offset: 18,
      closeButton: true,
      closeOnClick: true,
      maxWidth: '320px',
    }).setDOMContent(popupEl)

    const onLoad = () => {
      // source
      if (!map.getSource(SOURCE_ID)) {
        map.addSource(SOURCE_ID, {
          type: 'geojson',
          data: pendingFcRef.current,
        })
      }

      // base dot
      if (!map.getLayer(DOT_LAYER)) {
        map.addLayer({
          id: DOT_LAYER,
          type: 'circle',
          source: SOURCE_ID,
          paint: {
            'circle-radius': 7,
            'circle-color': '#2563eb',
            'circle-stroke-width': 2,
            'circle-stroke-color': '#ffffff',
            'circle-opacity': 0.9,
          },
        })
      }

      // hover ring (feature-state hover)
      if (!map.getLayer(HOVER_LAYER)) {
        map.addLayer({
          id: HOVER_LAYER,
          type: 'circle',
          source: SOURCE_ID,
          paint: {
            'circle-radius': 12,
            'circle-color': '#2563eb',
            'circle-opacity': [
              'case',
              ['boolean', ['feature-state', 'hover'], false],
              0.25,
              0,
            ],
          },
        })
      }

      // selected ring (filter by listingId)
      if (!map.getLayer(SELECTED_LAYER)) {
        map.addLayer({
          id: SELECTED_LAYER,
          type: 'circle',
          source: SOURCE_ID,
          paint: {
            'circle-radius': 14,
            'circle-color': '#2563eb',
            'circle-opacity': 0.35,
          },
          filter: ['==', ['get', 'listingId'], ''], // none selected initially
        })
      }

      // optional: price label
      if (!map.getLayer(PRICE_LAYER)) {
        map.addLayer({
          id: PRICE_LAYER,
          type: 'symbol',
          source: SOURCE_ID,
          layout: {
            'text-field': ['get', 'priceLabel'],
            'text-size': 12,
            'text-allow-overlap': true,
            'text-offset': [0, -1.25],
          },
          paint: {
            'text-color': '#111827',
            'text-halo-color': '#ffffff',
            'text-halo-width': 1,
          },
        })
      }

      // hover behavior
      map.on('mousemove', DOT_LAYER, (e) => {
        map.getCanvas().style.cursor = 'pointer'

        const f = e.features && e.features[0]
        if (!f) return

        // clear previous hover
        if (hoveredIdRef.current !== null) {
          map.setFeatureState(
            { source: SOURCE_ID, id: hoveredIdRef.current },
            { hover: false }
          )
        }

        hoveredIdRef.current = f.id ?? f.properties?.listingId
        map.setFeatureState(
          { source: SOURCE_ID, id: hoveredIdRef.current },
          { hover: true }
        )
      })

      map.on('mouseleave', DOT_LAYER, () => {
        map.getCanvas().style.cursor = ''
        if (hoveredIdRef.current !== null) {
          map.setFeatureState(
            { source: SOURCE_ID, id: hoveredIdRef.current },
            { hover: false }
          )
        }
        hoveredIdRef.current = null
      })

      // click behavior: select + zoom + popup
      map.on('click', DOT_LAYER, (e) => {
        const feature = e.features && e.features[0]
        if (!feature) return

        const id = feature.properties?.listingId
        const listing = listingByIdRef.current.get(String(id))
        if (!listing) return

        // highlight selection
        selectedIdRef.current = String(id)
        map.setFilter(SELECTED_LAYER, [
          '==',
          ['get', 'listingId'],
          selectedIdRef.current,
        ])

        // popup
        popupRootRef.current.render(<PopUp listing={listing} />)
        popupRef.current.setLngLat(e.lngLat).addTo(map)
      })

      // clear selection when popup closes
      popupRef.current.on('close', () => {
        selectedIdRef.current = null
        if (map.getLayer(SELECTED_LAYER)) {
          map.setFilter(SELECTED_LAYER, ['==', ['get', 'listingId'], ''])
        }
      })

      // ensure we render whatever listings we already have
      const src = map.getSource(SOURCE_ID)
      if (src) src.setData(pendingFcRef.current)
      fitToFeatures(map, pendingFcRef.current)
    }

    map.on('load', onLoad)

    return () => {
      try {
        popupRootRef.current?.unmount?.()
      } catch {}
      popupRef.current?.remove()

      map.off('load', onLoad)
      map.remove()
      mapRef.current = null
    }
  }, [])

  // update source data when listings change
  useEffect(() => {
    const fc = buildListingsGeoJSON(listings)
    pendingFcRef.current = fc

    const map = mapRef.current
    if (!map) return

    const src = map.getSource(SOURCE_ID)
    if (src) {
      src.setData(fc)
      fitToFeatures(map, fc)
    }
  }, [listings])

  return <div ref={mapContainerRef} className="w-screen h-[80vh]" />
}
