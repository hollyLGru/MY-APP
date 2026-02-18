const streets = [
  'Rocky Rd',
  'Main St',
  'Park Ave',
  'Deer Valley Dr',
  'Prospector Ave',
  'Kearns Blvd',
  'Thaynes Canyon Dr',
  'Bear Hollow Dr',
  'Canyons Resort Dr',
  'Sunrise Dr',
  'Pinebrook Rd',
  'Snyderville Basin Rd',
  'Highway 224',
]

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
function randFloat(min, max) {
  return Math.random() * (max - min) + min
}
function pick(arr) {
  return arr[randInt(0, arr.length - 1)]
}

// Rough bounding boxes (fast). Pick one.
const BOUNDS = {
  'summit-ut': { minLat: 40.52, maxLat: 40.9, minLon: -111.7, maxLon: -111.1 },
}

function randomPointInBounds(b) {
  return {
    lat: randFloat(b.minLat, b.maxLat),
    lon: randFloat(b.minLon, b.maxLon),
  }
}

function fakePhotos(id) {
  const topics = ['house', 'home', 'interior', 'kitchen', 'living-room']
  return Array.from({ length: 3 }, (_, i) => {
    const topic = topics[(id + i) % topics.length]
    return `https://source.unsplash.com/800x600/?${topic}&sig=${id * 10 + i}`
  })
}

export default function generateSummitCountyListings(count = 50, opts = {}) {
  const { county = 'summit-ut', includeImages = true } = opts

  const b = BOUNDS[county] || BOUNDS['summit-ut']

  const cityPool = ['Park City', 'Coalville', 'Kamas']

  const state = 'UT'

  return Array.from({ length: count }, (_, i) => {
    const { lat, lon } = randomPointInBounds(b)

    const beds = randInt(1, 6)
    const baths = Math.round(randFloat(1, 4.5) * 2) / 2
    const sqft = randInt(750, 4200)

    // simple "mountain county" pricing heuristic
    const base = 650
    const price =
      Math.round(
        ((base + beds * 120 + baths * 80 + sqft * 0.35 + randInt(-80, 160)) *
          1000) /
          5000
      ) * 5000

    const address = `${randInt(120, 9999)} ${pick(streets)}`
    const city = pick(cityPool)

    return {
      id: `summit-${String(i + 1).padStart(4, '0')}`,
      address,
      city,
      state,
      zip: String(randInt(84000, 84099)),
      lat,
      lon,
      price,
      beds,
      baths,
      sqft,
      status: Math.random() < 0.85 ? 'active' : 'pending',
      images: includeImages ? fakePhotos(i + 1) : [],
    }
  })
}
