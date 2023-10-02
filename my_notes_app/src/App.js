// src/App.js
import React, { useState, useEffect } from "react";
import { auth, db } from "../private/firebase-config";

function App() {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Listen for changes in user authentication state
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    // Load initial messages from Firestore
    const fetchMessages = async () => {
      const messagesRef = db.collection("messages").orderBy("timestamp", "desc");
      const messagesSnapshot = await messagesRef.get();
      const messageData = messagesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(messageData);
    };

    fetchMessages();

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    try {
      const provider = new auth.GoogleAuthProvider();
      await auth.signInWithPopup(provider);
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (message.trim() === "") {
      return; // Don't add empty messages
    }

    try {
      // Add a new message to Firestore
      await db.collection("messages").add({
        text: message,
        timestamp: new Date(),
        userId: user.uid,
        userName: user.displayName,
      });

      setMessage(""); // Clear the input field after submitting
    } catch (error) {
      console.error("Error adding message:", error);
    }
  };

  return (
    <div className="App">
      <header>
        {user ? (
          <>
            <span>Welcome, {user.displayName}!</span>
            <button onClick={handleSignOut}>Sign Out</button>
          </>
        ) : (
          <button onClick={handleSignIn}>Sign In with Google</button>
        )}
      </header>
      <main>
        {user && (
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Enter your message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button type="submit">Send</button>
          </form>
        )}
        <div>
          {messages.map((msg) => (
            <div key={msg.id}>
              <strong>{msg.userName}:</strong> {msg.text}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;

