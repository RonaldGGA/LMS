"use client";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { passwordSchema } from "@/zod-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import z from "zod";

import bcrypt from "bcryptjs";
import { CheckCircle2 } from "lucide-react";

interface ConfirmPasswordProps {
  dbPassword: string | undefined;
  setPasswordCorrect: (value: boolean) => void;
  passwordCorrect: boolean;
}

const ConfirmPassword: React.FC<ConfirmPasswordProps> = ({
  dbPassword,
  setPasswordCorrect,
  passwordCorrect,
}) => {
  const closeRef = useRef<HTMLButtonElement>(null);
  const form = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      oldPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof passwordSchema>) => {
    // Check if the old password matches the database password
    const isMatch = await bcrypt.compare(values.oldPassword, dbPassword!);
    console.log(isMatch);
    if (!isMatch) {
      toast.error("Invalid password");
      return;
    }
    toast("New password ready to be changed");

    if (closeRef.current) {
      setPasswordCorrect(true);
      closeRef.current.click();
    }
  };
  if (passwordCorrect) {
    return (
      <div className="flex gap-2 items-center p-2">
        <CheckCircle2 color="green" />
        Password confirmed
      </div>
    );
  }

  return (
    <Dialog>
      <DialogTrigger className=" text-start">
        <Button type="button" variant={"secondary"}>
          Confirm Old password
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>First, type your old password</DialogTitle>
        </DialogHeader>
        <div className="">
          <div className="">
            <form
              id="checkPassword"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8"
            >
              <Form {...form}>
                <FormField
                  control={form.control}
                  name="oldPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Old Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="********"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription></FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogClose ref={closeRef}></DialogClose>
                <Button form="checkPassword" type="submit">
                  Check
                </Button>
              </Form>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmPassword;
