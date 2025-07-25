import { useEffect, useRef, useState, useCallback } from 'react';
import io from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

/**
 * A robust custom hook to manage a Socket.IO connection.
 * This version is corrected to use the browser's httpOnly session cookie for authentication,
 * which is more secure and aligns with our updated auth strategy.
 *
 * @returns {{ isConnected: boolean, on: (eventName: string, handler: function) => void, emit: (eventName: string, data: any) => void }}
 */
export const useSocket = () => {
  // REMOVED the 'token' parameter as it's no longer needed.
  const socketRef = useRef(null);
  const listenersRef = useRef({});
  const [isConnected, setIsConnected] = useState(false);

  // This function allows components to register event listeners.
  // It's stable and won't cause re-renders.
  const on = useCallback((eventName, handler) => {
    // Store the latest handler in a ref to prevent stale closure issues.
    listenersRef.current[eventName] = handler;

    // If the socket is already connected, register the listener immediately.
    if (socketRef.current?.connected) {
      socketRef.current.on(eventName, handler);
    }
  }, []);

  // This function allows components to emit messages safely.
  const emit = useCallback((eventName, data) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(eventName, data);
    } else {
      console.warn(`Socket not connected. Could not emit event: ${eventName}`);
    }
  }, []);

  // The main effect for managing the socket lifecycle.
  useEffect(() => {
    // --- THIS IS THE CRITICAL FIX ---
    // Create the socket instance. `withCredentials: true` tells the browser
    // to automatically send the secure session cookie with the connection request.
    const socket = io(SOCKET_URL, {
      withCredentials: true, // This enables cookie-based authentication.
      reconnection: true,
      reconnectionAttempts: 5,
    });

    socketRef.current = socket;

    // --- Setup Listeners (This logic is correct and remains) ---
    socket.on('connect', () => {
      console.log(`Socket.IO: Connected with ID ${socket.id}`);
      setIsConnected(true);

      // Re-register all listeners upon connection/reconnection.
      Object.entries(listenersRef.current).forEach(([eventName, handler]) => {
        socket.on(eventName, handler);
      });
    });

    socket.on('disconnect', () => {
      console.log('Socket.IO: Disconnected');
      setIsConnected(false);
    });

    socket.on('connect_error', (err) => {
      console.error('Socket.IO: Connection Error:', err.message);
    });

    // --- Cleanup Function (This logic is correct and remains) ---
    return () => {
      console.log('Socket.IO: Cleaning up and disconnecting...');
      if (socket) {
        Object.keys(listenersRef.current).forEach((eventName) => {
          socket.off(eventName);
        });
        listenersRef.current = {};
        socket.disconnect();
      }
    };
  }, []); // The dependency array is now empty, so this effect runs only once.

  return { isConnected, on, emit };
};