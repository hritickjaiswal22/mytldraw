import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_BACKEND_DOMAIN, {
  forceNew: true,
  reconnectionAttempts: Infinity,
  timeout: 10000,
  transports: ["websocket"],
});

export { socket };
