import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import { useChannelStateContext } from "stream-chat-react";

const CustomChannelHeader = () => {
  const navigate = useNavigate();
  const { channel } = useChannelStateContext();

  // Get the other user's info from channel members
  const members = Object.values(channel.state.members || {});
  const otherMember = members.find(member => member.user?.id !== channel._client.user?.id);
  const otherUser = otherMember?.user;

  return (
    <div className="str-chat__header-livestream">
      <div className="str-chat__header-livestream-left">
        <button
          onClick={() => navigate(-1)}
          className="btn btn-ghost btn-sm btn-circle mr-2 hover:bg-white/20 transition-all"
          aria-label="Go back"
        >
          <ArrowLeft className="size-5 text-white" />
        </button>
        
        {otherUser && (
          <>
            <div className="str-chat__avatar str-chat__avatar--rounded">
              <img
                src={otherUser.image}
                alt={otherUser.name}
                className="str-chat__avatar-image"
              />
            </div>
            <div className="str-chat__header-livestream-left--info">
              <div className="str-chat__header-livestream-left--title">
                {otherUser.name || 'User'}
              </div>
              <div className="str-chat__header-livestream-left--subtitle">
                {channel.data?.member_count || 2} members
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CustomChannelHeader;
