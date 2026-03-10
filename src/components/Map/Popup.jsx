'use client'

import ImageContainer from '@/components/ImageContainer'

export default function PopUp({ listing }) {
  const horse = listing

  const isMale = horse.sex === 'gelding'
  const isFemale = horse.sex === 'mare'

  const sexSymbol = isMale ? '♂' : isFemale ? '♀' : ''

  return (
    <div>
      <ImageContainer horse={horse} />

      <div className="p-3 space-y-2">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          {sexSymbol && (
            <span
              className={`text-lg font-bold ${
                isMale ? 'text-blue-500' : 'text-pink-500'
              }`}
            >
              {sexSymbol}
            </span>
          )}
          {horse.name}
          <p className="text-sm text-gray-600">{horse.breed}</p>
        </h2>

        <div className="flex flex-wrap gap-2 text-sm">
          <span className="bg-indigo-50 text-indigo-700 px-2 py-[2px] rounded-md">
            {horse.height} hh
          </span>

          <span className="bg-amber-50 text-amber-700 px-2 py-[2px] rounded-md">
            {horse.age} yrs
          </span>

          <span
            className={`px-2 py-[2px] rounded-md ${
              isMale
                ? 'bg-blue-50 text-blue-700'
                : isFemale
                  ? 'bg-pink-50 text-pink-700'
                  : 'bg-gray-50 text-gray-600'
            }`}
          >
            {horse.rider_type}
          </span>

          <span className="bg-emerald-50 text-emerald-700 px-2 py-[2px] rounded-md">
            {horse.discipline}
          </span>
        </div>

        <p className="text-xs text-gray-500">
          {horse.city}, {horse.state}
        </p>
      </div>
    </div>
  )
}
