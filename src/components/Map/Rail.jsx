'use client'
import PopUp from '@/components/Map/Popup'

export default function Rail({ listingsInView, openListing, setIsRailOpen }) {
  return (
    <aside
      className="
        fixed inset-x-0 bottom-0 z-30 h-[42vh] rounded-t-3xl border-t border-pink-100 bg-[#fcfcfd] shadow-2xl
        md:relative md:bottom-auto md:left-auto md:right-auto md:inset-x-auto md:z-20 md:h-full md:w-[520px] md:shrink-0 md:rounded-none md:rounded-l-3xl md:border-t-0 md:border-l
      "
    >
      <div className="flex h-full flex-col">
        <div className="sticky top-0 z-10 border-b border-pink-100 bg-white/95 backdrop-blur rounded-t-3xl md:rounded-none">
          <div className="flex items-center justify-between px-4 py-4 md:px-5">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-gray-400">
                Find your ride
              </p>
              <h2 className="text-lg font-semibold text-gray-900 md:text-xl">
                {listingsInView.length} horses in view
              </h2>
            </div>

            <button
              type="button"
              onClick={() => setIsRailOpen(false)}
              className="rounded-full border border-pink-100 bg-white px-3 py-1.5 text-sm font-medium text-gray-600 shadow-sm transition hover:bg-pink-50"
            >
              Close
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto px-3 py-3 md:px-4 md:py-4">
          <div className="space-y-3 md:space-y-4">
            {listingsInView.map((l) => (
              <div
                key={l.id}
                onClick={() => openListing(l)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') openListing(l)
                }}
                role="button"
                tabIndex={0}
                className="group cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <PopUp listing={l} />
              </div>
            ))}

            {!listingsInView.length && (
              <div className="rounded-2xl border border-dashed border-pink-200 bg-white px-6 py-12 text-center">
                <p className="text-base font-semibold text-gray-700">
                  No horses in this view yet
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Pan or zoom the map to discover more rides nearby.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  )
}
