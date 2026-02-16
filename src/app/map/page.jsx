import ListingsMap from '@/components/Map/ListingsMap'
import { listings } from '@/data/listings'

export default function Home() {
  return (
    <div>
      <h1>Heres all my fake housing data</h1>
      <ListingsMap listings={listings} />
    </div>
  )
}
