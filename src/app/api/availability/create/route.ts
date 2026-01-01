import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
  try {
    // 1. Pega o token do Header (Bearer <token>)
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }

    // 2. Decodifica o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    const professionalId = decoded.id;

    const body = await request.json();
    // Esperamos um array: [{ dayOfWeek: 1, startTime: "08:00", endTime: "12:00" }, ...]
    const { availabilities } = body;

    // 3. Salva no banco vinculando ao ID do profissional logado
    // Usamos createMany para performance
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