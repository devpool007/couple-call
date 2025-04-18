import React from 'react';
import { Link } from 'react-router-dom';

function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-3xl mx-auto text-white">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <div className="space-y-4">
          <section>
            <h2 className="text-xl font-semibold mb-3">Information Collection and Use</h2>
            <p className="text-gray-300">
              We only collect minimal information necessary for the video call functionality. 
              No personal data is stored on our servers. All video and audio communication 
              is peer-to-peer and encrypted.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3">Data Security</h2>
            <p className="text-gray-300">
              All video calls are encrypted using WebRTC's built-in encryption. 
              We do not record or store any call content.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Cookies</h2>
            <p className="text-gray-300">
              We use essential cookies only for maintaining your session during the call.
            </p>
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

export default PrivacyPolicy;