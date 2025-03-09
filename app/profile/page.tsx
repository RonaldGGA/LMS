"use client";
import React, { useEffect, useState } from "react";
import { useUserSession } from "../hooks/useUserSession";
import { useRouter } from "next/navigation";
import { getUserForProfile } from "@/data/getUser";

import toast from "react-hot-toast";
import EditProfile from "./components/edit-profile";
import ShowProfile from "./components/show-profile";
// import NextImprovements from "../components/next-improvements";

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
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
      }
    };
    if (userId) {
      getUserDb(userId);
    }
  }, [userId, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[200px] bg-ivory-50 rounded-lg">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-golden-amber"></div>
      </div>
    );
  }

  if (!dbUserData) {
    return <>User not found</>;
  }
  // const next = [
  //   "Make this page prettier",
  //   "Show more information",
  //   "Implement better loading states ",
  // ];

  return (
    <div className="container w-full p-4">
      <div className="grid grid-cols-1 gap-4 flex-1">
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
            toggleEdit={() => setIsEditing(true)}
            username={dbUserData.username}
            DNI={dbUserData.dni}
            userImg={dbUserData.img}
          />
        )}
      </div>
      {/* <NextImprovements className={"mt-10 space-y-5"}>
        <ul className="space-y-2">
          {next.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </NextImprovements> */}
    </div>
  );
};

export default Profile;
