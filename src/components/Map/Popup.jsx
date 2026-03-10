'use client'

import ImageContainer from '@/components/ImageContainer'

export default function PopUp({ listing }) {
  const horse = listing

  const isMale = horse.sex === 'gelding'
  const isFemale = horse.sex === 'mare'

  return (
    <div className="overflow-hidden">
      <div className="relative">
        <ImageContainer horse={horse} />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent px-4 pb-3 pt-10">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-lg font-semibold text-white">{horse.name}</p>
              <p className="text-sm text-white/85">{horse.breed}</p>
            </div>

            <div
              className={[
                'rounded-full px-2.5 py-1 text-xs font-semibold shadow-sm',
                isMale
                  ? 'bg-blue-100 text-blue-700'
                  : isFemale
                    ? 'bg-pink-100 text-pink-700'
                    : 'bg-white/90 text-gray-700',
              ].join(' ')}
            >
              {isMale ? '♂ Gelding' : isFemale ? '♀ Mare' : horse.sex}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3 p-4">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700">
            {horse.height} hh
          </span>
          <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
            {horse.age} yrs
          </span>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
            {horse.rider_type}
          </span>
          <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700">
            {horse.discipline}
          </span>
        </div>

        <div className="space-y-1">
          <p className="text-sm text-gray-500">{horse.address}</p>
          <p className="text-sm font-medium text-gray-800">
            {horse.city}, {horse.state}
          </p>
        </div>
      </div>
    </div>
  )
}
