import FormBooks from "@/app/components/form-book";
import React from "react";

const AddBook = async () => {
  return (
    <div className="w-full">
      <FormBooks book={undefined} onSuccess={undefined} />;
    </div>
  );
};

export default AddBook;
