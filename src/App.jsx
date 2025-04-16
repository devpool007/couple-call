import React, { useState, useEffect } from 'react';
import VideoRoom from './components/VideoRoom';
import JoinRoom from './components/JoinRoom';
import { Analytics } from "@vercel/analytics/react"

function App() {
  const [roomId, setRoomId] = useState('');
  const [joined, setJoined] = useState(false);
  const [userId] = useState(`user-${Math.floor(Math.random() * 1000000)}`);
  const [peerConnection, setPeerConnection] = useState(null);

  const iceConfig = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      {
        urls: "turn:turn.example.com", // Replace with your TURN server URL
        username: "user", // Replace with your TURN server username
        credential: "password" // Replace with your TURN server password
      }
    ]
  };

  useEffect(() => {
    if (joined) {
      const pc = new RTCPeerConnection(iceConfig);
      setPeerConnection(pc);

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          console.log('New ICE candidate:', event.candidate);
          // Send the candidate to the remote peer via signaling server
        }
      };

      pc.onconnectionstatechange = () => {
        console.log('Connection state:', pc.connectionState);
      };

      // Clean up the peer connection when the component unmounts or user leaves the room
      return () => {
        pc.close();
        setPeerConnection(null);
      };
    }
  }, [joined]);

  const handleJoinRoom = (roomId) => {
    setRoomId(roomId);
    setJoined(true);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-9/10 mx-auto px-4 pb-8">
        {!joined ? (
          <JoinRoom onJoin={handleJoinRoom} />
        ) : (
          <VideoRoom roomId={roomId} userId={userId} peerConnection={peerConnection} />
        )}
      </div>
      <Analytics/>
    </div>
  );
}

export default App;        