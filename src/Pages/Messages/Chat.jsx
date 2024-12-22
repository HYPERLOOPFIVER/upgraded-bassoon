import React, { useState, useEffect } from 'react';
import { db } from '../../Firebase';
import { collection, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import styles from '../Messages/Chat.module.css';

const Chat = ({ housemasterView, studentId, chatId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (!chatId) {
      console.error('Chat ID is missing');
      return;
    }

    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const q = query(messagesRef, orderBy('timestamp'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map((doc) => doc.data());
      setMessages(fetchedMessages);
    });

    return () => unsubscribe();
  }, [chatId]);

  const sendMessage = async () => {
    if (newMessage.trim() === '') return;

    try {
      await addDoc(collection(db, 'chats', chatId, 'messages'), {
        senderId: housemasterView ? 'housemaster' : 'student',
        receiverId: housemasterView ? studentId : 'CryXUMqfE7bmVVfV9kO4QJfVL2Z2',  // Add receiverId based on context
        text: newMessage,
        timestamp: new Date(),
        participants: [studentId, 'CryXUMqfE7bmVVfV9kO4QJfVL2Z2'],  // Example participants array
      });
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message: ', error);
    }
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.messages}>
        {messages.map((message, index) => (
          <div
            key={index}
            className={
              message.senderId === (housemasterView ? 'housemaster' : 'student')
                ? styles.sent
                : styles.received
            }
          >
            <p>{message.text}</p>
            <span>{new Date(message.timestamp?.toDate()).toLocaleString()}</span>
          </div>
        ))}
      </div>
      <div className={styles.inputContainer}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className={styles.inputField}
        />
        <button onClick={sendMessage} className={styles.sendButton}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
