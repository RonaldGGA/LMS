import { Book } from "@prisma/client";

export type BigBook = Book & {
  author: {
    author_name: string;
  };
  category: {
    cat_type: string;
  };
};
