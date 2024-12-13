import { getBookedDatesByCabinId, getCabin } from '@/app/_lib/data-service'

// Custom api endpoints. (the function name cannot be a random name, the function needs to be called the name of the http request we want to do)
export async function GET (request, { params }) {
  const { cabinId } = params

  try {
    const [cabin, bookedDate] = await Promise.all([
      getCabin(cabinId),
      getBookedDatesByCabinId(cabinId)
    ])

    return Response.json({ cabin, bookedDate })
  } catch (error) {
    return Response.json({ message: 'Cabin not found' })
  }
}
