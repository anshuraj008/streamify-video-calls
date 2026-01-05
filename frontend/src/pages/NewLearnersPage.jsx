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
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 animate-in fade-in duration-500 bg-white">
      <div className="container mx-auto">
        <div className="mb-8 p-6 rounded-2xl border animate-in slide-in-from-top-4 duration-700 bg-gradient-to-br from-[#0B1F4B] to-[#1E3A8A] border-[#2563EB]/30">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                Meet New Learners
              </h2>
              <p className="text-base text-blue-100">
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
                  className="card hover:shadow-xl transition-all duration-500 hover:scale-[1.03] border group animate-in fade-in slide-in-from-bottom-8 duration-700 bg-gradient-to-br from-[#0B1F4B] to-[#1E3A8A] backdrop-blur-sm border-[#2563EB]/30 hover:border-[#2563EB]/50"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="card-body p-6 space-y-4 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#2563EB]/20 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                    
                    <div className="flex items-center gap-4 relative z-10">
                      <div className="relative group/avatar">
                        <div className="absolute -inset-1 bg-gradient-to-r from-[#2563EB] to-blue-400 rounded-full blur opacity-30 group-hover/avatar:opacity-60 transition duration-500"></div>
                        <div className="avatar size-20 rounded-full ring-2 ring-[#2563EB]/30 relative">
                          <img src={user.profilePic} alt={user.fullName} className="rounded-full" />
                        </div>
                      </div>

                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-white group-hover:text-blue-300 transition-colors">
                          {user.fullName}
                        </h3>
                        {user.location && (
                          <div className="flex items-center text-sm mt-1 gap-1 text-blue-200/80">
                            <MapPinIcon className="size-4 text-blue-300" />
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
                      <div className="rounded-lg p-3 relative z-10 bg-white/5 border border-[#2563EB]/20">
                        <p className="text-sm leading-relaxed line-clamp-3 text-blue-100">{user.bio}</p>
                      </div>
                    )}

                    {/* Action button */}
                    <button
                      className={`w-full mt-2 gap-2 relative z-10 shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg px-4 py-3 font-semibold flex items-center justify-center ${
                        hasRequestBeenSent 
                          ? "bg-white/10 hover:bg-white/20 text-white border-2 border-[#2563EB]/30" 
                          : "btn btn-primary hover:scale-[1.02] active:scale-[0.98]"
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
