'use server'

import { revalidatePath } from 'next/cache'
import { auth, signIn, signOut } from './auth'
import { supabase } from './supabase'
import { getBookings } from './data-service'
import { redirect } from 'next/navigation'

// Anything we do in the server action is run in the backend
// So we must always check for if the user is authorized and autheticated cos we are on the server
export async function updateGuest (formData) {
  // The formdata basically has all the values filled by the user
  const session = await auth()
  if (!session) throw new Error('You must be logged in')

  const nationalID = formData.get('nationalID')
  const [nationality, countryFlag] = formData.get('nationality').split('%')

  if (!/^[a-zA-Z0-9]{6,12}$/.test(nationalID))
    throw new Error('please provide a valid nationalID')

  const updateData = { nationality, countryFlag, nationalID }

  const { data, error } = await supabase
    .from('guests')
    .update(updateData)
    .eq('id', session.user.guestId)

  if (error) {
    throw new Error('Guest could not be updated')
  }
  // return data
  revalidatePath('/account/profile')
}

export async function createBooking (bookingData, formData) {
  const session = await auth()
  if (!session) throw new Error('You must be logged in')

  const newBooking = {
    ...bookingData,
    guestId: session.user.guestId,
    numGuests: Number(formData.get('numGuests')),
    observations: formData.get('observations').slice(0, 1000),
    extrasPrice: 0,
    totalPrice: bookingData.cabinPrice,
    isPaid: false,
    hasBreakfast: false,
    status: 'unconfirmed'
  }

  const { error } = await supabase.from('bookings').insert([newBooking])

  if (error) {
    throw new Error('Booking could not be created')
  }

  revalidatePath(`/cabins/${bookingData.cabinId}`)
  redirect('/cabins/thankyou')
}

export async function deleteReservation (id) {
  const session = await auth()
  if (!session) throw new Error('You must be logged in')

  const guestBookings = await getBookings(session.user.guestId)
  const guestBookingsId = guestBookings.map(booking => booking.id)

  if (!guestBookingsId.includes(id))
    throw new Error('You are not allowed to delete this booking')

  const { error } = await supabase.from('bookings').delete().eq('id', id)

  if (error) throw new Error('Booking could not be deleted')

  revalidatePath('/account/reservations')
}

export async function updateReservation (formData) {
  // Authetication
  const session = await auth()
  if (!session) throw new Error('You must be logged in')

  // Authorization
  const guestBookings = await getBookings(session.user.guestId)
  const guestBookingsId = guestBookings.map(booking => booking.id)
  if (!guestBookingsId.includes(id))
    throw new Error('You are not allowed to update this reservation')

  // Building updated data
  const numGuests = Number(formData.get('numGuests'))
  const observations = formData.get('observations').splice(0, 1000)
  const bookingId = Number(formData.get('bookingId'))
  const updatedFields = { numGuests, observations }
  // console.log(updatedFields)

  // Mutation to db
  const { error } = await supabase
    .from('bookings')
    .update(updatedFields)
    .eq('id', bookingId)
    .select()
    .single()

  // Error handling
  if (error) {
    console.error(error)
    throw new Error('Booking could not be updated')
  }

  // Revalidation
  revalidatePath(`/account/reservations/edit/${bookingId}`)
  revalidatePath('/account/reservations')

  // Redirecting
  redirect('/account/reservations')
}

export async function signInAction () {
  await signIn('google', { redirectTo: '/account' })
}

export async function signOutAction () {
  await signOut({ redirectTo: '/' })
}
