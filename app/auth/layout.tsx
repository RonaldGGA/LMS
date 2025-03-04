import NextImprovements from "../components/next-improvements";
import { auth } from "@/auth";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import Image from "next/image";
import { ArchiveIcon, BookOpenIcon } from "lucide-react";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  const user = session?.user;

  // Redirección server-side
  if (user?.role) {
    redirect(user.role === Role.MEMBER ? "/" : "/dashboard");
  }

  const next = [
    "Improve code logic for a better developer understanding",
    "change the any line and actually implement a type",
    "Make this page a little more beautiful",
    "Improve Error total handling",
  ];

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-vintage-blue-900 to-antique-white flex items-center justify-center p-4 relative overflow-hidden">
        {/* Efecto de profundidad con estantes */}

        {/* Contenedor principal */}
        <div className="w-full max-w-7xl bg-ivory-50 rounded-2xl shadow-library-xl border-2 border-antique-gold/20 overflow-hidden grid grid-cols-1 lg:grid-cols-2 relative z-10">
          {/* Sección de Imagen - Lado Izquierdo */}
          <div className="bg-gradient-to-br from-library-dark to-library-midnight hidden lg:flex flex-col items-center justify-center p-12 relative">
            {/* Efecto de iluminación de lámpara */}
            <div className="absolute top-1/4 left-1/2 w-48 h-48 bg-golden-amber/10 rounded-full filter blur-3xl transform -translate-x-1/2 -translate-y-1/2" />

            <div className="text-antique-gold text-center space-y-10 max-w-md relative z-10">
              {/* Citación con efecto de libro abierto */}
              <div className="space-y-6 bg-antique-white/5 p-8 rounded-xl border border-antique-gold/20 backdrop-blur-sm">
                <BookOpenIcon className="h-12 w-12 mx-auto text-antique-gold/40" />
                <blockquote className="text-2xl font-serif font-medium leading-relaxed italic text-antique-gold">
                  “Libros: naves que surcan los mares del tiempo”
                </blockquote>
                <div className="flex items-center justify-center space-x-3">
                  <div className="h-px w-16 bg-antique-gold/30" />
                  <p className="text-sm font-medium text-antique-gold/80">
                    Francis Bacon
                  </p>
                  <div className="h-px w-16 bg-antique-gold/30" />
                </div>
              </div>

              {/* Imagen con marco de estante */}
              <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden border-4 border-antique-gold/20 shadow-library-inner">
                <div className="absolute inset-0 bg-library-dark/50" />
                <Image
                  src="/login.webp"
                  alt="Biblioteca Histórica"
                  fill
                  className="object-cover grayscale-[20%]"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                {/* Etiqueta vintage */}
                <div className="absolute bottom-4 left-4 bg-antique-gold/90 px-3 py-1 rounded-md text-xs font-medium text-library-dark flex items-center">
                  <ArchiveIcon className="h-4 w-4 mr-2" />
                  Colección Digitalizada 2024
                </div>
              </div>

              {/* Indicadores de estado con diseño de fichas de biblioteca */}
              {(() => {
                const currentHour = new Date().getHours();
                const openingHour = 8; // 8:00 AM
                const closingHour = 20; // 8:00 PM
                const isOpen =
                  currentHour >= openingHour && currentHour < closingHour;

                return (
                  <div className="flex justify-center gap-8 text-sm font-medium">
                    <div className="bg-library-dark/80 p-3 rounded-lg border border-antique-gold/30 flex items-center gap-2 shadow-md">
                      <div
                        className={`h-3 w-3 rounded-full animate-pulse ${
                          isOpen
                            ? "bg-emerald-400 shadow-glow-green"
                            : "bg-red-400 shadow-glow-red"
                        }`}
                      />
                      <span className="text-antique-gold/90">
                        {isOpen ? "Abierto ahora" : "Cerrado ahora"}
                      </span>
                      <span className="text-antique-gold/60">
                        {isOpen
                          ? `Horario: ${openingHour}:00 - ${closingHour}:00`
                          : `Abre a las ${openingHour}:00`}
                      </span>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Sección de Formulario - Lado Derecho */}
          <div className="p-8 sm:p-12 lg:p-16 bg-ivory-50 relative">
            {/* Detalle decorativo superior */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-library-dark via-antique-gold to-library-dark" />

            {/* Logo y encabezado */}
            {/* <div className="mb-12 text-center space-y-4">
            <div className="inline-block p-4 rounded-2xl bg-library-dark/5">
              <LibraryIcon className="h-16 w-16 text-library-dark mx-auto" />
            </div>
            <h1 className="text-4xl font-serif font-bold text-library-dark">
              The Alexandria Archive
            </h1>
            <p className="text-library-dark/80 font-medium">
              Gateway to Digital Wisdom
            </p>
          </div> */}

            {/* Contenido principal */}
            <div className="space-y-10">
              {children}

              {/* Mejoras visuales para la lista */}
            </div>
          </div>
        </div>
      </div>
      <div className="w-full items-center justify-start flex flex-col">
        <NextImprovements className="mt-10 space-y-6  ">
          <ul className="space-y-3">
            {next.map((item, i) => (
              <li key={i} className="flex items-center text-library-dark/90">
                <div className="h-2 w-2 bg-antique-gold rounded-full mr-3" />
                {item}
              </li>
            ))}
          </ul>
        </NextImprovements>
      </div>
    </>
  );
}
