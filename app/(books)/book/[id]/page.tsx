"use client";

import { getBookById } from "@/data/getBook";
import {
  BookLoanRequestStatus,
  BookLoanStatus,
  BookPaymentMethod,
  Role,
} from "@prisma/client";
import Image from "next/image";
import React, { useCallback, useEffect, useState } from "react";
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
import { useRouter } from "next/navigation";

type BigUser = {
  role: Role;
  bookLoans: {
    userId: string;
    status: string;
    bookCopy: {
      bookTitleId: string;
    };
  }[];
  bookLoanRequests: {
    userId: string;
    status: BookLoanRequestStatus;
    bookCopy: {
      bookTitleId: string;
    };
  }[];
};

const SingleBookPage = ({ params }: { params: { id: string } }) => {
  const [reload, setReload] = useState(false);

  const router = useRouter();
  const userSession = useUserSession();

  const [bookInfo, setBookInfo] = useState<BigBook | null>(null);
  const [issuedByUser, setIssuedByUser] = useState(false);
  const [pendingRequest, setPendingRequest] = useState("");
  const [userRole, setUserRole] = useState<Role | undefined>(Role.MEMBER);
  const [userId, setUserId] = useState<string | undefined>("");

  const [userDb, setUserDb] = useState<BigUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUserId(userSession?.id);
    setUserRole(userSession?.role);
  }, []);
  console.log(params);

  const getBook = useCallback(async () => {
    try {
      setLoading(true);
      console.log(`getting book with id ${params.id}`);
      const result = await getBookById(params.id);

      if (!result?.success) {
        setBookInfo(null);
        console.log({ BOOKID: result?.error });
        return;
      }

      if (result.data) {
        setBookInfo(result.data);
      } else {
        setBookInfo(null);
      }
      console.log("Got the book");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }

    //TODO: handle this more properly
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id, reload]); // Dependency on params.id
  useEffect(() => {
    try {
      setLoading(true);
      getBook();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [getBook, reload]);

  useEffect(() => {
    async function getUserFromDb() {
      const userDb = await getBigUser(userId as string);
      if (userDb?.success && userDb.data) {
        setUserDb(userDb.data);
      }
    }
    try {
      setLoading(true);
      if (userId) {
        getUserFromDb();
      }
    } catch (error) {
      console.log(error);
      toast.error("Something happened");
    } finally {
      setLoading(false);
    }
  }, [userId, reload, router]);

  useEffect(() => {
    try {
      setLoading(true);
      if (bookInfo && userId) {
        const date = new Date().toLocaleDateString(); // Date placeholder

        // Check if book is already issued by the user
        const isIssued = userDb?.bookLoans.some(
          (item) =>
            item.userId === userId &&
            item.status === "ISSUED" &&
            item.bookCopy.bookTitleId === params.id
        );

        if (isIssued) {
          setIssuedByUser(isIssued);
          return;
        }
        // Check if user has a pending request with the book
        const hasPendingRequest = userDb?.bookLoanRequests.some(
          (item) =>
            item.bookCopy.bookTitleId === bookInfo.id &&
            item.status === BookLoanRequestStatus.PENDING
        );

        if (hasPendingRequest) {
          setPendingRequest(`Requested by you on ${date}`);
          return;
        }
        // Check if someone else has a pending request
        const hasPendingRequestFromOthers = bookInfo.bookCopies.some((item) => {
          const result = item.bookLoanRequests.some(
            (item) =>
              item.userId !== userId &&
              item.status === BookLoanRequestStatus.PENDING
          );
          return result;
        });

        if (hasPendingRequestFromOthers && bookInfo.stock === 1) {
          setPendingRequest(`Requested by another user`);
        } else {
          setIssuedByUser(false);
          setPendingRequest("");
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Something happened");
    } finally {
      setLoading(false);
    }
  }, [
    bookInfo,
    userId,
    reload,
    userDb?.bookLoans,
    userDb?.bookLoanRequests,
    params.id,
  ]); // Only run this effect when bookInfo or userId changes

  const handleBorrowBook = async (
    paymentMethod: BookPaymentMethod,
    paymentReference: string | undefined
  ) => {
    // Logic if the book is paid
    setLoading(true);
    try {
      if (bookInfo && parseFloat(bookInfo?.book_price) > 0) {
        // toast("Payment required");

        const response = await requestIssueBook({
          id: bookInfo.id,
          author: bookInfo.authorId,
          name: bookInfo.title,
          price: bookInfo.book_price,
          paymentMethod,
          paymentReference,
        });

        if (response?.success) {
          // IF user is admin, issue the book accepting the request and not sending a notification
          if (
            userDb?.role === Role.SUPERADMIN ||
            userDb?.role === Role.LIBRARIAN
          ) {
            const result = await issueBook(
              params.id,
              userId,
              response.data?.id,
              Role.SUPERADMIN //less data to the function
            );
            if (result.success) {
              toast.success("Book Issued successfully");
              setReload(!reload);
              return;
            }
          } else {
            // save the response in a global variable
            toast.success(
              "Book requested, please wait for the admin for confirmation"
            );
            setReload(!reload);
            return;
          }
        } else {
          console.log(response?.error);
          toast.error("Something happened");
          setReload(!reload);
        }
      }
      // If the book is not paid just issue it
      console.log("Issuing the book...");
      toast(`Issuing the book with the id ${params.id}`);
      const result = await issueBook(params.id);
      if (result?.success) {
        toast.success("Book issued succesfully");
        setReload(!reload);
        window.location.reload();
      } else {
        toast.error(result.error);
        setReload(!reload);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something happened");
    } finally {
      setLoading(false);
    }
  };
  const handleReturnBook = async () => {
    console.log("Returning the book...");
    toast(`Returning the book with the id ${params.id}`);
    const result = await returnBook(params.id);
    if (result?.success) {
      toast.success("Book returned succesfully");
      window.location.reload();
    } else {
      toast.error(result.error);
      toast.error("Book coulnt be returned, something happpened");
    }
  };
  if (!bookInfo) {
    return null;
  }
  console.log(bookInfo);

  const createBookCopy = async () => {
    try {
      // TRADEOFF: CURRENT AND ACCURATE OR FASTER, FOR NOW THE FIRST
      const result = await addBookCopy(params.id);
      if (result.error) {
        console.log(result.error);
        toast.error("Error happened creating the copy");
        setReload(!true);
        return;
      }
      console.log(result.data);
      toast.success("Copy created");
      setReload(!reload);
    } catch (error) {
      console.log(error);
      toast.error(
        "Couldnt add the copy of the book, check the console for mor details"
      );
      setReload(!true);
    }
  };

  return (
    <div className="container mx-auto p-4 w-full">
      <div className="shadow-lg rounded-lg w-full flex flex-col lg:flex-row p-8 bg-white">
        <div className="flex-shrink-0">
          <Image
            width={200}
            height={300}
            alt={bookInfo?.title}
            src={bookInfo?.img ? bookInfo.img : "/default.webp"}
            className="rounded-lg"
          />
        </div>
        <div className="flex-grow mt-4 lg:mt-0 lg:ml-6">
          <h2 className="text-3xl font-bold capitalize">{bookInfo?.title}</h2>
          <p className="text-gray-600">Author: {bookInfo.author.author_name}</p>
          <div className="text-gray-600 my-2 flex-wrap flex items-center gap-1">
            Categories:{" "}
            {bookInfo?.categories && bookInfo.categories.length > 0 ? (
              bookInfo.categories.map((item, index) => {
                console.log(`your item is ${item.name}`);
                return (
                  <Badge
                    className="p-2 tracking-widest bg-gray-700"
                    key={index}
                  >
                    {item.name}{" "}
                  </Badge>
                );
              })
            ) : (
              <span>No categories available</span>
            )}
          </div>
          <p className="text-lg font-semibold text-green-600">
            Fine-Price: ${parseFloat(bookInfo.book_price).toFixed(2)}
          </p>
          {userId && (
            <Rating
              bookInfo={bookInfo}
              setReload={() => setReload(!reload)}
              userId={userId}
            />
          )}

          <p className="mt-2 text-gray-700">{bookInfo.description}</p>
          <p
            className={`mt-2 font-semibold ${
              issuedByUser == true || pendingRequest || bookInfo.stock <= 0
                ? "text-red-500"
                : "text-green-500"
            }`}
          >
            {
              //TODO: ADD CANCEL REQUEST, not needed for mvp

              issuedByUser
                ? "Status: Borrowed by you"
                : pendingRequest
                ? pendingRequest
                : bookInfo.stock <= 0
                ? "Status: Out of stock"
                : "Status: Avaible"
            }
          </p>
          <div className="flex items-center gap-4">
            {bookInfo.stock > 0 &&
              !pendingRequest &&
              !issuedByUser &&
              !loading && (
                <Confirmation
                  type={"STOCK"}
                  price={bookInfo.book_price}
                  handleBorrowBook={handleBorrowBook}
                />
              )}
            {issuedByUser && !loading && (
              <Confirmation
                type={BookLoanStatus.ISSUED}
                price={bookInfo.book_price}
                handleReturnBook={handleReturnBook}
              />
            )}
            {/* TOOD: CONFIRMATION OF COPYING THE BOOK */}
            {!loading &&
              (userRole === Role.LIBRARIAN || userRole === Role.SUPERADMIN) && (
                <Button
                  className="p-5 mt-3"
                  variant={"outline"}
                  onClick={createBookCopy}
                >
                  Add copy
                </Button>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleBookPage;
