"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useUserSession } from "../../hooks/useUserSession";
import { getUserPendingNotifications } from "@/data/getNotifications";
import { readNotification } from "@/actions/read-notification";
import UserNotification from "../components/user-notification";
import { UserNotificationSkeleton } from "../components/user-notification-skeleton";

export type UserPendingNotification = {
  id: string;
  message: string;
  createdAt: Date;
};

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<UserPendingNotification[]>(
    [],
  );
  const [pageLoading, setPageLoading] = useState(true);

  const session = useUserSession();

  useEffect(() => {
    const getNotifications = async () => {
      try {
        if (session?.id) {
          const notificationsResponse = await getUserPendingNotifications(
            session?.id,
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
      notifications.filter((item) => item.id !== notificationId),
    );
  };

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
    </div>
  );
};

export default NotificationsPage;
