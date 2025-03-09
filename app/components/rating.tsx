"use client";
import React, { useMemo, useState } from "react";
import { BookOpen, InfoIcon, Star, StarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogHeader,
  DialogTrigger,
  DialogClose,
  DialogContent,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { ratingSchema } from "@/zod-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import toast from "react-hot-toast";
import { BigBook } from "@/types";
import { z } from "zod";
import { addRating } from "@/actions/add-rating";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface RatingProps {
  bookInfo: BigBook;
  userId: string;
}

const Rating: React.FC<RatingProps> = ({ bookInfo, userId }) => {
  const [open, setOpen] = useState(false);
  const [pickedStars, setPickedStars] = useState(0);
  const [hoverStars, setHoverStars] = useState(0);

  const form = useForm<z.infer<typeof ratingSchema>>({
    resolver: zodResolver(ratingSchema),
    defaultValues: {
      rating: 0,
    },
  });

  const { ratings, totalRatings, averageRating } = useMemo(() => {
    const ratings = bookInfo.bookRatings || [];
    const totalRatings = ratings.length;
    const averageRating =
      totalRatings > 0
        ? Number(
            (
              ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings
            ).toFixed(1)
          )
        : 0;
    return { ratings, totalRatings, averageRating };
  }, [bookInfo]);

  const ratingDistribution = useMemo(() => {
    const distribution = [0, 0, 0, 0, 0];
    ratings.forEach((r) => distribution[r.rating - 1]++);
    return distribution.map((count) => (count / totalRatings) * 100);
  }, [ratings, totalRatings]);

  const onSubmit = async (values: z.infer<typeof ratingSchema>) => {
    try {
      const result = await addRating({
        userId,
        userRating: values.rating,
        bookId: bookInfo.id,
      });
      if (!result.success) {
        throw new Error(result.error ? result.error : "Something went wrong");
      } else {
        toast.success("Thanks for your rating!");
        window.location.reload();
        setOpen(false);
        form.reset();
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error instanceof Error ? error.message : "Failed to submit rating"
      );
    }
  };

  const handleStarInteraction = (stars: number) => {
    setPickedStars(stars);
    form.setValue("rating", stars);
  };

  const StarRating = ({
    value,
    interactive = false,
  }: {
    value: number;
    interactive?: boolean;
  }) => (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => {
        const ratingValue = i + 1;
        return (
          <Star
            key={i}
            className={cn(
              "w-6 h-6 transition-all duration-150",
              ratingValue <= value
                ? "fill-golden-amber stroke-golden-amber "
                : "fill-gray-200 stroke-gray-300",
              interactive && "cursor-pointer hover:scale-125"
            )}
            onMouseEnter={() => interactive && setHoverStars(ratingValue)}
            onMouseLeave={() => interactive && setHoverStars(0)}
            onClick={() => interactive && handleStarInteraction(ratingValue)}
          />
        );
      })}
    </div>
  );

  function StarsRatingTooltip({
    children,
    ratingDistribution,
  }: {
    children: React.ReactNode;
    ratingDistribution: number[];
  }) {
    return (
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>{children}</TooltipTrigger>
          <TooltipContent
            side="top"
            className="p-4 bg-white border border-gray-200 rounded-lg shadow-xl w-64"
            avoidCollisions={true}
          >
            <div className="space-y-3 ">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-900">
                  Rating Breakdown
                </h4>
                <InfoIcon className="w-4 h-4 text-gray-500" />
              </div>

              {[5, 4, 3, 2, 1].map((stars, i) => {
                const percentage = Math.round(ratingDistribution[4 - i]);
                return (
                  <div key={stars} className="flex items-center gap-3 group">
                    <div className="flex items-center gap-1 w-14">
                      <span className="text-sm font-medium text-gray-900">
                        {stars}
                      </span>
                      <StarIcon className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    </div>

                    <div className="flex-1 flex items-center gap-2">
                      <Progress
                        value={percentage}
                        className="h-2 bg-gray-100"
                      />

                      <span className="text-sm font-medium text-gray-600 w-8">
                        {percentage ? percentage : 0}%
                      </span>
                    </div>
                  </div>
                );
              })}

              <p className="mt-3 text-xs text-gray-500 text-center">
                Based on recent reader ratings
              </p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200 w-full md:max-w-md">
      <div className="flex items-center gap-3">
        <BookOpen className="w-6 h-6 text-library-midnight" />
        <h3 className="text-lg font-semibold">Reader Ratings</h3>
        <Badge variant="outline" className="ml-2">
          {totalRatings} reviews
        </Badge>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <StarsRatingTooltip ratingDistribution={ratingDistribution}>
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-4">
              <span className="text-4xl font-bold text-library-midnight">
                {averageRating}
              </span>
              <div className="space-y-1">
                <StarRating value={averageRating} />
                <p className="text-sm text-gray-600">Average rating</p>
              </div>
            </div>
          </div>
        </StarsRatingTooltip>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full md:w-auto">
              Rate this book
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-md">
            <DialogHeader>
              <h3 className="text-xl font-semibold">
                How would you rate this book?
              </h3>
              <p className="text-sm text-gray-600">
                Your rating helps other readers
              </p>
            </DialogHeader>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="rating"
                  render={() => (
                    <FormItem>
                      <FormControl>
                        <div className="space-y-4">
                          <div className="flex justify-center">
                            <StarRating
                              value={hoverStars || pickedStars}
                              interactive
                            />
                          </div>

                          <div className="text-center">
                            {!pickedStars ? (
                              <p className="text-gray-500">
                                Select your rating
                              </p>
                            ) : (
                              <Badge variant="secondary">
                                {pickedStars} Star{pickedStars > 1 ? "s" : ""}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </FormControl>

                      <FormMessage className="text-center" />

                      <div className="flex justify-center gap-3 mt-6">
                        <DialogClose asChild>
                          <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button
                          type="submit"
                          disabled={!pickedStars || form.formState.isSubmitting}
                          className="bg-library-midnight hover:bg-library-midnight"
                        >
                          {form.formState.isSubmitting ? (
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Submitting...
                            </div>
                          ) : (
                            "Submit Rating"
                          )}
                        </Button>
                      </div>
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Rating;
