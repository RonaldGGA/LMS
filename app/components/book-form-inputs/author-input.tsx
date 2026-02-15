"use client";

import { useState, useCallback, useRef } from "react";
import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Loader2, CheckCircle, User, X } from "lucide-react";
import { debounce } from "lodash";
import { getLiveAuthors } from "@/data/getAuthors";
import { BookFormValues } from "@/types";

const AuthorInput = ({ form }: { form: UseFormReturn<BookFormValues> }) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const bookValue = form.watch("title");
  const authorValue = form.watch("author");

  const fetchAuthors = useCallback(
    debounce(async (query: string) => {
      if (query.length < 2) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        const authors = await getLiveAuthors(authorValue, bookValue);
        if (authors.success && authors.data) {
          setSuggestions(authors.data);
          setShowSuggestions(true);
        }
      } catch (error) {
        console.error("Error fetching authors:", error);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    [authorValue],
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    form.setValue("author", value, { shouldValidate: true });
    fetchAuthors(value);
  };

  const handleSuggestionClick = (author: string) => {
    form.setValue("author", author, { shouldValidate: true });
    setShowSuggestions(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  return (
    <FormField
      control={form.control}
      name="author"
      render={({ field, fieldState }) => (
        <FormItem className="relative">
          <FormLabel className="text-sm font-medium text-ivory-50/80 peer-focus:text-antique-gold transition-colors">
            Author *
          </FormLabel>

          <FormControl>
            <div className="relative group">
              <Input
                {...form.register("author")}
                ref={inputRef}
                onChange={handleInputChange}
                onFocus={() => setShowSuggestions(true)}
                onKeyDown={handleKeyDown}
                autoComplete="off"
                onBlur={() => setShowSuggestions(false)}
                value={field.value}
                className={`peer h-12 rounded-lg transition-all border ${
                  fieldState.error
                    ? "border-golden-amber"
                    : "border-library-dark focus:ring-2 focus:ring-antique-gold"
                } pl-10 pr-8 text-base shadow-sm hover:border-antique-gold/80`}
                placeholder="Search authors..."
              />

              <div className="absolute inset-y-0 left-3 flex items-center">
                <User className="h-5 w-5 text-ivory-50/50 peer-focus:text-antique-gold" />
              </div>

              {isLoading && (
                <div className="absolute inset-y-0 right-3 flex items-center">
                  <Loader2 className="h-5 w-5 text-ivory-50/50 animate-spin" />
                </div>
              )}

              {!isLoading && authorValue && (
                <button
                  type="button"
                  onClick={() => {
                    form.resetField("author");
                  }}
                  className="absolute inset-y-0 right-3 flex items-center"
                >
                  <X className="h-5 w-5 text-ivory-50/50 hover:text-golden-amber transition-colors" />
                </button>
              )}
            </div>
          </FormControl>

          {showSuggestions && suggestions.length > 0 && (
            <ul
              role="listbox"
              className="absolute z-20 w-full mt-2 bg-library-dark border-library-midnight rounded-lg shadow-lg   
          divide-y divide-library-midnight max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-1"
            >
              {suggestions.map((author, index) => (
                <li
                  key={author}
                  role="option"
                  aria-selected={form.watch("author") === author}
                  onMouseDown={() => handleSuggestionClick(author)}
                  className={`cursor-pointer flex items-center justify-between   
                hover:bg-library-midnight/50 transition-colors ${
                  index === 0 ? "rounded-t-lg" : ""
                } ${index === suggestions.length - 1 ? "rounded-b-lg" : ""}`}
                >
                  <span className="p-3 border-l hover:border-library-midnight w-full transition-colors text-ivory-50">
                    {author}
                  </span>
                  {form.watch("author") === author && (
                    <CheckCircle className="h-5 w-5 text-antique-gold ml-2" />
                  )}
                </li>
              ))}
            </ul>
          )}

          <FormMessage className="absolute -bottom-5 left-0 text-sm text-golden-amber" />
        </FormItem>
      )}
    />
  );
};

export default AuthorInput;
