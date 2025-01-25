"use client";

import { Input } from "@/components/ui/input";
import { searchSchema } from "@/zod-schemas";
import { Search, SearchIcon, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { getBooksByName, getLiveBooksName } from "@/data/getBooks";
import CardBook from "./components/card-book";
import { useDebounce } from "@uidotdev/usehooks";
import z from "zod";
import { useUserSession } from "./hooks/useUserSession";
import { BookStatus } from "@prisma/client";
import { getUserById } from "@/data/getUser";

const Home = () => {
  const router = useRouter();
  const userId = useUserSession();

  const [searchValue, setSearchValue] = useState<string>("");
  const [searchedBooks, setSearchedBooks] = useState<
    | {
        id: string;
        title: string;
        author: string;
        category: string;
        status: BookStatus;
      }[]
    | null
  >(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) {
      router.push("/auth/user?type=login");
    }
  }, [userId, router]);

  useEffect(() => {
    async function getDbUser() {
      const userDb = await getUserById(userId);
      if (userDb) {
        // setUser(userDb);
      }
    }
    getDbUser();
  }, [userId]);
  const [suggestionBooks, setSuggestionBooks] = useState<
    { id: string; book_name: string; author: { author_name: string } }[] | null
  >(null);

  const form = useForm<z.infer<typeof searchSchema>>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      book_name: "",
    },
  });

  const clearSearch = () => {
    setSearchValue("");
    setSuggestionBooks(null);
  };

  const debouncedSearchValue = useDebounce(searchValue, 300);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!debouncedSearchValue) {
        setSuggestionBooks(null);
        return;
      }

      // setLoading(true);
      try {
        const liveBooks = await getLiveBooksName(debouncedSearchValue);
        setSuggestionBooks(
          liveBooks.data && liveBooks.data.length > 0 ? liveBooks.data : []
        );
      } catch (error) {
        console.error("Error fetching live books:", error);
      } finally {
        // setLoading(false);
      }
    };

    fetchSuggestions();
  }, [debouncedSearchValue]);

  const handleSuggestionClick = (bookName: string) => {
    setSearchValue(bookName);
    setSuggestionBooks(null);
    form.setValue("book_name", bookName);
    form.handleSubmit(onSubmit)();
    setSearchValue("");
  };

  const onSubmit = async (values: z.infer<typeof searchSchema>) => {
    console.log(`submmited ${values.book_name}`);

    setLoading(true);

    try {
      const results = await getBooksByName(values.book_name);
      if (results?.success && results.data) {
        const data = results.data.map((item) => {
          return {
            id: item.id,
            title: item.book_name,
            author: item.author.author_name,
            category: item.category.cat_type,
            status: item.book_status,
          };
        });
        setSearchedBooks(data);
        setSuggestionBooks(null);
      }
    } catch (error) {
      console.log(error);
      toast("error");
      return;
    } finally {
      setLoading(false);
    }
  };
  const capitalize = (book: string) => {
    return book[0].toUpperCase().concat(book.slice(1));
  };

  return (
    <div className="flex items-center flex-col gap-5 mt-7 max-w-[1400px] justify-center">
      <div className="mb-10 bg-gray-100 rounded-md focus-within:block relative  focus-within:shadow focus-within:shadow-black focus-within:rounded-b-none transition-shadow max-w-[90%] lg:w-[500px]">
        <form onSubmit={form.handleSubmit(onSubmit)} className="">
          <div className="bg-gray-100 flex  items-center  focus-within:border-none rounded-sm mx-auto  p-0 w-full">
            <div className=" h-full  rounded-l-none border-r border-l-gray-300 flex items-center justify-center p-2 px-3 ">
              <Search width={20} height={20} />
            </div>
            <div className="relative flex-1">
              <Input
                {...form.register("book_name")} // Registra el campo
                onChange={(e) => {
                  setSearchValue(e.currentTarget.value);
                  form.setValue("book_name", e.currentTarget.value); // Actualiza el valor en react-hook-form
                }}
                autoComplete="off"
                type="text"
                value={searchValue || ""}
                className="text-lg md:text-lg lg:text-lg h-10 rounded-none focus-visible:ring-0 outline-none border-none focus:border-none focus:outline-none"
                placeholder="Search any book..."
              />
              <div className="absolute right-3 top-0 h-10 flex items-center justify-center">
                <button
                  type="button"
                  onClick={clearSearch}
                  className={`bg-gray-400 hover:bg-gray-100 hover:text-black text-gray-100 cursor-pointer text-center border border-gray-400 rounded-full transition w-7 h-7 flex items-center justify-center ${
                    searchValue ? "block" : "hidden"
                  }`}
                >
                  <X className="text-xs w-3" />
                </button>
              </div>
            </div>
          </div>
        </form>{" "}
        <div className="flex items-center absolute bg-gray-100 w-full rounded-b">
          <ul className="w-full">
            {suggestionBooks &&
              suggestionBooks.length > 0 &&
              suggestionBooks.map(
                (book: {
                  id: string;
                  book_name: string;
                  author: { author_name: string };
                }) => (
                  <li
                    className="p-1 flex items-center cursor-pointer hover:bg-gray-200 gap-5 text-gray-600"
                    onClick={() => handleSuggestionClick(book.book_name)}
                    key={book.id}
                  >
                    <div className="ml-2">
                      <SearchIcon width={20} height={20} color="#999999" />
                    </div>
                    {capitalize(book.book_name)} by {book.author.author_name}
                  </li>
                )
              )}
          </ul>
        </div>
      </div>
      <div className="justify-center w-full  flex items-center gap-3 flex-wrap">
        {searchedBooks &&
          !loading &&
          searchedBooks.map((book) => (
            <CardBook
              id={book.id}
              key={book.id}
              title={book.title}
              author={book.author}
              category={book.category}
              status={book.status}
            />
          ))}
        {loading && <p className="text-3xl text-white bg-black">LOADING...</p>}
      </div>
    </div>
  );
};

export default Home;
