import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import * as z from "zod";

const registerSchema = z.object({
  name: z.string().min(2, "Nome é obrigatório"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  slug: z.string().min(3, "O slug deve ter pelo menos 3 caracteres")
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, slug } = registerSchema.parse(body);

    const userExists = await prisma.professional.findFirst({
      where: {
        OR: [
          { email },
          { slug }
        ]
      }
    });

    if (userExists) {
      return NextResponse.json(
        { message: "E-mail ou Slug já estão em uso" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const professional = await prisma.professional.create({
      data: {
        name,
        email,
        slug: slug.toLowerCase().replace(/\s+/g, "-"),
        password: hashedPassword,
      },
    });

    return NextResponse.json({
      message: "Usuário criado com sucesso",
      user: { id: professional.id, email: professional.email }
    }, { status: 201 });

  } catch (error) {
    console.error("ERRO NO REGISTRO:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({ errors: error.issues }, { status: 400 });
    }

    return NextResponse.json(
      { message: "Erro interno no servidor", details: error instanceof Error ? error.message : "Erro desconhecido" }, 
      { status: 500 }
    );
  }
}