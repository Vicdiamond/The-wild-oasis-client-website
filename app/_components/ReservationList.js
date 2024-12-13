'use client'

import ReservationCard from './ReservationCard'
import { useOptimistic } from 'react'
import { deleteReservation } from '../_lib/actions'

function ReservationList ({ bookings }) {
  // the first arg is the initial state that we want, the second arg is the updating function
  //   The optimisticBookings is the same thing as the bookings that we passed into the hook
  //   the optimisticDelete funtion in the hook, gets access to the current state and whatever arg that we pass into the optimistic function
  const [optimisticBookings, optimisticDelete] = useOptimistic(
    bookings,
    (curBookings, bookingId) => {
      return curBookings.filter(booking => booking.id !== bookingId)
    }
  )

  async function handleDelete (bookingId) {
    optimisticDelete(bookingId)
    await deleteReservation(bookingId)
  }

  return (
    <ul className='space-y-6'>
      {optimisticBookings.map(booking => (
        <ReservationCard
          booking={booking}
          key={booking.id}
          onDelete={handleDelete}
        />
      ))}
    </ul>
  )
}

export default ReservationList
