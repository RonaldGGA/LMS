import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Bell, CheckCircle2, XCircle } from "lucide-react";

interface UserNotificationProps {
  message: string;
  markRead: () => void;
  createdAt: Date;
  isUnread?: boolean;
}

function UserNotification({
  message,
  markRead,
  createdAt,
  isUnread = true,
}: UserNotificationProps) {
  return (
    <div className="group relative flex w-full max-w-3xl items-start justify-between rounded-lg bg-white p-4 shadow-sm transition-all hover:shadow-md md:items-center">
      {/* Unread indicator */}
      {isUnread && (
        <div className="absolute left-0 top-1/2 h-full w-1 -translate-y-1/2 rounded-l-lg bg-blue-500" />
      )}

      <div className="flex flex-1 items-start gap-3 md:items-center">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
          <Bell className="h-4 w-4 text-blue-600" />
        </div>

        <div className="flex-1">
          <div className="mb-1 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-800">
              System Notification
            </h3>
            <span className="text-xs text-slate-400">
              {format(new Date(createdAt), "PPpp")}
            </span>
          </div>
          <p className="text-sm text-slate-600">{message}</p>
        </div>
      </div>

      <div className="mt-2 flex items-center gap-2 md:mt-0 md:pl-4">
        <Button
          onClick={markRead}
          variant="ghost"
          size="sm"
          className="hidden h-8 gap-1.5 text-slate-600 hover:bg-slate-100 group-hover:flex"
        >
          <CheckCircle2 className="h-4 w-4" />
          <span>Mark Read</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-slate-400 hover:text-slate-600 md:hidden"
        >
          <XCircle className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export default UserNotification;
