'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import { createRoot } from 'react-dom/client'
import 'mapbox-gl/dist/mapbox-gl.css'
import PopUp from '@/components/Map/Popup'

export default function Map({ listings }) {
  const [isRailOpen, setIsRailOpen] = useState(true)
  const [idsInView, setIdsInView] = useState([])

  const mapContainerRef = useRef(null)
  const mapRef = useRef(null)

  // shared popup infra
  const popupRef = useRef(null)
  const popupRootRef = useRef(null)

  const listingByIdRef = useRef(new globalThis.Map())

  const hoveredIdRef = useRef(null)
  const selectedIdRef = useRef(null)

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

      // get listings in view
      map.on('idle', updateListingsInView)
      map.on('moveend', updateListingsInView)
      updateListingsInView()

      // ensure we render whatever listings we already have
      const src = map.getSource(SOURCE_ID)
      if (src) src.setData(pendingFcRef.current)
      fitToFeatures(map, pendingFcRef.current)
    }

    map.on('load', onLoad)

    return () => {
      try {
        popupRef.current?.remove()
      } catch {}
      popupRef.current?.remove()

      map.off('load', onLoad)
      map.remove()
      mapRef.current = null
      map.off('idle', updateListingsInView)
      map.off('moveend', updateListingsInView)
    }
  }, [])

  useEffect(() => {
    const fc = buildListingsGeoJSON(listings)
    // const fc = buildListingsGeoJSON(allListings)

    pendingFcRef.current = fc

    const map = mapRef.current
    if (!map) return

    const src = map.getSource(SOURCE_ID)
    if (src) {
      src.setData(fc)
      fitToFeatures(map, fc)
    }
  }, [listings])

  const updateListingsInView = () => {
    const map = mapRef.current
    if (!map) return

    // Only grab features from the dot layer (or your source) in the viewport
    const feats = map.queryRenderedFeatures({ layers: [DOT_LAYER] }) || []

    const seen = new Set()
    const ids = []
    for (const f of feats) {
      const id = String(f.properties?.listingId ?? f.id ?? '')
      if (!id) continue
      if (seen.has(id)) continue
      seen.add(id)
      ids.push(id)
    }

    setIdsInView(ids)
  }

  const listingsInView = useMemo(() => {
    const byId = listingByIdRef.current
    return idsInView.map((id) => byId.get(String(id))).filter(Boolean)
  }, [idsInView])

  const openListing = (listing) => {
    const map = mapRef.current
    if (!map) return

    const id = String(listing.id ?? listing.listing_id ?? listing.slug ?? '')
    if (!id) return

    // highlight selection
    selectedIdRef.current = id
    if (map.getLayer(SELECTED_LAYER)) {
      map.setFilter(SELECTED_LAYER, ['==', ['get', 'listingId'], id])
    }

    // fly to
    if (Number.isFinite(listing.lon) && Number.isFinite(listing.lat)) {
      map.flyTo({
        center: [listing.lon, listing.lat],
        zoom: Math.max(map.getZoom(), 13),
      })
    }

    // open popup (reuse your shared popup infra)
    popupRootRef.current.render(<PopUp listing={listing} />)
    popupRef.current.setLngLat([listing.lon, listing.lat]).addTo(map)
  }

  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    // slight delay helps after CSS transition
    const timeout = setTimeout(() => {
      map.resize()
    }, 200)

    return () => clearTimeout(timeout)
  }, [isRailOpen])

  return (
    <div className="w-screen h-[80vh] flex">
      {/* Map */}
      <div className="relative flex-1">
        <div ref={mapContainerRef} className="w-full h-full" />
        {!isRailOpen && (
          <button
            type="button"
            onClick={() => setIsRailOpen(true)}
            className="absolute top-4 right-4 z-10 rounded-md bg-white/90 px-3 py-2 text-sm shadow"
          >
            Show listings
          </button>
        )}
      </div>

      {/* Rail */}
      <aside
        className={[
          'relative z-20 h-full shrink-0 bg-white transition-all duration-300 overflow-hidden shadow-xl',
          isRailOpen ? 'w-[460px]' : 'w-0',
        ].join(' ')}
      >
        <div className="flex h-full flex-col">
          {/* Rainbow accent bar */}
          <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-pink-50 via-amber-50 via-emerald-50 to-sky-50 border-b">
            <div className="flex flex-col">
              <span className="text-xs uppercase tracking-widest text-gray-500">
                Explore
              </span>

              <span className="text-lg font-[var(--font-fraunces)] text-gray-900">
                {listingsInView.length} rides nearby
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsRailOpen(false)}
              className="rounded-full bg-white px-3 py-1 text-sm shadow hover:bg-gray-100 transition"
            >
              ✕
            </button>
          </div>

          {/* Listings */}
          <div className="flex-1 overflow-auto p-4 space-y-4 bg-gray-50">
            {listingsInView.map((l) => (
              <div
                key={l.id ?? l.listing_id ?? l.slug}
                onClick={() => openListing(l)}
                className="cursor-pointer"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    openListing(l)
                  }
                }}
              >
                <div className="rounded-xl bg-white shadow-sm hover:shadow-md transition p-2">
                  <PopUp listing={l} />
                </div>
              </div>
            ))}

            {!listingsInView.length && (
              <div className="text-sm text-gray-500 text-center py-12">
                Pan or zoom the map to see listings in this area.
              </div>
            )}
          </div>
        </div>
      </aside>
    </div>
  )
}
