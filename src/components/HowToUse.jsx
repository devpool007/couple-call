import React from 'react';
import { Link } from 'react-router-dom';

function HowToUse() {
  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-3xl mx-auto text-white">
        <h1 className="text-3xl font-bold mb-6">How to Use Couple Call</h1>
        
        <div className="space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-3">1. Getting Started</h2>
            <p className="text-gray-300">
              Visit the homepage and you'll see an option to enter a room ID or generate a random one.
              This ID is unique to your call session.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. Joining a Room</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Enter a specific room ID if you're joining someone</li>
              <li>Leave it blank for a random room ID if you're creating a new call</li>
              <li>Click "Join Room" to enter the video call</li>
              <li>Allow camera and microphone access when prompted</li>
              <li>Tip: You can click on the Room ID to copy it to your clipboard easily! :D</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. During the Call</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Use the mute button to toggle your microphone</li>
              <li>Use the camera button to toggle your video</li>
              <li>Click "Leave Call" to end the session</li>
              <li>The timer shows how long you've been connected</li>
              <li>Maximum 2 participants can join a room</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">4. Sharing the Room</h2>
            <p className="text-gray-300">
              Share the room ID displayed at the top of your screen with the person you want to call.
              They can enter this ID on their device to join your room.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">5. Privacy & Security</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>All calls are peer-to-peer and encrypted</li>
              <li>No call data is stored on our servers</li>
              <li>Room IDs are temporary and expire after the call</li>
            </ul>
          </section>

          <div className="mt-8">
            <Link 
              to="/" 
              className="text-green-400 hover:text-green-300 transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HowToUse;