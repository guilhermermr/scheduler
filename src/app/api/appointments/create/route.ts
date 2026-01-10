import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { date, clientName, clientEmail, professionalId } = body;

    // 1. Validar se o horário já está ocupado
    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        professionalId,
        date: new Date(date),
      },
    });

    if (existingAppointment) {
      return NextResponse.json(
        { message: "Este horário já está ocupado." },
        { status: 400 }
      );
    }

    // 2. Criar o agendamento
    const newAppointment = await prisma.appointment.create({
      data: {
        date: new Date(date),
        clientName,
        clientEmail,
        professionalId,
      },
    });

    return NextResponse.json({ message: "Agendamento realizado com sucesso!", newAppointment }, { status: 201 });

  } catch (error) {
    console.error("ERRO_CREATE_APPOINTMENT:", error);
    return NextResponse.json({ message: "Erro ao realizar agendamento" }, { status: 500 });
  }
}