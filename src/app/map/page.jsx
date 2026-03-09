import ListingsMap from '@/components/Map/ListingsMap'
import listings from '@/data/listings'
import Header from '@/components/Header'

export default async function Home() {
  return (
    <div>
      <Header />
      <ListingsMap listings={listings} />
    </div>
  )
}
