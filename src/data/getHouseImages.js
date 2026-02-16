// src/data/getHouseImages.js

// Loads every image in ./images at build time
const ctx = require.context('./images', false, /\.(png|jpe?g|webp|gif)$/i)

const ALL_IMAGES = ctx.keys().map((key) => {
  const mod = ctx(key)
  const src = mod?.default ?? mod
  const filename = key.replace('./', '') // "3090 Rocky Rd-1.jpg"
  return { filename, src }
})

function normalizeName(s) {
  return String(s || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s-]/g, '') // keep letters/numbers/space/hyphen
}

// Returns number suffix if present, e.g. "-12" => 12, else 0
function extractTrailingNumber(name) {
  const m = name.match(/(?:^|[\s_-])(\d+)$/)
  return m ? Number(m[1]) : 0
}

export function getHouseImagesByAddress(address) {
  const addr = normalizeName(address)
  if (!addr) return []

  const matches = ALL_IMAGES.map(({ filename, src }) => {
    // split filename into base + ext
    const dot = filename.lastIndexOf('.')
    const base = dot >= 0 ? filename.slice(0, dot) : filename
    const baseNorm = normalizeName(base)

    // baseNorm should be:
    // "3090 rocky rd-1" or "3090 rocky rd 2" or "3090 rocky rd"
    // Match if it starts with address and the remainder is optional "- 123"
    if (!baseNorm.startsWith(addr)) return null

    const remainder = baseNorm.slice(addr.length) // "", "-1", " 2", "_3" after normalize rules
    if (!remainder) return { src, order: 0 }

    // remainder must be just a separator + digits
    if (!/^[\s_-]*\d+$/.test(remainder)) return null

    return { src, order: extractTrailingNumber(baseNorm) }
  })
    .filter(Boolean)
    .sort((a, b) => a.order - b.order)
    .map((x) => x.src)

  return matches
}
