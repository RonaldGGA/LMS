import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import Link from "next/link";
import React, { useMemo } from "react";
import { Star, Bookmark, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { CldImage } from "next-cloudinary";

interface CardBookProps {
  id: string;
  title: string;
  img?: string | null;
  author?: string;
  categories?: { name: string }[];
  ratings?: { rating: number }[];
  price?: string;
  returnDate?: Date;
  popularity?: number;
  limitedOffer?: boolean;
}

const CardBook: React.FC<CardBookProps> = ({
  id,
  title,
  img = "",
  author = "Unknown Author",
  categories = [],
  ratings = [],
  price,
  returnDate,
  popularity = 0,
  limitedOffer = false,
}) => {
  const ratingAverage = useMemo(() => {
    if (!ratings?.length) return 0;
    const average =
      ratings.reduce((acc, { rating }) => acc + rating, 0) / ratings.length;
    return Number(average.toFixed(1));
  }, [ratings]);

  const statusText = useMemo(() => {
    if (price) return `Deposit: $${parseFloat(price).toFixed(2)}`;
    if (returnDate)
      return `Due: ${format(new Date(returnDate), "MMM dd, yyyy")}`;
    return "Available Now";
  }, [price, returnDate]);

  const popularityPercentage = useMemo(() => {
    return Math.min(Math.floor((popularity / 100) * 100), 100);
  }, [popularity]);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 400 }}
      className="relative group bg-white rounded-lg shadow-sm hover:shadow-md border border-gray-100 transition-all"
    >
      <Card className="overflow-hidden">
        {/* Promo Badge */}
        {limitedOffer && (
          <div className="absolute top-3 right-3 bg-blue-600 text-white px-2.5 py-1 text-xs font-medium rounded-full z-10 flex items-center">
            <Zap size={12} className="mr-1" />
            Limited
          </div>
        )}

        {/* Image Section */}
        <div className="relative aspect-[6/4] max-h-[300px] bg-gray-50">
          <CldImage
            src={img || "/default-book.webp"}
            alt={title}
            fill
            className="object-cover transition-opacity group-hover:opacity-90 max-h-[300px]"
            sizes="(max-width: 768px) 100vw, 320px"
          />
          <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/40">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-white">
                {popularityPercentage}% Popular
              </span>
              <Badge variant="secondary" className="text-xs bg-white/90">
                {statusText}
              </Badge>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4">
          <div className="mb-3">
            <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1">
              {title}
            </h3>
            <p className="text-sm text-gray-500 truncate">{author}</p>
          </div>

          {/* Rating & Categories */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={`${
                    i < Math.floor(ratingAverage)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300 fill-gray-300"
                  }`}
                />
              ))}
              <span className="text-sm text-gray-500 ml-1">
                ({ratings.length})
              </span>
            </div>

            {categories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {categories.slice(0, 2).map(({ name }, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md"
                  >
                    {name}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Action Button */}
          <Link
            href={`/books/book/${id}`}
            className="mt-4 w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-md text-sm font-medium transition-colors"
          >
            <Bookmark size={14} />
            Reserve Now
          </Link>
        </div>
      </Card>
    </motion.div>
  );
};

export default CardBook;
