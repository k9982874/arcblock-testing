import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
async function main() {
  const alice = await prisma.user.upsert({
    where: { email: 'alice@example.com' },
    update: {},
    create: {
      username: 'Alice',
      email: 'alice@example.com',
      phone: '13888888888',
      gender: 0,
    },
  })
  const bob = await prisma.user.upsert({
    where: { email: 'bob@example.com' },
    update: {},
    create: {
      username: 'Bob',
      email: 'bob@example.com',
      phone: '15888888888',
      gender: 1,
    },
  })
  // eslint-disable-next-line no-console
  console.log({ alice, bob })
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })