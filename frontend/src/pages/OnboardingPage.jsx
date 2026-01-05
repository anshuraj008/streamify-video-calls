import { useState } from "react";
import useAuthUser from "../hooks/useAuthUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { completeOnboarding } from "../lib/api";
import { LoaderIcon, MapPinIcon, ShipWheelIcon, ShuffleIcon, Camera, Sparkles, User, MessageSquare, Globe } from "lucide-react";
import { LANGUAGES } from "../constants";

const OnboardingPage = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();

  const [formState, setFormState] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    learningLanguage: authUser?.learningLanguage || "",
    location: authUser?.location || "",
    profilePic: authUser?.profilePic || "",
  });

  const { mutate: onboardingMutation, isPending } = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => {
      toast.success("Profile onboarded successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },

    onError: (error) => {
      toast.error(error.response.data.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    onboardingMutation(formState);
  };

  const handleRandomAvatar = () => {
    const idx = Math.floor(Math.random() * 100) + 1; // 1-100 included
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

    setFormState({ ...formState, profilePic: randomAvatar });
    toast.success("Random profile picture generated!");
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-[#0B1F4B] to-[#1E3A8A]"
      data-theme="forest"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#2563EB]/10 via-transparent to-[#2563EB]/5"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#2563EB]/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#1E3A8A]/30 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      
      <div className="relative border border-[#2563EB]/30 w-full max-w-4xl mx-auto bg-[#1E3A8A]/20 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden">
        {/* Decorative top bar */}
        <div className="h-2 bg-gradient-to-r from-[#2563EB] via-blue-400 to-[#1E3A8A]"></div>
        
        <div className="p-8 sm:p-12">
          {/* Header Section */}
          <div className="text-center mb-10">
            <div className="relative inline-flex items-center justify-center mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-[#2563EB] to-[#1E3A8A] rounded-full blur-xl opacity-30 animate-pulse"></div>
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-[#2563EB]/30 to-[#1E3A8A]/30 flex items-center justify-center ring-4 ring-[#2563EB]/20">
                <Sparkles className="w-10 h-10 text-blue-300" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-3 bg-gradient-to-r from-blue-400 via-blue-300 to-blue-200 bg-clip-text text-transparent">
              Complete Your Profile
            </h1>
            <p className="text-base sm:text-lg text-blue-200/80 max-w-2xl mx-auto">
              Let's personalize your experience and connect you with the community
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* PROFILE PIC CONTAINER */}
            <div className="flex flex-col items-center justify-center space-y-6 bg-gradient-to-br from-[#2563EB]/10 to-[#1E3A8A]/10 rounded-2xl p-8 border border-[#2563EB]/20">
              {/* IMAGE PREVIEW with animated gradient border */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#2563EB] via-blue-400 to-[#1E3A8A] rounded-full blur opacity-30 group-hover:opacity-50 transition duration-500 animate-pulse"></div>
                <div className="relative size-40 rounded-full bg-gradient-to-br from-[#1E3A8A]/50 to-[#0B1F4B]/50 overflow-hidden ring-4 ring-[#2563EB]/30 shadow-xl">
                  {formState.profilePic ? (
                    <img
                      src={formState.profilePic}
                      alt="Profile Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-gradient-to-br from-[#2563EB]/20 to-[#1E3A8A]/20">
                      <Camera className="size-20 text-blue-300/40" />
                    </div>
                  )}
                </div>
              </div>

              {/* Generate Random Avatar BTN */}
              <button 
                type="button" 
                onClick={handleRandomAvatar} 
                className="btn btn-accent gap-2 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <ShuffleIcon className="size-5" />
                Generate Random Avatar
              </button>
            </div>

            {/* Form Grid - Enhanced styling */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* FULL NAME */}
              <div className="form-control lg:col-span-2 group">
                <label className="label">
                  <span className="label-text font-semibold flex items-center gap-2 text-base text-blue-200">
                    <div className="w-8 h-8 rounded-lg bg-[#2563EB]/20 flex items-center justify-center">
                      <User className="size-4 text-blue-300" />
                    </div>
                    Full Name
                  </span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formState.fullName}
                  onChange={(e) => setFormState({ ...formState, fullName: e.target.value })}
                  className="input input-bordered w-full focus:input-primary transition-all hover:border-primary/50 h-12 bg-[#1E3A8A]/30 border-[#2563EB]/30 text-white"
                  placeholder="Your full name"
                />
              </div>

              {/* BIO */}
              <div className="form-control lg:col-span-2 group">
                <label className="label">
                  <span className="label-text font-semibold flex items-center gap-2 text-base text-blue-200">
                    <div className="w-8 h-8 rounded-lg bg-[#2563EB]/20 flex items-center justify-center">
                      <MessageSquare className="size-4 text-blue-300" />
                    </div>
                    Bio
                  </span>
                </label>
                <textarea
                  name="bio"
                  value={formState.bio}
                  onChange={(e) => setFormState({ ...formState, bio: e.target.value })}
                  className="textarea textarea-bordered h-32 focus:textarea-primary transition-all hover:border-primary/50 resize-none bg-[#1E3A8A]/30 border-[#2563EB]/30 text-white"
                  placeholder="Tell others about yourself and your language learning goals..."
                />
              </div>

              {/* NATIVE LANGUAGE */}
              <div className="form-control group">
                <label className="label">
                  <span className="label-text font-semibold flex items-center gap-2 text-base text-blue-200">
                    <div className="w-8 h-8 rounded-lg bg-[#2563EB]/20 flex items-center justify-center">
                      <Globe className="size-4 text-blue-300" />
                    </div>
                    Native Language
                  </span>
                </label>
                <select
                  name="nativeLanguage"
                  value={formState.nativeLanguage}
                  onChange={(e) => setFormState({ ...formState, nativeLanguage: e.target.value })}
                  className="select select-bordered w-full focus:select-primary transition-all hover:border-primary/50 h-12 bg-[#1E3A8A]/30 border-[#2563EB]/30 text-white"
                >
                  <option value="">Select your native language</option>
                  {LANGUAGES.map((lang) => (
                    <option key={`native-${lang}`} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>

              {/* LEARNING LANGUAGE */}
              <div className="form-control group">
                <label className="label">
                  <span className="label-text font-semibold flex items-center gap-2 text-base text-blue-200">
                    <div className="w-8 h-8 rounded-lg bg-[#1E3A8A]/30 flex items-center justify-center">
                      <Globe className="size-4 text-blue-300" />
                    </div>
                    Learning Language
                  </span>
                </label>
                <select
                  name="learningLanguage"
                  value={formState.learningLanguage}
                  onChange={(e) => setFormState({ ...formState, learningLanguage: e.target.value })}
                  className="select select-bordered w-full focus:select-primary transition-all hover:border-primary/50 h-12 bg-[#1E3A8A]/30 border-[#2563EB]/30 text-white"
                >
                  <option value="">Select language you're learning</option>
                  {LANGUAGES.map((lang) => (
                    <option key={`learning-${lang}`} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>

              {/* LOCATION */}
              <div className="form-control lg:col-span-2 group">
                <label className="label">
                  <span className="label-text font-semibold flex items-center gap-2 text-base text-blue-200">
                    <div className="w-8 h-8 rounded-lg bg-[#2563EB]/20 flex items-center justify-center">
                      <MapPinIcon className="size-4 text-blue-300" />
                    </div>
                    Location
                  </span>
                </label>
                <div className="relative">
                  <MapPinIcon className="absolute top-1/2 transform -translate-y-1/2 left-4 size-5 text-blue-300/60" />
                  <input
                    type="text"
                    name="location"
                    value={formState.location}
                    onChange={(e) => setFormState({ ...formState, location: e.target.value })}
                    className="input input-bordered w-full pl-12 focus:input-primary transition-all hover:border-primary/50 h-12 bg-[#1E3A8A]/30 border-[#2563EB]/30 text-white"
                    placeholder="City, Country"
                  />
                </div>
              </div>
            </div>

            {/* SUBMIT BUTTON with gradient */}
            <button 
              className="btn btn-primary w-full text-lg h-16 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-lg hover:shadow-2xl relative overflow-hidden group" 
              disabled={isPending} 
              type="submit"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#2563EB] via-blue-400 to-[#1E3A8A] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative flex items-center gap-3">
                {!isPending ? (
                  <>
                    <ShipWheelIcon className="size-6" />
                    Complete Onboarding
                  </>
                ) : (
                  <>
                    <LoaderIcon className="animate-spin size-6" />
                    Setting up your profile...
                  </>
                )}
              </span>
            </button>
          </form>

          {/* Footer hint with icon */}
          <div className="flex items-center justify-center gap-2 text-center text-sm text-blue-200/70 mt-8">
            <Sparkles className="size-4" />
            <p>You can always update these details later from your profile settings</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default OnboardingPage;
