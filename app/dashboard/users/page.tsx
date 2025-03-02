"use client";

import { useState, useEffect } from "react";

import { Role } from "@prisma/client";
import { toast } from "react-hot-toast";
import { useUserSession } from "@/app/hooks/useUserSession";
import { MoreVerticalIcon, PlusIcon } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
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
import UserCreationDialog from "./components/user-creation-dialog";
import UserEditDialog from "./components/user-editing";
import NextImprovements from "@/app/components/next-improvements";

export type dashboardUser = {
  id: string;
  username: string;
  role: Role;
  _count: {
    bookLoans: number;
    bookLoanRequests: number;
  };
  dni: string;
};

const UsersDashboardPage = () => {
  const session = useUserSession();
  const [users, setUsers] = useState<dashboardUser[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<dashboardUser | null>(null);

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
  // const handleCopyId = (userId: string) => {
  //   navigator.clipboard.writeText(userId);
  //   toast.success("Copied id");
  // };

  if (loading) {
    return <>LOADING...</>;
  }

  if (!session || !["SUPERADMIN", "LIBRARIAN"].includes(session.role)) {
    // Probably not need as I have middleware
    return <div className="p-6">Unauthorized access</div>;
  }

  const next = [
    "Implement user status handling online/offline",
    "Implement unique user view page for the admin",
    "Implement user loans and request handling",
    "implement a better actions ui",
    "Improve user creatin requirements, actually an admin can create invalid users",
    "Implement pagination, table pagination and better mobile ux and ui",
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col  gap-4 justify-between items-start sm:items-center">
        <div className="flex flex-col sm:flex-row justify-between gap-4 sm:items-center w-full">
          <Input
            placeholder="Search by name or ID..."
            className="max-w-md text-black"
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
                  <TableHead className="text-center">Active Loans</TableHead>
                  <TableHead className="text-center">
                    Pending Requests
                  </TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium ">
                      {/* <Copy width={15} onClick={() => handleCopyId(user.id)} /> */}
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
                    <TableCell className="text-center">
                      {user._count?.bookLoans || 0}
                    </TableCell>
                    <TableCell className="text-center">
                      {user._count?.bookLoanRequests || 0}
                    </TableCell>
                    <TableCell className="flex items-center justify-center gap-2">
                      <Button
                        variant={"outline"}
                        onClick={() => setSelectedUser(user)}
                      >
                        Edit
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVerticalIcon className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
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
              <div className="text-center w-full p-3 text-lg text-gray-700">
                No Users found with that id or name
              </div>
            )}
          </>
        )}
      </div>
      {/* TODO: VERIFICATION AND IMPLEMENTATION */}
      {selectedUser && (
        <UserEditDialog
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
      <NextImprovements>
        <ol className="space-y-2 mt-3">
          {next.map((item: string, index: number) => (
            <li key={index}>
              {index + 1} - {item}
            </li>
          ))}
        </ol>
      </NextImprovements>
    </div>
  );
};

export default UsersDashboardPage;
