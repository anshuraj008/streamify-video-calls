import { Link } from "react-router";
import { MessageCircle } from "lucide-react";
import { getLanguageFlag } from "../lib/languageUtils.jsx";

const FriendCard = ({ friend, unreadCount = 0, isOnline = false }) => {
  return (
    <div className="card hover:shadow-xl transition-all duration-500 hover:scale-[1.03] border group relative bg-gradient-to-br from-[#0B1F4B] to-[#1E3A8A] backdrop-blur-sm border-[#2563EB]/30 hover:border-[#2563EB]/50">
      {/* Unread badge */}
      {unreadCount > 0 && (
        <div className="absolute -top-2 -right-2 z-20">
          <div className="relative">
            <div className="absolute inset-0 bg-error rounded-full blur-md animate-pulse"></div>
            <div className="relative badge badge-error badge-lg font-bold text-white shadow-lg h-8 px-3 flex items-center gap-1">
              <MessageCircle className="size-4" />
              {unreadCount > 99 ? '99+' : unreadCount}
            </div>
          </div>
        </div>
      )}
      
      <div className="card-body p-5 relative overflow-hidden">
        {/* Animated background effect */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#2563EB]/20 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
        
        {/* USER INFO */}
        <div className="flex items-center gap-3 mb-4 relative z-10">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#2563EB] to-blue-400 rounded-full blur opacity-0 group-hover:opacity-40 transition duration-500"></div>
            <div className="avatar size-14 rounded-full ring-2 ring-[#2563EB]/30 relative">
              <img 
                src={friend.profilePic} 
                alt={friend.fullName} 
                className="rounded-full"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(friend.fullName)}&background=2563EB&color=fff&size=128`;
                }}
              />
              {/* Online/Offline status indicator */}
              <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-[#0B1F4B] ${
                isOnline ? 'bg-success' : 'bg-gray-400'
              } transition-colors`}
                title={isOnline ? 'Online' : 'Offline'}
              />
              {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-error rounded-full border-2 border-[#0B1F4B] animate-pulse"></div>
              )}
            </div>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-base truncate text-white group-hover:text-blue-300 transition-colors">{friend.fullName}</h3>
            <p className={`text-xs flex items-center gap-1 transition-colors ${
              isOnline ? 'text-success' : 'text-gray-400'
            }`}>
              <span className={`size-1.5 rounded-full ${
                isOnline ? 'bg-success animate-pulse' : 'bg-gray-400'
              }`} />
              {isOnline ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4 relative z-10">
          <span className="badge badge-secondary text-xs gap-1 h-6 px-2 shadow-sm hover:scale-105 transition-transform">
            {getLanguageFlag(friend.nativeLanguage)}
            <span className="font-semibold">Native: {friend.nativeLanguage}</span>
          </span>
          <span className="badge badge-accent text-xs gap-1 h-6 px-2 shadow-sm hover:scale-105 transition-transform">
            {getLanguageFlag(friend.learningLanguage)}
            <span className="font-semibold">Learning: {friend.learningLanguage}</span>
          </span>
        </div>

        <Link 
          to={`/chat/${friend._id}`} 
          className={`btn w-full gap-2 relative z-10 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 ${
            unreadCount > 0 ? 'btn-error animate-pulse' : 'btn-primary'
          }`}
        >
          <MessageCircle className="size-5" />
          <span className="font-semibold">
            {unreadCount > 0 ? `${unreadCount} New Message${unreadCount > 1 ? 's' : ''}` : 'Message'}
          </span>
        </Link>
      </div>
    </div>
  );
};

export default FriendCard;
