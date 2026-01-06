import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";

import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  CallControls,
  SpeakerLayout,
  StreamTheme,
  CallingState,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import toast from "react-hot-toast";
import PageLoader from "../components/PageLoader";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const CallPage = () => {
  const { id: callId } = useParams();
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [isConnecting, setIsConnecting] = useState(true);

  const { authUser, isLoading } = useAuthUser();

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  useEffect(() => {
    let videoClient = null;
    let callInstance = null;
    let isCleanedUp = false;

    const initCall = async () => {
      if (!tokenData?.token || !authUser || !callId) return;

      try {
        console.log("Initializing Stream video client...");

        const user = {
          id: authUser._id,
          name: authUser.fullName,
          image: authUser.profilePic,
        };

        videoClient = new StreamVideoClient({
          apiKey: STREAM_API_KEY,
          user,
          token: tokenData.token,
        });

        callInstance = videoClient.call("default", callId);

        await callInstance.join({ create: true });

        console.log("Joined call successfully");

        if (!isCleanedUp) {
          setClient(videoClient);
          setCall(callInstance);
        }
      } catch (error) {
        console.error("Error joining call:", error);
        toast.error("Could not join the call. Please try again.");
      } finally {
        if (!isCleanedUp) {
          setIsConnecting(false);
        }
      }
    };

    initCall();

    // Cleanup function to prevent duplicate joins
    return () => {
      isCleanedUp = true;
      if (callInstance) {
        callInstance.leave().catch(err => console.log('Leave call error:', err));
      }
      if (videoClient) {
        videoClient.disconnectUser().catch(err => console.log('Disconnect error:', err));
      }
    };
  }, [tokenData, authUser, callId]);

  if (isLoading || isConnecting) return <PageLoader />;

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
      <style>{`
        /* Custom styles for professional video call */
        .str-video__call-layout {
          width: 100vw !important;
          height: 100vh !important;
          background: transparent !important;
        }
        
        .str-video__speaker-layout {
          width: 100% !important;
          height: 100% !important;
          padding: 0 !important;
        }
        
        .str-video__speaker-layout__wrapper {
          width: 100% !important;
          height: calc(100vh - 110px) !important;
          gap: 16px !important;
          padding: 16px !important;
        }
        
        .str-video__participant-view {
          border-radius: 20px !important;
          overflow: hidden !important;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3) !important;
          border: 1px solid rgba(255, 255, 255, 0.05) !important;
        }
        
        .str-video__participant-view video {
          object-fit: cover !important;
        }
        
        /* Classic Call Controls */
        .str-video__call-controls {
          position: fixed !important;
          bottom: 20px !important;
          left: 50% !important;
          transform: translateX(-50%) !important;
          background: rgba(30, 30, 30, 0.95) !important;
          backdrop-filter: blur(16px) !important;
          padding: 14px 20px !important;
          border-radius: 50px !important;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5), 
                      0 0 0 1px rgba(255, 255, 255, 0.08) !important;
          z-index: 50 !important;
          display: flex !important;
          gap: 10px !important;
          align-items: center !important;
        }
        
        /* All Buttons - Small Circle Shape */
        .str-video__call-controls button {
          width: 44px !important;
          height: 44px !important;
          border-radius: 50% !important;
          margin: 0 !important;
          padding: 0 !important;
          transition: all 0.2s ease !important;
          background: rgba(70, 70, 70, 0.85) !important;
          border: none !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          cursor: pointer !important;
          position: relative !important;
        }
        
        .str-video__call-controls button svg {
          width: 20px !important;
          height: 20px !important;
          color: #ffffff !important;
        }
        
        .str-video__call-controls button:hover {
          background: rgba(90, 90, 90, 0.95) !important;
          transform: scale(1.08) !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4) !important;
        }
        
        .str-video__call-controls button:active {
          transform: scale(0.96) !important;
        }
        
        /* Active/Pressed state (mic off, camera off) - Keep gray */
        .str-video__call-controls button[data-active="true"],
        .str-video__call-controls button[aria-pressed="true"] {
          background: rgba(90, 90, 90, 0.9) !important;
        }
        
        .str-video__call-controls button[data-active="true"]:hover,
        .str-video__call-controls button[aria-pressed="true"]:hover {
          background: rgba(110, 110, 110, 0.95) !important;
        }
        
        /* End Call Button - Only this one is RED */
        .str-video__call-controls button[data-testid="cancel-call-button"],
        .str-video__call-controls button[aria-label*="Leave"],
        .str-video__call-controls button:last-child {
          background: #ef4444 !important;
          width: 44px !important;
          height: 44px !important;
        }
        
        .str-video__call-controls button[data-testid="cancel-call-button"]:hover,
        .str-video__call-controls button[aria-label*="Leave"]:hover,
        .str-video__call-controls button:last-child:hover {
          background: #dc2626 !important;
          box-shadow: 0 4px 16px rgba(239, 68, 68, 0.5) !important;
        }
        
        /* Participant Labels */
        .str-video__participant-view__label {
          background: rgba(0, 0, 0, 0.75) !important;
          backdrop-filter: blur(8px) !important;
          padding: 6px 12px !important;
          border-radius: 8px !important;
          font-weight: 600 !important;
          font-size: 13px !important;
          letter-spacing: 0.3px !important;
        }
      `}</style>
      
      {client && call ? (
        <StreamVideo client={client}>
          <StreamCall call={call}>
            <CallContent />
          </StreamCall>
        </StreamVideo>
      ) : (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <p className="text-white text-xl mb-4">Could not initialize call</p>
            <p className="text-gray-400">Please refresh or try again later</p>
          </div>
        </div>
      )}
    </div>
  );
};

const CallContent = () => {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();

  const navigate = useNavigate();

  if (callingState === CallingState.LEFT) return navigate("/");

  return (
    <StreamTheme>
      <SpeakerLayout />
      <CallControls />
    </StreamTheme>
  );
};

export default CallPage;