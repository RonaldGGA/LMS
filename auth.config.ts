import Credentials from "next-auth/providers/credentials";

import { loginUser } from "./actions/auth-user";
import { CredentialsSignin } from "next-auth";

const authConfig = {
  providers: [
    Credentials({
      async authorize(credentials) {
        try {
          if (!credentials?.username || !credentials?.password) {
            return new CredentialsSignin("Username and password are required");
          }

          const result = await loginUser({
            username: credentials.username as string,
            password: credentials.password as string,
          });

          if (!result.success) {
            if (result.error) {
              // Handle specific error cases if available
              switch (result.error) {
                case "User not found":
                  return new CredentialsSignin(
                    "User not found. Please check your username."
                  );
                case "Invalid password":
                  return new CredentialsSignin("Invalid password.");
                case "Account locked":
                  return new CredentialsSignin(
                    "Your account is temporarily locked."
                  );
                default:
                  return new CredentialsSignin(
                    result.error || "Sign in failed"
                  );
              }
            }
            return new CredentialsSignin("Sign in failed");
          }
          if (result.data) {
            return result.data;
          }

          return new CredentialsSignin("No user data received");
        } catch (error) {
          console.error("Credentials authorization error:", error);
          return new CredentialsSignin(
            "An unexpected error occurred during sign in"
          );
        }
      },
    }),
  ],
};
export default authConfig;
