import { NextResponse } from "next/server"
import { categories } from "../mock-data"

export async function GET() {
  return NextResponse.json(categories)
}
