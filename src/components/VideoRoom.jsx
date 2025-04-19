import React, { useEffect, useRef, useState } from "react";
import StatusBar from './StatusBar';
import VideoGrid from './VideoGrid';
import Controls from './Controls';
import SocketService from '../services/socketService';

function VideoRoom({ roomId, userId, userName, peerConnection }) {
  const [peers, setPeers] = useState({});
  const [connected, setConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [notification, setNotification] = useState(null);
  const [userNamesVersion, setUserNamesVersion] = useState(0); // Add this line
  const localVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const peerConnectionsRef = useRef({});
  const socketServiceRef = useRef(null);
  const userNamesRef = useRef({ [userId]: userName });

  const updateUserNames = (userId, name) => {
    userNamesRef.current[userId] = name;
    setUserNamesVersion(v => v + 1); // Trigger rerender
  };

  useEffect(() => {
    const socketCallbacks = {
      onError: (error) => {
        setNotification({
          message: `Connection error: ${error.message}`,
          type: "error"
        });
      },
      onExistingUsers: (existingUsers) => {
        console.log("Existing users in room:", existingUsers);
        existingUsers.forEach(({userId: existingUserId, userName: existingUserName}) => {
          userNamesRef.current[existingUserId] = existingUserName;
          createPeerConnection(existingUserId);
          sendOffer(existingUserId);
        });
      },
      onUserConnected: (newUserId, peerName) => {
        console.log("New user connected:", newUserId);
        updateUserNames(newUserId, peerName);
        setNotification({
          message: `${peerName} joined the call`,
          type: "info"
        });
      },
      onUserDisconnected: (disconnectedUserId) => {
        handlePeerDisconnection(disconnectedUserId);
        const disconnectedName = userNamesRef.current[disconnectedUserId] || 'Anonymous';
        delete userNamesRef.current[disconnectedUserId];
        setUserNamesVersion(v => v + 1); // Trigger rerender
        setNotification({
          message: `${disconnectedName} left the call`,
          type: "warning"
        });
      },
      onRoomFull: (roomId) => {
        setNotification({
          message: "This room is full. Maximum 2 users allowed.",
          type: "error"
        });
        alert("This room is full. Maximum 2 users allowed.");
        window.location.reload();
      },
      onOffer: async (offer, fromUserId) => {
        try {
          if (!peerConnectionsRef.current[fromUserId]) {
            createPeerConnection(fromUserId);
          }
          const pc = peerConnectionsRef.current[fromUserId];
          if (pc.signalingState !== "stable") {
            await pc.setLocalDescription({ type: "rollback" });
          }
          await pc.setRemoteDescription(new RTCSessionDescription(offer));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          socketServiceRef.current.sendAnswer(answer, fromUserId);
        } catch (error) {
          console.error("Error handling offer:", error);
          setNotification({
            message: "Connection error, please try refreshing",
            type: "error"
          });
        }
      },
      onAnswer: async (answer, fromUserId) => {
        try {
          const pc = peerConnectionsRef.current[fromUserId];
          if (pc && pc.signalingState === "have-local-offer") {
            await pc.setRemoteDescription(new RTCSessionDescription(answer));
          }
        } catch (error) {
          console.error("Error handling answer:", error);
        }
      },
      onIceCandidate: async (candidate, fromUserId) => {
        try {
          const pc = peerConnectionsRef.current[fromUserId];
          if (pc?.remoteDescription) {
            await pc.addIceCandidate(new RTCIceCandidate(candidate));
          }
        } catch (error) {
          console.error("Error handling ICE candidate:", error);
        }
      }
    };

    // Initialize socket service
    socketServiceRef.current = new SocketService(roomId, userId, userName, socketCallbacks);

    // Get local media stream
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        // Connect to socket and join room
        socketServiceRef.current.connect();
        socketServiceRef.current.joinRoom();
        setConnected(true);
        setNotification({
          message: `You've joined room: ${roomId}`,
          type: "success"
        });
      })
      .catch((error) => {
        console.error("Error accessing media devices:", error);
        setNotification({
          message: `Error accessing camera/microphone: ${error.message}`,
          type: "error"
        });
      });

    return () => {
      cleanupResources();
    };
  }, [roomId, userId, userName]);

  useEffect(() => {
    if (peerConnection) {
      const handleConnectionStateChange = () => {
        console.log("Peer connection state:", peerConnection.connectionState);
        // Optionally, update UI based on connection state
      };

      peerConnection.addEventListener(
        "connectionstatechange",
        handleConnectionStateChange
      );

      return () => {
        peerConnection.removeEventListener(
          "connectionstatechange",
          handleConnectionStateChange
        );
      };
    }
  }, [peerConnection]);

  const createPeerConnection = (peerId) => {
    try {
      console.log("Creating peer connection for:", peerId);

      const configuration = {
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:stun1.l.google.com:19302" },
        ],
        iceCandidatePoolSize: 10,
      };

      const pc = new RTCPeerConnection(configuration);
      peerConnectionsRef.current[peerId] = pc;

      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => {
          pc.addTrack(track, localStreamRef.current);
        });
      }

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socketServiceRef.current.sendIceCandidate(event.candidate, peerId);
        }
      };

      pc.onconnectionstatechange = () => {
        console.log(`Connection state change for ${peerId}: ${pc.connectionState}`);
      };

      pc.oniceconnectionstatechange = () => {
        console.log(`ICE connection state change for ${peerId}: ${pc.iceConnectionState}`);
      };

      pc.ontrack = (event) => {
        console.log("Received remote track from:", peerId);
        setPeers((prevPeers) => ({
          ...prevPeers,
          [peerId]: event.streams[0],
        }));
      };

      return pc;
    } catch (error) {
      console.error("Error creating peer connection:", error);
      setNotification({
        message: "Failed to establish connection",
        type: "error"
      });
      return null;
    }
  };

  const sendOffer = async (peerId) => {
    try {
      const pc = peerConnectionsRef.current[peerId];
      if (!pc || pc.signalingState !== "stable") return;

      const offer = await pc.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      });

      await pc.setLocalDescription(offer);

      setTimeout(() => {
        socketServiceRef.current.sendOffer(pc.localDescription, peerId);
      }, 1000);
    } catch (error) {
      console.error("Error creating/sending offer:", error);
    }
  };

  const handlePeerDisconnection = (disconnectedUserId) => {
    if (peerConnectionsRef.current[disconnectedUserId]) {
      peerConnectionsRef.current[disconnectedUserId].close();
      setPeers((prevPeers) => {
        const newPeers = { ...prevPeers };
        delete newPeers[disconnectedUserId];
        return newPeers;
      });
      delete peerConnectionsRef.current[disconnectedUserId];
    }
  };

  const cleanupResources = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    Object.values(peerConnectionsRef.current).forEach((pc) => pc.close());
    if (socketServiceRef.current) {
      socketServiceRef.current.disconnect();
    }
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTracks = localStreamRef.current.getAudioTracks();
      audioTracks.forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTracks = localStreamRef.current.getVideoTracks();
      videoTracks.forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  const leaveRoom = () => {
    cleanupResources();
    window.location.reload();
  };

  // Notification component
  const Notification = ({
    message,
    type = "info",
    duration = 3000,
    onClose,
  }) => {
    useEffect(() => {
      const timer = setTimeout(() => {
        if (onClose) onClose();
      }, duration);

      return () => clearTimeout(timer);
    }, [duration, onClose]);

    const typeStyles = {
      info: "bg-blue-500",
      success: "bg-green-500",
      warning: "bg-yellow-500",
      error: "bg-red-500",
    };

    return (
      <div
        className={`fixed top-4 right-4 ${typeStyles[type]} text-white px-4 py-2 rounded-lg shadow-lg max-w-md z-50`}
      >
        <div className="flex items-center justify-between">
          <p>{message}</p>
          <button
            onClick={onClose}
            className="ml-4 text-white hover:text-gray-200 focus:outline-none"
          >
            ✕
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 relative p-6">
      <StatusBar
        roomId={roomId}
        userId={userId}
        connected={connected}
        peersCount={Object.keys(peers).length + 1}
      />

      <VideoGrid
        localVideoRef={localVideoRef}
        isVideoOff={isVideoOff}
        isMuted={isMuted}
        peers={peers}
        userNames={userNamesRef.current}
        roomId={roomId}
        userId={userId}
      />

      <Controls
        isMuted={isMuted}
        isVideoOff={isVideoOff}
        toggleMute={toggleMute}
        toggleVideo={toggleVideo}
        leaveRoom={leaveRoom}
      />

      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
}

export default VideoRoom;
