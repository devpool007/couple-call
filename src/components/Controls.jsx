import React from "react";

function Controls({ isMuted, isVideoOff, toggleMute, toggleVideo, leaveRoom }) {
  return (
    <div className="bg-gray-800 bg-opacity-90 p-4 rounded-lg">
      <div className="flex items-center justify-center gap-3 md:gap-4 max-w-xl mx-auto">
        <button
          onClick={toggleMute}
          className={`px-4 md:px-6 py-3 rounded-full ${
            isMuted ? "bg-red-500" : "bg-blue-500"
          } text-white font-medium hover:opacity-90 transition-opacity focus:outline-none shadow-lg flex items-center gap-2 text-sm md:text-base w-[110px] md:w-auto justify-center`}
        >
          {isMuted ? "Unmute Audio" : "Mute Audio"}
        </button>

        <button
          onClick={toggleVideo}
          className={`px-4 md:px-6 py-3 rounded-full ${
            isVideoOff ? "bg-red-500" : "bg-blue-500"
          } text-white font-medium hover:opacity-90 transition-opacity focus:outline-none shadow-lg flex items-center gap-2 text-sm md:text-base w-[110px] md:w-auto justify-center`}
        >
          {isVideoOff ? "Show Video" : "Hide Video"}
        </button>

        <button
          onClick={leaveRoom}
          className="px-4 md:px-6 py-3 rounded-full bg-red-600 text-white font-medium hover:bg-red-700 transition-colors focus:outline-none shadow-lg flex items-center gap-2 text-sm md:text-base w-[110px] md:w-auto justify-center"
        >
          Leave Call
        </button>
      </div>
    </div>
  );
}

export default Controls;
