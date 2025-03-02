"use server";

import { registerUser } from "@/actions/auth-user";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// Get users
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query") || "";
  try {
    const users = await prisma.userAccount.findMany({
      where: {
        OR: [
          { username: { contains: query, mode: "insensitive" } },
          { id: { contains: query, mode: "insensitive" } },
        ],
      },
      take: 15,
      include: {
        _count: {
          select: {
            bookLoans: true,
            bookLoanRequests: true,
          },
        },
      },
    });
    console.log(users);
    return NextResponse.json(users);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

// CREATE USER
export async function POST(req: Request) {
  let body;
  try {
    body = await req.json();
  } catch (error) {
    console.error("Invalid JSON:", error);
    return new NextResponse("Invalid JSON", { status: 400 });
  }

  try {
    const { username, password, dni, role } = body;

    const response = await registerUser({ username, password, dni, role });
    if (!response.success) {
      console.error("registerUser error:", response.error); // Use console.error for errors
      return NextResponse.json(
        { error: response.error || "Failed to create user" },
        { status: 400 }
      ); // Send specific error
    }
    console.log("registerUser success:", response.data); // Log success data (remove in prod)
    return NextResponse.json(response.data, { status: 201 }); //  return only data and status 201
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
