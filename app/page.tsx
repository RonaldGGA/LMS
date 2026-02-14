"use client";

import { BookOpenIcon } from "lucide-react";
import { useState } from "react";
import Head from "next/head";

import CardBook from "./components/card-book";
import { SkeletonDemo } from "./components/skeleton-demo";
import { searchedBooks } from "@/types";
import Search from "./components/search";

const Home = () => {
  const [searchedBooks, setSearchedBooks] = useState<searchedBooks[] | null>(
    null,
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);

  return (
    <>
      <Head>
        <title>Book Library - Find Your Next Read</title>
        <meta
          name="description"
          content="Discover a wide range of books in our library. Search by title, author, or category and find your next favorite read."
        />
        <meta
          name="keywords"
          content="books, library, reading, authors, categories"
        />
        <meta
          property="og:title"
          content="Book Library - Find Your Next Read"
        />
        <meta
          property="og:description"
          content="Discover a wide range of books in our library. Search by title, author, or category and find your next favorite read."
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://library-management-system-ten-rho.vercel.app"
        />
        <meta
          property="og:image"
          content="https://library-management-system-ten-rho.vercel.app/login.webp"
        />
        <meta property="og:site_name" content="Book Library" />
        <link
          rel="canonical"
          href="https://library-management-system-ten-rho.vercel.app"
        />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Book Library",
            url: "https://library-management-system-ten-rho.vercel.app",
            description: "Discover a wide range of books in our library.",
          })}
        </script>
      </Head>

      <div className="min-h-screen bg-ivory-50 px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <Search
            setErrorMessage={setErrorMessage}
            setSearchedBooks={setSearchedBooks}
            searchedBooks={searchedBooks}
            setLoading={setLoading}
          />

          <div className="space-y-8 mt-12">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <SkeletonDemo
                    key={i}
                    className="bg-library-midnight rounded-xl"
                  />
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
                    className="bg-library-midnight border-2 border-antique-gold/20 hover:border-golden-amber transition-colors"
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="max-w-md mx-auto">
                  <BookOpenIcon className="w-16 h-16 text-antique-gold mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-ivory-50 mb-2">
                    {errorMessage || "No books found"}
                  </h3>
                  <p className="text-antique-gold">
                    Try searching for a different term or browse our categories
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
