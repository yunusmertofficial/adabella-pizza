import { NextResponse } from "next/server"
import { users } from "../mock-data"

export async function GET() {
  return NextResponse.json(users)
}
