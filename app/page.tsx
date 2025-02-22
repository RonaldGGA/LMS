"use client";

import { Input } from "@/components/ui/input";
import { searchSchema } from "@/zod-schemas";
import { Search, SearchIcon, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { getBooksByName, getLiveBooksName } from "@/data/getBooks";
import CardBook from "./components/card-book";
import { useDebounce } from "@uidotdev/usehooks";
import z from "zod";
import { SkeletonDemo } from "./components/skeleton-demo";
import { searchedBooks } from "@/types";

const Home = () => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [quantity] = useState(10);
  const [searchedBooks, setSearchedBooks] = useState<searchedBooks[] | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  const [suggestionBooks, setSuggestionBooks] = useState<
    { id: string; title: string; author: { author_name: string } }[] | null
  >(null);

  const [counter, setCounter] = useState(false);

  useEffect(() => {
    // Función para manejar la tecla Enter o Search
    const handleKeyPress = (e: { key: string }) => {
      if (e.key === "Enter" || e.key === "Search") {
        // Lógica que se ejecutará cuando se presione Enter o Search
        setCounter(!counter);
      }
    };

    // Añadir el event listener al documento
    document.addEventListener("keydown", handleKeyPress);

    // Limpia el event listener al desmontar
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [counter]); // Agregamos contador como dependencia

  const form = useForm<z.infer<typeof searchSchema>>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      title: "",
    },
  });

  const clearSearch = () => {
    setSearchValue("");
    setSuggestionBooks(null);
  };

  const debouncedSearchValue = useDebounce(searchValue, 300);

  const [errorMesasge, setErrorMessage] = useState("");
  useEffect(() => {
    const searchDefaultBooks = async () => {
      const result = await getBooksByName(undefined, quantity);
      console.log(result);
      if (!result?.success) {
        if (result?.error && result.error === "Empty") {
          setErrorMessage("No books in the library");
          setSearchedBooks([]);
          return;
        } else {
          toast.error("Something happened searching the books");
          setSearchedBooks([]);

          return;
        }
      }
      setSearchedBooks(result.data);
    };
    searchDefaultBooks();
  }, [quantity, counter]);

  useEffect(() => {
    // Puedes crear notificaciones en cualquier lugar de tu aplicación

    // createNotification(userId, "First message");
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
    form.setValue("title", bookName);
    form.handleSubmit(onSubmit)();
    setSearchValue("");
  };

  const onSubmit = async (values: z.infer<typeof searchSchema>) => {
    console.log(`submmited ${values.title}`);

    setLoading(true);

    try {
      const results = await getBooksByName(values.title, undefined);
      if (results?.success && results.data) {
        setSearchedBooks(results.data);
        console.log(results.data);
        setSuggestionBooks(null);
      } else {
        if (results?.error === "No matches") {
          setSuggestionBooks(null);
          setSearchedBooks([]);
          setErrorMessage("No book matches your query");
        } else {
          setErrorMessage("Internal server error, please contact support");
        }
      }

      toast.success("searched");
      console.log(searchedBooks);
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
                {...form.register("title")} // Registra el campo
                onChange={(e) => {
                  setSearchValue(e.currentTarget.value);
                  form.setValue("title", e.currentTarget.value); // Actualiza el valor en react-hook-form
                }}
                autoFocus
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
                  title: string;
                  author: { author_name: string };
                }) => (
                  <li
                    className="p-1 flex items-center cursor-pointer hover:bg-gray-200 gap-5 text-gray-600"
                    onClick={() => handleSuggestionClick(book.title)}
                    key={book.id}
                  >
                    <div className="ml-2">
                      <SearchIcon width={20} height={20} color="#999999" />
                    </div>
                    {capitalize(book.title)} by {book.author.author_name}
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
              img={book.img}
              id={book.id}
              key={book.id}
              title={book.title}
              author={book.author.author_name}
              categories={book.categories}
              price={book.book_price}
              ratings={book.bookRatings}
            />
          ))}
        {searchedBooks && searchedBooks.length === 0 && (
          <div className="text-lg text-white">{errorMesasge}</div>
        )}
        {loading && (
          <div className="flex gap- flex-col md:flex-row">
            {[...Array(3)].map((_, i) => (
              <SkeletonDemo key={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
