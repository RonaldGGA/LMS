import NextImprovements from "../components/next-improvements";
import { auth } from "@/auth";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import { CldImage } from "next-cloudinary";

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden grid grid-cols-1 lg:grid-cols-2 p-2">
        {/* Sección de Imagen */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 hidden lg:flex flex-col items-center justify-center p-12 relative">
          <div className="text-white text-center space-y-8 max-w-md">
            <div className="space-y-4">
              <blockquote className="text-2xl font-light leading-relaxed">
                “The only true wisdom is in knowing you know nothing”
              </blockquote>
              <p className="text-sm font-medium">- Socrates</p>
            </div>

            <div className="relative w-full aspect-square rounded-xl overflow-hidden border-4 border-white/20">
              <CldImage
                src="/login.jpg"
                alt="Library"
                fill
                className="object-cover"
                priority
                sizes={""}
              />
            </div>

            <div className="flex justify-center gap-6 text-sm font-medium">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 bg-green-400 rounded-full animate-pulse" />
                <span>Open: 8:00 AM</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 bg-red-400 rounded-full" />
                <span>Close: 8:00 PM</span>
              </div>
            </div>
          </div>
        </div>{" "}
        {/* Sección de Formulario */}
        <div className="p-8 sm:p-12 lg:p-16">
          {children}
          <NextImprovements className={"mt-10 space-y-5"}>
            <ul className="space-y-2">
              {next.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </NextImprovements>
        </div>
      </div>
    </div>
  );
}
