// import { NextResponse } from 'next/server'

import { auth } from './app/_lib/auth'

// export function middleware (request) {
//   console.log(request)

// //   this does not work for some resason
//   return NextResponse.redirect(new URL('/about', request.URL))
// }

export const middleware = auth

export const config = {
  // This is to tell the url the route in which it should be applied
  matcher: ['/account']
}
