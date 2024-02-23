import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'

import { signUp } from './routes/sign-up'
import { sendAuthenticationLink } from './routes/send-authentication-link'
import { signOut } from './routes/sign-out'
import { getProfile } from './routes/get-profile'
import { authentication } from './authentication'
import { authenticateFromLink } from './routes/authenticate-from-link'
import { getUser } from './routes/get-User'

const app = new Elysia()
  .use(
    cors({
      credentials: true,
      allowedHeaders: ['content-type'],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
      origin: (request): boolean => {
        const origin = request.headers.get('origin')

        if (!origin) {
          return false
        }

        return true
      },
    }),
  )
  .use(authentication)
  .use(authenticateFromLink)
  .use(getUser)
  .use(getProfile)
  .use(signUp)
  .use(sendAuthenticationLink)
  .use(signOut)
app.listen(3333)

console.log(
  `🔥 HTTP server running at ${app.server?.hostname}:${app.server?.port}`,
)
