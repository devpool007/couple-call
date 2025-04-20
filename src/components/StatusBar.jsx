import React, { useEffect}  from "react";
import Timer from "./Timer";

function StatusBar({ roomId, userId, connected, peersCount }) {
  // Initialize startTime when the component mounts
  const [startTime] = React.useState(new Date().getTime());
  const [copied, setCopied] = React.useState(false);

  const handleCopyClick = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

    const Notification = ({
      message,
      type = "info",
      duration = 3000,
      onClose,
    }) => {
      useEffect(() => {
        const timer = setTimeout(() => {
          if (onClose) onClose();
        }, duration);
  
        return () => clearTimeout(timer);
      }, [duration, onClose]);
  
      const typeStyles = {
        info: "bg-blue-500",
        success: "bg-green-500",
        warning: "bg-yellow-500",
        error: "bg-red-500",
      };
  
      return (
        <div
          className={`fixed top-4 right-4 ${typeStyles[type]} text-white px-4 py-2 rounded-lg shadow-lg max-w-md z-50`}
        >
          <div className="flex items-center justify-between">
            <p>{message}</p>
            <button
              onClick={onClose}
              className="ml-4 text-white hover:text-gray-200 focus:outline-none"
            >
              ✕
            </button>
          </div>
        </div>
      );
    };

  return (
    <div className="bg-gray-800 bg-opacity-90 p-4 rounded-lg mb-4">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <div>
          {/* <h2 className="text-white text-xs md:text-lg">Room: <span className="font-mono">{roomId}</span></h2> */}
          <button
            onClick={handleCopyClick}
            className="p-1 hover:bg-gray-700 rounded transition-colors"
            title="Copy room ID"
          >
            <span className="font-mono text-white text-xs md:text-lg">{`Room:${roomId}`}</span>
            <p
              className={`text-xs ${
                connected ? "text-green-400" : "text-yellow-400"
              }`}
            >
              {connected ? "Connected" : "Connecting..."}
            </p>
          </button>
        </div>
        <div className="flex flex-col items-center gap-2 ">
          <div className="text-center  text-white text-xs md:text-xl font-semibold">
            Couple Call ❤️
          </div>
          {connected && <Timer startTime={startTime} />}
        </div>
        <div className="text-white text-xs md:text-sm ml-5">
          <span className="px-3 py-1">{peersCount}/2 Participants</span>
        </div>
      </div>
      {copied && (
        <Notification
          message={"Room ID copied to clipboard!"}
          type="success"
          onClose={() => setCopied(false)}
        />
      )}
    </div>
  );
}

export default StatusBar;
