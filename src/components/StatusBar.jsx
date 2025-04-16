import React from 'react';

function StatusBar({ roomId, userId, connected, peersCount }) {
  return (
    <div className="bg-gray-800 bg-opacity-90 p-4 rounded-lg mb-4">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <div>
          <h2 className="text-white text-sm md:text-lg">Room: <span className="font-mono">{roomId}</span></h2>
          <p className={`text-sm ${connected ? 'text-green-400' : 'text-yellow-400'}`}>
            {connected ? `Connected as: ${userId.substring(0, 8)}...` : 'Connecting...'}
          </p>
        </div>
        <div className="text-center text-white text-sm md:text-xl font-semibold">
          Couple Call ❤️
        </div>
        <div className="text-white text-sm">
          <span className="px-3 py-1 rounded-full">
            {peersCount}/2 Participants
          </span>
        </div>
      </div>
    </div>
  );
}

export default StatusBar;