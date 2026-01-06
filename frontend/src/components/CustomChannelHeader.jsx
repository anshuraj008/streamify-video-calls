import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useChannelStateContext } from "stream-chat-react";
import CallButton from "./CallButton";

const CustomChannelHeader = ({ handleVideoCall }) => {
  const navigate = useNavigate();
  const { channel } = useChannelStateContext();

  // Get the other user's info from channel members
  const members = Object.values(channel.state.members || {});
  const otherMember = members.find(member => member.user?.id !== channel._client.user?.id);
  const otherUser = otherMember?.user;
  
  // Count online members
  const memberCount = members.length;
  const onlineCount = members.filter(m => m.user?.online).length;

  const handleBackClick = () => {
    console.log("Back button clicked - navigating to /home");
    navigate("/home");
  };

  return (
    <div className="str-chat__header-livestream">
      <div className="str-chat__header-livestream-left">
        <button
          type="button"
          onClick={handleBackClick}
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            marginRight: '12px',
            transition: 'all 0.2s',
            flexShrink: 0,
            zIndex: 1001,
            pointerEvents: 'auto',
            position: 'relative'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
          aria-label="Go back to home"
        >
          <ArrowLeft style={{ width: '22px', height: '22px', color: 'white' }} />
        </button>
        
        {otherUser && (
          <>
            <div className="str-chat__avatar str-chat__avatar--rounded relative">
              <img
                src={otherUser.image}
                alt={otherUser.name}
                className="str-chat__avatar-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(otherUser.name || 'User')}&background=2563EB&color=fff&size=128`;
                }}
              />
              {otherUser.online && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
              )}
            </div>
            <div className="str-chat__header-livestream-left--info">
              <div className="str-chat__header-livestream-left--title">
                {otherUser.name || 'User'}
              </div>
              <div className="str-chat__header-livestream-left--subtitle">
                {memberCount} member{memberCount !== 1 ? 's' : ''}, {onlineCount} online
              </div>
            </div>
          </>
        )}
      </div>
      
      {/* Video Call Button */}
      <div className="str-chat__header-livestream-right">
        <CallButton handleVideoCall={handleVideoCall} />
      </div>
    </div>
  );
};

export default CustomChannelHeader;
