"use client";

import { Input } from "@/components/ui/input";
import { searchSchema } from "@/zod-schemas";
import { BookOpenIcon, Search, SearchIcon, X } from "lucide-react";
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
  const [loading, setLoading] = useState(true);

  const [suggestionBooks, setSuggestionBooks] = useState<
    { id: string; title: string; author: { author_name: string } }[] | null
  >(null);

  const [counter, setCounter] = useState(false);

  useEffect(() => {
    window.history.pushState({}, "Home page", "/");
  }, []);

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
      try {
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
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Search Section */}
        <div className="flex flex-col items-center mb-16">
          <h1 className="text-4xl font-bold text-slate-800 mb-6 text-center">
            Discover Your Next Read
          </h1>

          <div className="w-full max-w-2xl relative">
            <div className="relative group">
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex items-center bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200">
                  <div className="pl-4 pr-2">
                    <Search className="w-6 h-6 text-slate-400" />
                  </div>

                  <Input
                    {...form.register("title")}
                    onChange={(e) => {
                      setSearchValue(e.currentTarget.value);
                      form.setValue("title", e.currentTarget.value);
                    }}
                    autoFocus
                    autoComplete="off"
                    type="text"
                    value={searchValue || ""}
                    className="h-14 text-lg border-0 ring-0 focus-visible:ring-0 shadow-none placeholder:text-slate-400"
                    placeholder="Search by title, author, or category..."
                  />

                  <div className="pr-4">
                    <button
                      type="button"
                      onClick={clearSearch}
                      className={`p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors ${
                        searchValue ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      <X className="w-5 h-5 text-slate-600" />
                    </button>
                  </div>
                </div>
              </form>

              {/* Suggestions Dropdown */}
              {suggestionBooks && suggestionBooks.length > 0 && (
                <div className="absolute z-10 w-full mt-2 bg-white rounded-lg shadow-xl overflow-hidden">
                  {suggestionBooks.map((book) => (
                    <div
                      key={book.id}
                      onClick={() => handleSuggestionClick(book.title)}
                      className="flex items-center p-3 hover:bg-blue-50 cursor-pointer transition-colors border-b last:border-0 border-slate-100"
                    >
                      <SearchIcon className="w-5 h-5 text-slate-400 mr-3" />
                      <div>
                        <p className="font-medium text-slate-800">
                          {capitalize(book.title)}
                        </p>
                        <p className="text-sm text-slate-500">
                          {book.author.author_name}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-8">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <SkeletonDemo key={i} />
              ))}
            </div>
          ) : searchedBooks && searchedBooks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {searchedBooks.map((book) => (
                <CardBook
                  key={book.id}
                  img={book.img}
                  id={book.id}
                  title={book.title}
                  author={book.author.author_name}
                  categories={book.categories}
                  price={book.book_price}
                  ratings={book.bookRatings}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="max-w-md mx-auto">
                <BookOpenIcon className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-800 mb-2">
                  {errorMesasge || "No books found"}
                </h3>
                <p className="text-slate-600">
                  Try searching for a different term or browse our categories
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
