import { db, auth } from "./Firebase";
import { TbBrandSentry } from "react-icons/tb";
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./Chat.css";
import { FiPaperclip } from "react-icons/fi";
import Modal from "react-modal";

// Set the root element for accessibility (required by react-modal)
Modal.setAppElement("#root"); // Replace "#root" with your app's root element ID

const ChatWindow = () => {
  const { userId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [chatId, setChatId] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);

  // Fetch user details
  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;

      const studentRef = doc(db, "students", userId);
      const userRef = doc(db, "users", userId);

      const studentSnap = await getDoc(studentRef);
      const userSnap = await getDoc(userRef);

      if (studentSnap.exists()) {
        setSelectedUser({ id: userId, ...studentSnap.data() });
      } else if (userSnap.exists()) {
        setSelectedUser({ id: userId, ...userSnap.data() });
      }
    };

    fetchUser();
  }, [userId]);

  // Generate chat ID
  useEffect(() => {
    if (selectedUser && auth.currentUser) {
      const generatedChatId =
        auth.currentUser.uid > selectedUser.id
          ? `${auth.currentUser.uid}_${selectedUser.id}`
          : `${selectedUser.id}_${auth.currentUser.uid}`;
      setChatId(generatedChatId);
    }
  }, [selectedUser]);

  // Fetch messages
  useEffect(() => {
    if (!chatId) return;

    const q = query(
      collection(db, "messages"),
      where("chatId", "==", chatId),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messageList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate(),
      }));

      console.log("Messages received:", messageList); // Debugging
      setMessages(messageList);
    });

    return () => unsubscribe();
  }, [chatId]);

  // Upload file to Cloudinary
  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ml_default"); // Your Cloudinary preset

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dfzmg1jtd/upload",
        formData
      );
      console.log("Cloudinary Upload URL:", response.data.secure_url); // Debugging
      return response.data.secure_url;
    } catch (error) {
      console.error("Cloudinary Upload Failed:", error);
      return null;
    }
  };

  // Send message
  const sendMessage = async () => {
    if ((!newMessage.trim() && !selectedFile) || !selectedUser || !auth.currentUser || !chatId)
      return;

    let messageData = {
      chatId,
      senderId: auth.currentUser.uid,
      receiverId: selectedUser.id,
      timestamp: serverTimestamp(),
    };

    if (selectedFile) {
      const fileUrl = await uploadToCloudinary(selectedFile);
      if (fileUrl) {
        messageData.content = fileUrl;
        messageData.type = "media"; // Mark as media message
      }
      setSelectedFile(null);
    } else {
      messageData.content = newMessage;
      messageData.type = "text";
    }

    await addDoc(collection(db, "messages"), messageData);
    setNewMessage("");
  };

  // Open modal with selected media
  const openModal = (mediaUrl) => {
    setSelectedMedia(mediaUrl);
    setModalIsOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setSelectedMedia(null);
    setModalIsOpen(false);
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <img src={selectedUser?.photoURL} alt="User" className="avatar" />
        <span className="username">{selectedUser?.name}</span>
      </div>

      <div className="messages-container">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`message-bubble ${
              msg.senderId === auth.currentUser?.uid ? "sent" : "received"
            }`}
          >
            {msg.type === "text" ? (
              <p>{msg.content}</p>
            ) : msg.type === "media" && msg.content ? (
              <div onClick={() => openModal(msg.content)}>
                {msg.content.endsWith(".mp4") || msg.content.endsWith(".webm") ? (
                  <video controls className="shared-media">
                    <source src={msg.content} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <img
                    src={msg.content}
                    alt="Shared Media"
                    className="shared-media"
                    onError={(e) => console.error("Image Load Error:", e)}
                  />
                )}
              </div>
            ) : (
              <p>Shared media not available</p> // Fallback for invalid media
            )}
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <label htmlFor="file-upload" className="file-picker-label">
          <FiPaperclip />
        </label>
        <input
          id="file-upload"
          type="file"
          accept="image/*, video/*"
          onChange={(e) => setSelectedFile(e.target.files[0])}
        />
        <button onClick={sendMessage}><TbBrandSentry /></button>
      </div>

      {/* Modal for viewing media */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Media Modal"
        className="modal"
        overlayClassName="modal-overlay"
      >
        {selectedMedia && (
          <>
            {selectedMedia.endsWith(".mp4") || selectedMedia.endsWith(".webm") ? (
              <video controls className="modal-media">
                <source src={selectedMedia} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <img src={selectedMedia} alt="Full Size Media" className="modal-media" />
            )}
          </>
        )}
        <button onClick={closeModal} className="modal-close-button">
          Close
        </button>
      </Modal>
    </div>
  );
};

export default ChatWindow;