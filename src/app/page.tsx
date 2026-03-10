import Header from '@/components/Header'
import ListingsGrid from '@/components/ListingsGrid'
import listings from '@/data/listings'

export default async function Home() {
  return (
    <div>
      <Header />
      <ListingsGrid listings={listings} />
    </div>
  )
}
