import { NextResponse } from "next/server"
import { campaigns } from "../mock-data"

export async function GET() {
  return NextResponse.json(campaigns)
}
