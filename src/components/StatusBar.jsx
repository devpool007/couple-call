import React from 'react';
import Timer from './Timer';

function StatusBar({ roomId, userId, connected, peersCount }) {
  // Initialize startTime when the component mounts
  const [startTime] = React.useState(new Date().getTime());

  return (
    <div className="bg-gray-800 bg-opacity-90 p-4 rounded-lg mb-4">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <div>
          <h2 className="text-white text-xs md:text-lg">Room: <span className="font-mono">{roomId}</span></h2>
          <p className={`text-xs ${connected ? 'text-green-400' : 'text-yellow-400'}`}>
            {connected ? `Connected as: ${userId.substring(0, 8)}...` : 'Connecting...'}
          </p>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="text-center text-white text-xs md:text-xl font-semibold">
            Couple Call ❤️
          </div>
          {connected && <Timer startTime={startTime} />}
        </div>
        <div className="text-white text-xs md:text-sm">
          <span className="px-3 py-1">
            {peersCount}/2 Participants
          </span>
        </div>
      </div>
    </div>
  );
}

export default StatusBar;