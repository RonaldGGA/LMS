"use client";
import React, { useEffect, useState } from "react";
import { useUserSession } from "../hooks/useUserSession";
import { useRouter } from "next/navigation";
import { getUserById } from "@/data/getUser";
import { User } from "@prisma/client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import toast from "react-hot-toast";
import { updateProfileSchema } from "@/zod-schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import ConfirmPassword from "../components/confirm-password";
import { updateProfile } from "@/actions/update-profile";

const Profile = () => {
  const userId = useUserSession();
  const [dbUserData, setDbUserData] = useState<User | null>(null);
  const router = useRouter();
  const [isDirty, setIsDirty] = useState(false);
  const [passwordCorrect, setPasswordCorrect] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Fetch user data from the database
    const getUserDb = async (userId: string | undefined) => {
      try {
        const dbUser = await getUserById(userId);
        if (!dbUser) {
          toast.error("User not found"); // Inform user about the issue
          router.push("/auth/login"); // Redirect to login
          return null;
        }
        setDbUserData(dbUser);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch user data.");
      }
    };
    if (!userId) {
      router.push("/auth/login");
    } else {
      getUserDb(userId);
    }
  }, [userId, router]);

  // Create the form state with default values from the database
  const form = useForm({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      username: dbUserData?.username || "",
      DNI: dbUserData?.DNI || "",
      password: "",
    },
  });

  useEffect(() => {
    // Reset the form when user data is fetched
    if (dbUserData) {
      form.reset({
        username: dbUserData.username,
        DNI: dbUserData.DNI,
        password: "",
      });
    }
  }, [dbUserData, form]);

  useEffect(() => {
    const subscription = form.watch((values) => {
      setIsDirty(
        values.username !== dbUserData?.username ||
          values.DNI !== dbUserData?.DNI ||
          !!values.password
      );
    });

    return () => subscription.unsubscribe();
  }, [form, dbUserData]);

  const toggleEdit = () => {
    setIsEditing((prevEditing) => !prevEditing);
    if (isEditing) {
      reset();
    }
  };

  const onSubmit = async (values: {
    username: string;
    DNI: string;
    password?: string | undefined;
  }) => {
    toast("Submitting...");

    if (!passwordCorrect && values.password) {
      toast.error("Please confirm your old password before changing it");
      return;
    }

    try {
      const result = updateProfileSchema.safeParse(values);
      if (!result.success) {
        toast.error("Validation failed");
        return;
      }

      const updateResult = await updateProfile(values);
      if (!updateResult.success) {
        toast.error("Error updating profile");
      } else {
        toast.success("User information updated successfully");
        setIsEditing(false);
        setIsDirty(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong during update.");
    }
  };

  const reset = () => {
    form.reset({
      username: dbUserData?.username || "",
      DNI: dbUserData?.DNI || "",
      password: "",
    });
    setIsDirty(false);
    setIsEditing(false);
  };

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
              <Form {...form}>
                <form
                  id="profileCredentials"
                  onSubmit={form.handleSubmit(onSubmit)}
                >
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your username" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="DNI"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>DNI</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your DNI" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex items-end gap-2">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="********"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <ConfirmPassword
                      setPasswordCorrect={setPasswordCorrect}
                      dbPassword={dbUserData?.password}
                      passwordCorrect={passwordCorrect}
                    />
                  </div>
                  <div>
                    <Button
                      variant="outline"
                      className="mr-2"
                      type="button"
                      onClick={reset}
                    >
                      Cancel
                    </Button>
                    <Button
                      form="profileCredentials"
                      disabled={!isDirty}
                      type="submit"
                      className="lg:max-w-[100px] w-[100px] mr-auto mt-7"
                    >
                      Save
                    </Button>
                  </div>
                </form>
              </Form>
            ) : (
              <div className="flex flex-col gap-2">
                <p>
                  <strong>Username:</strong> {dbUserData?.username}
                </p>
                <p>
                  <strong>DNI:</strong> {dbUserData?.DNI}
                </p>
                <p>
                  <strong>Active since:</strong>
                  {dbUserData?.createdAt
                    ? format(new Date(dbUserData.createdAt), "PPP")
                    : "Loading..."}
                </p>
                <Button
                  onClick={toggleEdit}
                  type="button"
                  className="lg:max-w-[100px] w-[100px] mr-auto mt-7"
                >
                  {isEditing ? "Cancel" : "Edit"}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </div>
  );
};

export default Profile;
