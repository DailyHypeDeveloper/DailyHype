// Import the necessary modules

"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useSearchParams } from "next/navigation";
import { Button } from "@nextui-org/react";
//import DeliveryDetailsModal from './DeliveryDetailsModal'; // Import the new component

import "./Chatroom.css";

const ChatRoomPage = () => {
  const searchParams = useSearchParams();
  const deliveryDataAll = searchParams.get("data");
  // Get the current URL
  const currentUrl = window.location.href;

  // Use regular expression to match the roomId
  const roomIDMatchOut = 1;
  //currentUrl.match(/\/deliveries\/chat\/([^?]+)/);

  let deliveryId: string | null = null;

  if (deliveryDataAll) {
    const deliveryData = JSON.parse(deliveryDataAll);
    deliveryId = deliveryData.deliveryId;

    console.log("deliveryIdForChat is " + deliveryId);
  }

  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        // Assuming roomIDMatchOut is the result of some regular expression matching
        var roomIDMatch = roomIDMatchOut;

        // Check if roomIDMatchOut is an array and has the roomId
        if (roomIDMatchOut) {
          var roomID = roomIDMatch;

          const response = await fetch(
            `${process.env.BACKEND_URL}/api/getAllMessages/${roomID}`
          );
          const data = await response.json();

          // Extracting the "text" property and arranging by datetime
          const messagesData = data
            .map((message: any) => ({
              text: message.msgcontent,
              timestamp: new Date(message.timestamp),
            }))
            .sort((a: any, b: any) => a.timestamp - b.timestamp)
            .map((message: any) => message.text);

            console.log("The messagesData is " + messagesData)

          setMessages(messagesData);

        } else {
          console.error("Room ID not found in the URL");
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [roomIDMatchOut]);

  const [messageInput, setMessageInput] = useState<string>("");

  const [socket, setSocket] = useState<any>(null);
  const [isDeliveryModalOpen, setDeliveryModalOpen] = useState<boolean>(false);
  const [selectedDelivery, setSelectedDelivery] = useState<any>(null);

  const WS_DOMAIN = "localhost";
  const WS_PORT = "5001";

  useEffect(() => {
    // Check if deliveryId is defined before connecting to WebSocket
    if (deliveryId) {
      // Connect to the WebSocket server
      const newSocket = io(`ws://${WS_DOMAIN}:${WS_PORT}/chat`, {
        transports: ["websocket"],
        query: { deliveryId },
      });
      setSocket(newSocket);

      // Clean up the socket connection on component unmount
      return () => {
        newSocket.disconnect();
      };
    }
  }, [deliveryId]);

  useEffect(() => {
    // Listen for incoming messages
    if (socket) {
      socket.on("message", (newMessage: string) => {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      });
    }
  }, [socket]);

  /*const sendMessage = () => {
    try {
      if (socket && messageInput.trim() !== '') {
        // Emit a message to the server
        console.log("Sending message: " + messageInput);
        socket.emit('message', messageInput);
        setMessageInput('');
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };*/

  const sendMessage = async () => {
    try {
      if (socket && messageInput.trim() !== "") {
        // Send the message to the server to add it to the database
        const response = await fetch(`${process.env.BACKEND_URL}/api/addNewMessage`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // You might need to include an authorization header if required
            // 'Authorization': `Bearer ${yourAuthToken}`,
          },
          body: JSON.stringify({
            messagedatetime: new Date(),
            msgcontent: messageInput,
            roomid: roomIDMatchOut,
            speakerid: 52,
          }),
        });

        // Check if the server successfully added the message to the database
        if (response.ok) {
          // Emit the message to other clients through the socket
          console.log("Sending message through socket: " + messageInput);
          socket.emit("message", messageInput);

          // Clear the message input after sending
          setMessageInput("");
        } else {
          console.error("Error adding message to the database");
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="chatroom-container">
      <div className="chatroom-header">
        <h1>Chat Room for Delivery #{deliveryId}</h1>
      </div>
      <div className="chatroom-messages">
        {messages.map((message, index) => (
          <div key={index} className="message">
            {message}
          </div>
        ))}
      </div>
      <div className="chatroom-input">
        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatRoomPage;
