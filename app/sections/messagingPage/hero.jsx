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
        // `http://localhost:3001/messages?sender=${sender}&receiver=${receiver}` -> commented out for testing through ip adress
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
      
      // Update messages state
      setMessages((prevMessages) => [...prevMessages, newMessage]);
  
      // Emit message through Socket.io
      socket.emit("sendMessage", { sender, receiver, content: message });
  
      // Clear message state
      setMessage("");
  
      // Reset textarea height
      const textarea = document.getElementById("messageInput");
      if (textarea) {
        textarea.style.height = "auto"; // Shrink back to original size
      }
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
          <div className="absolute top-20 left-0 flex flex-col justify-end px-2 py-8 h-[90%] w-full">
            {/* Messages Container */}
            <div style={{ overflowY: "scroll", maxHeight: "70vh", scrollbarWidth: "none", msOverflowStyle: "none" }}>
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`${
                    msg.sender === sender
                      ? "bg-[#01C5FB]"
                      : "bg-gray-100"
                  } p-2 mb-2 rounded-xl w-fit sm:max-w-[80%] md:max-w-[50%] ${msg.sender === sender ? "ml-auto" : ""} text-sm md:text-lg`}
                >
                  {/* Message Content */}
                  <p className="break-words whitespace-pre-wrap overflow-wrap no-scrollbar">
                    {msg.content}
                  </p>
                </div>
              ))}
            </div>

            {/* Input Field and Send Button */}
            <div className="flex flex-row justify-center items-center gap-4">
              <textarea
                id="messageInput"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message"
                className="w-3/4 px-2 py-2 outline outline-b outline-[1px] md:outline-[0.5px] -outline-offset-2 focus:outline focus:outline-blue-500 rounded-lg resize-none overflow-hidden no-scrollbar"
                rows={1}
                onInput={(e) => {
                  e.target.style.height = "auto"; // Reset height first
                  e.target.style.height = e.target.scrollHeight + "px"; // Expand dynamically
                }}
              />
              <button className="px-10 btn btn-primary h-fit" onClick={sendMessage}>
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
