import { NextResponse, NextRequest } from 'next/server'

export async function GET(request: Request) {

  const results = {
    message: 'Hello World!',
  }

  return NextResponse.json(results)
}
