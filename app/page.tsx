"use client";

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
import { getUserById } from "@/data/getUser";
import { searchSchema } from "@/zod-schemas";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { useUserSession } from "./hooks/useUserSession";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { BookStatus, User } from "@prisma/client";
import toast from "react-hot-toast";
import { getBooksByName } from "@/data/getBooks";
import CardBook from "./components/card-book";
export default function Home() {
  const router = useRouter();
  const [searchedBooks, setSearchedBokks] = useState<
    | {
        book_name: string;
        id: string;
        author: string;
        category: string;
        status: BookStatus;
      }[]
    | null
  >(null);
  const [user, setUser] = useState<User | null>(null);

  const userId = useUserSession();
  if (!userId) {
    router.push("/auth/user?type=login");
  }
  async function getDbUser() {
    const userDb = await getUserById(userId);
    if (userDb) {
      setUser(userDb);
    }
  }
  useEffect(() => {
    getDbUser();
  }, [userId]);

  const form = useForm<z.infer<typeof searchSchema>>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      book_name: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof searchSchema>) => {
    const result = searchSchema.safeParse(values);
    if (!result.success) {
      toast("invalid query");
    }
    // Improve this
    console.log({ THIS: values });
    const results = await getBooksByName(values.book_name);
    if (results?.success) {
      const data = results.data!.map((item) => {
        return {
          book_name: item.book_name,
          id: item.id,
          author: item.author.author_name,
          category: item.category.cat_type,
          status: item.book_status,
        };
      });
      setSearchedBokks(data);
    }
    console.log(results);
  };
  // console.log(user);
  return (
    <div className="flex items-center flex-col gap-5 max-w-[1400px] justify-center">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            name="book_name"
            render={({ field }) => (
              <FormItem>
                {/* <FormLabel>Book name*</FormLabel> */}
                <FormControl>
                  <div className="flex flex-1 max-w-[350px] focus-within:ring-1 items-center border rounded-md ">
                    {/* Asegúrate de que el icono tenga un poco de margen */}
                    <Input
                      {...field}
                      type="text"
                      className="rounded-none focus-visible:ring-0 outline-none border-none focus-visible:outline-none focus-visible:border-none focus:ring-none flex-1 focus:border-none" // Flex-1 para que ocupe el espacio disponible
                      placeholder="Harry Potter..." // Agregar un placeholder para mejor UX
                    />
                    <Button
                      type="submit"
                      variant={"ghost"}
                      className=" rounded-l-none border-l "
                    >
                      <Search />{" "}
                    </Button>
                  </div>
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
      <div className="justify-center w-full border flex items-center gap-3 flex-wrap">
        {searchedBooks &&
          searchedBooks.map((book) => (
            <CardBook
              id={book.id}
              key={book.id}
              title={book.book_name}
              author={book.author}
              category={book.category}
              status={book.status}
            />
          ))}
      </div>
    </div>
  );
}
