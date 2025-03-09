"use server";

import { FilterType, SortType } from "@/app/components/search";
import db from "@/lib/prisma";
import { createErrorResponse } from "@/lib/utils";
import { Prisma } from "@prisma/client";

export const getLiveSuggestionBooks = async (
  partial_search: string,
  sortOption: SortType,
  selectedFilter: FilterType
) => {
  if (!partial_search) {
    return createErrorResponse("No value specified");
  }

  if (isNaN(Number(partial_search)) && selectedFilter === "rating") {
    return createErrorResponse("Invalid rating value");
  }

  try {
    let books;
    switch (selectedFilter) {
      case "title":
        books = await db.bookTitle.findMany({
          where: {
            title: {
              contains: partial_search,
              mode: "insensitive",
            },
          },
          take: 6,
          select: {
            author: {
              select: {
                author_name: true,
              },
            },
            id: true,
            title: true,
          },
        });
        break;
      case "author":
        console.log("searching by author...");
        books = await db.bookTitle.findMany({
          where: {
            author: {
              is: {
                author_name: {
                  contains: partial_search,
                  mode: "insensitive",
                },
              },
            },
          },
          take: 6,
          select: {
            author: {
              select: {
                author_name: true,
              },
            },
            id: true,
            title: true,
          },
        });
        break;
      case "category":
        books = await db.bookTitle.findMany({
          where: {
            categories: {
              some: {
                name: {
                  contains: partial_search,
                  mode: "insensitive",
                },
              },
            },
          },
          take: 6,
          select: {
            author: {
              select: {
                author_name: true,
              },
            },
            id: true,
            title: true,
          },
        });
        break;
      case "rating":
        books = await db.bookTitle.findMany({
          where: {
            averageRating: {
              gt: Number(partial_search) + 1.5, // Filtra donde rating < (partial_search + 1.5)
              lt: Number(partial_search) - 1.5, // Filtra donde rating > (partial_search - 1.5)
            },
          },
          take: 6,
          select: {
            author: {
              select: {
                author_name: true,
              },
            },
            id: true,
            title: true,
          },
        });
        break;
      default:
        console.log("searching by default..");
        books = await db.bookTitle.findMany({
          take: 6,
          select: {
            author: {
              select: {
                author_name: true,
              },
            },
            id: true,
            title: true,
          },
        });
    }

    return {
      success: true,
      error: null,
      data: books,
    };
  } catch (error) {
    console.error("Error fetching books:", error);
    return createErrorResponse("Server side error");
  }
};

export const getDefaultBooks = async (quantity: number) => {
  if (!quantity) {
    return createErrorResponse("no specified quantity");
  }

  try {
    const books = await db.bookTitle.findMany({
      take: quantity,
      select: {
        id: true,
        title: true,
        img: true,
        book_price: true,
        bookRatings: {
          select: {
            rating: true,
          },
        },
        author: {
          select: {
            author_name: true,
          },
        },
        categories: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      error: null,
      data: books,
    };
  } catch (error) {
    console.error("Error fetching books:", error);
    return createErrorResponse("Server side error");
  }
};

export const getBooks = async (
  partial_search: string,
  sortOption: SortType,
  selectedFilter: FilterType
) => {
  if (!partial_search) {
    return createErrorResponse("No value specified");
  }

  if (isNaN(Number(partial_search)) && selectedFilter === "rating") {
    return createErrorResponse("Invalid rating value");
  }

  const orderByOptions: Record<
    string,
    Prisma.BookTitleOrderByWithRelationInput
  > = {
    popularity: { loanCount: "desc", averageRating: "desc" },
    price: { book_price: "desc" },
    relevance: { lastLoanedAt: "desc" },
    rating: { averageRating: "desc" },
    default: { averageRating: "desc" },
  };

  const order = orderByOptions[sortOption] || orderByOptions.default;
  try {
    let books;
    switch (selectedFilter) {
      case "title":
        books = await db.bookTitle.findMany({
          where: {
            title: {
              contains: partial_search,
              mode: "insensitive",
            },
          },
          select: {
            categories: {
              select: {
                name: true,
              },
            },
            bookRatings: {
              select: {
                rating: true,
              },
            },

            author: {
              select: {
                author_name: true,
              },
            },
            img: true,
            id: true,
            book_price: true,
            title: true,
          },
          orderBy: order,
        });
        break;

      case "author":
        console.log("searching by author...");
        books = await db.bookTitle.findMany({
          where: {
            author: {
              is: {
                author_name: {
                  contains: partial_search,
                  mode: "insensitive",
                },
              },
            },
          },
          select: {
            categories: {
              select: {
                name: true,
              },
            },
            bookRatings: {
              select: {
                rating: true,
              },
            },

            author: {
              select: {
                author_name: true,
              },
            },
            img: true,
            id: true,
            book_price: true,
            title: true,
          },
          orderBy: order,
        });
        break;
      case "category":
        books = await db.bookTitle.findMany({
          where: {
            categories: {
              some: {
                name: {
                  contains: partial_search,
                  mode: "insensitive",
                },
              },
            },
          },
          select: {
            categories: {
              select: {
                name: true,
              },
            },
            bookRatings: {
              select: {
                rating: true,
              },
            },

            author: {
              select: {
                author_name: true,
              },
            },
            img: true,
            id: true,
            book_price: true,
            title: true,
          },
          orderBy: order,
        });
        break;
      case "rating":
        books = await db.bookTitle.findMany({
          where: {
            averageRating: {
              gt: Number(partial_search) + 1.5, // Filtra donde rating < (partial_search + 1.5)
              lt: Number(partial_search) - 1.5, // Filtra donde rating > (partial_search - 1.5)
            },
          },
          select: {
            categories: {
              select: {
                name: true,
              },
            },
            bookRatings: {
              select: {
                rating: true,
              },
            },

            author: {
              select: {
                author_name: true,
              },
            },
            img: true,
            id: true,
            book_price: true,
            title: true,
          },
          orderBy: order,
        });
        break;
      default:
        console.log("searching by default..");
        books = await db.bookTitle.findMany({
          take: 6,
          select: {
            categories: {
              select: {
                name: true,
              },
            },
            bookRatings: {
              select: {
                rating: true,
              },
            },

            author: {
              select: {
                author_name: true,
              },
            },
            img: true,
            id: true,
            book_price: true,
            title: true,
          },
          orderBy: order,
        });
    }

    return {
      success: true,
      error: null,
      data: books,
    };
  } catch (error) {
    console.error("Error fetching books:", error);
    return createErrorResponse("Server side error");
  }
};
