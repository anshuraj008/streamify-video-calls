import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  getOutgoingFriendReqs,
  getRecommendedUsers,
  getUserFriends,
  sendFriendRequest,
  getStreamToken,
} from "../lib/api";
import { Link } from "react-router";
import { CheckCircleIcon, MapPinIcon, UserPlusIcon, UsersIcon } from "lucide-react";

import { capitialize } from "../lib/utils";
import { getLanguageFlag } from "../lib/languageUtils.jsx";

import FriendCard from "../components/FriendCard";
import NoFriendsFound from "../components/NoFriendsFound";
import useAuthUser from "../hooks/useAuthUser";
import { StreamChat } from "stream-chat";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const HomePage = () => {
  const queryClient = useQueryClient();
  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set());
  const [unreadCounts, setUnreadCounts] = useState({});
  const { authUser } = useAuthUser();

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const { data: recommendedUsers = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getRecommendedUsers,
  });

  const { data: outgoingFriendReqs } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoingFriendReqs,
  });

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  const { mutate: sendRequestMutation, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] }),
  });

  useEffect(() => {
    const outgoingIds = new Set();
    if (outgoingFriendReqs && outgoingFriendReqs.length > 0) {
      outgoingFriendReqs.forEach((req) => {
        outgoingIds.add(req.recipient._id);
      });
      setOutgoingRequestsIds(outgoingIds);
    }
  }, [outgoingFriendReqs]);

  // Initialize Stream Chat to track unread messages
  useEffect(() => {
    if (!tokenData?.token || !authUser || friends.length === 0) return;

    let chatClient = null;

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

        // Listen for new messages to update counts in real-time
        chatClient.on("message.new", (event) => {
          // Only update if message is from a friend (not from you)
          if (event.user.id !== authUser._id) {
            setUnreadCounts(prev => ({
              ...prev,
              [event.user.id]: (prev[event.user.id] || 0) + 1
            }));
          }
        });

        // Listen for when messages are marked as read
        chatClient.on("message.read", (event) => {
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
        });

      } catch (error) {
        console.error("Error initializing chat tracking:", error);
      }
    };

    initChatTracking();

    // Cleanup: Remove event listeners but keep client connected
    return () => {
      if (chatClient) {
        chatClient.off("message.new");
        chatClient.off("message.read");
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

        <section className="animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300">
          <div className="mb-8 bg-gradient-to-r from-secondary/5 via-transparent to-primary/5 p-6 rounded-2xl border border-secondary/10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent mb-2">Meet New Learners</h2>
                <p className="text-base opacity-70">
                  ✨ Discover perfect language exchange partners based on your profile
                </p>
              </div>
            </div>
          </div>

          {loadingUsers ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg" />
            </div>
          ) : recommendedUsers.length === 0 ? (
            <div className="card bg-base-200 p-6 text-center">
              <h3 className="font-semibold text-lg mb-2">No recommendations available</h3>
              <p className="text-base-content opacity-70">
                Check back later for new language partners!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedUsers.map((user, index) => {
                const hasRequestBeenSent = outgoingRequestsIds.has(user._id);

                return (
                  <div
                    key={user._id}
                    className="card bg-base-200 hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] border border-primary/10 hover:border-primary/30 group animate-in fade-in slide-in-from-bottom-8 duration-700"
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    <div className="card-body p-6 space-y-4 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                      <div className="flex items-center gap-4 relative z-10">
                        <div className="relative group/avatar">
                          <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-full blur opacity-30 group-hover/avatar:opacity-60 transition duration-500"></div>
                          <div className="avatar size-20 rounded-full ring-2 ring-base-100 relative">
                            <img src={user.profilePic} alt={user.fullName} className="rounded-full" />
                          </div>
                        </div>

                        <div className="flex-1">
                          <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{user.fullName}</h3>
                          {user.location && (
                            <div className="flex items-center text-sm opacity-70 mt-1 gap-1">
                              <MapPinIcon className="size-4 text-primary" />
                              {user.location}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Languages with flags */}
                      <div className="flex flex-wrap gap-2 relative z-10">
                        <span className="badge badge-secondary gap-1 h-7 px-3 shadow-sm hover:scale-105 transition-transform">
                          {getLanguageFlag(user.nativeLanguage)}
                          <span className="font-semibold">Native: {capitialize(user.nativeLanguage)}</span>
                        </span>
                        <span className="badge badge-accent gap-1 h-7 px-3 shadow-sm hover:scale-105 transition-transform">
                          {getLanguageFlag(user.learningLanguage)}
                          <span className="font-semibold">Learning: {capitialize(user.learningLanguage)}</span>
                        </span>
                      </div>

                      {user.bio && (
                        <div className="bg-base-300/50 rounded-lg p-3 relative z-10">
                          <p className="text-sm leading-relaxed line-clamp-3">{user.bio}</p>
                        </div>
                      )}

                      {/* Action button */}
                      <button
                        className={`btn w-full mt-2 gap-2 relative z-10 shadow-lg hover:shadow-xl transition-all duration-300 ${
                          hasRequestBeenSent 
                            ? "btn-success" 
                            : "btn-primary hover:scale-[1.02] active:scale-[0.98]"
                        }`}
                        onClick={() => sendRequestMutation(user._id)}
                        disabled={hasRequestBeenSent || isPending}
                      >
                        {hasRequestBeenSent ? (
                          <>
                            <CheckCircleIcon className="size-5" />
                            <span className="font-semibold">Request Sent ✓</span>
                          </>
                        ) : (
                          <>
                            <UserPlusIcon className="size-5" />
                            <span className="font-semibold">Send Friend Request</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default HomePage;
