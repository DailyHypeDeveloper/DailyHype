// Import the necessary modules
"use client";

import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { useSearchParams } from "next/navigation";
import { Button } from "@nextui-org/react";
//import DeliveryDetailsModal from './DeliveryDetailsModal'; // Import the new component

import "./Chatroom.css";

const ChatRoomPage = () => {
  const actualCurrentUserId = 52;

  const searchParams = useSearchParams();
  const deliveryDataAll = searchParams.get("data");
  const currentUrl = window.location.href;

  // Use regular expression to match the roomId
  const roomIDMatchOut = 1;

  let deliveryId: string | null = null;

  if (deliveryDataAll) {
    const deliveryData = JSON.parse(deliveryDataAll);
    deliveryId = deliveryData.deliveryId;

    console.log("deliveryIdForChat is " + deliveryId);
  }

  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        var roomIDMatch = roomIDMatchOut;

        if (roomIDMatchOut) {
          var roomID = roomIDMatch;

          const response = await fetch(
            `${process.env.BACKEND_URL}/api/getAllMessages/${roomID}`
          );
          const data = await response.json();

          const messagesData = data
            .map((message: any) => ({
              text: message.msgcontent,
              messagedatetime: new Date(message.messagedatetime),
              speakerid: message.speakerid,
            }))
            .sort((a: any, b: any) => a.messagedatetime - b.messagedatetime);

          console.log("The messagesData is ", messagesData);

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
    if (deliveryId) {
      const newSocket = io(`ws://${WS_DOMAIN}:${WS_PORT}/chat`, {
        transports: ["websocket"],
        query: { deliveryId },
      });
      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    }
  }, [deliveryId]);

  useEffect(() => {
    if (socket) {
      socket.on("message", (newMessage: string) => {
        const speakerid = actualCurrentUserId;
        const dataTime = new Date(); // insert datetime code here

        const newMessageData = {
          text: newMessage,
          messagedatetime: dataTime,
          speakerid: speakerid,
        };

        setMessages((prevMessages) => [...prevMessages, newMessageData]);
      });
    }
  }, [socket]);

  const sendMessage = async () => {
    try {
      if (socket && messageInput.trim() !== "") {
        const response = await fetch(`${process.env.BACKEND_URL}/api/addNewMessage`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messagedatetime: new Date(),
            msgcontent: messageInput,
            roomid: roomIDMatchOut,
            speakerid: actualCurrentUserId,
          }),
        });

        if (response.ok) {
          console.log("Sending message through socket: " + messageInput);
          socket.emit("message", messageInput);
          setMessageInput("");
        } else {
          console.error("Error adding message to the database");
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const chatroomRef = useRef(null);

  useEffect(() => {
    // Scroll to the bottom of the chatroom container if chatroomRef is available
    const chatroomElement = chatroomRef.current as HTMLDivElement | null;
    if (chatroomElement) {
        chatroomElement.scrollTop = chatroomElement.scrollHeight;
    }
}, [messages, chatroomRef]);

  return (
    <div className="chatroom-container" ref={chatroomRef}>
      <div className="chatroom-header">
        <h1>Chat Room for Delivery #{deliveryId}</h1>
      </div>
      <div className="chatroom-messages">
        {messages.map((message, index) => (
          <div
            key={index} //message.speakerid
            className={`message`}
            style={{
              backgroundColor:
                actualCurrentUserId == message.speakerid
                  ? "lightgreen"
                  : "white",
            }}
          >
            <span className="message-text">{message.text}</span>
            {message.messagedatetime && (
              <span className="message-timestamp relative bottom-0 left-2 text-xs text-gray-500">
                {message.messagedatetime.toLocaleString()}
              </span>
            )}
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
