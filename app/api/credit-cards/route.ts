import { NextResponse } from "next/server"
import { creditCards } from "../mock-data"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")

  if (userId) {
    const userCards = creditCards.filter((card) => card.userId === userId)
    return NextResponse.json(userCards)
  }

  return NextResponse.json(creditCards)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    // In a real app, we would save this to a database
    return NextResponse.json({ message: "Credit card added successfully", card: body }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to add credit card" }, { status: 500 })
  }
}
