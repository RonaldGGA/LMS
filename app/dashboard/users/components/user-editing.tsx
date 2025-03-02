"use client";

import { Role } from "@prisma/client";
import { toast } from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useForm, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { useEffect, useMemo, useState } from "react";
import { dashboardUser } from "../page";
import { z } from "zod";
import { adminUpdateProfileSchema } from "@/zod-schemas";

// User Edit Dialog Component
const UserEditDialog = ({
  user,
  onClose,
}: {
  user: dashboardUser | null;
  onClose: () => void;
}) => {
  const [loading, setLoading] = useState(true);

  const defaultValues = useMemo(() => {
    return {
      username: user?.username || "",
      newPassword: "",
      dni: user?.dni || "",
      confirmPassword: "",
      role: user?.role || Role.MEMBER,
    };
  }, [user]);

  useEffect(() => {
    setLoading(false);
  }, [user]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    control,
  } = useForm({ defaultValues });

  const onSubmit = async (data: z.infer<typeof adminUpdateProfileSchema>) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3000/api/users/${user?.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast.success("User updated succesfully");
      window.location.reload();
    } catch (error) {
      console.log(error);
      toast.error("Error updating the user");
    } finally {
      setLoading(false);
    }
  };

  // Option, see for better ux
  const cancel = () => {
    reset(defaultValues);
  };

  const handleClose = () => {
    cancel();
    onClose();
  };

  return (
    <Dialog open={!!user} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Modify user details and permissions
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-4 py-4">
            {/* Image Upload */}

            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="username">Username *</Label>
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
              />
              {errors.username && (
                <p className="text-sm text-destructive">
                  {errors.username.message as string}
                </p>
              )}
            </div>

            {/* DNI */}
            <div className="space-y-2">
              <Label htmlFor="dni">DNI *</Label>
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
              />
              {errors.dni && (
                <p className="text-sm text-destructive">
                  {errors.dni.message as string}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                {...register("newPassword", {
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                })}
                placeholder="Enter password"
              />
              {errors.newPassword && (
                <p className="text-sm text-destructive">
                  {errors.newPassword.message as string}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <Input
                id="confirmPassword"
                type="password"
                {...register("confirmPassword", {
                  validate: (value) =>
                    value === watch("newPassword") || "Passwords do not match",
                })}
                placeholder="Confirm password"
              />
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">
                  {errors.confirmPassword.message as string}
                </p>
              )}
            </div>

            {/* Role Selector */}
            <div className="space-y-2">
              <Label htmlFor="role">User Role *</Label>
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    onValueChange={(value) => field.onChange(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(Role).map((role) => (
                        <SelectItem key={role} value={role}>
                          {role.charAt(0) + role.slice(1).toLowerCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.role && (
                <p className="text-sm text-destructive">
                  {errors.role.message as string}
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" aria-disabled={loading} disabled={loading}>
              Accept Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserEditDialog;
