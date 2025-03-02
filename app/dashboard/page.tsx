// app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableFooter,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

import { BookCopyIcon, DownloadIcon, FilterIcon, User } from "lucide-react";
import LineChart from "./components/charts/line-chart";
import {
  Pagination,
  PaginationContent,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import NextImprovements from "../components/next-improvements";

type DashboardRecentLoans = {
  id: string;
  user: {
    username: string;
  };
  bookCopy: {
    bookTitle: {
      title: string;
    };
  };
  loanDate: Date;
};

type DashboardData = {
  stats: {
    totalBooks: number;
    activeLoans: number;
    pendingRequests: number;
    totalDeposits: string;
  };
  recentLoans: DashboardRecentLoans[];
  // activeDeposits: any[];
  // pendingRequests: any[];
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const next = [
    "Implement manage Loans",
    "Implement manage requests",
    "Implement manage deposits",
    "Implement manage notifications",
    "Implement system general settings ",
    "Implement advanced reports ",
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/dashboard");
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-6 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-[120px]" />
          ))}
        </div>
        <div className="space-y-4">
          <Skeleton className="h-[400px]" />
        </div>
      </div>
    );
  }

  if (!data) return <div>Error loading data</div>;

  return (
    <div className="p-6 space-y-8 block">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Books"
          value={data.stats.totalBooks}
          description="Available titles"
        />
        <StatCard
          title="Active Loans"
          value={data.stats.activeLoans}
          description="Currently issued"
        />
        <StatCard
          title="Pending Requests"
          value={data.stats.pendingRequests}
          description="Awaiting approval"
        />
        <StatCard
          title="Total Deposits"
          value={`$${Number(data.stats.totalDeposits).toFixed(2)}`}
          description="Security holdings"
        />
      </div>

      {/* Charts Section */}
      <Card>
        <CardHeader>
          <CardTitle>Loan Activity Example</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center ">
          <LineChart
            data={{
              labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
              datasets: [
                {
                  label: "Loans",
                  data: [65, 59, 80, 81, 56, 55],
                  borderColor: "rgb(59, 130, 246)",
                  tension: 0.1,
                },
              ],
            }}
          />
        </CardContent>
      </Card>

      {/* Recent Loans Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Loans</CardTitle>
        </CardHeader>
        <CardContent>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <FilterIcon className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuCheckboxItem>Active Loans</DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Book</TableHead>
                <TableHead>Loan Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.recentLoans.map((loan) => (
                <TableRow key={loan.id}>
                  <TableCell>{loan.user.username}</TableCell>
                  <TableCell>{loan.bookCopy.bookTitle.title}</TableCell>
                  <TableCell>
                    {new Date(loan.loanDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={4} className="text-right">
                  <Pagination>
                    <PaginationContent>
                      <PaginationPrevious />
                      <PaginationNext />
                    </PaginationContent>
                  </Pagination>
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
          <Button variant="ghost">
            <DownloadIcon className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="flex gap-4 flex-wrap items-center justify-around">
        <Link href={"/dashboard/books"}>
          <Button variant="secondary" className="bg-green-200 border-2">
            <BookCopyIcon className="mr-2 h-4 w-4" />
            Manage Books
          </Button>
        </Link>

        <Link href={"/dashboard/users"}>
          <Button variant="secondary" className="bg-pink-200">
            <User className="mr-2 h-4 w-4" />
            Manage Users
          </Button>
        </Link>
      </div>
      <NextImprovements>
        {next.map((item, index) => (
          <li key={index}>
            {index} - {item}
          </li>
        ))}
      </NextImprovements>
    </div>
  );
}

function StatCard({
  title,
  value,
  description,
}: {
  title: string;
  value: string | number;
  description: string;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
