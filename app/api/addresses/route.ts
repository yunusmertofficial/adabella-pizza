import { NextResponse } from "next/server"
import { addresses } from "../mock-data"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")

  if (userId) {
    const userAddresses = addresses.filter((address) => address.userId === userId)
    return NextResponse.json(userAddresses)
  }

  return NextResponse.json(addresses)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    // In a real app, we would save this to a database
    return NextResponse.json({ message: "Address added successfully", address: body }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to add address" }, { status: 500 })
  }
}
