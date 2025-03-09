"use client";

import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Role } from "@prisma/client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

// User Creation Dialog Component
export default function UserCreationDialog() {
  const [loading, setLoading] = useState(false);

  const defaultValues = {
    username: "",
    password: "",
    dni: "",
    confirmPassword: "",
    role: "MEMBER",
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({ defaultValues });

  const onSubmit = async (data: {
    username: string | "";
    password: string | "";
    dni: string | "";
    confirmPassword: string | "";
    role: string;
  }) => {
    setLoading(true);
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Parse the response data
      const responseData = await response.json();

      if (responseData.error && !responseData.success) {
        toast.error(responseData.error);
        console.log(responseData.error);
      } else {
        toast.success("User created succesfully");
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
      toast.error("Error creating the user");
    } finally {
      setLoading(false);
    }
  };

  // Option, see for better ux
  const cancel = () => {
    reset(defaultValues);
  };

  return (
    <DialogContent className="bg-library-dark text-ivory-50">
      <DialogHeader>
        <DialogTitle>Create New User</DialogTitle>
        <DialogDescription>
          Add a new library member or staff account
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-4 py-4">
          {/* Image Upload */}

          {/* Username */}
          <div className="space-y-2">
            <Label htmlFor="username" className="text-ivory-50">
              Username *
            </Label>
            <Input
              id="username"
              {...register("username", {
                required: "Username is required",
                minLength: {
                  value: 3,
                  message: "Username must be at least 3 characters",
                },
              })}
              placeholder="Enter username"
              className="bg-ivory-50 text-library-dark"
            />
            {errors.username && (
              <p className="text-sm text-destructive">
                {errors.username.message as string}
              </p>
            )}
          </div>

          {/* DNI */}
          <div className="space-y-2">
            <Label htmlFor="dni" className="text-ivory-50">
              DNI *
            </Label>
            <Input
              id="dni"
              {...register("dni", {
                required: "DNI is required",
                pattern: {
                  value: /^[0-9]{11}$/,
                  message: "Invalid DNI format",
                },
              })}
              placeholder="Enter DNI (11 digits)"
              className="bg-ivory-50 text-library-dark"
            />
            {errors.dni && (
              <p className="text-sm text-destructive">
                {errors.dni.message as string}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-ivory-50">
              Password *
            </Label>
            <Input
              id="password"
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              })}
              placeholder="Enter password"
              className="bg-ivory-50 text-library-dark"
            />
            {errors.password && (
              <p className="text-sm text-destructive">
                {errors.password.message as string}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-ivory-50">
              Confirm Password *
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              {...register("confirmPassword", {
                validate: (value) =>
                  value === watch("password") || "Passwords do not match",
              })}
              placeholder="Confirm password"
              className="bg-ivory-50 text-library-dark"
            />
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">
                {errors.confirmPassword.message as string}
              </p>
            )}
          </div>

          {/* Role Selector */}
          <div className="space-y-2">
            <Label htmlFor="role" className="text-ivory-50">
              User Role *
            </Label>
            <Select
              {...register("role", { required: "Role is required" })}
              defaultValue={Role.MEMBER}
              onValueChange={(value) => setValue("role", value)}
            >
              <SelectTrigger>
                <SelectValue
                  defaultValue={Role.MEMBER}
                  placeholder="Select role"
                />
              </SelectTrigger>
              <SelectContent>
                {Object.values(Role).map((role) => (
                  <SelectItem key={role} value={role}>
                    {role.charAt(0) + role.slice(1).toLowerCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.role && (
              <p className="text-sm text-destructive">
                {errors.role.message as string}
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <DialogClose>
            <Button
              type="button"
              onClick={cancel}
              className="bg-library-midnight text-ivory-50"
            >
              Cancel
            </Button>
          </DialogClose>

          <Button
            type="submit"
            aria-disabled={loading}
            disabled={loading}
            className="bg-golden-amber text-library-dark hover:text-ivory-50"
          >
            Create User
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
