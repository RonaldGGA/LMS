import { Book } from "@prisma/client";

export type BigBook = Book & {
  author: {
    author_name: string;
  };
  category: {
    cat_type: string;
  };
  issuedBooks: {
    return_date: Date;
    user_id: string;
  }[];
};
