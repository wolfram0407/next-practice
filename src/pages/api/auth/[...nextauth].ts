import NextAuth  from "next-auth"
import dotenv from 'dotenv'

import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials";
dotenv.config()
export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
          username: { label: '이메일', type: 'text', placeholder: '이메일 주소를 입력해 주세요.' },
          password: { label: '비밀번호', type: 'password' },
      },
      async authorize(credentials, req) {
          const res = await fetch(`${process.env.NEXTAUTH_URL}/api/login`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  username: credentials?.username,
                  password: credentials?.password,
              }),
          })
          const user = await res.json()
          console.log('$$$user: ', user)

          if (user) {
              return user
          } else {
              return null
       }
      },
  }),
  ],
}

export default NextAuth(authOptions)