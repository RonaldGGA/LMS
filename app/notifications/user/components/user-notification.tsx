import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface UserNotificationProps {
  message: string;
  markRead: () => void;
  createdAt: Date;
}

function UserNotification({
  message,
  markRead,
  createdAt,
}: UserNotificationProps) {
  return (
    <div className="flex items-center justify-between p-2 max-w-[900px] w-[95%] rounded-md shadow-sm shadow-black bg-white ">
      <div className="flex-col">
        <div className="flex justify-between items-center p-1 ml-4">
          <p className="text-lg font-semibold ">System Notification</p>
          <span className="text-xs text-gray-600">
            {format(new Date(createdAt), "MMM/dd/yyyy")}
          </span>
        </div>
        <div className="flex items-center justify-between ml-4 pl-1">
          <div>
            <p>{message}</p>
          </div>
        </div>
      </div>
      <Button onClick={markRead}>Mark as Read</Button>
    </div>
  );
}

export default UserNotification;
