import Elysia from 'elysia'
import { authentication } from '../authentication'
import { prisma } from '@/db/prisma-client'

export const getUser = new Elysia()
  .use(authentication)
  .get('/user', async ({ getUserId }) => {
    const userId = await getUserId()

    const user = await prisma.user.findFirst({
      where: {
        id: userId,
      },
    })

    if (!user) {
      throw new Error('User not found.')
    }

    return user
  })
