import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value

    // No token = not logged in (return 401, not 500)
    if (!token) {
      return NextResponse.json(
        { authenticated: false, user: null },
        { status: 401 }
      )
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as { 
        userId: number; 
        username: string 
      }
    } catch (jwtError) {
      // Invalid/expired token = return 401, not 500
      console.warn('Invalid JWT token:', jwtError)
      return NextResponse.json(
        { authenticated: false, user: null, error: 'Invalid token' },
        { status: 401 }
      )
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true
      }
    })

    // User not found in database
    if (!user) {
      return NextResponse.json(
        { authenticated: false, user: null, error: 'User not found' },
        { status: 401 }
      )
    }

    // Success - user is authenticated
    return NextResponse.json({ 
      authenticated: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    })

  } catch (error) {
    // Only real server errors (database connection, etc.) should return 500
    console.error('Auth check server error:', error)
    return NextResponse.json(
      { authenticated: false, user: null, error: 'Server error' },
      { status: 500 }
    )
  }
}