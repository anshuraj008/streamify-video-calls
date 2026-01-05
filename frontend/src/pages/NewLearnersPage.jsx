import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  getOutgoingFriendReqs,
  getRecommendedUsers,
  sendFriendRequest,
} from "../lib/api";
import { CheckCircleIcon, MapPinIcon, UserPlusIcon } from "lucide-react";

import { capitialize } from "../lib/utils";
import { getLanguageFlag } from "../lib/languageUtils.jsx";

const NewLearnersPage = () => {
  const queryClient = useQueryClient();
  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set());

  const { data: recommendedUsers = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["recommendedUsers"],
    queryFn: getRecommendedUsers,
  });

  const { data: outgoingFriendReqs = [] } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoingFriendReqs,
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

  return (
    <div className="p-4 sm:p-6 lg:p-8 animate-in fade-in duration-500">
      <div className="container mx-auto">
        <div className="mb-8 bg-gradient-to-r from-emerald-50 via-green-50 to-emerald-50 p-6 rounded-2xl border border-emerald-200 animate-in slide-in-from-top-4 duration-700">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-2">
                Meet New Learners
              </h2>
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
          <div className="card bg-base-200 p-8 text-center animate-in fade-in duration-700">
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-4">👥</div>
              <h3 className="font-semibold text-xl mb-2">No recommendations available</h3>
              <p className="text-base-content opacity-70">
                Check back later for new language partners!
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedUsers.map((user, index) => {
              const hasRequestBeenSent = outgoingRequestsIds.has(user._id);

              return (
                <div
                  key={user._id}
                  className="card bg-base-200 hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] border border-emerald-100 hover:border-emerald-300 group animate-in fade-in slide-in-from-bottom-8 duration-700"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="card-body p-6 space-y-4 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-100 to-transparent rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                    
                    <div className="flex items-center gap-4 relative z-10">
                      <div className="relative group/avatar">
                        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full blur opacity-30 group-hover/avatar:opacity-60 transition duration-500"></div>
                        <div className="avatar size-20 rounded-full ring-2 ring-base-100 relative">
                          <img src={user.profilePic} alt={user.fullName} className="rounded-full" />
                        </div>
                      </div>

                      <div className="flex-1">
                        <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                          {user.fullName}
                        </h3>
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
      </div>
    </div>
  );
};

export default NewLearnersPage;
