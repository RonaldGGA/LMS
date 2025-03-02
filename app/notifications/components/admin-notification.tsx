import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  User,
  BookOpenCheck,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";

interface AdminNotificationProps {
  title: string;
  price: string;
  userId: string;
  requestDate: Date;
  handleAccept: () => void;
  handleReject: () => void;
  status?: "pending" | "approved" | "rejected";
  disabled: boolean;
}

const AdminNotification: React.FC<AdminNotificationProps> = ({
  title,
  price,
  userId,
  requestDate,
  handleAccept,
  handleReject,
  disabled,
  status = "pending",
}) => {
  return (
    <div className="group relative bg-white rounded-xl p-6 shadow-sm transition-all hover:shadow-md border border-slate-100 max-w-2xl w-full">
      <div className="flex flex-col gap-4">
        {/* Header Section */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <BookOpenCheck className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
              <p className="text-sm text-slate-500">Price: ${price}</p>
            </div>
          </div>
          <Badge className={`${status == "pending" ? "bg-yellow-900" : ""}`}>
            {status.toUpperCase()}
          </Badge>
        </div>

        {/* Metadata Section */}
        <div className="flex flex-col text-sm">
          <div className="flex items-center gap-2 text-slate-600">
            <User className="w-4 h-4 text-slate-400" />
            <span className="font-medium">User ID:</span>
            <span className="text-slate-800 font-mono">{userId}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <Clock className="w-4 h-4 text-slate-400" />
            <span className="font-medium">Request Date:</span>
            <span className="text-slate-800">
              {format(new Date(requestDate), "PP 'at' h:mm a")}
            </span>
          </div>
        </div>

        {/* Action Section */}
        <div className="flex flex-col sm:flex-row gap-2 mt-4">
          <Button
            onClick={handleAccept}
            size="sm"
            disabled={disabled}
            className="gap-2 w-full bg-green-700 hover:bg-green-900"
          >
            {disabled ? <Loader2 className="animate-spin" /> : <CheckCircle2 />}
            Approve Request
          </Button>
          <Button
            disabled={disabled}
            onClick={handleReject}
            variant="destructive"
            size="sm"
            className="gap-2 w-full"
          >
            {disabled ? <Loader2 className="animate-spin" /> : <CheckCircle2 />}
            <XCircle className="w-4 h-4" />
            Decline Request
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminNotification;
