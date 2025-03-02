"use client";

import { rejectIssueRequest } from "@/actions/reject-issue-request";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getPendingLoanRequests } from "@/data/getNotifications";
import { issueBook } from "@/actions/issue-book";
import { BigRequest } from "@/types";
import AdminNotification from "../components/admin-notification";
import { AdminNotificationSkeleton } from "../components/admin-notification-skeletion";

const NotificationsPage = () => {
  //add the type
  const [notifications, setNotifications] = useState<BigRequest[] | null>([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    try {
      const getNotifications = async () => {
        setPageLoading(true);

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
    } catch (error) {
      console.log(error);
    } finally {
      setPageLoading(false);
    }
  }, []);
  console.log(notifications);

  const handleAccept = async (
    requestId: string,
    bookId: string,
    userId: string
  ) => {
    try {
      setLoading(true);
      const acceptResult = await issueBook(bookId, userId, requestId);
      if (acceptResult?.error) {
        toast.error("something wrong happened");
      } else {
        toast.success("accepted request");
        const filtered = notifications?.filter((item) => item.id !== requestId);
        setNotifications(filtered || []);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const handleReject = async (requestId: string) => {
    try {
      setLoading(true);
      const rejectResult = await rejectIssueRequest(
        requestId,
        "No payment validated"
      );
      if (rejectResult.error) {
        toast.error("something happended");
        return;
      } else {
        toast("declined request");
        const filtered = notifications?.filter((item) => item.id !== requestId);
        setNotifications(filtered || []);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {[...Array(6)].map((_, i) => (
          <AdminNotificationSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4 text-slate-800">
        Pending Requests
      </h1>

      {notifications?.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notifications.map((item) => (
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
              disabled={loading}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <div className="text-center space-y-2 text-slate-500">
            <p className="text-xl">No pending requests</p>
            <p className="text-sm">All requests are up to date</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
