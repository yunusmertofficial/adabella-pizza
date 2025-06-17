import { NextResponse } from "next/server"
import { orders } from "../mock-data"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")

  if (userId) {
    const userOrders = orders.filter((order) => order.userId === userId)
    return NextResponse.json(userOrders)
  }

  return NextResponse.json(orders)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    // In a real app, we would save this to a database
    return NextResponse.json({ message: "Order created successfully", order: body }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
