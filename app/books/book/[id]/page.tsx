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
    } catch (error) {
      console.error(error);
    }
  }, [params.id]);

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
          item.bookCopy.bookTitleId === params.id,
      );
      const userPendingRequest = userDb?.bookLoanRequests.some(
        (item) =>
          item.bookCopy.bookTitleId === bookInfo.id &&
          item.status === BookLoanRequestStatus.PENDING &&
          item.userId === userId,
      );

      const hasPendingRequestFromOthers = bookInfo.bookCopies.some((item) =>
        item.bookLoanRequests.some(
          (item) =>
            item.userId !== userId &&
            item.status === BookLoanRequestStatus.PENDING,
        ),
      );
      setIssuedByUser(isIssued);
      setPendingRequest(
        userPendingRequest
          ? `Requested by you on ${format(new Date(Date.now()), "hh/dd/yyy")}`
          : hasPendingRequestFromOthers && bookInfo.stock === 1
            ? "Requested by another user"
            : "",
      );
      setPageLoading(false);
    };
    updateStatus();
  }, [bookInfo, userDb, params.id, userId]);

  const handleBorrowBook = async (
    paymentMethod: BookPaymentMethod,
    paymentReference: string | undefined,
  ) => {
    try {
      setLoading(true);

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
              Role.SUPERADMIN,
            );
          }

          await Promise.all([getBook(), getUserFromDb()]);

          toast.success(
            userRole === Role.MEMBER
              ? "Book requested, please wait for admin confirmation"
              : "Book Issued successfully",
          );

          return;
        }
      } else {
        const res = await issueBook(params.id, userId);
        if (res.error) {
          toast.error(res.error);
        } else {
          toast.success("Book borrowed");
          await Promise.all([getBook(), getUserFromDb()]);
        }
      }
    } catch (error) {
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
      setIssuedByUser(false);

      const result = await returnBook(params.id);
      if (result?.success) {
        await Promise.all([getBook(), getUserFromDb()]);
        toast.success("Book returned successfully");
      } else {
        throw new Error(result.error || "Something went wrong");
      }
    } catch (error) {
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
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading || !bookInfo) {
    return <BookSkeleton />;
  }

  return (
    <div className="min-h-screen bg-ivory-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
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

            <div className="space-y-6">
              <div className="border-b border-library-midnight/10 pb-6">
                <h1 className="text-3xl font-bold text-library-dark mb-2">
                  {bookInfo.title}
                </h1>
                <p className="text-lg text-library-midnight">
                  by {bookInfo.author.author_name}
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <Rating userId={userId!} bookInfo={bookInfo} />
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {bookInfo.categories?.map((category) => (
                  <Badge
                    key={category.name}
                    variant="secondary"
                    className="px-3 py-1 text-sm bg-ivory-50 text-library-midnight border-library-midnight/10"
                  >
                    {category.name}
                  </Badge>
                ))}
              </div>

              <div className="prose text-library-midnight leading-relaxed">
                {bookInfo.description}
              </div>

              <div className="bg-ivory-50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-2xl font-bold text-library-dark">
                      ${parseFloat(bookInfo.book_price).toFixed(2)}
                    </span>
                    <span className="block text-sm text-library-midnight mt-1">
                      per loan period
                    </span>
                  </div>
                  <Badge
                    variant={bookInfo.stock > 0 ? "default" : "destructive"}
                    className="px-4 py-2 bg-library-dark text-white hover:bg-antique-gold/90"
                  >
                    {bookInfo.stock > 0
                      ? `${bookInfo.stock} in stock`
                      : "Out of stock"}
                  </Badge>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  {issuedByUser ? (
                    <div className="flex items-center gap-2 text-green-500">
                      <CheckCircle className="w-5 h-5" />
                      <span>Currently borrowed by you</span>
                    </div>
                  ) : pendingRequest ? (
                    <div className="flex items-center gap-2 text-antique-gold">
                      <Clock className="w-5 h-5" />
                      <span>{pendingRequest}</span>
                    </div>
                  ) : (
                    <div className="text-library-midnight">
                      {bookInfo.stock > 0
                        ? "Available for loan"
                        : "Check back soon"}
                    </div>
                  )}
                </div>

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
                        className="w-full hover:bg-antique-gold/10 border-library-dark text-library-dark hover:text-black"
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
    </div>
  );
};

export default memo(SingleBookPage);
