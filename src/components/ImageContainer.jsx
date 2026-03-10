'use client'

import { useMemo, useState } from 'react'
import { getHorseImagesById } from '@/data/getHorseImagesById'

export default function ImageContainer({ horse }) {
  const images = useMemo(() => {
    const imgs = getHorseImagesById(horse.id) || []
    return imgs.map((img) => img?.src ?? img).filter(Boolean)
  }, [horse?.id])

  const [idx, setIdx] = useState(0)

  const safeIdx = images.length ? Math.min(idx, images.length - 1) : 0
  if (safeIdx !== idx) setIdx(safeIdx)

  const prev = (e) => {
    e?.preventDefault?.()
    e?.stopPropagation?.()
    if (!images.length) return
    setIdx((i) => (i - 1 + images.length) % images.length)
  }

  const next = (e) => {
    e?.preventDefault?.()
    e?.stopPropagation?.()
    if (!images.length) return
    setIdx((i) => (i + 1) % images.length)
  }

  if (!images.length) {
    return (
      <div className="text-sm opacity-70">No images found for: {horse.id}</div>
    )
  }

  return (
    <div className="relative w-full overflow-hidden rounded">
      <img
        className="w-full h-auto block select-none"
        src={images[safeIdx]}
        alt={horse?.name || 'horse'}
        draggable={false}
      />

      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 text-white w-9 h-9 flex items-center justify-center"
            aria-label="Previous image"
          >
            ‹
          </button>

          <button
            type="button"
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 text-white w-9 h-9 flex items-center justify-center"
            aria-label="Next image"
          >
            ›
          </button>

          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/50 text-white text-xs px-2 py-1">
            {safeIdx + 1} / {images.length}
          </div>
        </>
      )}
    </div>
  )
}
