import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient()

process.on('exit', () => {
  prisma.$disconnect()
})

export {prisma}
