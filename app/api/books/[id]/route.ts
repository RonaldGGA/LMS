import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  const currentBook = await prisma.bookTitle.findUnique({
    where: {
      id: params.id,
    },

    select: {
      id: true,
      authorId: true,
      categories: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!currentBook) {
    return new NextResponse("Book not found", { status: 404 });
  }

  const sameAuthor = await prisma.bookTitle.findMany({
    where: {
      authorId: currentBook.authorId,
      NOT: { id: currentBook.id },
    },
    take: 3,
    orderBy: [{ loanCount: "desc" }, { averageRating: "desc" }],
  });

  const categoryIds = currentBook.categories.map((cat) => cat.id);

  const sameCategories = await prisma.bookTitle.findMany({
    where: {
      categories: {
        some: {
          id: {
            in: categoryIds,
          },
        },
      },
      NOT: { id: currentBook.id },
    },
    take: 3,
    orderBy: [{ loanCount: "desc" }, { averageRating: "desc" }],
  });

  const frequentlyTogether = await prisma.bookTitle.findMany({
    where: {
      id: {
        not: currentBook.id,
      },
      loanCount: {
        gt: 5,
      },
    },
    orderBy: [{ loanCount: "desc" }, { averageRating: "desc" }],
    take: 3,
  });

  const recommendations = [
    ...sameAuthor,
    ...sameCategories,
    ...frequentlyTogether,
  ]
    .filter((v, i, a) => a.findIndex((t) => t.id === v.id) === i)
    .slice(0, 5);

  return NextResponse.json(recommendations);
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { book_name, img, author, categories, price } = await req.json();

    if (!params.id) {
      return NextResponse.json({ error: "ID requerido" }, { status: 400 });
    }

    const result = await prisma.$transaction(
      async (tx) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data: any = {};

        if (book_name) data.title = book_name;
        if (img) data.img = img;
        if (price) data.book_price = price;

        if (author) {
          let authorId: string;
          let authorName: string;

          const authorExists = await tx.bookAuthor.findUnique({
            where: { author_name: author },
          });

          if (authorExists) {
            authorId = authorExists.id;
            authorName = authorExists.author_name;
          } else {
            const newAuthor = await tx.bookAuthor.create({
              data: { author_name: author },
            });
            authorId = newAuthor.id;
            authorName = newAuthor.author_name;
          }

          data.authorId = authorId;
          data.authorName = authorName;
        }

        if (categories && categories.length > 0) {
          data.categories = {
            set: [],
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            connect: categories.map((cat: any) => ({ id: cat.id })),
          };
        }

        const book = await tx.bookTitle.update({
          where: { id: params.id },
          data,
        });

        return book;
      },
      { timeout: 30000 },
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error en PATCH:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
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
