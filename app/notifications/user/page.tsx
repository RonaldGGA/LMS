"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useUserSession } from "../../hooks/useUserSession";
import { getUserPendingNotifications } from "@/data/getNotifications";
import UserNotification from "./components/user-notification";
import { readNotification } from "@/actions/read-notification";

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
  const [change, setChange] = useState(false);

  const session = useUserSession();

  useEffect(() => {
    const getNotifications = async () => {
      if (session?.id) {
        const notificationsResponse = await getUserPendingNotifications(
          session?.id
        );
        if (notificationsResponse.success) {
          setNotifications(notificationsResponse.data || []);
        }
      }
    };
    getNotifications();
  }, [change, session?.id]);
  console.log(notifications);

  const markRead = async (notificationId: string) => {
    const response = await readNotification(notificationId);
    if (response.error || !response.success) {
      console.log(response.error);
      toast.error(response.error);
      return;
    }
    toast.success("Read");
    setChange(!change);
  };

  return (
    <div className="flex flex-col flex-gap-2 items-center ">
      {notifications && notifications.length > 0 ? (
        notifications.map((item) => (
          <UserNotification
            key={item.id}
            message={item.message}
            createdAt={item.createdAt}
            markRead={() => markRead(item.id)}
          />
        ))
      ) : (
        <div className="text-lg text-gray-600 mx-auto mt-5">
          No Notifications to see ...
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
