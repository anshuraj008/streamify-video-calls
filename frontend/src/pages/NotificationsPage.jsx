import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { acceptFriendRequest, getFriendRequests } from "../lib/api";
import { BellIcon, ClockIcon, MessageSquareIcon, UserCheckIcon } from "lucide-react";
import NoNotificationsFound from "../components/NoNotificationsFound";
import { useThemeStore } from "../store/useThemeStore";

const NotificationsPage = () => {
  const queryClient = useQueryClient();
  const { isDarkMode } = useThemeStore();

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
    <div className={`min-h-screen p-4 sm:p-6 lg:p-8 animate-in fade-in duration-500 transition-colors ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50' 
        : 'bg-gradient-to-br from-gray-900 via-black to-gray-900'
    }`}>
      <div className="container mx-auto max-w-4xl space-y-8">
        <div className={`p-6 rounded-2xl border backdrop-blur-sm animate-in slide-in-from-top-4 duration-700 ${
          isDarkMode
            ? 'bg-gradient-to-r from-emerald-50 via-green-50 to-emerald-50 border-emerald-200'
            : 'bg-gradient-to-r from-emerald-900/30 via-green-900/30 to-emerald-900/30 border-emerald-700/50'
        }`}>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-1">Notifications</h1>
          <p className="text-sm opacity-60">Stay updated with your friend requests and connections</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <>
            {incomingRequests.length > 0 && (
              <section className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex items-center gap-3 bg-emerald-50 p-4 rounded-xl border border-emerald-200">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                    <UserCheckIcon className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold">Friend Requests</h2>
                    <p className="text-sm opacity-70">You have {incomingRequests.length} pending request{incomingRequests.length > 1 ? 's' : ''}</p>
                  </div>
                  <span className="badge badge-primary badge-lg h-8 px-4 font-bold">{incomingRequests.length}</span>
                </div>

                <div className="space-y-3">
                  {incomingRequests.map((request, index) => (
                    <div
                      key={request._id}
                      className="card bg-base-200 hover:shadow-xl transition-all duration-500 hover:scale-[1.01] border border-emerald-100 hover:border-emerald-300 group animate-in fade-in slide-in-from-left-4 duration-500"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="card-body p-5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-100 to-transparent rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                        
                        <div className="flex items-center justify-between relative z-10">
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
                              <div className="avatar w-16 h-16 rounded-full ring-2 ring-base-100 relative">
                                <img src={request.sender.profilePic} alt={request.sender.fullName} className="rounded-full" />
                              </div>
                            </div>
                            <div>
                              <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{request.sender.fullName}</h3>
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
                  ))}
                </div>
              </section>
            )}

            {/* ACCEPTED REQS NOTIFICATONS */}
            {acceptedRequests.length > 0 && (
              <section className="space-y-4 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
                <div className="flex items-center gap-3 bg-emerald-50 p-4 rounded-xl border border-emerald-200">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                    <BellIcon className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">New Connections</h2>
                    <p className="text-sm opacity-70">Recent accepted friend requests</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {acceptedRequests.map((notification, index) => (
                    <div 
                      key={notification._id} 
                      className="card bg-base-200 hover:shadow-xl transition-all duration-500 hover:scale-[1.01] border border-emerald-100 hover:border-emerald-300 group animate-in fade-in slide-in-from-right-4 duration-500"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="card-body p-5 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-emerald-100 to-transparent rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                        
                        <div className="flex items-start gap-4 relative z-10">
                          <div className="relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
                            <div className="avatar size-14 rounded-full ring-2 ring-base-100 relative">
                              <img
                                src={notification.recipient.profilePic}
                                alt={notification.recipient.fullName}
                                className="rounded-full"
                              />
                            </div>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-base group-hover:text-emerald-600 transition-colors">{notification.recipient.fullName}</h3>
                            <p className="text-sm my-2 bg-emerald-50 rounded-lg px-3 py-2 inline-block border border-emerald-200">
                              <span className="font-semibold">{notification.recipient.fullName}</span> accepted your friend request ✓
                            </p>
                            <p className="text-xs flex items-center gap-1 opacity-70 mt-2">
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
                  ))}
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
