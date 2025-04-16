import React from "react";

function VideoGrid({ localVideoRef, isVideoOff, isMuted, peers, roomId }) {
  return (
    <div className="flex flex-col lg:flex-row gap-4 mb-10 mt-8">
      {/* Local Video */}
      <div className="w-full lg:w-1/2 h-auto">
        <div className="relative w-full h-full rounded-xl overflow-hidden">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className={`w-full h-full object-cover ${
              isVideoOff ? "opacity-0" : ""
            }`}
          />
          {isVideoOff && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
              <span className="text-white text-2xl font-bold">Camera Off</span>
            </div>
          )}
          <div className="absolute bottom-4 left-4 bg-black bg-opacity-60 text-white px-4 py-2 rounded-lg text-base">
            You {isMuted ? "(Muted)" : ""}
          </div>
        </div>
      </div>

      {/* Remote Video */}
      <div className="w-full lg:w-1/2 h-auto">
        {Object.entries(peers).length > 0 ? (
          Object.entries(peers).map(([peerId, stream]) => (
            <div
              key={peerId}
              className="relative w-full h-full rounded-xl overflow-hidden"
            >
              <video
                ref={(element) => {
                  if (element) element.srcObject = stream;
                }}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 bg-black bg-opacity-60 text-white px-4 py-2 rounded-lg text-base">
                Peer: {peerId.substring(0, 8)}...
              </div>
            </div>
          ))
        ) : (
          <div className="w-full h-full rounded-xl bg-gray-800 flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-400 text-xl mb-4">
                Waiting for someone to join...
              </p>
              <p className="text-gray-500 text-sm">
                Share the room ID to invite someone
              </p>
              <p className="font-mono bg-gray-700 px-4 py-2 rounded mt-2 text-gray-300">
                {roomId}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default VideoGrid;
