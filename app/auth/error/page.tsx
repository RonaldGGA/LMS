"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function ErrorPage() {
  const params = useSearchParams();
  const errorCode = params.get("error");

  useEffect(() => {
    if (errorCode) {
      console.error(`Auth Error: ${errorCode}`);
      // Opcional: Enviar error a servicio de monitoreo
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
