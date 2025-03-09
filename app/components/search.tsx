import React from "react";

import { Input } from "@/components/ui/input";
import { searchSchema } from "@/zod-schemas";
import { BookOpen, Search as SearchIcon, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import {
  getBooks,
  getDefaultBooks,
  getLiveSuggestionBooks,
} from "@/data/getBooks";
import { useDebounce } from "@uidotdev/usehooks";
import z from "zod";
import { searchedBooks } from "@/types";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface SearchProps {
  setLoading: (loading: boolean) => void;
  searchedBooks: searchedBooks[] | null;
  setErrorMessage: (errorMessage: string) => void;
  setSearchedBooks: (books: searchedBooks[] | null) => void;
}

export type FilterType = "title" | "author" | "category" | "rating";
export type SortType = "relevance" | "popularity" | "rating" | "price";
const Search: React.FC<SearchProps> = ({
  searchedBooks,
  setSearchedBooks,
  setLoading,
  setErrorMessage,
}) => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [quantity] = useState(20);
  const [sortOption, setSortOption] = useState<SortType>("relevance");

  const [selectedFilter, setSelectedFilter] = useState<FilterType>("title");

  useEffect(() => {
    // Función para manejar la tecla Enter o Search
    const handleKeyPress = (e: { key: string }) => {
      if (e.key === "Enter" || e.key === "Search") {
        // Lógica que se ejecutará cuando se presione Enter o Search
        onSubmit(form.getValues());
      }
    };

    // Añadir el event listener al documento
    document.addEventListener("keydown", handleKeyPress);

    // Limpia el event listener al desmontar
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []); // Agregamos contador como dependencia

  const form = useForm<z.infer<typeof searchSchema>>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      searchTerm: "",
    },
  });
  const debouncedSearchValue = useDebounce(searchValue, 300);

  useEffect(() => {
    if (debouncedSearchValue.length < 2) {
      setSuggestionBooks(null);
      return;
    }
    const fetchSuggestions = async () => {
      try {
        const liveBooks = await getLiveSuggestionBooks(
          debouncedSearchValue,
          sortOption,
          selectedFilter
        );
        setSuggestionBooks(liveBooks.data);
      } catch (error) {
        console.error("Error fetching live books:", error);
      } finally {
      }
    };

    fetchSuggestions();
  }, [debouncedSearchValue, selectedFilter, sortOption]);

  const [suggestionBooks, setSuggestionBooks] = useState<
    { id: string; title: string; author: { author_name: string } }[] | null
  >(null);

  const clearSearch = () => {
    setSearchValue("");
    setSuggestionBooks(null);
  };

  useEffect(() => {
    // Improve
    const searchDefaultBooks = async () => {
      try {
        const result = await getDefaultBooks(quantity);
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
  }, [quantity]);

  const handleSuggestionClick = (bookName: string) => {
    setSearchValue(bookName);
    setSuggestionBooks(null);
    form.setValue("searchTerm", bookName);
    form.handleSubmit(onSubmit)();
  };

  const onSubmit = async (values: z.infer<typeof searchSchema>) => {
    console.log(`submmited ${values.searchTerm}`);

    setLoading(true);

    try {
      const results = await getBooks(
        values.searchTerm,
        sortOption,
        selectedFilter
      );
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

  const getPlaceholder = (filter: FilterType) => {
    const placeholders = {
      title: "Search book by titles...",
      author: "Search book by author...",
      category: "Search by category",
      rating: "Minimun rating 1-5 (e.g. 4.5)",
    };
    return placeholders[filter] || "Search...";
  };

  return (
    <div className="flex flex-col items-center mb-16">
      <h1 className="text-4xl font-bold text-vintage-blue-900 mb-8 text-center">
        Search your favorite book
      </h1>

      <div className="w-full max-w-4xl relative">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex gap-2 items-center w-full">
            <div className="flex-1 relative">
              <Input
                {...form.register("searchTerm")}
                onChange={(e) => {
                  setSearchValue(e.target.value);
                  form.setValue("searchTerm", e.target.value);
                }}
                autoFocus
                placeholder={getPlaceholder(selectedFilter)}
                className="h-12 text-lg border-antique-gold focus-visible:ring-golden-amber placeholder:text-library-midnight/70 text-vintage-blue-900"
              />

              <div className="absolute right-2 top-2.5 flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={clearSearch}
                  className={`p-1.5 rounded-full hover:bg-antique-gold/10 transition-colors ${
                    searchValue ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <X className="w-5 h-5 text-library-midnight" />
                </button>
                <Button
                  type="submit"
                  variant="ghost"
                  className="text-library-midnight hover:bg-antique-gold/10"
                >
                  <SearchIcon className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Advanced Filters */}
          <div className="flex gap-4 items-center justify-end">
            <Select
              onValueChange={(value) => setSelectedFilter(value as FilterType)}
            >
              <SelectTrigger className="w-[180px] border-antique-gold hover:border-golden-amber focus:ring-golden-amber">
                <SelectValue placeholder="Title" />
              </SelectTrigger>
              <SelectContent className="bg-ivory-50 border-antique-gold">
                <SelectGroup>
                  <SelectLabel className="text-library-midnight sr-only">
                    Filter Type
                  </SelectLabel>
                  <SelectItem
                    value="title"
                    className="focus:bg-antique-gold/10 text-vintage-blue-900"
                  >
                    Title
                  </SelectItem>
                  <SelectItem
                    value="author"
                    className="focus:bg-antique-gold/10 text-vintage-blue-900"
                  >
                    Author
                  </SelectItem>
                  <SelectItem
                    value="category"
                    className="focus:bg-antique-gold/10 text-vintage-blue-900"
                  >
                    Category
                  </SelectItem>
                  <SelectItem
                    disabled={true}
                    value="rating"
                    className="focus:bg-antique-gold/10 text-vintage-blue-900"
                  >
                    Rating (soon...)
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2">
              <Label className="text-library-midnight">Sort by:</Label>
              <Select
                onValueChange={(value) => setSortOption(value as SortType)}
              >
                <SelectTrigger className="w-[150px] border-antique-gold">
                  <SelectValue placeholder="Relevance" />
                </SelectTrigger>
                <SelectContent className="bg-ivory-50 border-antique-gold">
                  <SelectGroup>
                    <SelectLabel className="text-library-midnight sr-only">
                      Sort Type
                    </SelectLabel>
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="popularity">Popularity</SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
                    <SelectItem value="price">Price</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </form>

        {/* Suggestions Dropdown */}
        {suggestionBooks && suggestionBooks.length > 0 && (
          <div className="absolute z-10 w-full mt-2 bg-ivory-50 rounded-lg shadow-lg border border-antique-gold">
            {suggestionBooks.map((book) => (
              <div
                key={book.id}
                onClick={() => handleSuggestionClick(book.title)}
                className="flex items-center p-3 hover:bg-antique-gold/5 cursor-pointer border-b last:border-0 border-antique-gold/10"
              >
                <BookOpen className="w-5 h-5 text-golden-amber mr-3" />
                <div>
                  <p className="font-medium text-vintage-blue-900">
                    {capitalize(book.title)}
                  </p>
                  <p className="text-sm text-library-midnight">
                    {book.author.author_name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
