// app/dashboard/books/page.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "react-hot-toast";
import { useUserSession } from "@/app/hooks/useUserSession";
import { Book, MoreVerticalIcon, PlusIcon } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import FormBooks from "@/app/components/form-books";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { BookCategory } from "@prisma/client";
import Link from "next/link";

export type dashboardBook = {
  title: string;
  id: string;
  book_price: string;
  stock: number;
  author: {
    author_name: string;
  };
  categories: BookCategory[];
};

const BooksDashboard = () => {
  const session = useUserSession();
  const router = useRouter();
  const [books, setBooks] = useState<dashboardBook[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState<dashboardBook | null>(null);
  const [search, setSearch] = useState(false);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(`/api/books?query=${searchTerm}`);
        const data = await response.json();

        setBooks(data);
      } catch (error) {
        console.log(error);
        toast.error("Error fetching the books");
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, [searchTerm, search]);

  const handleDelete = async (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    bookId: string
  ) => {
    e.stopPropagation();
    if (
      !confirm(
        "Are you sure you want to delete this book, there is no way back after this"
      )
    ) {
      return null;
    }
    try {
      setLoading(true);
      await fetch(`/api/books/${bookId}`, {
        method: "DELETE",
      });

      setBooks(books.filter((book) => book.id !== bookId));
      toast.success("Book deleted succesfully");
    } catch (error) {
      toast.error("Error deleting the book");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const bookRowRef = useRef(null);

  const handleBookClick = (
    e: React.MouseEvent<HTMLTableCellElement, MouseEvent>,
    bookId: string
  ) => {
    e.stopPropagation();
    // if (bookRowRef.current && e.currentTarget === bookRowRef.current) {
    router.push(`/book/${bookId}`);
    // }
  };

  const handleSelectBook = (
    e:
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.MouseEvent<HTMLDivElement, MouseEvent>,
    book: dashboardBook | null
  ) => {
    e.stopPropagation();
    setSelectedBook(book);
  };

  const handleSuccess = () => {
    setSelectedBook(null);
    setSearch(!search);
  };

  if (!session || !["SUPERADMIN", "LIBRARIAN"].includes(session.role)) {
    return <div>Unuathorized access</div>;
  }
  if (loading) {
    return (
      <div className="text-3xl text-white text-center mx-auto">
        LOADING.....
      </div>
    );
  }
  return (
    <div className="p-6 space-y-6  rounded-md">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <Input
          placeholder="Search by title or author..."
          className="max-w-md text-white"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Link href="/add">
          <Button>
            <PlusIcon className="mr-2 h-4 w-4" />
            Add New Book
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : (
        <Table className="bg-gray-200 rounded-md">
          <TableHeader>
            <TableRow>
              <TableHead>More</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Categories</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {books.map((book) => (
              <TableRow id={book.id} ref={bookRowRef} key={book.id}>
                <TableCell
                  className="hover:bg-gray-700 hover:text-white cursor-pointer rounded-r-md transition"
                  onClick={(e) => handleBookClick(e, book.id)}
                >
                  <Book />
                </TableCell>
                <TableCell className="font-medium group-hover:text-gray-200">
                  {book.title}
                </TableCell>
                <TableCell className="group-hover:text-gray-200">
                  {book.author.author_name}
                </TableCell>
                <TableCell className="group-hover:text-gray-200">
                  ${book.book_price}
                </TableCell>
                <TableCell>
                  <Badge variant={book.stock > 0 ? "default" : "destructive"}>
                    {book.stock}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-2">
                    {book.categories.slice(0, 3).map((category) => (
                      <Badge key={category.id} variant="secondary">
                        {category.name}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="flex items-center gap-2">
                  <Button
                    variant={"outline"}
                    onClick={(e) => handleSelectBook(e, book)}
                  >
                    Edit
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        className="group-hover:bg-gray-200"
                        variant="ghost"
                        size="sm"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreVerticalIcon className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent onClick={(e) => e.stopPropagation()}>
                      <DropdownMenuItem
                        onClick={(e) => handleDelete(e, book.id)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      {selectedBook && (
        <EditDialog
          selectedBook={selectedBook}
          setSelectedBook={setSelectedBook}
          handleSuccess={handleSuccess}
        />
      )}
    </div>
  );
};
interface EditDialogProps {
  selectedBook: dashboardBook | null;
  setSelectedBook: (selectedBook: dashboardBook | null) => void;
  handleSuccess: () => void;
}

const EditDialog: React.FC<EditDialogProps> = ({
  selectedBook,
  setSelectedBook,
  handleSuccess,
}) => {
  return (
    <Dialog open={!!selectedBook} onOpenChange={() => setSelectedBook(null)}>
      <DialogContent className="overflow-auto max-w-[600px] bg-gray-50 h-full">
        <FormBooks
          book={selectedBook ? selectedBook : undefined}
          onSuccess={() => handleSuccess()}
        />
      </DialogContent>
    </Dialog>
  );
};

export default BooksDashboard;
