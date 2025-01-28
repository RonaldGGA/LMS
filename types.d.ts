import { Book, Category } from "@prisma/client";

export type BigBook = Book & {
  author: {
    author_name: string;
  };
  categories: {
    category: {
      cat_type: string;
    };
  }[];
  issuedBooks: {
    return_date: Date;
    user_id: string;
  }[];
};

export type CategoryPlus = Category & {
  isNew: boolean;
};
