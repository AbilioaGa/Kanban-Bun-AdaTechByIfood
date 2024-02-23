import { prisma } from '@/db/prisma-client'

import Elysia, { t } from 'elysia'

export const signUp = new Elysia().post(
  '/sign-up',
  async ({ body, set }) => {
    const { name, email, password } = body

    const sanitizedEmail = email.toLowerCase()

    const existingUser = await prisma.user.findUnique({
      where: {
        email: sanitizedEmail,
      },
    })
    if (!existingUser) {
      set.status = 422
    }

    const bcryptHash = await Bun.password.hash(password, {
      algorithm: 'bcrypt',
      cost: 14,
    })

    await prisma.user.create({
      data: {
        name,
        email: sanitizedEmail,
        password: bcryptHash,
      },
    })

    set.status = 201
  },
  {
    body: t.Object({
      name: t.String(),
      email: t.String({ format: 'email' }),
      password: t.String(),
    }),
  },
)
