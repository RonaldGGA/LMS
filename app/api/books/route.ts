"use server";

// import { createBook } from "@/actions/createBooks";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// Get books
export async function GET(req: NextRequest) {
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
        img: true,
        description: true,
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

// export async function POST(req: NextRequest) {
//   const body = await req.json();

//   try {
//     const books = [];
//     for (let i = 0; i < body.length - 1; i++) {
//       const res = await createBook(body[i]);
//       if (res?.error) {
//         console.log(res.error);
//         throw new Error(res.error);
//       } else if (res?.data) {
//         books.push(res.data);
//       }
//     }

//     return NextResponse.json(books);
//   } catch (error) {
//     console.log(error);
//     return new NextResponse("Internal server error", { status: 500 });
//   }
// }
