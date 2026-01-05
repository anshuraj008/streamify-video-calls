import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  getUserFriends,
  getStreamToken,
} from "../lib/api";
import { Link } from "react-router";
import { UsersIcon } from "lucide-react";

import FriendCard from "../components/FriendCard";
import NoFriendsFound from "../components/NoFriendsFound";
import useAuthUser from "../hooks/useAuthUser";
import { StreamChat } from "stream-chat";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const HomePage = () => {
  const [unreadCounts, setUnreadCounts] = useState({});
  const { authUser } = useAuthUser();

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  // Initialize Stream Chat to track unread messages
  useEffect(() => {
    if (!tokenData?.token || !authUser || friends.length === 0) return;

    let chatClient = null;
    let messageHandler = null;
    let readHandler = null;

    const initChatTracking = async () => {
      try {
        chatClient = StreamChat.getInstance(STREAM_API_KEY);

        // Check if already connected
        if (!chatClient.user) {
          await chatClient.connectUser(
            {
              id: authUser._id,
              name: authUser.fullName,
              image: authUser.profilePic,
            },
            tokenData.token
          );
        }

        // Remove any existing listeners first
        chatClient.off("message.new");
        chatClient.off("message.read");

        // Get unread counts for all friends
        const updateUnreadCounts = async () => {
          const counts = {};
          
          for (const friend of friends) {
            const channelId = [authUser._id, friend._id].sort().join("-");
            try {
              const channel = chatClient.channel("messaging", channelId);
              await channel.watch();
              
              // Get unread count for this channel
              const state = channel.state;
              counts[friend._id] = state.unreadCount || 0;
            } catch (error) {
              console.error(`Error getting unread count for ${friend.fullName}:`, error);
              counts[friend._id] = 0;
            }
          }
          
          setUnreadCounts(counts);
        };

        await updateUnreadCounts();

        // Create named handler functions that can be removed later
        messageHandler = (event) => {
          // Only update if message is from a friend (not from you)
          if (event.user.id !== authUser._id) {
            setUnreadCounts(prev => ({
              ...prev,
              [event.user.id]: (prev[event.user.id] || 0) + 1
            }));
          }
        };

        readHandler = (event) => {
          if (event.user.id === authUser._id) {
            // Find which friend's channel was read
            friends.forEach(friend => {
              const channelId = [authUser._id, friend._id].sort().join("-");
              if (event.channel_id === `messaging:${channelId}`) {
                setUnreadCounts(prev => ({
                  ...prev,
                  [friend._id]: 0
                }));
              }
            });
          }
        };

        // Listen for new messages to update counts in real-time
        chatClient.on("message.new", messageHandler);

        // Listen for when messages are marked as read
        chatClient.on("message.read", readHandler);

      } catch (error) {
        console.error("Error initializing chat tracking:", error);
      }
    };

    initChatTracking();

    // Cleanup: Remove event listeners but keep client connected
    return () => {
      if (chatClient) {
        if (messageHandler) chatClient.off("message.new", messageHandler);
        if (readHandler) chatClient.off("message.read", readHandler);
      }
    };
  }, [tokenData, authUser, friends]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 animate-in fade-in duration-500">
      <div className="container mx-auto space-y-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 p-6 rounded-2xl border border-primary/10 backdrop-blur-sm animate-in slide-in-from-top-4 duration-700">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-1">Your Friends</h2>
            <p className="text-sm opacity-60">Connect and practice languages together</p>
          </div>
          <Link to="/notifications" className="btn btn-primary gap-2 shadow-lg hover:scale-105 transition-all duration-300">
            <UsersIcon className="size-5" />
            Friend Requests
          </Link>
        </div>

        {loadingFriends ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : friends.length === 0 ? (
          <NoFriendsFound />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {friends.map((friend, index) => (
              <div
                key={friend._id}
                className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <FriendCard friend={friend} unreadCount={unreadCounts[friend._id] || 0} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
