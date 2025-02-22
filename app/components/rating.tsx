"use client";
import React, { useMemo, useState } from "react";

import { StarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { ratingSchema } from "@/zod-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";

import z from "zod";
import { addRating } from "@/actions/add-rating";
import toast from "react-hot-toast";
import { BigBook } from "@/types";

interface RatingProps {
  bookInfo: BigBook;
  setReload: () => void;
  userId: string;
}

const Rating: React.FC<RatingProps> = ({ bookInfo, setReload, userId }) => {
  const [pickedStars, setPickedStars] = useState(0);

  const form = useForm<z.infer<typeof ratingSchema>>({
    resolver: zodResolver(ratingSchema),
    defaultValues: {
      rating: 0,
    },
  });

  const ratingMedia = useMemo(() => {
    // Verificamos que bookInfo y bookInfo.ratings existan y tengan elementos
    if (
      !bookInfo ||
      !bookInfo.bookRatings ||
      bookInfo.bookRatings.length === 0
    ) {
      return 0;
    }

    // Calculamos el promedio de las calificaciones
    const averageRating =
      bookInfo.bookRatings.reduce((total, item) => total + item.rating, 0) /
      bookInfo.bookRatings.length;

    // Devolvemos el promedio con dos decimales
    return Number(averageRating.toFixed(2));
  }, [bookInfo]); // Asegúrate de incluir todas las dependencias

  const onSubmit = async (values: z.infer<typeof ratingSchema>) => {
    try {
      const result = await addRating({
        userId,
        userRating: values.rating,
        bookId: bookInfo.id,
      });
      if (!result.success) {
        toast.error("Something happened adding the rating");
      } else {
        toast.success("Rating added correctly");
        setReload();
      }
    } catch (error) {
      console.log(error);
      toast.error("An error ocurred");
    }
  };
  const handleStarsPicked = (starNumber: number) => {
    if (pickedStars === starNumber) {
      setPickedStars(0);
      form.setValue("rating", 0);
    } else {
      setPickedStars(starNumber);
      form.setValue("rating", starNumber);
    }
  };
  return (
    <div className="flex items-center">
      <p className="text-lg font-semibold">Rating: {ratingMedia}/5</p>
      <Dialog>
        <DialogTrigger className="p-1 shadow shadow-gray-400 hover:bg-gray-500 transition-colors rounded">
          Rate it!
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>What do you think about this book?</DialogTitle>
            <DialogDescription>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <FormField
                    control={form.control}
                    name="rating"
                    render={() => (
                      <FormItem>
                        <FormLabel>Rating</FormLabel>
                        <FormControl className="flex flex-col gap-2">
                          <>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => {
                                if (i + 1 > pickedStars) {
                                  return (
                                    <StarIcon
                                      fill=""
                                      width={20}
                                      key={i}
                                      color="black"
                                      onClick={() => handleStarsPicked(i + 1)}
                                    />
                                  );
                                } else {
                                  return (
                                    <StarIcon
                                      fill="yellow"
                                      width={20}
                                      key={i}
                                      color="black"
                                      onClick={() => handleStarsPicked(i + 1)}
                                    />
                                  );
                                }
                              })}
                            </div>
                            <Badge>{pickedStars}/5</Badge>
                            <DialogFooter className="text-md text-black p-3">
                              <DialogClose>
                                <Button type="submit">Save</Button>
                              </DialogClose>
                            </DialogFooter>
                          </>
                        </FormControl>
                        <FormDescription></FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Rating;
