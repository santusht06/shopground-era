import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import EmailList from '../components/EmailList';
import EmailView from '../components/EmailView';
import ComposeModal from '../components/ComposeModal';
import AdminPanel from '../components/AdminPanel';

const MailPage = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0a0a0c] relative">
      {/* Absolute blur background highlights */}
      <div className="absolute top-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-blue-500/5 blur-[180px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-indigo-500/5 blur-[180px] pointer-events-none"></div>

      {/* Main interface layout */}
      <div className="flex flex-1 z-10 overflow-hidden">
        <Sidebar />
        <EmailList />
        <EmailView />
      </div>

      {/* Overlay Modals */}
      <ComposeModal />
      <AdminPanel />
    </div>
  );
};

export default MailPage;
