import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> } 
) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json({ message: "Slug não fornecido" }, { status: 400 });
    }

    const professional = await prisma.professional.findUnique({
      where: { 
        slug: slug
      },
      select: {
        id: true,
        name: true,
        slug: true,
        availability: true
      },
    });

    if (!professional) {
      return NextResponse.json({ message: "Profissional não encontrado" }, { status: 404 });
    }

    return NextResponse.json(professional);

  } catch (error: any) {
    console.error("ERRO_DETALHADO:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}