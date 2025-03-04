const DEFAULT_LOGIN_REDIRECT = "/";
const authRoutes = [
  "/auth/login",
  "/auth/register",
  "/auth/error",
  "/auth/reset-password",
];
const publicRoutes = [
  "/terms",
  "/conditions",
  "privacity",
  "/landing",
  "/error",
];
const apiAuthPrefix = "/api/auth";

const adminRoutes = ["/dashboard"];

export {
  DEFAULT_LOGIN_REDIRECT,
  adminRoutes,
  authRoutes,
  publicRoutes,
  apiAuthPrefix,
};
