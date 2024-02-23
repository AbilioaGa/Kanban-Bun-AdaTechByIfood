import Elysia, { t } from 'elysia'
import dayjs from 'dayjs'
import { authentication } from '../authentication'
import { prisma } from '@/db/prisma-client'
import { UnauthorizedError } from './errors/unauthorized-error'

export const authenticateFromLink = new Elysia().use(authentication).get(
  '/auth-links/authenticate',
  async ({ signUser, query, set }) => {
    const { code, redirect } = query

    const authLinkFromCode = await prisma.authLinks.findFirst({
      where: { code },
    })

    if (!authLinkFromCode) {
      throw new UnauthorizedError()
    }

    if (dayjs().diff(authLinkFromCode.createdAt, 'days') > 7) {
      throw new UnauthorizedError()
    }

    const user = await prisma.user.findUnique({
      where: { id: authLinkFromCode.userId },
    })

    await signUser({
      sub: authLinkFromCode.userId,
      userId: user?.id,
    })

    await prisma.authLinks.deleteMany({
      where: { code },
    })

    set.redirect = redirect
  },
  {
    query: t.Object({
      code: t.String(),
      redirect: t.String(),
    }),
  },
)
