import { io } from "socket.io-client";

export const socket = io(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000", {
  autoConnect: false,
});
