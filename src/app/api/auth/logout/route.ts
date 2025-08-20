import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const response = NextResponse.json({
      message: 'Logged out successfully'
    })
    
    // Clear the auth cookie
    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0 // This clears the cookie
    })
    
    return response
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    )
  }
}