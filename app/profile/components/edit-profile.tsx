import { updateProfileSchema } from "@/zod-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

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
import Image from "next/image";
import toast from "react-hot-toast";
import { updateProfile } from "@/actions/update-profile";
import { debounce } from "lodash-es";
import { Pencil, X } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ImageUpload } from "@/app/components/image-upload";

interface EditProfileProps {
  username: string;
  DNI: string;
  profileImg: string | null;
  oldPassword: string;
  toggleEdit: () => void;
}
export interface FormValues {
  username: string;
  DNI: string;
  profileImg: string | null;
  oldPassword: string | undefined;
  newPassword: string | undefined;
}
const EditProfile: React.FC<EditProfileProps> = ({
  username,
  DNI,
  profileImg,
  oldPassword,
  toggleEdit,
}) => {
  const [isDirty, setIsDirty] = useState(false);

  const defaultFormValues: FormValues = useMemo(
    () => ({
      username: username,
      DNI: DNI,
      profileImg: profileImg || null,
      oldPassword: undefined,
      newPassword: undefined,
    }),
    [DNI, profileImg, username]
  );

  // Set the values and form control
  const form = useForm({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: defaultFormValues,
  });

  // handle any change in the values, allow submit button
  useEffect(() => {
    const debouncedHandleChange = debounce(
      (currentValues: Partial<FormValues>) => {
        // Comparación de valores para determinar si el formulario ha cambiado
        const isFormDirty = Object.keys(currentValues).some((key) => {
          const keyTyped = key as keyof FormValues;

          // Excluir oldPassword y newPassword de la comparación si están vacíos
          if (keyTyped === "oldPassword" || keyTyped === "newPassword") {
            return !!currentValues[keyTyped];
          }

          // Comparación con los valores iniciales
          return currentValues[keyTyped] !== defaultFormValues[keyTyped];
        });

        setIsDirty(isFormDirty);
      },
      300
    ); // Ajusta el tiempo de debounce según tus necesidades

    const subscription = form.watch((currentValues: Partial<FormValues>) => {
      debouncedHandleChange(currentValues);
    });

    return () => {
      subscription.unsubscribe();
      debouncedHandleChange.cancel();
    };
  }, [form, username, DNI, profileImg, oldPassword, defaultFormValues]);

  // submit the new values of the profile
  const onSubmit = async (values: z.infer<typeof updateProfileSchema>) => {
    const result = updateProfileSchema.safeParse(values);
    if (!result.success) {
      toast.error("Something happened");
      return;
    }
    if (!values.username) {
      toast.error("Username required");
      return;
    }
    if (!values.DNI) {
      toast.error("DNI required");
      return;
    }

    const response = await updateProfile({
      username: values.username,
      DNI: values.DNI,
      oldPassword: values.oldPassword,
      newPassword: values.newPassword,
      profileImg: values.profileImg,
    });
    if (!response.success || response.error || !response.data) {
      toast.error(response.error);
      console.log(response.error);
      return;
    }

    toast.success("Profile Edited");

    // everything to default
    reset();
    toggleEdit();
    setIsDirty(false);
    window.location.reload();

    console.log(values);
  };

  const reset = () => {
    form.reset(defaultFormValues);
    setIsDirty(false);
  };

  return (
    <Card className="w-full max-w-2xl bg-ivory-50 shadow-lg border border-golden-amber/20 mx-auto">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-golden-amber/10 rounded-full">
            <Pencil className="w-6 h-6 text-golden-amber" />
          </div>
          <h2 className="text-2xl font-bold text-library-dark">Edit Profile</h2>
        </div>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Profile Image Upload */}
            <FormField
              name="profileImg"
              render={({ field }) => (
                <FormItem className="flex flex-col items-center">
                  <div className="relative group">
                    <div className="relative group h-32 w-32">
                      {field.value ? (
                        <div className="relative w-full h-full rounded-full border-4 border-golden-amber/20 shadow-md transition-all hover:border-golden-amber/40">
                          <Image
                            src={field.value}
                            alt="Profile"
                            fill
                            className="rounded-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => form.setValue("profileImg", null)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      ) : (
                        <ImageUpload
                          type="user"
                          onSuccess={(url) => form.setValue("profileImg", url)}
                          isValue={!!profileImg}
                        />
                      )}
                    </div>
                  </div>
                </FormItem>
              )}
            />

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["username", "DNI", "oldPassword", "newPassword"].map(
                (fieldName) => (
                  <FormField
                    key={fieldName}
                    name={fieldName}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-golden-amber">
                          {fieldName === "oldPassword"
                            ? "Current Password"
                            : fieldName === "newPassword"
                            ? "New Password"
                            : fieldName.toUpperCase()}
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type={
                              fieldName.includes("Password")
                                ? "password"
                                : "text"
                            }
                            className="h-12 rounded-lg border-golden-amber/20 focus:ring-golden-amber/50"
                            placeholder={
                              fieldName === "username"
                                ? "JohnDoe123"
                                : fieldName === "DNI"
                                ? "001-1234567-8"
                                : "••••••••"
                            }
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 text-sm" />
                      </FormItem>
                    )}
                  />
                )
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col md:flex-row gap-3 justify-end">
              <Button
                type="button"
                variant="outline"
                className="h-12 w-full md:w-32 border-golden-amber/30 text-library-dark hover:bg-golden-amber/5"
                onClick={isDirty ? reset : toggleEdit}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="h-12 w-full md:w-32 bg-golden-amber hover:bg-golden-amber/90 text-library-dark font-medium transition-all"
                disabled={!isDirty}
              >
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default EditProfile;
