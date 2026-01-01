import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function GET(request: Request) {
  try {
    // 1. Validação do Token (Apenas o profissional logado acessa)
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

    // 2. Busca os agendamentos vinculados ao ID do profissional
    const myAppointments = await prisma.appointment.findMany({
      where: {
        professionalId: decoded.id
      },
      orderBy: {
        date: 'asc' // Mostra os agendamentos mais próximos primeiro
      }
    });

    return NextResponse.json(myAppointments, { status: 200 });

  } catch (error) {
    console.error("ERRO_LIST_APPOINTMENTS:", error);
    return NextResponse.json({ message: "Erro ao buscar seus agendamentos" }, { status: 500 });
  }
}