import { NextResponse } from "next/server"
import { products } from "../mock-data"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const categoryId = searchParams.get("categoryId")

  if (categoryId) {
    const filteredProducts = products.filter((product) => product.categoryId === categoryId)
    return NextResponse.json(filteredProducts)
  }

  return NextResponse.json(products)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    // In a real app, we would save this to a database
    return NextResponse.json({ message: "Product created successfully", product: body }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
