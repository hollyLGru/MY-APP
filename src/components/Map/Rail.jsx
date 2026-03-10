'use client'
import PopUp from '@/components/Map/Popup'

export default function Rail({
  listingsInView,
  openListing,
  setIsRailOpen,
  isRailOpen,
}) {
  return (
    <aside
      className={[
        'relative z-20 h-full shrink-0 border-l border-pink-100 bg-[#fcfcfd] transition-all duration-300 w-[520px]',
      ].join(' ')}
    >
      <div className="flex h-full flex-col">
        <div className="sticky top-0 z-10 border-b border-pink-100 bg-white/90 backdrop-blur">
          <div className="h-1 w-full bg-linear-to-r from-pink-200 via-amber-200 via-emerald-200 via-sky-200 to-violet-200" />

          <div className="flex items-center justify-between px-5 py-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-gray-400">
                Find your ride
              </p>
              <h2 className="text-xl font-semibold text-gray-900">
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

        <div className="flex-1 overflow-auto px-4 py-4">
          <div className="space-y-4">
            {listingsInView.map((l) => (
              <div
                key={l.id}
                onClick={() => openListing(l)}
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
