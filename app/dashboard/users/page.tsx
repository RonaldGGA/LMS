"use client";

import { useState, useEffect } from "react";

import { Role } from "@prisma/client";
import { toast } from "react-hot-toast";
import { useUserSession } from "@/app/hooks/useUserSession";
import { MoreVerticalIcon, PlusIcon, SearchIcon } from "lucide-react";
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
// import NextImprovements from "@/app/components/next-improvements";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  const handleCopyId = () => {
    navigator.clipboard.writeText(session!.id!);
    toast.success("Copied id");
  };

  if (loading) {
    return <>LOADING...</>;
  }

  if (!session || !["SUPERADMIN", "LIBRARIAN"].includes(session.role)) {
    // Probably not need as I have middleware
    return <div className="p-6">Unauthorized access</div>;
  }

  // const next = [
  //   "Implement user status handling online/offline",
  //   "Implement unique user view page for the admin",
  //   "Implement user loans and request handling",
  //   "implement a better actions ui",
  //   "Improve user creatin requirements, actually an admin can create invalid users",
  //   "Implement pagination, table pagination and better mobile ux and ui",
  // ];

  return (
    <div className="p-6 space-y-6 bg-library-dark text-ivory-50 rounded-xl shadow-2xl border border-library-midnight">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <Input
          placeholder="Search by name or ID..."
          className="max-w-md text-library-dark bg-ivory-50 border-2 border-golden-amber focus:ring-2 focus:ring-golden-amber"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-golden-amber hover:bg-golden-amber/90 text-library-dark font-bold transition-transform hover:scale-105">
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
            <Skeleton
              key={i}
              className="h-12 w-full bg-library-midnight/50 animate-pulse"
            />
          ))}
        </div>
      ) : (
        <>
          <Table className="bg-library-midnight/50 rounded-lg overflow-hidden">
            <TableHeader className="bg-golden-amber">
              <TableRow>
                {[
                  "User ID",
                  "Username",
                  "Role",
                  "Status",
                  "Active Loans",
                  "Pending Requests",
                  "Actions",
                ].map((header) => (
                  <TableHead
                    key={header}
                    className="text-library-dark font-black text-center"
                  >
                    {header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow
                  key={user.id}
                  className="hover:bg-library-midnight/30 transition-colors"
                >
                  <TableCell
                    onClick={handleCopyId}
                    className="font-medium text-golden-amber text-center"
                  >
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <span>{user.id.slice(0, 8)}</span>
                        </TooltipTrigger>
                        <TooltipContent className="bg-ivory-50 text-library-dark">
                          <p>Click to copy ID</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell className="text-center">{user.username}</TableCell>
                  <TableCell>
                    <Select
                      value={user.role}
                      onValueChange={(value: Role) =>
                        updateRole(user.id, value)
                      }
                      disabled={session.id === user.id}
                    >
                      <SelectTrigger className="w-32 bg-ivory-50 text-library-dark border-2 border-golden-amber">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-ivory-50 text-library-dark border-2 border-golden-amber">
                        {Object.values(Role).map((role) => (
                          <SelectItem
                            key={role}
                            value={role}
                            className="hover:bg-golden-amber/20"
                          >
                            {role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant="default"
                      className="bg-emerald-500 text-ivory-50 "
                    >
                      Online
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center text-golden-amber font-bold">
                    {user._count?.bookLoans || 0}
                  </TableCell>
                  <TableCell className="text-center text-golden-amber font-bold">
                    {user._count?.bookLoanRequests || 0}
                  </TableCell>
                  <TableCell className="flex items-center justify-center gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setSelectedUser(user)}
                      className="border-golden-amber text-golden-amber hover:bg-golden-amber/10"
                    >
                      Edit
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-golden-amber hover:bg-golden-amber/10"
                        >
                          <MoreVerticalIcon className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-library-dark border border-golden-amber">
                        <DropdownMenuItem
                          onClick={() => handleDelete(user.id)}
                          disabled={session.id === user.id}
                          className="text-ivory-50 hover:bg-golden-amber/20"
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
            <div className="flex flex-col items-center justify-center h-[40vh] bg-library-midnight/50 rounded-xl">
              <SearchIcon className="h-16 w-16 text-golden-amber mb-4" />
              <h3 className="text-xl font-bold text-ivory-50">
                No users found
              </h3>
              <p className="text-golden-amber/80">
                Try adjusting your search criteria
              </p>
            </div>
          )}
        </>
      )}

      {selectedUser && (
        <UserEditDialog
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}

      {/* <NextImprovements>
        <div className="mt-8 p-4 bg-library-midnight/50 rounded-lg">
          <h4 className="text-golden-amber font-bold mb-3">
            Next Improvements
          </h4>
          <ol className="space-y-2 text-ivory-50/80">
            {next.map((item: string, index: number) => (
              <li key={index} className="flex items-center">
                <span className="text-golden-amber mr-2">▶</span>
                {index + 1}. {item}
              </li>
            ))}
          </ol>
        </div>
      </NextImprovements> */}
    </div>
  );
};

export default UsersDashboardPage;
