import React from "react";

interface AdminNotificationProps {
  title: string;
  price: string;
  userId: string;
  requestDate: Date;
  handleAccept: () => void;
  handleReject: () => void;
}

const AdminNotification: React.FC<AdminNotificationProps> = ({
  title,
  price,
  userId,
  requestDate,
  handleAccept,
  handleReject,
}) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-200 ease-in-out transform hover:translate-y-[-2px] w-[400px] mx-auto">
      <div className="flex justify-between items-start mb-6 flex-col">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <p className="text-gray-600">Price: ${price}</p>
        </div>
        <div className="">
          <p className="text-sm text-gray-500">Request From: {userId}</p>
          <p className="text-sm text-gray-500">
            Request Date: {new Date(requestDate).toLocaleString()}
          </p>
          <p className="text-sm text-gray-500">
            Request of <b>Borrowing a Book</b>
          </p>
        </div>
      </div>
      <div className="flex gap-4">
        <button
          onClick={handleAccept}
          className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md flex items-center justify-center gap-2 transition-colors duration-200"
        >
          <span className="text-xl">✅</span>
          Verify
        </button>
        <button
          onClick={handleReject}
          className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md flex items-center justify-center gap-2 transition-colors duration-200"
        >
          <span className="text-xl">❌</span>
          Decline
        </button>
      </div>
    </div>
  );
};

export default AdminNotification;
