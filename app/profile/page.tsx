"use client";
import React, { useEffect, useState } from "react";
import { useUserSession } from "../hooks/useUserSession";
import { useRouter } from "next/navigation";
import { getUserForProfile } from "@/data/getUser";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

import toast from "react-hot-toast";
import EditProfile from "./components/edit-profile";
import ShowProfile from "./components/show-profile";

export type UserProfile = {
  username: string;
  dni: string;
  password: string;
  createdAt: Date;
  img: string | null;
};

const Profile = () => {
  const userId = useUserSession()?.id;
  const [dbUserData, setDbUserData] = useState<UserProfile | null>(null);
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Fetch user data from the database
    const getUserDb = async (userId: string) => {
      try {
        const dbUser = await getUserForProfile(userId);
        if (!dbUser || (dbUser?.success && dbUser?.error)) {
          toast.error("User not found"); // Inform user about the issue
          router.push("/auth/login"); // Redirect to login
          return;
        }
        if (!dbUser?.data) {
          toast.error("No data from the user"); // Inform user about the issue
        }
        setDbUserData(dbUser.data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch user data.");
      }
    };
    if (userId) {
      getUserDb(userId);
    }
  }, [userId, router]);

  if (!dbUserData) {
    return <>User not found</>;
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold">
            {isEditing ? "Edit Profile" : "Profile Information"}
          </h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4">
            {isEditing ? (
              <EditProfile
                username={dbUserData.username}
                DNI={dbUserData.dni}
                profileImg={dbUserData.img}
                oldPassword={dbUserData.password}
                toggleEdit={() => setIsEditing(false)}
              />
            ) : (
              <ShowProfile
                toogleEdit={() => setIsEditing(true)}
                isEditing={isEditing}
                username={dbUserData.username}
                createdAt={dbUserData.createdAt}
                DNI={dbUserData.dni}
              />
            )}
          </div>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </div>
  );
};

export default Profile;
