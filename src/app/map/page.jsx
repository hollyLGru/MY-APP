import Map from '@/components/Map/Map'
import { listings } from '@/data/listings'

export default function Home() {
  return (
    <div>
      <h1>Heres all my fake housing data</h1>
      <Map listings={listings} />
    </div>
  )
}
