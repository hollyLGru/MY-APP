'use client'
import ImageContainer from '@/components/ImageContainer'
export default function PopUp(listing) {
  console.log(listing)
  return (
    <div>
      <ImageContainer image={listing.listing.images[0]} />
      <h1>${listing.listing.price}</h1>
    </div>
  )
}
