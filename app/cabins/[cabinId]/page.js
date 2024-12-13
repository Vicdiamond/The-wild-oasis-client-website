import Cabin from '@/app/_components/Cabin'
import Reservation from '@/app/_components/Reservation'
import Spinner from '@/app/_components/Spinner'
import TextExpander from '@/app/_components/TextExpander'
import { getCabin, getCabins } from '@/app/_lib/data-service'
import { EyeSlashIcon, MapPinIcon, UsersIcon } from '@heroicons/react/24/solid'
import Image from 'next/image'
import { Suspense } from 'react'

// Generating dynamic metadata
export async function generateMetadata ({ params }) {
  const { name } = await getCabin(params.cabinId)

  return { title: `Cabin ${name}` }
}

// by default, this is a dynamic rendered route so this function tells nextjs the possible amount of routes so that nextjs can render this route statically
export async function generateStaticParams () {
  const cabins = await getCabins()

  const ids = cabins.map(cabin => ({ cabinId: String(cabin.id) }))

  return ids
}

export default async function Page ({ params }) {
  const cabin = await getCabin(params.cabinId)
  // const settings = await getSettings()
  // const bookedDate = await getBookedDatesByCabinId(params.cabinId)

  // OR
  // const [cabin, settings, bookedDate] = await Promise.all([
  //   getCabin(params.cabinId),
  //   getSettings(),
  //   getBookedDatesByCabinId(params.cabinId)
  // ])

  return (
    <div className='max-w-6xl mx-auto mt-8'>
      <Cabin cabin={cabin} />
      <div>
        <h2 className='text-5xl font-semibold text-center mb-10 text-accent-400'>
          Reserve {cabin.name} today. Pay on arrival.
        </h2>

        <Suspense fallback={<Spinner />}>
          <Reservation cabin={cabin} />
        </Suspense>
      </div>
    </div>
  )
}
