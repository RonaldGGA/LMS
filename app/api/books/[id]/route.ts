import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { CategoryPlus } from "@/types";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const {
      book_name = "",
      img = "",
      author = "",
      categories = [],
      price = "",
    } = await req.json();

    // Validar ID
    if (!params.id) {
      return NextResponse.json(
        { error: "ID of the book required" },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(
      async (tx) => {
        const data: {
          title?: string;
          img?: string;
          book_price?: string;
          author?: string;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          categories?: any;
        } = {};

        // Actualizar campos básicos
        if (book_name) data.title = book_name;
        if (img) data.img = img;
        if (price) data.book_price = price;

        // Manejar autor
        if (author) {
          const authorExists = await tx.bookAuthor.findUnique({
            where: { author_name: author },
          });

          if (authorExists) {
            data.author = authorExists.id;
          } else {
            const newAuthor = await tx.bookAuthor.create({
              data: { author_name: author },
            });
            data.author = newAuthor.id;
          }
        }
        // Handle categories
        if (categories.length > 0) {
          // Map categories for connectOrCreate
          data.categories = {
            connectOrCreate: categories.map((category: CategoryPlus) => ({
              where: { id: category.id },
              create: { name: category.name },
            })),
          };
        }

        // Update book title
        const book = await tx.bookTitle.update({
          where: { id: params.id },
          data: {
            title: data.title,
            categories: data.categories,
            img: data.img,
            authorId: data.author,
            book_price: data.book_price,
          },
        });
        if (!book) {
          throw new Error("Error updating the book");
        }

        return book;
      },
      {
        timeout: 30000,
      }
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error en PATCH:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.bookTitle.delete({
      where: { id: params.id },
    });

    return NextResponse.json(null, { status: 201 });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
