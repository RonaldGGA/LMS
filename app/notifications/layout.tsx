import React from "react";
import AuthGuard from "../components/auth-guard";

const NotificationsLayout = ({ children }: { children: React.ReactNode }) => {
  return <AuthGuard>{children}</AuthGuard>;
};

export default NotificationsLayout;
