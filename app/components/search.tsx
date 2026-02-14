// app/components/search.tsx (updated)
import React, { useEffect, useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { searchSchema } from "@/zod-schemas";
import { BookOpen, Search as SearchIcon, X } from "lucide-react";
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
  setSearchedBooks,
  setLoading,
  setErrorMessage,
}) => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [quantity] = useState(20);
  const [sortOption, setSortOption] = useState<SortType>("relevance");
  const [selectedFilter, setSelectedFilter] = useState<FilterType>("title");
  const [suggestionBooks, setSuggestionBooks] = useState<
    { id: string; title: string; author: { author_name: string } }[] | null
  >(null);

  const form = useForm<z.infer<typeof searchSchema>>({
    resolver: zodResolver(searchSchema),
    defaultValues: { searchTerm: "" },
  });

  const debouncedSearchValue = useDebounce(searchValue, 300);
  const isFirstRender = useRef(true);

  useEffect(() => {
    const fetchDefault = async () => {
      setLoading(true);
      try {
        const result = await getDefaultBooks(quantity, sortOption);
        if (!result?.success) {
          if (result?.error === "Empty") {
            setErrorMessage("No books in the library");
            setSearchedBooks([]);
          } else {
            toast.error("Something happened searching the books");
            setSearchedBooks([]);
          }
        } else {
          setSearchedBooks(result.data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDefault();
  }, []);

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
          selectedFilter,
        );
        setSuggestionBooks(liveBooks.data);
      } catch (error) {
        console.error("Error fetching live books:", error);
      }
    };
    fetchSuggestions();
  }, [debouncedSearchValue, selectedFilter, sortOption]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    form.handleSubmit(onSubmit)();
  }, [sortOption, selectedFilter]);

  const clearSearch = async () => {
    setSearchValue("");
    setSuggestionBooks(null);
    form.setValue("searchTerm", "");
    setLoading(true);
    try {
      const result = await getDefaultBooks(quantity, sortOption);
      if (result?.success) setSearchedBooks(result.data);
      else setSearchedBooks([]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (bookName: string) => {
    setSearchValue(bookName);
    setSuggestionBooks(null);
    form.setValue("searchTerm", bookName);
    form.handleSubmit(onSubmit)();
  };

  const onSubmit = async (values: z.infer<typeof searchSchema>) => {
    setLoading(true);
    setErrorMessage("");
    try {
      /**Easy fix for empty searchs*/
      const fixedSearch = values.searchTerm === "" ? " " : values.searchTerm;

      const results = await getBooks(fixedSearch, sortOption, selectedFilter);

      if (results?.success && results.data) {
        setSearchedBooks(results.data);
        setSuggestionBooks(null);
      } else {
        setSearchedBooks([]);
        setErrorMessage(results?.error || "No books found");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Internal server error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        onSubmit(form.getValues());
      }
    };
    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, []);

  const capitalize = (str: string) => str[0].toUpperCase() + str.slice(1);

  const getPlaceholder = (filter: FilterType) => {
    const placeholders = {
      title: "Search by title...",
      author: "Search by author...",
      category: "Search by category",
      rating: "Minimum rating 1‑5 (e.g. 4.5)",
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
                className="h-12 text-lg border-antique-gold focus-visible:ring-golden-amber placeholder:text-library-midnight/70 text-vintage-blue-900 pr-20 pl-4 rounded-full shadow-sm"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <button
                  type="button"
                  onClick={clearSearch}
                  className={`p-1.5 rounded-full hover:bg-antique-gold/20 transition-colors ${
                    searchValue
                      ? "opacity-100"
                      : "opacity-0 pointer-events-none"
                  }`}
                >
                  <X className="w-5 h-5 text-library-midnight" />
                </button>
                <Button
                  type="submit"
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-antique-gold/20"
                >
                  <SearchIcon className="w-5 h-5 text-library-midnight" />
                </Button>
              </div>
            </div>
          </div>

          <div className="flex gap-4 items-center justify-end">
            <Select
              value={selectedFilter}
              onValueChange={(value) => setSelectedFilter(value as FilterType)}
            >
              <SelectTrigger className="w-[180px] border-antique-gold rounded-full">
                <SelectValue placeholder="Title" />
              </SelectTrigger>
              <SelectContent className="bg-ivory-50 border-antique-gold rounded-xl">
                <SelectGroup>
                  <SelectLabel className="sr-only">Filter Type</SelectLabel>
                  <SelectItem value="title">Title</SelectItem>
                  <SelectItem value="author">Author</SelectItem>
                  <SelectItem value="category">Category</SelectItem>
                  <SelectItem value="rating" disabled>
                    Rating (soon...)
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <Label className="text-library-midnight">Sort by:</Label>
              <Select
                value={sortOption}
                onValueChange={(value) => setSortOption(value as SortType)}
              >
                <SelectTrigger className="w-[150px] border-antique-gold rounded-full">
                  <SelectValue placeholder="Relevance" />
                </SelectTrigger>
                <SelectContent className="bg-ivory-50 border-antique-gold rounded-xl">
                  <SelectGroup>
                    <SelectLabel className="sr-only">Sort Type</SelectLabel>
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="popularity">Popularity</SelectItem>
                    <SelectItem value="price">Price</SelectItem>
                    <SelectItem value="rating" disabled>
                      Rating
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </form>

        {suggestionBooks && suggestionBooks.length > 0 && (
          <div className="absolute z-10 w-full mt-2 bg-ivory-50 rounded-xl shadow-lg border border-antique-gold overflow-hidden">
            {suggestionBooks.map((book) => (
              <div
                key={book.id}
                onClick={() => handleSuggestionClick(book.title)}
                className="flex items-center p-3 hover:bg-antique-gold/10 cursor-pointer border-b last:border-0 border-antique-gold/10 transition-colors"
              >
                <BookOpen className="w-5 h-5 text-golden-amber mr-3 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="font-medium text-vintage-blue-900 truncate">
                    {capitalize(book.title)}
                  </p>
                  <p className="text-sm text-library-midnight truncate">
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
