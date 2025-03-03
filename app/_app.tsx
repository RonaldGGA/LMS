// pages/_app.tsx
import { useEffect } from "react";

import { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Auto-configurar NEXTAUTH_URL en runtime
    if (typeof window !== "undefined") {
      const dynamicAuthUrl = window.location.origin;
      if (process.env.NEXTAUTH_URL !== dynamicAuthUrl) {
        console.log("Dynamic NEXTAUTH_URL:", dynamicAuthUrl);
        // Forzar nueva configuración
        window.sessionStorage.setItem("dynamicAuthUrl", dynamicAuthUrl);
      }
    }
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;
