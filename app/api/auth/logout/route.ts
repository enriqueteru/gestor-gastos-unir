import { NextResponse } from "next/server";

export async function POST() {
    return NextResponse.json({ message: 'Sesión cerrada (cliente debe borrar el token)' });
  }
  