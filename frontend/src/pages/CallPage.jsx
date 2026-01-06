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
        
        .str-video__call-controls {
          position: fixed !important;
          bottom: 24px !important;
          left: 50% !important;
          transform: translateX(-50%) !important;
          background: rgba(30, 41, 59, 0.95) !important;
          backdrop-filter: blur(12px) !important;
          padding: 16px 24px !important;
          border-radius: 50px !important;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          z-index: 50 !important;
        }
        
        .str-video__call-controls button {
          width: 56px !important;
          height: 56px !important;
          border-radius: 50% !important;
          margin: 0 6px !important;
          transition: all 0.2s ease !important;
          background: rgba(255, 255, 255, 0.1) !important;
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
        }
        
        .str-video__call-controls button:hover {
          transform: scale(1.1) !important;
          background: rgba(255, 255, 255, 0.2) !important;
        }
        
        .str-video__call-controls button[data-testid="cancel-call-button"],
        .str-video__call-controls button[aria-label*="Leave"] {
          background: #ef4444 !important;
          border-color: #dc2626 !important;
        }
        
        .str-video__call-controls button[data-testid="cancel-call-button"]:hover,
        .str-video__call-controls button[aria-label*="Leave"]:hover {
          background: #dc2626 !important;
        }
        
        .str-video__participant-view__label {
          background: rgba(0, 0, 0, 0.7) !important;
          backdrop-filter: blur(8px) !important;
          padding: 8px 16px !important;
          border-radius: 8px !important;
          font-weight: 600 !important;
          font-size: 14px !important;
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
