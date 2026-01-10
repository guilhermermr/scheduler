import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

    const availabilities = await prisma.availability.findMany({
      where: { 
        professionalId: decoded.id 
      },
      orderBy: { 
        dayOfWeek: 'asc'
      }
    });

    return NextResponse.json(availabilities, { status: 200 });

  } catch (error) {
    console.error("ERRO_LIST_AVAILABILITY:", error);
    return NextResponse.json({ message: "Erro ao listar agenda" }, { status: 500 });
  }
}