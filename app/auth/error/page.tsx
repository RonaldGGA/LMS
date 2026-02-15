"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function AuthErrorPage() {
  const params = useSearchParams();
  const errorCode = params.get("error");

  useEffect(() => {
    if (errorCode) {
      console.error(`Auth Error: ${errorCode}`);
    }
  }, [errorCode]);

  return (
    <div className="error-container">
      <h1>Error de Autenticación</h1>
      <p>Código: {errorCode || "DESCONOCIDO"}</p>
      <a href="/auth/login">Volver al login</a>
    </div>
  );
}
