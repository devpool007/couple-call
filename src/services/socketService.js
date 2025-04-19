import io from "socket.io-client";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

class SocketService {
  constructor(roomId, userId, userName, callbacks) {
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
    this.userName = userName;
    this.callbacks = callbacks;
  }

  connect() {
    this.setupSocketListeners();
    return this.socket;
  }

  joinRoom() {
    this.socket.emit("join-room", {
      roomId: this.roomId,
      userId: this.userId,
      userName: this.userName
    });
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

    this.socket.on("existing-users", (users) => {
      this.callbacks.onExistingUsers?.(users);
    });

    this.socket.on("user-connected", (data) => {
      this.callbacks.onUserConnected?.(data.userId, data.userName);
    });

    this.socket.on("user-disconnected", (userId) => {
      this.callbacks.onUserDisconnected?.(userId);
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