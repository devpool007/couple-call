import React, { useState } from 'react';

function JoinRoom({ onJoin }) {
  const [roomId, setRoomId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Generate a random room ID if none is provided
    const finalRoomId = roomId || `room-${Math.floor(Math.random() * 1000000)}`;
    onJoin(finalRoomId);
  };

  return (
    <div className="max-w-md mx-auto bg-gray-50 p-6 rounded-lg shadow-md">
      <form onSubmit={handleSubmit}>
        <h2 className="text-xl font-semibold mb-4">Join a Video Call</h2>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Enter room ID (or leave blank for random)"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <button 
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-300"
        >
          Join Room
        </button>
      </form>
    </div>
  );
}

export default JoinRoom;