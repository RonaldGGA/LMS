import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await prisma.userAccount.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        role: true,
      },
    });

    if (
      !user ||
      (user.role !== Role.LIBRARIAN && user.role !== Role.SUPERADMIN)
    ) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const [stats, recentLoans] = await Promise.all([
      {
        totalBooks: await prisma.bookTitle.count(),

        activeLoans: await prisma.bookLoan.count({
          where: { status: "ISSUED" },
        }),

        pendingRequests: await prisma.bookLoanRequest.count({
          where: { status: "PENDING" },
        }),
        totalDeposits: await prisma.bookSecurityDeposit
          .findMany({
            select: {
              amount: true,
            },
          })
          .then((deposits) => {
            if (!deposits || deposits.length === 0) {
              return 0;
            }
            return deposits.reduce((total, deposit) => {
              const amount = Number(deposit.amount);
              return total + amount;
            }, 0);
          }),
      },

      prisma.bookLoan.findMany({
        where: { status: "ISSUED" },
        select: {
          id: true,
          user: {
            select: {
              id: true,
              username: true,
            },
          },
          bookCopy: {
            select: {
              bookTitle: {
                select: {
                  title: true,
                },
              },
            },
          },
          loanDate: true,
        },
        orderBy: { loanDate: "desc" },
        take: 5,
      }),
    ]);
    return Response.json({
      stats,
      recentLoans,
    });
  } catch (error) {
    console.log("Error in dashboard route: " + error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
