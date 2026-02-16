'use client'
import ImageContainer from '@/components/ImageContainer'
export default function PopUp(listing) {
  const house = listing.listing
  return (
    <div>
      <ImageContainer image={house.images[0]} />
      <h1>${house.price}</h1>
      <h2>
        {house.beds} beds | {house.baths} baths | {house.sqft} sqft home
      </h2>
      <h2>
        {house.address}, {house.city}, {house.state}, {house.zip}
      </h2>
    </div>
  )
}
