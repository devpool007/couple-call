import React, { useState } from 'react';

function JoinRoom({ onJoin }) {
  const [roomId, setRoomId] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Generate a random room ID if none is provided
    const generateSecureRoomId = () => {
      const characters = '*!@/ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let result = 'room-';
      for (let i = 0; i < 11; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      return result;
    };

    const finalRoomId = roomId || generateSecureRoomId();
    const finalName = name || 'Anonymous';
    onJoin(finalRoomId, finalName);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 p-4">
      <h1 className="text-4xl font-bold mb-8 text-white">Couple Call ❤️</h1>
      <div className="max-w-md w-full bg-gray-800 p-8 rounded-lg shadow-xl border border-gray-700">
        <form onSubmit={handleSubmit}>
          <h2 className="text-2xl font-semibold mb-6 text-gray-200">Join a Video Call</h2>
          <div className="space-y-6">
            <div>
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 text-white placeholder-gray-400 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent mb-1"
                maxLength={20}
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Enter room ID (or leave blank for random)"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 text-white placeholder-gray-400 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
          <button 
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-300 shadow-lg mt-6"
          >
            Join Room
          </button>
        </form>
      </div>
    </div>
  );
}

export default JoinRoom;