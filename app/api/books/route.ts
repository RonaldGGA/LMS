"use server";

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// Get books
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query") || "";
  try {
    const books = await prisma.bookTitle.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          {
            author: {
              author_name: { contains: query, mode: "insensitive" },
            },
          },
        ],
      },
      select: {
        title: true,
        book_price: true,
        stock: true,
        id: true,
        author: {
          select: {
            author_name: true,
          },
        },
        categories: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      take: 15,
    });
    return NextResponse.json(books);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
