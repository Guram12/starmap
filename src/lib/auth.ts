import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function createUser(username: string, email: string, password: string) {
  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 12)
  
  // Create user in database
  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
    }
  })
  
  // Return user without password
  const { password: _, ...userWithoutPassword } = user
  return userWithoutPassword
}

export async function authenticateUser(username: string, password: string) {
  // Find user by username or email
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { username },
        { email: username }
      ]
    }
  })
  
  if (!user) {
    return null
  }
  
  // Check password
  const isValidPassword = await bcrypt.compare(password, user.password)
  
  if (!isValidPassword) {
    return null
  }
  
  // Return user without password
  const { password: _, ...userWithoutPassword } = user
  return userWithoutPassword
}


export const findUserByUsername = async (username: string) => {
  return await prisma.user.findUnique({
    where: { username }
  })
}


export const findUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: { email }
  })
}