import Test from './components/Test'

export default function Home() {
  console.log('here?')
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <Test />
    </div>
  )
}
