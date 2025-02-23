"use client";

import React, { useState, useEffect } from "react";
// import axios from "axios";
import { useDebounce } from "@uidotdev/usehooks";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { getLiveAuthors } from "@/data/getAuthors";

// interface VolumeInfo {
//   authors: string[];
// }

// interface Item {
//   volumeInfo: VolumeInfo;
// }

// interface ResponseData {
//   items: Item[];
// }

interface AuthorInputProps {
  form: UseFormReturn<
    {
      categories: string[];
      book_name: string;
      author: string;
      price: string;
      img: string;
      description: string;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any,
    undefined
  >;
  authorValue: string;
  setAuthorValue: React.Dispatch<React.SetStateAction<string>>;
  bookValue: string;
}

const AuthorInput: React.FC<AuthorInputProps> = ({
  form,
  authorValue,
  setAuthorValue,
  bookValue,
}) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(true);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debouncedFetchAuthors = useDebounce(authorValue, 300); // Debounce API calls

  useEffect(() => {
    const fetchAuthors = async (
      query: string,
      bookValue: string | undefined
    ): Promise<void> => {
      if (!query) {
        setSuggestions([]);
        return;
      }

      if (bookValue) {
        try {
          const response = await getLiveAuthors(
            debouncedFetchAuthors,
            bookValue
          );
          if (response.success && response.data) {
            setSuggestions(response.data);
          }
          setLoading(true);
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      }

      // Only works with vpn and has no db integration

      // try {

      // if (bookValue) {
      //   response = await axios.get<ResponseData>(
      //     `https://www.googleapis.com/books/v1/volumes?q=inauthor:${query}+OR+intitle:${bookValue}&maxResults=5`
      //   );
      // } else {
      //   response = await axios.get<ResponseData>(
      //     `https://www.googleapis.com/books/v1/volumes?q=inauthor:${query}&maxResults=5`
      //   );
      // }

      // const authorsArray = response.data.items
      //   .map((item) => item.volumeInfo.authors)
      //   .flat();
      // setSuggestions(Array.from(new Set(authorsArray))); // Remove duplicates

      // } catch (error) {
      //   console.error("Error fetching authors:", error);
      // } finally {
      //   setLoading(false);
      // }
    };
    fetchAuthors(debouncedFetchAuthors, bookValue);
  }, [debouncedFetchAuthors, bookValue, authorValue]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const value = event.target.value;
    setAuthorValue(value);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (author: string) => {
    setAuthorValue(author);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <>
      <FormField
        control={form.control}
        name="author"
        render={(field) => (
          <FormItem>
            <FormLabel>Author*</FormLabel>
            <FormControl>
              <div>
                <Input
                  {...form.register("author")}
                  placeholder="Joanne Rowling"
                  onChange={handleChange}
                  value={authorValue}
                  autoComplete="off"
                  onFocusCapture={() => setAuthorValue("")}
                  {...field}
                />
                {suggestions.length > 0 && showSuggestions && (
                  <ul className="border border-gray-300 mt-1 p-0 bg-white rounded-sm absolute z-10">
                    {suggestions.map((author, index) => (
                      <li
                        onClick={() => handleSuggestionClick(author)}
                        key={index}
                        className="cursor-pointer p-2 hover:bg-gray-100 transition hover:border-l hover:border-blue-400"
                      >
                        {author}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </FormControl>
            <FormDescription></FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      {/* {loading && <div>Loading...</div>} */}
    </>
  );
};

export default AuthorInput;
