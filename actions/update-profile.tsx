"use server";

import { auth } from "@/auth";
import { getUserById } from "@/data/getUser";
import db from "@/lib/prisma";
import { createErrorResponse, hashPassword } from "@/lib/utils";
import bcrypt from "bcryptjs";

interface updateProfileProps {
  username: string;
  DNI: string;
  newPassword?: string;
  oldPassword?: string;
  profileImg?: string | null;
}

export const updateProfile = async (values: updateProfileProps) => {
  try {
    const { username, DNI, profileImg, newPassword, oldPassword } = values;
    //get the userID
    const session = await auth();
    if (!session?.user?.id) {
      return createErrorResponse("User unreachable");
    }

    // TODO: improve validate inputs
    if (
      username &&
      DNI &&
      DNI !== null &&
      (username.length < 2 || DNI.length < 11)
    ) {
      return createErrorResponse("Invalid username or DNI");
    }

    let hashedPassword;

    if (!newPassword && oldPassword) {
      return createErrorResponse(
        "You just need your old password if you are going to change your new password"
      );
    }

    if (newPassword) {
      if (!oldPassword) {
        return createErrorResponse(
          "You need to provide the old password if you are setting a new one"
        );
      } else {
        //check last password
        const user = await getUserById(session.user.id);
        if (!user) {
          return createErrorResponse("Error getting the user");
        }
        const result = await bcrypt.compare(oldPassword, user.password);
        if (!result) {
          return createErrorResponse(
            "Your old password is incorrect, please provide the last password you used for your account"
          );
        }
        if (newPassword.length < 7) {
          return createErrorResponse(
            "Your password must be larger, 7 characters minimun"
          );
        }
        hashedPassword = await hashPassword(newPassword);
      }
    }

    // TODO: really check all the inputs

    // update the user info
    const user = await db.userAccount.update({
      where: {
        id: session.user.id,
      },
      data: {
        username,
        dni: DNI ? DNI : undefined,
        img: profileImg ? profileImg : null,
        password: hashedPassword ? hashedPassword : undefined,
      },
    });
    if (!user) {
      createErrorResponse("Error updating the user");
    }
    console.log(user);
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
