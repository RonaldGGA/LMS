import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import React from "react";

interface ShowProfileProps {
  username: string;
  DNI: string;
  createdAt: Date;
  toogleEdit: () => void;
  isEditing: boolean;
}

const ShowProfile: React.FC<ShowProfileProps> = ({
  username,
  DNI,
  createdAt,
  toogleEdit,
  isEditing,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <p>
        <strong>Username:</strong> {username}
      </p>
      <p>
        <strong>DNI:</strong> {DNI}
      </p>
      <p>
        <strong>Active since:</strong>
        {createdAt ? format(new Date(createdAt), "PPP") : "Loading..."}
      </p>
      <Button
        onClick={toogleEdit}
        type="button"
        className="lg:max-w-[100px] w-[100px] mr-auto mt-7"
      >
        {isEditing ? "Cancel" : "Edit"}
      </Button>
    </div>
  );
};

export default ShowProfile;
