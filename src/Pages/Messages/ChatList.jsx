import React, { useEffect, useState } from 'react';
import { db } from '../../Firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import styles from './Chat.module.css';

const ChatList = ({ housemasterId, onSelectChat }) => {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, 'messages'),
      where('participants', 'array-contains', housemasterId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedChats = [];
      snapshot.forEach((doc) => {
        fetchedChats.push({ id: doc.id, ...doc.data() });
      });
      setChats(fetchedChats);
    });

    return () => unsubscribe();
  }, [housemasterId]);

  return (
    <div className={styles.chatList}>
      <h3>Student Chats</h3>
      {chats.map((chat) => {
        const studentId = chat.participants.find((id) => id !== housemasterId);
        return (
          <div
            key={chat.id}
            className={styles.chatItem}
            onClick={() => onSelectChat(studentId, chat.id)}
          >
            <p><strong>Student ID:</strong> {studentId}</p>
            <p><strong>Last Message:</strong> {chat.text}</p>
          </div>
        );
      })}
    </div>
  );
};

export default ChatList;
