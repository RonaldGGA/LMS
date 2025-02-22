"use client";

import { rejectIssueRequest } from "@/actions/reject-issue-request";
import { BookLoanRequestStatus, Role } from "@prisma/client";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useUserSession } from "../../hooks/useUserSession";
import { getPendingLoanRequests } from "@/data/getNotifications";
import { issueBook } from "@/actions/issue-book";
import { BigRequest } from "@/types";

const NotificationsPage = () => {
  //add the type
  const [notifications, setNotifications] = useState<BigRequest[] | null>([]);
  const [change, setChange] = useState(false);

  const session = useUserSession();

  const role = session?.role;

  useEffect(() => {
    const getNotifications = async () => {
      const notificationsResponse = await getPendingLoanRequests();
      if (notificationsResponse.success) {
        setNotifications(
          notificationsResponse.data && notificationsResponse.data.length > 0
            ? notificationsResponse.data
            : []
        );
      }
    };
    getNotifications();
  }, [change]);
  console.log(notifications);

  const handleAccept = async (
    requestId: string,
    bookId: string,
    userId: string
  ) => {
    const acceptResult = await issueBook(bookId, true, userId, requestId);
    if (acceptResult?.error) {
      toast.error("something wrong happened");
    } else {
      toast.success("accepted request");
      setChange((prev) => !prev);
    }
  };
  const handleReject = async (issueId: string) => {
    const rejectResult = await rejectIssueRequest(
      issueId,
      "No payment validated"
    );
    if (rejectResult.error) {
      toast.error("something happended");
      return;
    } else {
      toast("declined request");
      setChange((prev) => !prev);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 ">
      {notifications && notifications.length > 0 ? (
        notifications?.map((item) => {
          if (
            item.status === BookLoanRequestStatus.PENDING &&
            (role == Role.SUPERADMIN || role == Role.LIBRARIAN)
          ) {
            return (
              <div
                key={item.id}
                className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-200 ease-in-out transform hover:translate-y-[-2px] w-[400px] mx-auto"
              >
                <div className="flex justify-between items-start mb-6 flex-col">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {item.bookCopy.bookTitle.title}
                    </h3>
                    <p className="text-gray-600">
                      Price: ${item.bookCopy.bookTitle.book_price}
                    </p>
                  </div>
                  <div className="">
                    <p className="text-sm text-gray-500">
                      Request From: {item.userId}
                    </p>
                    <p className="text-sm text-gray-500">
                      Request Date:{" "}
                      {new Date(item.requestDate).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      Request of <b>Borrowing a Book</b>
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() =>
                      handleAccept(
                        item.id,
                        item.bookCopy.bookTitle.id,
                        item.userId
                      )
                    }
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md flex items-center justify-center gap-2 transition-colors duration-200"
                  >
                    <span className="text-xl">✅</span>
                    Verify
                  </button>
                  <button
                    onClick={() => handleReject(item.id)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md flex items-center justify-center gap-2 transition-colors duration-200"
                  >
                    <span className="text-xl">❌</span>
                    Decline
                  </button>
                </div>
              </div>
            );
          } else {
            return (
              <div
                key={item.id}
                className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-200 ease-in-out transform hover:translate-y-[-2px] w-[400px] mx-auto"
              >
                <div className="flex justify-between items-start mb-6 flex-col">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {item.bookCopy.bookTitle.title}
                    </h3>
                    <p className="text-gray-600">
                      Price: ${item.bookCopy.bookTitle.book_price}
                    </p>
                  </div>
                  <div className="">
                    <p className="text-sm text-gray-500">
                      Request Date:{" "}
                      {new Date(item.requestDate).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      Request of <b>Borrowing a Book</b>
                    </p>
                  </div>
                </div>
                <p className="text-lg font-bold p-3 border m-1">
                  RESULT:{item.status}
                </p>
                <p className="text-lg font-bold p-3 border m-1">
                  REASON:{item.description ? item.description : "Not provided"}
                </p>
              </div>
            );
          }
        })
      ) : (
        <>No Pending notifications...</>
      )}
    </div>
  );
};

export default NotificationsPage;
