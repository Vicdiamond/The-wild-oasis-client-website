import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import { createGuest, getGuest } from './data-service'

const authConfig = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SERECT
    })
  ],
  callbacks: {
    // functions in here needs to return a true or false
    authorized ({ auth, request }) {
      // console.log(auth)
      return !!auth?.user
    },

    async signIn ({ user, account, profile }) {
      try {
        const exsitingGuest = await getGuest(user.email)
        // console.log(exsitingGuest)

        // Very important to not forget the await keyword
        if (!exsitingGuest)
          await createGuest({ email: user.email, fullName: user.name })

        return true
      } catch {
        return false
      }
    },

    async session ({ session, user }) {
      const guest = await getGuest(session.user.email)
      // console.log(guest)
      session.user.guestId = guest.id

      return session
    }
  },
  pages: {
    signIn: '/login'
  }
}

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST }
} = NextAuth(authConfig)
