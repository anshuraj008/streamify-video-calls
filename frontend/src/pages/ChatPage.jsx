import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";

import {
  Channel,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
  useChannelStateContext,
  useMessageContext,
} from "stream-chat-react";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";
import { Video } from "lucide-react";

import ChatLoader from "../components/ChatLoader";
import CallButton from "../components/CallButton";
import CustomChannelHeader from "../components/CustomChannelHeader";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

// Custom Message Component to force horizontal text
const CustomMessage = () => {
  const { message } = useMessageContext();
  const { channel } = useChannelStateContext();
  const isMyMessage = message.user?.id === channel._client.userID;
  
  // Check if message contains a call link
  const callLinkPattern = /(?:https?:\/\/[^\s]+)?\/call\/([a-zA-Z0-9-]+)/;
  const match = message.text?.match(callLinkPattern);
  const isCallLink = match !== null;
  const callId = match?.[1];
  
  return (
    <div style={{
      display: 'flex',
      flexDirection: isMyMessage ? 'row-reverse' : 'row',
      alignItems: 'flex-end',
      gap: '8px',
      marginBottom: '12px',
      padding: '0 16px'
    }}>
      {/* Avatar */}
      <img 
        src={message.user?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(message.user?.name || 'U')}&background=2563EB&color=fff&size=64`}
        alt={message.user?.name}
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          flexShrink: 0
        }}
      />
      
      {/* Message Bubble */}
      <div style={{
        maxWidth: '70%',
        padding: isCallLink ? '16px' : '12px 16px',
        borderRadius: isMyMessage ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
        backgroundColor: isMyMessage ? '#2563EB' : '#fff',
        color: isMyMessage ? '#fff' : '#1f2937',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        wordWrap: 'break-word',
        overflowWrap: 'break-word',
        whiteSpace: 'pre-wrap',
        fontSize: '15px',
        lineHeight: '1.5',
        textAlign: 'left'
      }}>
        {isCallLink ? (
          <Link 
            to={`/call/${callId}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px',
              backgroundColor: isMyMessage ? 'rgba(255,255,255,0.15)' : 'rgba(37, 99, 235, 0.1)',
              borderRadius: '12px',
              textDecoration: 'none',
              color: 'inherit',
              transition: 'all 0.2s ease',
              border: `2px solid ${isMyMessage ? 'rgba(255,255,255,0.3)' : '#2563EB'}`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.02)';
              e.currentTarget.style.backgroundColor = isMyMessage ? 'rgba(255,255,255,0.25)' : 'rgba(37, 99, 235, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.backgroundColor = isMyMessage ? 'rgba(255,255,255,0.15)' : 'rgba(37, 99, 235, 0.1)';
            }}
          >
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: isMyMessage ? 'rgba(255,255,255,0.2)' : '#2563EB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Video size={24} color={isMyMessage ? '#fff' : '#fff'} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, marginBottom: '4px' }}>
                📞 Video Call Invitation
              </div>
              <div style={{ fontSize: '13px', opacity: 0.9 }}>
                Click to join the call
              </div>
            </div>
          </Link>
        ) : (
          message.text
        )}
      </div>
    </div>
  );
};

const ChatPage = () => {
  const { id: targetUserId } = useParams();

  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  const { authUser } = useAuthUser();

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser, // this will run only when authUser is available
  });

  useEffect(() => {
    let currentChannel = null;

    const initChat = async () => {
      if (!tokenData?.token || !authUser) return;

      try {
        console.log("Initializing stream chat client...");

        const client = StreamChat.getInstance(STREAM_API_KEY);

        await client.connectUser(
          {
            id: authUser._id,
            name: authUser.fullName,
            image: authUser.profilePic,
          },
          tokenData.token
        );

        //
        const channelId = [authUser._id, targetUserId].sort().join("-");

        // you and me
        // if i start the chat => channelId: [myId, yourId]
        // if you start the chat => channelId: [yourId, myId]  => [myId,yourId]

        const currChannel = client.channel("messaging", channelId, {
          members: [authUser._id, targetUserId],
        });

        await currChannel.watch();

        currentChannel = currChannel;
        setChatClient(client);
        setChannel(currChannel);
      } catch (error) {
        console.error("Error initializing chat:", error);
        toast.error("Could not connect to chat. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    initChat();

    // Cleanup function
    return () => {
      // No manual cleanup needed - Stream handles this
    };
  }, [tokenData, authUser, targetUserId]);

  const handleVideoCall = () => {
    if (channel) {
      const callUrl = `${window.location.origin}/call/${channel.id}`;

      channel.sendMessage({
        text: `I've started a video call. Join me here: ${callUrl}`,
      });

      toast.success("Video call link sent successfully!");
    }
  };

  if (loading || !chatClient || !channel) return <ChatLoader />;

  return (
    <div className="h-[93vh]">
      <Chat client={chatClient}>
        <Channel 
          channel={channel}
          doMarkReadRequest={async () => {
            try {
              await channel.markRead();
            } catch (error) {
              console.debug('Mark as read skipped:', error.message);
            }
          }}
          Message={CustomMessage}
        >
          <div className="w-full relative">
            <Window>
              <CustomChannelHeader handleVideoCall={handleVideoCall} />
              <MessageList 
                disableDateSeparator={false}
                hideDeletedMessages={false}
              />
              <MessageInput focus />
            </Window>
          </div>
          <Thread />
        </Channel>
      </Chat>
    </div>
  );
};
export default ChatPage;