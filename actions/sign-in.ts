"use server";

import { signIn } from "@/auth";
import { loginSchema } from "@/zod-schemas";
import { AuthError } from "next-auth";
import { redirect } from "next/dist/server/api-utils";

type SignInData = {
  username: string;
  password: string;
};

export async function authenticate(
  prevState: string | undefined,
  formData: SignInData
) {
  try {
    // This is a backend check of the credentials, it is checked before in the frontend
    const response = loginSchema.safeParse(formData);
    if (!response.success && response.error) {
      throw new Error(response.error.message);
    }
    await signIn("credentials", {
      ...formData,
    });
    return undefined;
  } catch (error) {
    if (error instanceof AuthError) {
      console.log(error.message);
      switch (error.type) {
        case "AdapterError":
          return "Database connection issue. Please try again later.";

        case "AccessDenied":
          return "You don't have permission to access this resource. Contact your administrator.";

        case "CallbackRouteError":
          return "Authentication process failed. Invalid Credentials";

        case "ErrorPageLoop":
          return "Configuration error detected. Our team has been notified.";

        case "EventError":
          return "Server error during authentication process. Contact support if it persists.";

        case "InvalidCallbackUrl":
          return "Security verification failed. Please check the URL and try again.";

        case "CredentialsSignin":
          return "Invalid username or password. Please check your credentials.";

        case "InvalidEndpoints":
          return "Authentication provider misconfigured. Contact system administrator.";

        case "InvalidCheck":
          return "Security check failed. Enable cookies and try again.";

        case "JWTSessionError":
          return "Session expired. Please sign in again.";

        case "MissingAdapter":
        case "MissingAdapterMethods":
          return "System configuration error. Contact technical support.";

        case "MissingAuthorize":
          return "Authentication method not configured properly.";

        case "MissingSecret":
          return "Server security configuration issue. Contact administrator.";

        case "OAuthAccountNotLinked":
          return "This account isn't linked. Sign in with your original method.";

        case "OAuthCallbackError":
          return "Authentication provider error. Try another sign-in method.";

        case "OAuthProfileParseError":
          return "Couldn't retrieve profile information. Try again later.";

        case "SessionTokenError":
          return "Session verification failed. Please log in again.";

        case "OAuthSignInError":
          return "Error connecting to authentication provider. Try again.";

        case "EmailSignInError":
          return "Email verification failed. Check your inbox or try again.";

        case "SignOutError":
          return "Logout unsuccessful. Please try again.";

        case "UnknownAction":
          return "Invalid request type. Refresh the page and try again.";

        case "UnsupportedStrategy":
          return "Authentication method not supported. Contact support.";

        case "InvalidProvider":
          return "Invalid authentication provider selected.";

        case "UntrustedHost":
          return "Security verification failed. Try from original website.";

        case "Verification":
          return "Invalid or expired verification code. Request a new one.";

        case "MissingCSRF":
          return "Security check failed. Refresh the page and try again.";

        case "DuplicateConditionalUI":
          return "Multiple authentication methods conflict. Contact support.";

        case "MissingWebAuthnAutocomplete":
          return "Browser security feature missing. Update your browser.";

        case "WebAuthnVerificationError":
          return "Biometric verification failed. Try another method.";

        case "AccountNotLinked":
          return "Account not associated. Use your original sign-in method.";

        case "ExperimentalFeatureNotEnabled":
          return "Feature unavailable. Check settings or contact support.";

        default:
          return "An unexpected error occurred. Please try again later.";
      }
    }

    throw error;
  }
}
