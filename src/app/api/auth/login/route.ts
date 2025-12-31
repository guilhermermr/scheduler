import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import * as z from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = loginSchema.parse(body);

    const user = await prisma.professional.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json(
        { message: "E-mail ou senha incorretos" },
        { status: 401 }
      );
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "E-mail ou senha incorretos" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      message: "Login realizado com sucesso",
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email,
        slug: user.slug 
      }
    }, { status: 200 });

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