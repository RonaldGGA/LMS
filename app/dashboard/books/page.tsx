// app/dashboard/books/page.tsx
"use client";

import React, { useState, useEffect } from "react";

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
import {
  BookOpenIcon,
  BookXIcon,
  MoreVerticalIcon,
  PlusIcon,
} from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import FormBooks from "@/app/components/form-book";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { BookCategory } from "@prisma/client";
import Link from "next/link";
import { cn } from "@/lib/utils";

export type dashboardBook = {
  title: string;
  img: string;
  id: string;
  book_price: string;
  stock: number;
  description: string;
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

  const handleBookClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    bookId: string
  ) => {
    e.stopPropagation();

    router.push(`/books/book/${bookId}`);
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

  return (
    <div className="p-6 space-y-6 bg-library-dark text-ivory-50 rounded-xl shadow-2xl border border-library-midnight">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <Input
          placeholder="Search by title or author..."
          className="max-w-md text-library-dark bg-ivory-50 border-2 border-golden-amber focus:ring-2 focus:ring-golden-amber"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Link href="/books/add">
          <Button className="bg-golden-amber hover:bg-golden-amber/90 text-library-dark font-bold transition-transform hover:scale-105">
            <PlusIcon className="mr-2 h-4 w-4" />
            Add New Book
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton
              key={i}
              className="h-12 w-full bg-library-midnight/50 animate-pulse"
            />
          ))}
        </div>
      ) : (
        <Table className="bg-library-midnight/50 rounded-lg overflow-hidden">
          <TableHeader className="bg-golden-amber">
            <TableRow>
              {[
                "More",
                "Title",
                "Author",
                "Price",
                "Stock",
                "Categories",
                "Actions",
              ].map((header) => (
                <TableHead
                  key={header}
                  className="text-library-dark font-black text-center"
                >
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {books.map((book) => (
              <TableRow
                key={book.id}
                className="hover:bg-library-midnight/30 transition-colors"
              >
                <TableCell className="text-center">
                  <Button
                    variant="ghost"
                    className="text-golden-amber hover:bg-golden-amber/10"
                    onClick={(e) => handleBookClick(e, book.id)}
                  >
                    <BookOpenIcon className="h-5 w-5" />
                  </Button>
                </TableCell>
                <TableCell className="font-medium text-golden-amber text-center">
                  {book.title}
                </TableCell>
                <TableCell className="text-center">
                  {book.author.author_name}
                </TableCell>
                <TableCell className="text-center text-emerald-400 font-bold">
                  ${book.book_price}
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant={book.stock > 0 ? "default" : "destructive"}
                    className={cn({
                      "bg-emerald-500": book.stock > 0,
                      "bg-red-500": book.stock <= 0,
                    })}
                  >
                    {book.stock}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {book.categories.slice(0, 3).map((category) => (
                      <Badge
                        key={category.id}
                        variant="secondary"
                        className="bg-ivory-50 text-library-dark border border-golden-amber"
                      >
                        {category.name}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    onClick={(e) => handleSelectBook(e, book)}
                    className="border-golden-amber text-golden-amber hover:bg-golden-amber/10"
                  >
                    Edit
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-golden-amber hover:bg-golden-amber/10"
                      >
                        <MoreVerticalIcon className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-library-dark border border-golden-amber">
                      <DropdownMenuItem
                        onClick={(e) => handleDelete(e, book.id)}
                        className="text-ivory-50 hover:bg-golden-amber/20"
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

      {books.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center h-[40vh] bg-library-midnight/50 rounded-xl">
          <BookXIcon className="h-16 w-16 text-golden-amber mb-4" />
          <h3 className="text-xl font-bold text-ivory-50">No books found</h3>
          <p className="text-golden-amber/80">
            Try adjusting your search terms
          </p>
        </div>
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
      <DialogContent className="overflow-auto max-w-[900px]  bg-gray-500/80 h-full">
        <FormBooks
          book={selectedBook ? selectedBook : undefined}
          onSuccess={() => handleSuccess()}
        />
      </DialogContent>
    </Dialog>
  );
};

export default BooksDashboard;
