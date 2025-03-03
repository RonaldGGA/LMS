"use client";

import { useState, useEffect, useMemo } from "react";

import { UserAccount, Role } from "@prisma/client";
import { toast } from "react-hot-toast";
import { useUserSession } from "@/app/hooks/useUserSession";
import { MoreVerticalIcon, PlusIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import UserCreationDialog from "./components/user-creation-dialog";

type dashboardUser = UserAccount & {
  _count: {
    bookLoans: number;
    bookLoanRequests: number;
  };
};

const UsersDashboardPage = () => {
  const session = useUserSession();
  const [users, setUsers] = useState<dashboardUser[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserAccount | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`/api/users?query=${searchTerm}
            `);
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        toast.error("Failted to fetch users");
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [searchTerm]);

  const handleDelete = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      });
      setUsers(users.filter((user) => user.id !== userId));
      toast.success("User deleted succesfully");
    } catch (error) {
      console.log(error);
      toast.error("Error trying to delete the user");
    }
  };

  const updateRole = async (userId: string, newRole: Role) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      if (!response.ok) {
        toast.error("Error changing the role of the user");
        return;
      }
      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
      toast.success("User role updated succesfully");
    } catch (error) {
      console.log(error);
      toast.error("Error updating the role of the user");
    }
  };

  if (!session || !["SUPERADMIN", "LIBRARIAN"].includes(session.role)) {
    // Probably not need as I have middleware
    return <div className="p-6">Unauthorized access</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col  gap-4 justify-between items-start sm:items-center">
        <div className="flex flex-col sm:flex-row justify-between gap-4 sm:items-center w-full">
          <Input
            placeholder="Search by name or ID..."
            className="max-w-md text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <PlusIcon className="mr-2 h-4 w-4" />
                Create New User
              </Button>
            </DialogTrigger>

            <UserCreationDialog />
          </Dialog>
        </div>
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : (
          <>
            <Table className="bg-gray-200 rounded">
              <TableHeader>
                <TableRow>
                  <TableHead>User ID</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Active Loans</TableHead>
                  <TableHead>Pending Requests</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      {user.id.slice(0, 8)}
                    </TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>
                      <Select
                        value={user.role}
                        onValueChange={(value: Role) =>
                          updateRole(user.id, value)
                        }
                        disabled={session.id === user.id}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(Role).map((role) => (
                            <SelectItem key={role} value={role}>
                              {role}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      {/* <Badge variant={user.isActive ? "default" : "secondary"}>
                        {user.isActive ? "Online" : "Offline"}
                      </Badge> */}
                      <Badge variant={"default"}>Online</Badge>
                    </TableCell>
                    <TableCell>{user._count?.bookLoans || 0}</TableCell>
                    <TableCell>{user._count?.bookLoanRequests || 0}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVerticalIcon className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={() => setSelectedUser(user)}
                          >
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(user.id)}
                            disabled={session.id === user.id}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {users.length === 0 && (
              <div className="text-center w-full p-3 text-lg text-gray-200">
                No Users found with that id or name
              </div>
            )}
          </>
        )}
      </div>
      {/* TODO: VERIFICATION AND IMPLEMENTATION */}
      <UserEditDialog
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
      />
    </div>
  );
};

// User Edit Dialog Component
const UserEditDialog = ({
  user,
  onClose,
}: {
  user: UserAccount | null;
  onClose: () => void;
}) => {
  const defaultValues = useMemo(() => {
    return {
      username: user?.username || "",
      newPassword: "",
      dni: user?.dni || "",
      confirmPassword: "",
      role: "MEMBER",
    };
  }, [user]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    control,
  } = useForm({ defaultValues });
  const router = useRouter();

  const onSubmit = async (data: any) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/users/${user.id}`,
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
      router.refresh();
    } catch (error) {
      console.log(error);
      toast.error("Error updating the user");
    }
  };

  // Option, see for better ux
  const cancel = () => {
    reset(defaultValues);
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
            <Button type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Edit User</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UsersDashboardPage;
