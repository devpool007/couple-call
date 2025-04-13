import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

function VideoRoom({ roomId, userId }) {
  const [peers, setPeers] = useState({});
  const [connected, setConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [notification, setNotification] = useState(null);
  const localVideoRef = useRef(null);
  const socketRef = useRef(null);
  const localStreamRef = useRef(null);
  const peerConnectionsRef = useRef({});

  useEffect(() => {
    // Connect to the signaling server
    socketRef.current = io('http://localhost:3000');
    
    // Get local media stream
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        
        // Join room after getting local stream
        socketRef.current.emit('join-room', roomId, userId);
        setConnected(true);
        setNotification({
          message: `You've joined room: ${roomId}`,
          type: 'success'
        });

        // Set up socket event listeners
        setupSocketListeners();
      })
      .catch(error => {
        console.error('Error accessing media devices:', error);
        setNotification({
          message: `Error accessing camera/microphone: ${error.message}`,
          type: 'error'
        });
      });

    // Cleanup function
    return () => {
      cleanupResources();
    };
  }, [roomId, userId]);

  const setupSocketListeners = () => {
    // Handle existing users in the room
    socketRef.current.on('existing-users', (existingUsers) => {
      console.log('Existing users in room:', existingUsers);
      existingUsers.forEach(existingUserId => {
        // Initialize connection with existing users
        createPeerConnection(existingUserId);
        sendOffer(existingUserId);
      });
    });

    // Handle new user connection
    socketRef.current.on('user-connected', (newUserId) => {
      console.log('New user connected:', newUserId);
      // Wait for the new user to initialize their connection
      setNotification({
        message: `New user joined: ${newUserId.substring(0, 8)}...`,
        type: 'info'
      });
    });

    // Handle disconnection
    socketRef.current.on('user-disconnected', (disconnectedUserId) => {
      console.log('User disconnected:', disconnectedUserId);
      handlePeerDisconnection(disconnectedUserId);
      setNotification({
        message: `User left: ${disconnectedUserId.substring(0, 8)}...`,
        type: 'warning'
      });
    });

    // Handle WebRTC signaling
    socketRef.current.on('offer', async (offer, fromUserId) => {
      console.log('Received offer from:', fromUserId);
      try {
        if (!peerConnectionsRef.current[fromUserId]) {
          createPeerConnection(fromUserId);
        }
        
        const pc = peerConnectionsRef.current[fromUserId];
        
        // Check if we need to do a rollback
        if (pc.signalingState !== 'stable') {
          console.log('Applying rollback for non-stable state:', pc.signalingState);
          await pc.setLocalDescription({type: "rollback"});
        }
        
        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        
        socketRef.current.emit('answer', answer, roomId, fromUserId);
      } catch (error) {
        console.error('Error handling offer:', error);
        setNotification({
          message: 'Connection error, please try refreshing',
          type: 'error'
        });
      }
    });

    socketRef.current.on('answer', async (answer, fromUserId) => {
      try {
        console.log('Received answer from:', fromUserId);
        const pc = peerConnectionsRef.current[fromUserId];
        if (pc) {
          if (pc.signalingState === 'have-local-offer') {
            await pc.setRemoteDescription(new RTCSessionDescription(answer));
          } else {
            console.log('Cannot set remote answer in state:', pc.signalingState);
          }
        }
      } catch (error) {
        console.error('Error handling answer:', error);
      }
    });

    socketRef.current.on('ice-candidate', async (candidate, fromUserId) => {
      try {
        console.log('Received ICE candidate from:', fromUserId);
        const pc = peerConnectionsRef.current[fromUserId];
        if (pc) {
          if (pc.remoteDescription) {
            await pc.addIceCandidate(new RTCIceCandidate(candidate));
          } else {
            console.log('Cannot add ICE candidate without remote description');
          }
        }
      } catch (error) {
        console.error('Error handling ICE candidate:', error);
      }
    });
  };

  const createPeerConnection = (peerId) => {
    try {
      console.log('Creating peer connection for:', peerId);
      
      const configuration = {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' }
        ],
        iceCandidatePoolSize: 10
      };
      
      const pc = new RTCPeerConnection(configuration);
      peerConnectionsRef.current[peerId] = pc;
      
      // Add local tracks to the peer connection
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => {
          pc.addTrack(track, localStreamRef.current);
        });
      }
      
      // Handle ICE candidates
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socketRef.current.emit('ice-candidate', event.candidate, roomId, peerId);
        }
      };
      
      // Log connection state changes for debugging
      pc.onconnectionstatechange = () => {
        console.log(`Connection state change for ${peerId}: ${pc.connectionState}`);
      };
      
      pc.oniceconnectionstatechange = () => {
        console.log(`ICE connection state change for ${peerId}: ${pc.iceConnectionState}`);
      };
      
      // Handle incoming streams
      pc.ontrack = (event) => {
        console.log('Received remote track from:', peerId);
        setPeers(prevPeers => ({
          ...prevPeers,
          [peerId]: event.streams[0]
        }));
      };
      
      return pc;
    } catch (error) {
      console.error('Error creating peer connection:', error);
      setNotification({
        message: 'Failed to establish connection',
        type: 'error'
      });
      return null;
    }
  };

  const sendOffer = async (peerId) => {
    try {
      console.log('Sending offer to:', peerId);
      const pc = peerConnectionsRef.current[peerId];
      if (!pc) return;
      
      // Only create an offer if in stable state
      if (pc.signalingState !== 'stable') {
        console.log(`Cannot create offer in state: ${pc.signalingState}`);
        return;
      }
      
      const offer = await pc.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true
      });
      
      await pc.setLocalDescription(offer);
      
      // Wait a moment for ICE gathering to start
      setTimeout(() => {
        if (pc.iceGatheringState === 'complete') {
          socketRef.current.emit('offer', pc.localDescription, roomId, peerId);
        } else {
          // Use what we have so far
          socketRef.current.emit('offer', pc.localDescription, roomId, peerId);
        }
      }, 1000);
    } catch (error) {
      console.error('Error creating/sending offer:', error);
    }
  };
  
  const handlePeerDisconnection = (disconnectedUserId) => {
    if (peerConnectionsRef.current[disconnectedUserId]) {
      peerConnectionsRef.current[disconnectedUserId].close();
      
      // Update the peers state
      setPeers(prevPeers => {
        const newPeers = { ...prevPeers };
        delete newPeers[disconnectedUserId];
        return newPeers;
      });
      
      delete peerConnectionsRef.current[disconnectedUserId];
    }
  };
  
  const cleanupResources = () => {
    // Stop all tracks in the local stream
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }
    
    // Close all peer connections
    Object.values(peerConnectionsRef.current).forEach(pc => pc.close());
    
    // Disconnect socket
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
  };
  
  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTracks = localStreamRef.current.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };
  
  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTracks = localStreamRef.current.getVideoTracks();
      videoTracks.forEach(track => {
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
  const Notification = ({ message, type = 'info', duration = 3000, onClose }) => {
    useEffect(() => {
      const timer = setTimeout(() => {
        if (onClose) onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }, [duration, onClose]);
    
    const typeStyles = {
      info: 'bg-blue-500',
      success: 'bg-green-500',
      warning: 'bg-yellow-500',
      error: 'bg-red-500',
    };
    
    return (
      <div className={`fixed top-4 right-4 ${typeStyles[type]} text-white px-4 py-2 rounded-lg shadow-lg max-w-md z-50`}>
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
  
  // Component to display a remote video
  const RemoteVideo = ({ stream, peerId }) => {
    const videoRef = useRef(null);
    
    useEffect(() => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    }, [stream]);
    
    return (
      <div className="relative w-80 h-60 border-2 border-blue-500 rounded-lg overflow-hidden shadow-lg">
        <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
        <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
          Peer: {peerId.substring(0, 8)}...
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-2">Room: {roomId}</h2>
        {connected ? (
          <p className="font-bold text-green-600">Connected as: {userId.substring(0, 8)}...</p>
        ) : (
          <p className="font-bold text-yellow-600">Connecting...</p>
        )}
      </div>
      
      <div className="flex flex-wrap justify-center gap-5 mb-6">
        <div className="relative w-80 h-60 border-2 border-green-500 rounded-lg overflow-hidden shadow-lg">
          <video 
            ref={localVideoRef} 
            autoPlay 
            muted 
            playsInline 
            className={`w-full h-full object-cover ${isVideoOff ? 'opacity-0' : ''}`} 
          />
          {isVideoOff && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
              <span className="text-white font-bold">Camera Off</span>
            </div>
          )}
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
            You {isMuted ? '(Muted)' : ''}
          </div>
        </div>
        
        <div className="flex flex-wrap justify-center gap-5">
          {Object.entries(peers).map(([peerId, stream]) => (
            <RemoteVideo key={peerId} stream={stream} peerId={peerId} />
          ))}
        </div>
      </div>
      
      {/* Controls */}
      <div className="flex items-center justify-center gap-4 mb-8">
        <button 
          onClick={toggleMute} 
          className={`px-4 py-2 rounded-full ${isMuted ? 'bg-red-500' : 'bg-blue-500'} text-white font-medium hover:opacity-90 transition-opacity focus:outline-none`}
        >
          {isMuted ? 'Unmute' : 'Mute'}
        </button>
        
        <button 
          onClick={toggleVideo} 
          className={`px-4 py-2 rounded-full ${isVideoOff ? 'bg-red-500' : 'bg-blue-500'} text-white font-medium hover:opacity-90 transition-opacity focus:outline-none`}
        >
          {isVideoOff ? 'Turn On Camera' : 'Turn Off Camera'}
        </button>
        
        <button 
          onClick={leaveRoom} 
          className="px-4 py-2 rounded-full bg-red-600 text-white font-medium hover:bg-red-700 transition-colors focus:outline-none"
        >
          Leave Room
        </button>
      </div>
      
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="font-semibold text-lg mb-2">Room Information</h3>
        <p className="mb-1">Share this room ID with others to join: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{roomId}</span></p>
        <p className="text-sm text-gray-600">Active participants: {Object.keys(peers).length + 1}</p>
      </div>
      
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