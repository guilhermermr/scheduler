import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    const professionalId = decoded.id;

    const body = await request.json();
    const { availabilities } = body;

    await prisma.availability.createMany({
      data: availabilities.map((item: any) => ({
        ...item,
        professionalId,
      })),
    });

    return NextResponse.json({ message: "Agenda configurada com sucesso!" }, { status: 201 });

  } catch (error) {
    console.error("ERRO_AVAILABILITY:", error);
    return NextResponse.json({ message: "Erro ao salvar agenda" }, { status: 500 });
  }
}