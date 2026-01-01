import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function GET(request: Request) {
  try {
    // 1. Autenticação (O mesmo processo de segurança)
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }

    // 2. Decodifica para saber QUEM está pedindo a lista
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

    // 3. Busca no banco filtrando pelo ID do profissional logado
    const availabilities = await prisma.availability.findMany({
      where: { 
        professionalId: decoded.id 
      },
      orderBy: { 
        dayOfWeek: 'asc' // Organiza: 0 (Dom), 1 (Seg), 2 (Ter)...
      }
    });

    // 4. Retorna a lista para o Postman
    return NextResponse.json(availabilities, { status: 200 });

  } catch (error) {
    console.error("ERRO_LIST_AVAILABILITY:", error);
    return NextResponse.json({ message: "Erro ao listar agenda" }, { status: 500 });
  }
}