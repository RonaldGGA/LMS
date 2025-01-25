"use server";

import { auth } from "@/auth";
import db from "@/lib/prisma";
import { createErrorResponse, hashPassword } from "@/lib/utils";

interface updateProfileProps {
  username: string;
  password?: string | undefined;
  DNI: string;
}

export const updateProfile = async (values: updateProfileProps) => {
  try {
    //get the userID
    const session = await auth();
    if (!session?.user?.id) {
      return createErrorResponse("User unreachable");
    }

    // validate inputs
    if (values.username.length < 2 || values.DNI.length < 11) {
      return createErrorResponse("Invalid username or DNI");
    }
    // hash the new password, if there is a new password
    let hashedPassword = undefined;
    if (values?.password && values.password?.length > 7) {
      hashedPassword = await hashPassword(values.password); // Hash the new password
    }
    // update the user info
    const user = await db.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        username: values.username,
        DNI: values.DNI,
        password: hashedPassword ? hashedPassword : undefined,
      },
    });
    return {
      success: true,
      error: null,
      data: user,
    };
  } catch (error) {
    console.log(error);
    return createErrorResponse("Something happened in the server");
  }
};
