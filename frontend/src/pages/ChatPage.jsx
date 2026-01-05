import { useEffect, useState } from "react";
import { useParams } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";

import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
  useChannelStateContext,
  useMessageContext,
} from "stream-chat-react";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";

import ChatLoader from "../components/ChatLoader";
import CallButton from "../components/CallButton";
import MessageStatus from "../components/MessageStatus";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

// Custom Message component with read status
const CustomMessage = (props) => {
  const { message } = useMessageContext();
  const { channel } = useChannelStateContext();
  const { authUser } = useAuthUser();
  
  const isMyMessage = message.user.id === authUser?._id;

  return (
    <div className="str-chat__message-simple-wrapper">
      <div className={`str-chat__message-simple ${isMyMessage ? 'str-chat__message--me' : 'str-chat__message--other'}`}>
        {!isMyMessage && (
          <div className="str-chat__avatar">
            <img
              src={message.user.image}
              alt={message.user.name}
              className="str-chat__avatar-image"
            />
          </div>
        )}
        <div className="str-chat__message-text">
          <div className="str-chat__message-text-inner">
            {message.text}
            {isMyMessage && (
              <MessageStatus 
                message={message} 
                channel={channel} 
                isMyMessage={isMyMessage}
              />
            )}
          </div>
          <div className="str-chat__message-simple-timestamp">
            {new Date(message.created_at).toLocaleTimeString('en-US', { 
              hour: 'numeric', 
              minute: '2-digit',
              hour12: true 
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// Function to show browser notification
const showNotification = (senderName, messageText) => {
  if ("Notification" in window && Notification.permission === "granted") {
    const notification = new Notification(`💬 ${senderName}`, {
      body: messageText || "Sent you a message",
      icon: "/favicon.ico",
      badge: "/favicon.ico",
      tag: "chat-message",
      requireInteraction: false,
    });

    // Play notification sound
    const audio = new Audio("data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBStlyO7bozEFKXe/8OZ8NAocWrb36IxOEA1Ln+Lsr2MbBjiR1O/IbykFJHXE8Nx5Mg4PXLX36lxUFgQ=");
    audio.play().catch(() => {}); // Ignore errors if audio fails

    // Auto close notification after 5 seconds
    setTimeout(() => notification.close(), 5000);

    // Focus window when notification is clicked
    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  }
};

const ChatPage = () => {
  const { id: targetUserId } = useParams();

  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  const { authUser } = useAuthUser();

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser, // this will run only when authUser is available
  });

  // Request notification permission on mount
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          toast.success("Notifications enabled! 🔔");
        }
      });
    }
  }, []);

  useEffect(() => {
    const initChat = async () => {
      if (!tokenData?.token || !authUser) return;

      try {
        console.log("Initializing stream chat client...");

        const client = StreamChat.getInstance(STREAM_API_KEY);

        // Check if already connected
        if (!client.user) {
          await client.connectUser(
            {
              id: authUser._id,
              name: authUser.fullName,
              image: authUser.profilePic,
            },
            tokenData.token
          );
        }

        //
        const channelId = [authUser._id, targetUserId].sort().join("-");

        // you and me
        // if i start the chat => channelId: [myId, yourId]
        // if you start the chat => channelId: [yourId, myId]  => [myId,yourId]

        const currChannel = client.channel("messaging", channelId, {
          members: [authUser._id, targetUserId],
        });

        await currChannel.watch();

        // Listen for new messages and show notifications
        const handleNewMessage = (event) => {
          // Only show notification if:
          // 1. Message is from other user (not yourself)
          // 2. Page is not currently focused/visible
          if (event.user.id !== authUser._id && document.hidden) {
            showNotification(event.user.name, event.message.text);
            
            // Also show toast notification if user is on another page
            toast.success(`💬 New message from ${event.user.name}`, {
              duration: 4000,
            });
          }
        };

        currChannel.on("message.new", handleNewMessage);

        setChatClient(client);
        setChannel(currChannel);
      } catch (error) {
        console.error("Error initializing chat:", error);
        toast.error("Could not connect to chat. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    initChat();
  }, [tokenData, authUser, targetUserId]);

  const handleVideoCall = () => {
    if (channel) {
      const callUrl = `${window.location.origin}/call/${channel.id}`;

      channel.sendMessage({
        text: `I've started a video call. Join me here: ${callUrl}`,
      });

      toast.success("Video call link sent successfully!");
    }
  };

  if (loading || !chatClient || !channel) return <ChatLoader />;

  return (
    <div className="h-[93vh] relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5"></div>
      
      {/* Floating orbs for depth */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
      
      <div className="relative h-full">
        <Chat client={chatClient}>
          <Channel channel={channel} Message={CustomMessage}>
            <div className="w-full h-full relative">
              <CallButton handleVideoCall={handleVideoCall} />
              <Window>
                <ChannelHeader />
                <MessageList />
                <MessageInput focus />
              </Window>
            </div>
            <Thread />
          </Channel>
        </Chat>
      </div>
    </div>
  );
};
export default ChatPage;
