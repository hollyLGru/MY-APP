'use client'
import ImageContainer from '@/components/ImageContainer'
export default function PopUp(listing) {
  return (
    <div>
      <ImageContainer image={listing.listing.images[0]} />
    </div>
  )
}
