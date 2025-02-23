"use client";

import { rejectIssueRequest } from "@/actions/reject-issue-request";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getPendingLoanRequests } from "@/data/getNotifications";
import { issueBook } from "@/actions/issue-book";
import { BigRequest } from "@/types";
import AdminNotification from "../components/admin-notification";

const NotificationsPage = () => {
  //add the type
  const [notifications, setNotifications] = useState<BigRequest[] | null>([]);
  const [change, setChange] = useState(false);

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
    const acceptResult = await issueBook(bookId, userId, requestId);
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
        notifications.map((item) => (
          <AdminNotification
            key={item.id}
            title={item.bookCopy.bookTitle.title}
            price={item.bookCopy.bookTitle.book_price}
            requestDate={item.requestDate}
            userId={item.userId}
            handleAccept={() =>
              handleAccept(item.id, item.bookCopy.bookTitle.id, item.userId)
            }
            handleReject={() => handleReject(item.id)}
          />
        ))
      ) : (
        <div>No Pending notifications...</div>
      )}
    </div>
  );
};

export default NotificationsPage;
