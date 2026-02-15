import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  const {
    username = "",
    password = "",
    dni = "",
    role = Role.MEMBER,
    img = "",
  } = await req.json();

  try {
    const data: {
      username?: string;
      password?: string;
      dni?: string;
      role?: Role;
      img?: string;
    } = {};

    if (username) data.username = username;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      data.password = hashedPassword;
    }
    if (dni) data.dni = dni;
    if (role !== Role.MEMBER || Object.keys(data).length === 0) {
      data.role = role;
    }
    if (img) data.img = img;

    const user = await prisma.userAccount.update({
      where: { id: params.id },
      data,
    });

    if (!user) {
      throw new Error("Error updating the user");
    }

    const safeUser = {
      ...user,
      password: undefined,
    };

    return NextResponse.json(safeUser);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    await prisma.userAccount.delete({
      where: { id: params.id },
    });

    return NextResponse.json(null, { status: 204 });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
