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
import { Lock, User, XCircle } from "lucide-react";
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
    <Card className="w-full max-w-2xl bg-white shadow-sm border border-gray-100 mx-auto">
      <CardHeader className="pb-2">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <User className="w-6 h-6 text-blue-600" />
          Edit Profile
        </h2>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Sección de Imagen */}
            <FormField
              control={form.control}
              name="profileImg"
              render={({ field }) => (
                <FormItem className="flex flex-col items-center">
                  <div className="relative group">
                    <div className="relative h-32 w-32 rounded-full border-4 border-white shadow-lg">
                      {field.value ? (
                        <>
                          <Image
                            src={field.value}
                            alt="Profile"
                            fill
                            className="rounded-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => form.setValue("profileImg", null)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                          >
                            <XCircle className="w-6 h-6" />
                          </button>
                        </>
                      ) : (
                        <div className="h-full w-full bg-gray-100 rounded-full flex items-center justify-center">
                          <ImageUpload
                            onSuccess={(url) => {
                              form.setValue("profileImg", url);
                              form.clearErrors("profileImg");
                            }}
                            isValue={!!field.value}
                            type="user"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </FormItem>
              )}
            />

            {/* Campos del Formulario */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Username</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="h-12 rounded-lg"
                        placeholder="JohnDoe123"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />

              <FormField
                name="DNI"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">DNI</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="h-12 rounded-lg"
                        placeholder="001-1234567-8"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />

              <FormField
                name="oldPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      Current Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ? field.value : ""}
                        type="password"
                        className="h-12 rounded-lg"
                        placeholder="••••••••"
                        onBlur={() => form.trigger("oldPassword")}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />

              <FormField
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      New Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ? field.value : ""}
                        type="password"
                        className="h-12 rounded-lg"
                        placeholder="••••••••"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />
            </div>

            {/* Botones de Acción */}
            <div className="flex flex-col md:flex-row gap-3 justify-end">
              <Button
                type="button"
                variant="outline"
                className="h-12 w-full md:w-32"
                onClick={isDirty ? reset : toggleEdit}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="h-12 w-full md:w-32 bg-blue-600 hover:bg-blue-700 text-white"
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
