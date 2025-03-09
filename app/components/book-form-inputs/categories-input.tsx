"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { debounce } from "lodash";
import { motion } from "framer-motion";
import {
  FormField,
  FormControl,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Tags, X } from "lucide-react";
import { BookFormValues, CategoryPlus } from "@/types";
import { getCategories } from "@/data/getCategories";
import { toast } from "react-hot-toast";

interface CategoriesInputProps {
  form: UseFormReturn<BookFormValues>;
  selectedCategories: CategoryPlus[];
  setSelectedCategories: (categories: CategoryPlus[]) => void;
}

const CategoriesInput: React.FC<CategoriesInputProps> = ({
  form,
  selectedCategories,
  setSelectedCategories,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [availableCategories, setAvailableCategories] = useState<
    CategoryPlus[]
  >([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Actualizar el valor del formulario cuando cambian las categorías seleccionadas
  useEffect(() => {
    if (selectedCategories.length > 0) {
      form.setValue(
        "categories",
        selectedCategories.map(({ id, name }) => ({ id, name })),
        { shouldValidate: !!form.formState.submitCount }
      );
    }
  }, [selectedCategories, form]);

  // Búsqueda debounceada
  const searchCategories = useMemo(
    () =>
      debounce(async (query: string) => {
        try {
          const res = await getCategories(query);
          if (res?.success && res.data) {
            setAvailableCategories(
              res.data.map((c) => ({ ...c, isNew: false }))
            );
          }
        } catch (error) {
          console.error(error);
          toast.error("Error loading categories");
        }
      }, 300),
    []
  );

  useEffect(() => {
    searchCategories(searchQuery);
    return () => searchCategories.cancel();
  }, [searchQuery, searchCategories]);

  const handleAddCategory = (category: CategoryPlus) => {
    if (selectedCategories.length >= 7) {
      toast.error("Maximum 7 categories allowed");
      return;
    }

    setSelectedCategories([...selectedCategories, category]);
    setSearchQuery("");
    setIsDropdownOpen(false);
  };

  const handleCreateCategory = () => {
    if (!searchQuery) return;
    if (searchQuery.length > 25) return;

    const newCategory = {
      id: crypto.randomUUID(),
      name: searchQuery.trim(),
      isNew: true,
    };

    handleAddCategory(newCategory);
  };

  const handleRemoveCategory = (categoryId: string) => {
    setSelectedCategories(
      selectedCategories.filter((c) => c.id !== categoryId)
    );
  };

  const filteredCategories = useMemo(
    () =>
      availableCategories.filter(
        (c) => !selectedCategories.some((sc) => sc.id === c.id)
      ),
    [availableCategories, selectedCategories]
  );

  return (
    <FormField
      control={form.control}
      name="categories"
      render={({ field, fieldState }) => (
        <FormItem>
          <div className="space-y-3 relative">
            <Label className="flex items-center gap-2 text-sm font-medium text-ivory-50/80 group-focus-within:text-antique-gold transition-colors">
              Categories *
              <span className="text-ivory-50/50 font-normal ml-1">
                ({selectedCategories.length}/7)
              </span>
            </Label>

            <FormControl>
              <div className="space-y-3 relative">
                {/* Selected Categories */}
                <div className="flex flex-wrap gap-2 min-h-[20px] items-start p-1">
                  {selectedCategories.map((category) => (
                    <Badge
                      key={category.id}
                      variant="secondary"
                      className="pl-3 pr-1 py-1.5 transition-all   
                    hover:bg-library-midnight/80 group relative"
                    >
                      <span className="max-w-[160px] truncate">
                        {category.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveCategory(category.id)}
                        className="ml-1.5 p-1 translate-x-2 -translate-y-1 rounded hover:bg-library-midnight/50   
                      transition-colors absolute -right-1 -top-1.5 bg-library-dark   
                      shadow-sm border"
                      >
                        <X className="w-3.5 h-3.5 text-ivory-50/50" />
                      </button>
                    </Badge>
                  ))}
                </div>

                {/* Search & Dropdown */}
                <div className="relative group">
                  <div className="relative flex gap-2 items-center">
                    <Tags className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ivory-50/50" />
                    <Input
                      {...field}
                      ref={inputRef}
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setIsDropdownOpen(true);
                      }}
                      onBlur={() => setIsDropdownOpen(false)}
                      onFocus={() => setIsDropdownOpen(true)}
                      onKeyDown={(e) => {
                        if (e.key === "Escape") setIsDropdownOpen(false);
                        if (e.key === "Enter" && searchQuery)
                          handleCreateCategory();
                      }}
                      placeholder="Search or create categories..."
                      className={`peer h-12 rounded-lg transition-all border ${
                        fieldState.error
                          ? "border-golden-amber"
                          : "border-library-dark focus:ring-2 focus:ring-antique-gold"
                      } pl-10 pr-8 text-base shadow-sm hover:border-library-midnight`}
                    />
                    <span className="right-0 absolute md:right-24 text-sm text-ivory-50/50">
                      {searchQuery.length}/25
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="hidden md:flex absolute right-2 h-8 px-3 border-antique-gold/30 text-antique-gold   
                    hover:bg-antique-gold/10 hover:border-antique-gold/50 shadow-sm  
                    disabled:opacity-50 disabled:pointer-events-none"
                      onMouseDown={handleCreateCategory}
                      disabled={!searchQuery.trim()}
                    >
                      Add New
                    </Button>
                  </div>

                  {isDropdownOpen && (
                    <motion.ul
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute z-20 w-full mt-2 bg-library-dark border-library-midnight rounded-lg shadow-xl   
                    max-h-60 overflow-y-auto divide-y divide-library-midnight"
                    >
                      {filteredCategories.length === 0 ? (
                        <li className="p-4 text-center text-ivory-50/50 flex flex-col items-center">
                          No categories found
                          {searchQuery && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="mt-2 text-antique-gold"
                              onMouseDown={handleCreateCategory}
                            >
                              Create &quot;{searchQuery}&quot;
                            </Button>
                          )}
                        </li>
                      ) : (
                        filteredCategories.map((category) => (
                          <li
                            key={category.id}
                            onMouseDown={() => handleAddCategory(category)}
                            className="hover:bg-library-midnight/50 cursor-pointer flex items-center   
                          justify-between transition-colors first:rounded-t-lg last:rounded-b-lg"
                          >
                            <span className="border-l transition-colors hover:border-library-midnight p-3 flex items-center gap-2 w-full">
                              {category.name}
                            </span>
                            {selectedCategories.some(
                              (c) => c.id === category.id
                            ) && (
                              <Check className="w-4 h-4 text-antique-gold" />
                            )}
                          </li>
                        ))
                      )}
                    </motion.ul>
                  )}
                </div>
              </div>
            </FormControl>

            <FormMessage className="absolute -bottom-5 text-sm text-golden-amber" />
          </div>
        </FormItem>
      )}
    />
  );
};

export default CategoriesInput;
