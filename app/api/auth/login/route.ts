import { NextResponse } from "next/server"
import { users } from "../../mock-data"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    const user = users.find((u) => u.email === email)

    if (!user || user.password !== password) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // In a real app, we would generate a JWT token here
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      user: userWithoutPassword,
      token: "fake-jwt-token",
    })
  } catch (error) {
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
  }
}
