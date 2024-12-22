import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Pages/Auth/Login/Login';
import Dashboard from './Pages/Dashboard/Dashboard';
import SignUp from './Pages/Auth/Signup/Signup';
import AddNotice from './Pages/Notice/AddNotice';
import TotalStudents from './Pages/total students/TotalStudents';
import Chat from './Pages/Messages/Chat';
import Profile from './Pages/Profile';
import Bar from './Pages/navbar/Sidebar';
import Notices from './Pages/Notice/Notices';

const App = () => {
  return (
    <Router>
      {/* Sidebar at the bottom */}
      <Bar />
      
      {/* Content wrapper for scroll */}
      <div className="contentWrapper">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/Signup" element={<SignUp />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/AddNotice" element={<AddNotice />} />
          <Route path="/totalstudents" element={<TotalStudents />} />
          <Route path="/Chat" element={<Chat />} />
          <Route path="/Not" element={<Notices />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
