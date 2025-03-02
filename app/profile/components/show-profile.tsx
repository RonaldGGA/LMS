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
// ShowProfile.tsx
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { User, CalendarDays, Fingerprint } from "lucide-react";

const ShowProfile: React.FC<ShowProfileProps> = ({
  username,
  DNI,
  createdAt,
  toogleEdit,
  isEditing,
}) => {
  return (
    <Card className="w-full max-w-2xl bg-white shadow-sm border border-gray-100 mx-auto">
      <CardHeader className="pb-2">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <User className="w-6 h-6 text-blue-600" />
          User Profile
        </h2>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Username</p>
              <p className="font-medium text-gray-900">{username}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Fingerprint className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">DNI</p>
              <p className="font-medium text-gray-900">{DNI}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <CalendarDays className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Member Since</p>
              <p className="font-medium text-gray-900">
                {format(new Date(createdAt), "MMM dd, yyyy")}
              </p>
            </div>
          </div>
        </div>

        <Button
          onClick={toogleEdit}
          className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isEditing ? "Cancel Editing" : "Edit Profile"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ShowProfile;
