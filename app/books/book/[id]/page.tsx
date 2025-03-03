"use client";

import { getBookById } from "@/data/getBook";
import { BookLoanRequestStatus, BookPaymentMethod, Role } from "@prisma/client";
import Image from "next/image";
import React, { useCallback, useEffect, useState, memo } from "react";
import toast from "react-hot-toast";
import { issueBook } from "@/actions/issue-book";
import { useUserSession } from "@/app/hooks/useUserSession";
import Confirmation from "@/app/components/issue-confirmation";
import { returnBook } from "@/actions/return-book";
import { Badge } from "@/components/ui/badge";
import { requestIssueBook } from "@/actions/request-issue-book";
import Rating from "@/app/components/rating";
import { Button } from "@/components/ui/button";
import { addBookCopy } from "@/actions/add-book-copy";
import { getBigUser } from "@/data/getUser";
import { BigBook } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle, Clock, Plus } from "lucide-react";
import BookSkeleton from "./components/Book-skeleton";
import { format } from "date-fns";
import NextImprovements from "@/app/components/next-improvements";

type BigUser = {
  role: Role;
  bookLoans: {
    userId: string;
    status: string;
    bookCopy: { bookTitleId: string };
  }[];
  bookLoanRequests: {
    requestDate: Date;
    userId: string;
    status: BookLoanRequestStatus;
    bookCopy: { bookTitleId: string };
  }[];
};

const SingleBookPage = ({ params }: { params: { id: string } }) => {
  const [reload, setReload] = useState(false);
  const userSession = useUserSession();
  const [bookInfo, setBookInfo] = useState<BigBook | null>(null);
  const [issuedByUser, setIssuedByUser] = useState(false);
  const [pendingRequest, setPendingRequest] = useState("");
  const [userRole, setUserRole] = useState<Role | undefined>(Role.MEMBER);
  const [userId, setUserId] = useState<string | undefined>("");
  const [userDb, setUserDb] = useState<BigUser | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUserId(userSession?.id);
    setUserRole(userSession?.role);
  }, [userSession?.id, userSession?.role]);

  const getBook = useCallback(async () => {
    try {
      setPageLoading(true);
      const result = await getBookById(params.id);
      if (!result?.success) {
        setBookInfo(null);
        console.error(result?.error);
        return;
      }
      setBookInfo(result.data || null);
      // console.log("Got the book");
    } catch (error) {
      console.error(error);
    }
  }, [params.id]);

  // Definir getUserFromDb como función independiente
  const getUserFromDb = useCallback(async () => {
    const userDb = await getBigUser(userId as string);
    if (userDb?.success && userDb.data) {
      setUserDb(userDb.data);
    }
  }, [userId]);

  useEffect(() => {
    getUserFromDb();
    getBook();
    setPageLoading(false);
    setLoading(false);
  }, [getBook, getUserFromDb]);

  useEffect(() => {
    const updateStatus = async () => {
      if (!bookInfo || !userId || !userDb) return;

      const isIssued = userDb?.bookLoans.some(
        (item) =>
          item.userId === userId &&
          item.status === "ISSUED" &&
          item.bookCopy.bookTitleId === params.id
      );
      const userPendingRequest = userDb?.bookLoanRequests.filter(
        (item) =>
          item.bookCopy.bookTitleId === bookInfo.id &&
          item.status === BookLoanRequestStatus.PENDING
      );
      const hasPendingRequestFromOthers = bookInfo.bookCopies.some((item) =>
        item.bookLoanRequests.some(
          (item) =>
            item.userId !== userId &&
            item.status === BookLoanRequestStatus.PENDING
        )
      );
      setIssuedByUser(isIssued);
      setPendingRequest(
        userPendingRequest
          ? `Requested by you on ${format(new Date(Date.now()), "hh/dd/yyy")}`
          : hasPendingRequestFromOthers && bookInfo.stock === 1
          ? "Requested by another user"
          : ""
      );
      setPageLoading(false);
    };
    updateStatus();
  }, [bookInfo, userDb, params.id, userId]);

  const handleBorrowBook = async (
    paymentMethod: BookPaymentMethod,
    paymentReference: string | undefined
  ) => {
    try {
      setLoading(true);

      // Optimistic UI update
      setIssuedByUser(true);
      setPendingRequest("");

      if (bookInfo && parseFloat(bookInfo.book_price) > 0) {
        const response = await requestIssueBook({
          id: bookInfo.id,
          author: bookInfo.authorId,
          name: bookInfo.title,
          price: bookInfo.book_price,
          paymentMethod,
          paymentReference,
        });

        if (response?.success) {
          if (["SUPERADMIN", "LIBRARIAN"].includes(userRole!)) {
            await issueBook(
              params.id,
              userId,
              response.data?.id,
              Role.SUPERADMIN
            );
          }

          // Actualizar datos antes de cualquier redirección
          await Promise.all([getBook(), getUserFromDb()]);

          toast.success(
            userRole === Role.MEMBER
              ? "Book requested, please wait for admin confirmation"
              : "Book Issued successfully"
          );

          setReload((prev) => !prev);
          return;
        }
      }

      // Actualizar datos incluso si no hay precio
      await Promise.all([getBook(), getUserFromDb()]);
    } catch (error) {
      // Revertir cambios si hay error
      setIssuedByUser(false);
      setPendingRequest("");
      console.error(error);
      toast.error("Error processing request");
    } finally {
      setLoading(false);
    }
  };

  const handleReturnBook = async () => {
    try {
      setLoading(true);
      // Optimistic UI update
      setIssuedByUser(false);

      const result = await returnBook(params.id);
      if (result?.success) {
        await Promise.all([getBook(), getUserFromDb()]);
        toast.success("Book returned successfully");
      } else {
        throw new Error(result.error || "Something went wrong");
      }
    } catch (error) {
      // Revertir cambios si hay error
      setIssuedByUser(true);
      console.error(error);
      toast.error("Error returning book");
    } finally {
      setLoading(false);
    }
  };
  const createBookCopy = async () => {
    try {
      setLoading(true);
      const result = await addBookCopy(params.id);
      if (result.error) {
        console.error(result.error);
        toast.error("Error creating the copy");
        return;
      }
      toast.success("Copy created");
      await getBook();
    } catch (error) {
      console.error(error);
      toast.error("Couldn't add the copy, check console for details");
      setReload(!true);
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading || !bookInfo) {
    return <BookSkeleton />;
  }

  const next = [
    "Implement a better loading state and handling while changing from issued, pending, etc...",
    "Implement popularity logic, add it to the database",
    "Implement  better image optimization",
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Sección de Imagen */}
            <div className="relative aspect-[5/4] lg:aspect-[4/5] bg-gray-100 rounded-xl overflow-hidden">
              {pageLoading ? (
                <Skeleton className="h-full w-full rounded-xl" />
              ) : (
                <Image
                  src={bookInfo.img || "/default-book.webp"}
                  alt={bookInfo.title}
                  fill
                  className="object-cover"
                  priority
                />
              )}
            </div>

            {/* Detalles del Libro */}
            <div className="space-y-6">
              {/* Cabecera */}
              <div className="border-b border-gray-100 pb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {bookInfo.title}
                </h1>
                <p className="text-lg text-gray-600">
                  by {bookInfo.author.author_name}
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <Rating
                    userId={userId!}
                    bookInfo={bookInfo}
                    setReload={() => setReload(!reload)}
                  />
                </div>
              </div>

              {/* Categorías */}
              <div className="flex flex-wrap gap-2">
                {bookInfo.categories?.map((category) => (
                  <Badge
                    key={category.name}
                    variant="secondary"
                    className="px-3 py-1 text-sm"
                  >
                    {category.name}
                  </Badge>
                ))}
              </div>

              {/* Descripción */}
              <div className="prose text-gray-600 leading-relaxed">
                {bookInfo.description}
              </div>

              {/* Información de Precio y Stock */}
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-2xl font-bold text-blue-600">
                      ${parseFloat(bookInfo.book_price).toFixed(2)}
                    </span>
                    <span className="block text-sm text-gray-600 mt-1">
                      per loan period
                    </span>
                  </div>
                  <Badge
                    variant={bookInfo.stock > 0 ? "default" : "destructive"}
                    className="px-4 py-2"
                  >
                    {bookInfo.stock > 0
                      ? `${bookInfo.stock} in stock`
                      : "Out of stock"}
                  </Badge>
                </div>
              </div>

              {/* Estado y Acciones */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  {issuedByUser ? (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="w-5 h-5" />
                      <span>Currently borrowed by you</span>
                    </div>
                  ) : pendingRequest ? (
                    <div className="flex items-center gap-2 text-blue-600">
                      <Clock className="w-5 h-5" />
                      <span>{pendingRequest}</span>
                    </div>
                  ) : (
                    <div className="text-gray-600">
                      {bookInfo.stock > 0
                        ? "Available for loan"
                        : "Check back soon"}
                    </div>
                  )}
                </div>

                {/* Botones de Acción */}
                <div className="space-y-2">
                  {issuedByUser && (
                    <Confirmation
                      loading={loading}
                      type="ISSUED"
                      price={bookInfo.book_price}
                      handleReturnBook={handleReturnBook}
                    />
                  )}

                  {bookInfo.stock > 0 &&
                    !pendingRequest &&
                    !issuedByUser &&
                    !loading && (
                      <Confirmation
                        loading={loading}
                        type="STOCK"
                        price={bookInfo.book_price}
                        handleBorrowBook={handleBorrowBook}
                      />
                    )}

                  {(userRole === Role.LIBRARIAN ||
                    userRole === Role.SUPERADMIN) &&
                    !loading && (
                      <Button
                        onClick={createBookCopy}
                        variant="outline"
                        className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
                        size="lg"
                      >
                        <Plus className="mr-2 h-5 w-5" />
                        Add New Copy
                      </Button>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <NextImprovements className={"mt-10 space-y-5"}>
        <ul className="space-y-2">
          {next.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </NextImprovements>
    </div>
  );
};

export default memo(SingleBookPage);
