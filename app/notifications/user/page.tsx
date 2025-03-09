"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useUserSession } from "../../hooks/useUserSession";
import { getUserPendingNotifications } from "@/data/getNotifications";
import { readNotification } from "@/actions/read-notification";
import UserNotification from "../components/user-notification";
import { UserNotificationSkeleton } from "../components/user-notification-skeleton";
// import NextImprovements from "@/app/components/next-improvements";

export type UserPendingNotification = {
  id: string;
  message: string;
  createdAt: Date;
};

const NotificationsPage = () => {
  //add the type
  const [notifications, setNotifications] = useState<UserPendingNotification[]>(
    []
  );
  const [pageLoading, setPageLoading] = useState(true);

  const session = useUserSession();

  useEffect(() => {
    const getNotifications = async () => {
      try {
        if (session?.id) {
          const notificationsResponse = await getUserPendingNotifications(
            session?.id
          );
          if (notificationsResponse.success) {
            setNotifications(notificationsResponse.data || []);
          }
        }
      } catch (error) {
        console.log(error);
      } finally {
        setPageLoading(false);
      }
    };
    getNotifications();
  }, [session?.id]);
  console.log(notifications);

  const markRead = async (notificationId: string) => {
    const response = await readNotification(notificationId);
    if (response.error || !response.success) {
      console.log(response.error);
      toast.error(response.error);
      return;
    }
    toast.success("Read");
    setNotifications(
      notifications.filter((item) => item.id !== notificationId)
    );
  };

  // const next = [
  //   "Implement better loading states",
  //   "Implement an infinite notifications scroll",
  //   "Make this more real-time with no reload needed",
  //   "Make the logic for the red button in the bell in the correct way",
  //   "Implement real-time notifications, when a user is logged in and a book is accepted, he will get the notification in the page instantly",
  //   "Combine in-page notifications with gmail",
  // ];

  if (pageLoading) {
    return (
      <div className="space-y-3 w-full">
        <UserNotificationSkeleton />
        <UserNotificationSkeleton />
        <UserNotificationSkeleton />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 items-center ">
      {notifications && notifications.length > 0
        ? notifications.map((item) => (
            <UserNotification
              key={item.id}
              message={item.message}
              createdAt={item.createdAt}
              markRead={() => markRead(item.id)}
            />
          ))
        : !pageLoading && (
            <div className="text-lg text-gray-600 mx-auto mt-5">
              No Notifications to see ...
            </div>
          )}
      {/* <NextImprovements className={"mt-10 space-y-5"}>
        <ul className="space-y-2">
          {next.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </NextImprovements> */}
    </div>
  );
};

export default NotificationsPage;
