import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { acceptFriendRequest, getFriendRequests } from "../lib/api";
import { BellIcon, ClockIcon, MessageSquareIcon, UserCheckIcon } from "lucide-react";
import NoNotificationsFound from "../components/NoNotificationsFound";

const NotificationsPage = () => {
  const queryClient = useQueryClient();

  const { data: friendRequests, isLoading } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
  });

  const { mutate: acceptRequestMutation, isPending } = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
  });

  const incomingRequests = friendRequests?.incomingReqs || [];
  const acceptedRequests = friendRequests?.acceptedReqs || [];

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 animate-in fade-in duration-500 bg-white">
      <div className="container mx-auto max-w-4xl space-y-8">
        <div className="p-6 rounded-2xl border border-[#2563EB]/30 backdrop-blur-sm animate-in slide-in-from-top-4 duration-700 bg-gradient-to-br from-[#0B1F4B] to-[#1E3A8A]">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent mb-1">Notifications</h1>
          <p className="text-sm text-blue-200/80">Stay updated with your friend requests and connections</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <>
            {incomingRequests.length > 0 && (
              <section className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex items-center gap-3 bg-gradient-to-br from-[#0B1F4B] to-[#1E3A8A] p-4 rounded-xl border border-[#2563EB]/30 backdrop-blur-sm">
                  <div className="w-10 h-10 rounded-full bg-[#2563EB]/30 flex items-center justify-center">
                    <UserCheckIcon className="h-6 w-6 text-blue-300" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-white">Friend Requests</h2>
                    <p className="text-sm text-blue-100">You have {incomingRequests.length} pending request{incomingRequests.length > 1 ? 's' : ''}</p>
                  </div>
                  <span className="badge badge-primary badge-lg h-8 px-4 font-bold">{incomingRequests.length}</span>
                </div>

                <div className="space-y-3">
                  {incomingRequests.map((request, index) => {
                    if (!request?.sender) return null;
                    
                    return (
                    <div
                      key={request._id}
                      className="card bg-gradient-to-br from-[#0B1F4B] to-[#1E3A8A] backdrop-blur-sm hover:shadow-xl transition-all duration-500 hover:scale-[1.01] border border-[#2563EB]/30 hover:border-[#2563EB]/50 group animate-in fade-in slide-in-from-left-4 duration-500"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="card-body p-5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#2563EB]/20 to-transparent rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                        
                        <div className="flex items-center justify-between relative z-10">
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              <div className="absolute -inset-1 bg-gradient-to-r from-[#2563EB] to-blue-400 rounded-full blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
                              <div className="avatar w-16 h-16 rounded-full ring-2 ring-[#2563EB]/30 relative">
                                <img 
                                  src={request.sender.profilePic} 
                                  alt={request.sender.fullName} 
                                  className="rounded-full"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(request.sender?.fullName || 'User')}&background=2563EB&color=fff&size=128`;
                                  }}
                                />
                              </div>
                            </div>
                            <div>
                              <h3 className="font-bold text-lg text-white group-hover:text-blue-300 transition-colors">{request.sender.fullName}</h3>
                              <div className="flex flex-wrap gap-2 mt-2">
                                <span className="badge badge-secondary badge-sm gap-1 h-6 shadow-sm">
                                  <span className="font-semibold">Native: {request.sender.nativeLanguage}</span>
                                </span>
                                <span className="badge badge-accent badge-sm gap-1 h-6 shadow-sm">
                                  <span className="font-semibold">Learning: {request.sender.learningLanguage}</span>
                                </span>
                              </div>
                            </div>
                          </div>

                          <button
                            className="btn btn-primary gap-2 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300"
                            onClick={() => acceptRequestMutation(request._id)}
                            disabled={isPending}
                          >
                            <UserCheckIcon className="size-5" />
                            <span className="font-semibold">Accept</span>
                          </button>
                        </div>
                      </div>
                    </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* ACCEPTED REQS NOTIFICATONS */}
            {acceptedRequests.length > 0 && (
              <section className="space-y-4 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
                <div className="flex items-center gap-3 bg-gradient-to-br from-[#0B1F4B] to-[#1E3A8A] p-4 rounded-xl border border-[#2563EB]/30 backdrop-blur-sm">
                  <div className="w-10 h-10 rounded-full bg-[#2563EB]/30 flex items-center justify-center">
                    <BellIcon className="h-6 w-6 text-blue-300" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">New Connections</h2>
                    <p className="text-sm text-blue-100">Recent accepted friend requests</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {acceptedRequests.map((notification, index) => {
                    if (!notification?.recipient) return null;
                    
                    return (
                    <div 
                      key={notification._id} 
                      className="card bg-gradient-to-br from-[#0B1F4B] to-[#1E3A8A] backdrop-blur-sm hover:shadow-xl transition-all duration-500 hover:scale-[1.01] border border-[#2563EB]/30 hover:border-[#2563EB]/50 group animate-in fade-in slide-in-from-right-4 duration-500"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="card-body p-5 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-[#2563EB]/20 to-transparent rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                        
                        <div className="flex items-start gap-4 relative z-10">
                          <div className="relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-[#2563EB] to-blue-400 rounded-full blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
                            <div className="avatar size-14 rounded-full ring-2 ring-[#2563EB]/30 relative">
                              <img
                                src={notification.recipient.profilePic}
                                alt={notification.recipient.fullName}
                                className="rounded-full"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(notification.recipient?.fullName || 'User')}&background=2563EB&color=fff&size=128`;
                                }}
                              />
                            </div>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-base text-white group-hover:text-blue-300 transition-colors">{notification.recipient.fullName}</h3>
                            <p className="text-sm my-2 bg-[#2563EB]/20 rounded-lg px-3 py-2 inline-block border border-[#2563EB]/30">
                              <span className="font-semibold text-blue-200">{notification.recipient.fullName}</span> <span className="text-blue-300">accepted your friend request ✓</span>
                            </p>
                            <p className="text-xs flex items-center gap-1 text-blue-200/70 mt-2">
                              <ClockIcon className="h-4 w-4" />
                              Recently
                            </p>
                          </div>
                          <div className="badge badge-success gap-1 h-8 px-3 shadow-md">
                            <MessageSquareIcon className="h-4 w-4" />
                            <span className="font-semibold">New Friend</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    );
                  })}
                </div>
              </section>
            )}

            {incomingRequests.length === 0 && acceptedRequests.length === 0 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <NoNotificationsFound />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
export default NotificationsPage;
