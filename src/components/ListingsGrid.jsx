'use client'
import { useEffect, useState } from 'react'

export default function ListingsGrid({ listings }) {
  const [location, setLocation] = useState(null)

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        })
      },
      () => {
        setLocation('utah')
      }
    )
  }, [])

  if (!location) {
    return <div className="p-10 text-center">Finding horses near you...</div>
  }
  console.log(location)
  return (
    <div>hey</div>
    // <div className="relative w-full overflow-hidden rounded">{location}</div>
  )
}
