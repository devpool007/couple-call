import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import VideoRoom from './components/VideoRoom';
import JoinRoom from './components/JoinRoom';
import HowToUse from './components/HowToUse';
import PrivacyPolicy from './components/PrivacyPolicy';
import Feedback from './components/Feedback';
import Footer from './components/Footer';
import NotFound from './components/NotFound';
import { Analytics } from "@vercel/analytics/react";
import AdSense from 'react-adsense';

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

  useEffect(() => {
    if (!joined) {
      // Scroll to the bottom of the page when on the Join Room page
      window.scrollTo(0, document.body.scrollHeight);
    }
    else {
      window.scrollTo(0, 0);
    }
  }, [joined]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-900 relative pb-20">
        <div className="max-w-9/10 mx-auto px-4">
          <Routes>
            <Route path="/" element={
              !joined ? (
                <JoinRoom onJoin={handleJoinRoom} />
              ) : (
                <VideoRoom roomId={roomId} userId={userId} peerConnection={peerConnection} />
              )
            } />
            <Route path="/how-to-use" element={<HowToUse />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </div>
       
        <Footer />
        <Analytics />
      </div>
    </Router>
  );
}

export default App;