import { BookLoanRequestStatus, BookLoanStatus } from "@prisma/client";

export type CategoryPlus = BookCategory & {
  isNew: boolean;
};

declare global {
  interface EventSource {
    onmessage: (event: MessageEvent) => void;
  }
}

///////////////
type ServiceError = {
  code: string;
  userMessage: string;
  developerMessage?: string;
};

type ServiceResponse<T> = {
  success: boolean;
  data?: T;
  error?: ServiceError;
};

export type BigBook = {
  stock: number;
  book_price: string;
  id: string;
  authorId: string;
  title: string;
  img: string | null;
  author: {
    author_name: string;
  };
  categories: {
    name: string;
  }[];
  description: string | null;
  bookRatings: {
    rating: number;
  }[];
  bookCopies: {
    bookLoanRequests: {
      userId: string;
      status: BookLoanRequestStatus;
    }[];
  }[];
};

export type userBorrowedBooks = {
  id: string;
  status: BookLoanStatus;
  loanDate: Date;
  returnDate: Date | null;
  bookCopy: {
    bookTitle: {
      title: string;
      id: string;
      book_price: string;
    };
  };
};

export type searchedBooks = {
  id: string;
  title: string;
  author: {
    author_name: string;
  };
  categories: {
    name: string;
  }[];
  img: string | null;
  bookRatings: { rating: number }[];
  book_price: string;
};

export type BigRequest = {
  id: string;
  status: BookLoanRequestStatus;
  userId: string;
  requestDate: Date;
  bookCopy: {
    bookTitle: {
      id: string;
      title: string;
      book_price: string;
    };
  };
  description: string | null;
};
