import Test from '@/components/Test'

export default async function Home() {
  console.log('here?')
  const elevationRes = await fetch(
    `  https://api.open-elevation.com/api/v1/lookup?locations=41.161758,-8.583933`
  )
  const elevation = await elevationRes.json()

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <Test />
    </div>
  )
}
