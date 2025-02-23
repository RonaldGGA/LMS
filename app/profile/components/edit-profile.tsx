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
import { CldUploadWidget, CloudinaryUploadWidgetInfo } from "next-cloudinary";
import Image from "next/image";
import toast from "react-hot-toast";
import { updateProfile } from "@/actions/update-profile";
import { debounce } from "lodash-es";
import { X } from "lucide-react";

interface EditProfileProps {
  username: string;
  DNI: string;
  profileImg: string | null;
  oldPassword: string;
  toggleEdit: () => void;
}
export interface FormValues {
  username?: string | "";
  DNI?: string | "";
  profileImg?: string | null | "";
  oldPassword?: string | "";
  newPassword?: string | "";
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
      oldPassword: "",
      newPassword: "",
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
    const debouncedHandleChange = debounce((currentValues: FormValues) => {
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
    }, 300); // Ajusta el tiempo de debounce según tus necesidades

    const subscription = form.watch((currentValues) => {
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
    <Form {...form}>
      <form id="profileCredentials" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="profileImg"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <>
                  {/* Vista previa de la imagen */}
                  {field.value ? (
                    <div className="relative h-48 w-48">
                      <X
                        width={40}
                        height={40}
                        className="z-10 bg-black text-gray-300 absolute top-o right-0 p-2 rounded-lg cursor-pointer hover:scale-95 transition-transform"
                        onClick={() => form.setValue("profileImg", null)}
                      />
                      <Image
                        src={profileImg || field.value}
                        alt="Preview"
                        fill
                        className="rounded-md object-cover"
                      />
                    </div>
                  ) : (
                    <CldUploadWidget
                      uploadPreset={
                        process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME
                      }
                      // signatureEndpoint="/api/sign-cloudinary-params"
                      onSuccess={(result, { widget }) => {
                        if (result.info && typeof result.info !== "string") {
                          const info =
                            result.info as CloudinaryUploadWidgetInfo;
                          form.setValue("profileImg", info.secure_url);
                        }
                        widget.close();
                      }}
                    >
                      {({ open }) => (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => open()}
                        >
                          + Profile Picture
                        </Button>
                      )}
                    </CldUploadWidget>
                  )}
                </>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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

        <FormField
          control={form.control}
          name="oldPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Old Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
          {isDirty ? (
            <Button
              variant="outline"
              className="mr-2 w-20"
              type="button"
              onClick={reset}
            >
              Cancel
            </Button>
          ) : (
            <Button
              variant="outline"
              className="mr-2 w-20"
              type="button"
              onClick={toggleEdit}
            >
              Back
            </Button>
          )}

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
  );
};

export default EditProfile;
