import { NextRequest, NextResponse } from 'next/server'
import { createUser } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    // Get data from request body
    const { username, email, password } = await request.json()
    
    // Basic validation
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }
    
    // Create user
    const user = await createUser(username, email, password)
    
    return NextResponse.json({
      message: 'User created successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    })
    
  } catch (error: any) {
    console.error('Registration error:', error)
    
    // Handle unique constraint violations (duplicate username/email)
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Username or email already exists' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}