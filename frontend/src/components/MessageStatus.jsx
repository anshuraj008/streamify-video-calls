import { Check, CheckCheck } from "lucide-react";

const MessageStatus = ({ message, channel, isMyMessage }) => {
  if (!isMyMessage) return null;

  // Check if message has been read by other users
  const readBy = channel?.state?.read || {};
  const otherUsersRead = Object.entries(readBy).some(([userId, readState]) => {
    if (userId === message.user.id) return false; // Skip current user
    return readState.last_read && new Date(readState.last_read) >= new Date(message.created_at);
  });

  const isDelivered = message.status === "received";
  const isRead = otherUsersRead;

  return (
    <span className="inline-flex items-center ml-1">
      {isRead ? (
        // Double check (read) - blue
        <CheckCheck className="w-4 h-4 text-blue-500" strokeWidth={2.5} />
      ) : isDelivered ? (
        // Double check (delivered) - grey
        <CheckCheck className="w-4 h-4 text-gray-400" strokeWidth={2.5} />
      ) : (
        // Single check (sent) - grey
        <Check className="w-4 h-4 text-gray-400" strokeWidth={2.5} />
      )}
    </span>
  );
};

export default MessageStatus;
