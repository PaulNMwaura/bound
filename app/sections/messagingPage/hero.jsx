"use client";

import { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3001"); // Connect to the backend

export default function Hero() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [sender, setSender] = useState("");
  const [receiver, setReceiver] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      // Fetch previous messages from the server
      fetch(
        `http://localhost:3001/messages?sender=${sender}&receiver=${receiver}`
      )
        .then((response) => response.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setMessages(data);
          } else {
            console.error("Error: Messages are not an array", data);
          }
        })
        .catch((err) =>
          console.error("Error fetching previous messages:", err)
        );

      // Emit 'login' event with username
      socket.emit("login", sender);

      socket.on("receiveMessage", (newMessage) => {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      });

      return () => {
        socket.off("receiveMessage");
      };
    }
  }, [isLoggedIn, sender, receiver]);

  const sendMessage = () => {
    if (message.trim() && receiver.trim()) {
      const newMessage = { sender, receiver, content: message, status: "sent" };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      socket.emit("sendMessage", { sender, receiver, content: message });
      setMessage("");
    } else {
      alert("Please enter both a message and a receiver!");
    }
  };

  const handleLogin = () => {
    if (sender.trim() && receiver.trim()) {
      if (sender === receiver) {
        alert("Sender and receiver cannot be the same!");
        return;
      }
      setIsLoggedIn(true);
    } else {
      alert("Please enter both a username and receiver to continue");
    }
  };

  return (
    <div style={{ padding: "20px", border: "1px solid #ccc" }}>
      {!isLoggedIn ? (
        <div>
          <input
            type="text"
            placeholder="Enter your username"
            value={sender}
            onChange={(e) => setSender(e.target.value)}
          />
          <input
            type="text"
            placeholder="Enter receiver's username"
            value={receiver}
            onChange={(e) => setReceiver(e.target.value)}
          />
          <button onClick={handleLogin}>Log In</button>
        </div>
      ) : (
        <div>
          <h2>Chat</h2>
          <div style={{ maxHeight: "400px", overflowY: "scroll" }}>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`${
                    msg.sender === sender ? 'text-right bg-green-100' : 'text-left bg-gray-100'
                  } p-2 mb-2 rounded-xl max-w-[70%] ${msg.sender === sender ? 'ml-auto' : ''}`}
              >
                <strong>{msg.sender}:</strong> {msg.content}
              </div>
            ))}
          </div>
          <div>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message"
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}
