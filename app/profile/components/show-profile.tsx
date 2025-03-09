import { Button } from "@/components/ui/button";
import React from "react";

interface ShowProfileProps {
  username: string;
  DNI: string;
  toggleEdit: () => void;
  userImg: string | null;
}
// ShowProfile.tsx
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { User } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

const ShowProfile: React.FC<ShowProfileProps> = ({
  username,
  DNI,
  toggleEdit,
  userImg,
}) => {
  return (
    <Card className="w-full max-w-2xl bg-ivory-50 shadow-lg border border-golden-amber/20 mx-auto">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-golden-amber/10 rounded-full">
            <User className="w-6 h-6 text-golden-amber" />
          </div>
          <h2 className="text-2xl font-bold text-library-dark">User Profile</h2>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex flex-col items-center gap-4">
          <div className="relative h-24 w-24 rounded-full border-4 border-golden-amber/30 shadow-md flex items-center justify-center">
            <Avatar className="">
              <AvatarImage src={userImg || ""} />
              <AvatarFallback className="text-3xl text-center  w-full">
                {username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="w-full grid grid-cols-2 gap-4 text-library-dark">
            <div className="space-y-1">
              <p className="text-sm text-golden-amber">Username</p>
              <p className="font-medium">{username}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-golden-amber">DNI</p>
              <p className="font-medium">{DNI}</p>
            </div>
          </div>
        </div>

        <Button
          onClick={toggleEdit}
          className="w-full bg-golden-amber hover:bg-golden-amber/90 text-library-dark font-medium"
        >
          Edit Profile
        </Button>
      </CardContent>
    </Card>
  );
};

export default ShowProfile;
