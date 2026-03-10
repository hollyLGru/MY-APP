'use client'
import ImageContainer from '@/components/ImageContainer'
export default function PopUp(listing) {
  const horse = listing.listing
  return (
    <div>
      <ImageContainer horse={horse} />
      <h1>{horse.name}</h1>
      <h2>
        {horse.breed} beds | {horse.height} baths | {horse.age}
      </h2>
      <h2>
        {horse.address}, {horse.city}, {horse.state}, {horse.zip}
      </h2>
    </div>
  )
}
