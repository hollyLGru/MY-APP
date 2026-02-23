import ListingsMap from '@/components/Map/ListingsMap'
import listings from '@/data/listings'
import Header from '@/components/Header'
// import generateSummitCountyListings from '@/data/generateSummitCountyListings'

export default async function Home() {
  // const generatedSummitCountyListings = generateSummitCountyListings(100, {
  //   county: 'summit-ut',
  //   includeImages: true,
  // })
  return (
    <div>
      <Header />
      <ListingsMap
        listings={listings}
        // generatedSummitCountyListings={generatedSummitCountyListings}
      />
    </div>
  )
}
