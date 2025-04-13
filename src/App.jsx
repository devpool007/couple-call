import React, { useState, useEffect } from 'react';
import VideoRoom from './components/VideoRoom';
import JoinRoom from './components/JoinRoom';

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
    <div className="max-w-6xl mx-auto p-6 text-center">
      <h1 className="text-3xl font-bold mb-8">Simple Video Call App</h1>
      {!joined ? (
        <JoinRoom onJoin={handleJoinRoom} />
      ) : (
        <VideoRoom roomId={roomId} userId={userId} peerConnection={peerConnection} />
      )}
    </div>
  );
}

export default App;