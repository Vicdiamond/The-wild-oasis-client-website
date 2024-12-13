'use client'

export default function Error ({ error, reset }) {
  // Keep in mind that its only rendering errors thats will be caught by the error boundary
  //   Errors that happens in callbacks or that does not affect rendering will not be caught
  return (
    <main className='flex justify-center items-center flex-col gap-6'>
      <h1 className='text-3xl font-semibold'>Something went wrong!</h1>
      <p className='text-lg'>{error.message}!</p>

      <button
        className='inline-block bg-accent-500 text-primary-800 px-6 py-3 text-lg'
        onClick={reset}
      >
        Try again
      </button>
    </main>
  )
}
