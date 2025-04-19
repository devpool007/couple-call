import io from "socket.io-client";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
// const BACKEND_URL = 'http://localhost:3000';

class SocketService {
  constructor(roomId, userId, callbacks) {
    this.socket = io(BACKEND_URL, {
      transports: ["websocket"],
      reconnection: true,
      secure: true,
      reconnectionAttempts: 3,
      timeout: 10000,
      forceNew: true,
    });
    
    this.roomId = roomId;
    this.userId = userId;
    this.callbacks = callbacks;
  }

  connect() {
    this.setupSocketListeners();
    return this.socket;
  }

  joinRoom() {
    this.socket.emit("join-room", this.roomId, this.userId);
  }

  setupSocketListeners() {
    // Connection error handling
    this.socket.on("connect_error", (error) => {
      console.log("Connection error:", error);
      this.callbacks.onError?.(error);
    });

    this.socket.on("connect_timeout", () => {
      console.log("Connection timeout");
      this.callbacks.onError?.(new Error("Connection timeout"));
    });

    this.socket.on("reconnect", (attemptNumber) => {
      console.log("Reconnected on attempt: ", attemptNumber);
    });

    this.socket.on("reconnect_error", (error) => {
      console.log("Reconnection error:", error);
      this.callbacks.onError?.(error);
    });

    // Room events
    this.socket.on("existing-users", (existingUsers) => {
      this.callbacks.onExistingUsers?.(existingUsers);
    });

    this.socket.on("user-connected", (newUserId) => {
      this.callbacks.onUserConnected?.(newUserId);
    });

    this.socket.on("user-disconnected", (disconnectedUserId) => {
      this.callbacks.onUserDisconnected?.(disconnectedUserId);
    });

    this.socket.on("room-full", (roomId) => {
      this.callbacks.onRoomFull?.(roomId);
    });

    // WebRTC signaling
    this.socket.on("offer", async (offer, fromUserId) => {
      this.callbacks.onOffer?.(offer, fromUserId);
    });

    this.socket.on("answer", async (answer, fromUserId) => {
      this.callbacks.onAnswer?.(answer, fromUserId);
    });

    this.socket.on("ice-candidate", async (candidate, fromUserId) => {
      this.callbacks.onIceCandidate?.(candidate, fromUserId);
    });
  }

  // Signaling methods
  sendOffer(offer, peerId) {
    this.socket.emit("offer", offer, this.roomId, peerId);
  }

  sendAnswer(answer, peerId) {
    this.socket.emit("answer", answer, this.roomId, peerId);
  }

  sendIceCandidate(candidate, peerId) {
    this.socket.emit("ice-candidate", candidate, this.roomId, peerId);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}

export default SocketService;