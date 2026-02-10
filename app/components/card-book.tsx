"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import React, { useMemo } from "react";
import { Star, Zap } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

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
  className?: string;
}

const CardBook: React.FC<CardBookProps> = ({
  id,
  title,
  img = "",
  author = "Unknown Author",
  categories = [],
  ratings = [],
  popularity = 0,
  limitedOffer = false,
}) => {
  const ratingAverage = useMemo(() => {
    if (!ratings?.length) return 0;
    const average =
      ratings.reduce((acc, { rating }) => acc + rating, 0) / ratings.length;
    return Number(average.toFixed(1));
  }, [ratings]);

  const popularityPercentage = useMemo(() => {
    return Math.min(Math.floor((popularity / 100) * 100), 100);
  }, [popularity]);

  console.log(img);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 400 }}
      className="relative group bg-white rounded-lg shadow-sm hover:shadow-md border border-gray-100 transition-all"
    >
      <Link href={`/books/book/${id}`} className="group block h-full">
        <Card className="bg-ivory-50 overflow-hidden transition-all h-full hover:shadow-lg hover:border-antique-gold/30">
          {/* Promo Badge */}
          {limitedOffer && (
            <div className="absolute top-3 right-3 bg-antique-gold text-library-dark px-3 py-1 text-xs font-medium rounded-full z-10 flex items-center shadow-sm">
              <Zap size={12} className="mr-1" />
              Limited
            </div>
          )}

          {/* Image Section - Simplified with hover zoom */}
          <div className="relative aspect-[5/3] bg-gray-100 overflow-hidden">
            <Image
              src={img || "/default-book.webp"}
              alt={title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 420px"
              loading="lazy"
            />
            <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-library-dark/60">
              <Badge className="bg-ivory-50 text-library-midnight hover:bg-ivory-50/90">
                Popularity {popularityPercentage}%
              </Badge>
            </div>
          </div>

          {/* Content Section - Minimal Info */}
          <div className="p-4 space-y-3">
            <div>
              <h3 className="font-semibold text-library-dark line-clamp-2 text-lg">
                {title}
              </h3>
              <p className="text-library-midnight/80 text-sm truncate">
                {author}
              </p>
            </div>

            {/* Rating & Categories - Simplified */}
            <div className="flex items-center gap-1.5 text-antique-gold">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  fill={
                    i < Math.floor(ratingAverage)
                      ? "currentColor"
                      : "transparent"
                  }
                  className={
                    i < Math.floor(ratingAverage) ? "" : "text-gray-300"
                  }
                />
              ))}
            </div>

            {/* Categories - Single Line */}
            {categories.length > 0 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {categories.map(({ name }, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-library-midnight/10 text-library-midnight text-xs rounded-full whitespace-nowrap"
                  >
                    {name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </Card>
      </Link>
    </motion.div>
  );
};

export default CardBook;
