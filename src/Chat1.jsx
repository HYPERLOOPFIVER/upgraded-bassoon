import { useEffect, useState } from "react";
import { db, auth } from "./Firebase";
import {
  collection,
  getDocs,
  doc,
  setDoc
} from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import './Pages/home.css';

const Chathome = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const studentsRef = collection(db, "students");
        const usersRef = collection(db, "users");

        const [studentsSnap, usersSnap] = await Promise.all([
          getDocs(studentsRef),
          getDocs(usersRef),
        ]);

        const studentsList = studentsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const usersList = usersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const allUsers = [...studentsList, ...usersList].filter(
          (user) => user.id !== auth.currentUser?.uid
        );

        setUsers(allUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleSearch = (e) => {
    const queryText = e.target.value.toLowerCase();
    setSearch(queryText);
    if (!queryText) {
      setSearchResults([]);
      return;
    }
    setSearchResults(users.filter((user) => user.name?.toLowerCase().includes(queryText)));
  };

  const handleUserClick = async (user) => {
    const chatId = auth.currentUser.uid > user.id
      ? `${auth.currentUser.uid}_${user.id}`
      : `${user.id}_${auth.currentUser.uid}`;

    const chatRef = doc(db, "chats", chatId);

    try {
      await setDoc(chatRef, {
        users: [auth.currentUser.uid, user.id],
        lastMessage: "",
        timestamp: new Date()
      }, { merge: true });

      navigate(`/chatwindow/${user.id}`);
    } catch (error) {
      console.error("Error starting chat:", error);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-sidebar">
        <div className="navbar">
          <h1 className="logo">Chat</h1>
         
          <Link to="/profile">
            <CgProfile className="profile-icon" />
          </Link>
        </div>
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={handleSearch}
          className="search-bar"
        />
        {loading ? <p>Loading...</p> : (
          search.length > 0 ? searchResults : users
        ).map((user) => (
          <div key={user.id} onClick={() => handleUserClick(user)} className="user-item">
            <img src={user.photoURL || "https://www.kravemarketingllc.com/wp-content/uploads/2018/09/placeholder-user-500x500.png"} alt={user.name} className="user-avatar" />
            <div className="user-info">
              <p className="user-name">{user.name || "Unknown User"}</p>
            </div>
            
          </div>
          
        ))}
        <div> <span> copyrights reserved for idk chattting | lightupswift Tech </span></div>
      </div>
    </div>
  );
};

export default Chathome;
