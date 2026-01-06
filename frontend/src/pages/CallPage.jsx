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
          height: calc(100vh - 100px) !important;
          gap: 12px !important;
          padding: 12px !important;
        }
        
        .str-video__participant-view {
          border-radius: 16px !important;
          overflow: hidden !important;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4) !important;
          border: 2px solid rgba(255, 255, 255, 0.1) !important;
        }
        
        .str-video__participant-view video {
          object-fit: cover !important;
        }
        
        /* Refined Call Controls */
        .str-video__call-controls {
          position: fixed !important;
          bottom: 32px !important;
          left: 50% !important;
          transform: translateX(-50%) !important;
          background: rgba(17, 24, 39, 0.95) !important;
          backdrop-filter: blur(16px) !important;
          padding: 12px 20px !important;
          border-radius: 60px !important;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1) !important;
          z-index: 50 !important;
          display: flex !important;
          gap: 8px !important;
        }
        
        /* Button Styles - Smaller and Sleeker */
        .str-video__call-controls button {
          width: 48px !important;
          height: 48px !important;
          border-radius: 50% !important;
          margin: 0 !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
          background: rgba(55, 65, 81, 0.8) !important;
          border: 1px solid rgba(75, 85, 99, 0.5) !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          cursor: pointer !important;
        }
        
        .str-video__call-controls button svg {
          width: 20px !important;
          height: 20px !important;
        }
        
        .str-video__call-controls button:hover {
          transform: translateY(-2px) scale(1.05) !important;
          background: rgba(75, 85, 99, 0.9) !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
        }
        
        .str-video__call-controls button:active {
          transform: translateY(0) scale(0.98) !important;
        }
        
        /* Active state for toggle buttons (mic off, camera off) */
        .str-video__call-controls button[data-active="true"],
        .str-video__call-controls button[aria-pressed="true"] {
          background: rgba(239, 68, 68, 0.9) !important;
          border-color: rgba(220, 38, 38, 0.8) !important;
        }
        
        /* Leave/Cancel Call Button - Red and distinctive */
        .str-video__call-controls button[data-testid="cancel-call-button"],
        .str-video__call-controls button[aria-label*="Leave"],
        .str-video__call-controls button:last-child {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%) !important;
          border-color: #b91c1c !important;
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4) !important;
        }
        
        .str-video__call-controls button[data-testid="cancel-call-button"]:hover,
        .str-video__call-controls button[aria-label*="Leave"]:hover,
        .str-video__call-controls button:last-child:hover {
          background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%) !important;
          box-shadow: 0 6px 16px rgba(239, 68, 68, 0.5) !important;
        }
        
        /* Participant Labels */
        .str-video__participant-view__label {
          background: rgba(0, 0, 0, 0.75) !important;
          backdrop-filter: blur(10px) !important;
          padding: 6px 12px !important;
          border-radius: 8px !important;
          font-weight: 600 !important;
          font-size: 13px !important;
          letter-spacing: 0.3px !important;
        }
        
        /* Tooltip styling */
        .str-video__call-controls button[title]::after {
          content: attr(title) !important;
          position: absolute !important;
          bottom: 100% !important;
          left: 50% !important;
          transform: translateX(-50%) translateY(-8px) !important;
          background: rgba(0, 0, 0, 0.9) !important;
          color: white !important;
          padding: 6px 12px !important;
          border-radius: 6px !important;
          font-size: 12px !important;
          white-space: nowrap !important;
          opacity: 0 !important;
          pointer-events: none !important;
          transition: opacity 0.2s !important;
        }
        
        .str-video__call-controls button:hover[title]::after {
          opacity: 1 !important;
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