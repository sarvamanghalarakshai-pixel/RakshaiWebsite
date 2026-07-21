import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    
    const allowedEmail = 'sarvamanghalarakshai@gmail.com';
    const expectedPassword = process.env.ADMIN_PASSWORD || 'SMR@Admin123';

    if (email === allowedEmail && password === expectedPassword) {
      return NextResponse.json({ success: true, token: email });
    }

    return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
