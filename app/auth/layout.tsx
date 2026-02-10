// import NextImprovements from "../components/next-improvements";
import { auth } from "@/auth";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import Image from "next/image";
import { ArchiveIcon, BookOpenIcon } from "lucide-react";
import DemoCredentialsFloater from "../components/demo-credentials";

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

  // const next = [
  //   "Improve code logic for a better developer understanding",
  //   "change the any line and actually implement a type",
  //   "Make this page a little more beautiful",
  //   "Improve Error total handling",
  // ];

  return (
    <div>
      <div className="bg-gradient-to-br min-h-screen ">
        <div className="  flex items-center justify-center p-4 relative overflow-hidden">
          <div className="w-full max-w-7xl bg-ivory-50 rounded-2xl shadow-library-xl border-2 border-antique-gold/20 overflow-hidden grid grid-cols-1 lg:grid-cols-2 relative z-10">
            <div className="bg-gradient-to-br from-library-dark to-library-midnight hidden lg:flex flex-col items-center justify-center p-12 relative">
              <div className="absolute top-1/4 left-1/2 w-48 h-48 bg-golden-amber/10 rounded-full filter blur-3xl transform -translate-x-1/2 -translate-y-1/2" />

              <div className="text-antique-gold text-center space-y-10 max-w-md relative z-10">
                <div className="space-y-6 bg-antique-white/5 p-8 rounded-xl border border-antique-gold/20 backdrop-blur-sm">
                  <BookOpenIcon className="h-12 w-12 mx-auto text-antique-gold/40" />
                  <blockquote className="text-2xl font-serif font-medium leading-relaxed italic text-antique-gold">
                    “Books are the quietest and most constant of friends; they
                    are the most accessible and wisest of counselors, and the
                    most patient of teachers”
                  </blockquote>
                  <div className="flex items-center justify-center space-x-3">
                    <div className="h-px w-16 bg-antique-gold/30" />
                    <p className="text-sm font-medium text-antique-gold/80">
                      Charles W. Eliot
                    </p>
                    <div className="h-px w-16 bg-antique-gold/30" />
                  </div>
                </div>

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

                  <div className="absolute bottom-4 left-4 bg-antique-gold/90 px-3 py-1 rounded-md text-xs font-medium text-library-dark flex items-center">
                    <ArchiveIcon className="h-4 w-4 mr-2" />
                    All books are physically available in our library
                  </div>
                </div>

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
                          {isOpen ? "Open now" : "Closed Now"}
                        </span>
                        <span className="text-antique-gold/60">
                          {isOpen
                            ? `Schedule: ${openingHour}:00 - ${closingHour}:00`
                            : `Open at ${openingHour}:00`}
                        </span>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

            <div className="p-8 sm:p-12 lg:p-16 bg-ivory-50 relative">
              <div className="space-y-10">{children}</div>
              <DemoCredentialsFloater />
            </div>
          </div>
        </div>
        {/* <div className="w-full items-center justify-start flex flex-col  ">
          <NextImprovements className=" space-y-6 bg-gray-200 ">
            <ul className="space-y-3">
              {next.map((item, i) => (
                <li key={i} className="flex items-center text-library-dark/90">
                  <div className="h-2 w-2 bg-antique-gold rounded-full mr-3" />
                  {item}
                </li>
              ))}
            </ul>
          </NextImprovements>
        </div> */}
      </div>
    </div>
  );
}
