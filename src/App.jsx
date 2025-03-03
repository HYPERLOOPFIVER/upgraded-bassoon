import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Login from './Pages/Auth/Login/Login';
import Dashboard from './Pages/Dashboard/Dashboard';
import SignUp from './Pages/Auth/Signup/Signup';
import AddNotice from './Pages/Notice/AddNotice';
import TotalStudents from './Pages/total students/TotalStudents';
import Chat from './Pages/Messages/Chat';
import Profile from './Pages/Profile';
import Bar from './Pages/navbar/Sidebar';
import Notices from './Pages/Notice/Notices';
import ChatWindow from './Chatwindow';
import Chathome from './Chat1';
import DeleteNotices from './Deletenotices';
import Result from './Pages/Dashboard/Result';

const Layout = () => {
  const location = useLocation();

  // Hide navbar on login page and any chat window
  const shouldHideBar = location.pathname === "/" || location.pathname.startsWith("/chatwindow/");

  return (
    <>
      {/* Conditionally render the Bottom Nav */}
      {!shouldHideBar && <Bar />}

      {/* Content wrapper for scroll */}
      <div className="contentWrapper">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/Signup" element={<SignUp />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/AddNotice" element={<AddNotice />} />
          <Route path="/home" element={<Chathome />} />
          <Route path="/totalstudents" element={<TotalStudents />} />
          <Route path="/Result" element={<Result/>} />
          <Route path="/Chat" element={<Chat />} />
          <Route path="/chatwindow/:userId" element={<ChatWindow />} />
          <Route path="/Not" element={<Notices />} />
          <Route path="/delete" element={<DeleteNotices />} />
        </Routes>
      </div>
    </>
  );
};

const App = () => {
  return (
    <Router>
      <Layout />
    </Router>
  );
};

export default App;
