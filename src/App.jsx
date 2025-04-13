import React, { useState } from 'react';
import VideoRoom from './components/VideoRoom';
import JoinRoom from './components/JoinRoom';

function App() {
  const [roomId, setRoomId] = useState('');
  const [joined, setJoined] = useState(false);
  const [userId] = useState(`user-${Math.floor(Math.random() * 1000000)}`);

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
        <VideoRoom roomId={roomId} userId={userId} />
      )}
    </div>
  );
}

export default App;