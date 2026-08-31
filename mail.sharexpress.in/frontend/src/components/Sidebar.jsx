import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Inbox, Send, FileText, Trash2, ShieldAlert, Archive, 
  Settings, Edit, LogOut, Users 
} from 'lucide-react';
import { setFolder } from '../store/mailSlice';
import { openCompose, toggleAdminPanel } from '../store/uiSlice';
import { logout } from '../store/authSlice';
import authApi from '../api/auth';

const Sidebar = () => {
  const dispatch = useDispatch();
  const activeFolder = useSelector((state) => state.mail.activeFolder);
  const user = useSelector((state) => state.auth.user);

  const folders = [
    { id: 'inbox', label: 'Inbox', icon: Inbox, color: 'text-blue-400' },
    { id: 'sent', label: 'Sent', icon: Send, color: 'text-green-400' },
    { id: 'drafts', label: 'Drafts', icon: FileText, color: 'text-yellow-400' },
    { id: 'trash', label: 'Trash', icon: Trash2, color: 'text-red-400' },
    { id: 'spam', label: 'Spam', icon: ShieldAlert, color: 'text-orange-400' },
    { id: 'archive', label: 'Archive', icon: Archive, color: 'text-purple-400' },
  ];

  const handleLogout = async () => {
    const refresh = localStorage.getItem('refresh_token');
    try {
      if (refresh) await authApi.logout(refresh);
    } catch (e) {
      console.error(e);
    }
    dispatch(logout());
  };

  return (
    <aside className="w-64 glass-panel border-r border-white/5 flex flex-col h-full select-none z-10">
      {/* Platform Branding */}
      <div className="p-6 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="h-7 w-7 rounded-lg bg-blue-500 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20 text-sm">
            S
          </div>
          <span className="font-semibold text-white tracking-wide text-md">ShareXpress Mail</span>
        </div>
      </div>

      {/* Compose Button */}
      <div className="p-4">
        <button
          onClick={() => dispatch(openCompose())}
          className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium shadow-md shadow-blue-500/10 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
        >
          <Edit size={18} />
          <span>New Message</span>
        </button>
      </div>

      {/* Navigation Folder List */}
      <nav className="flex-1 px-3 space-y-1.5 overflow-y-auto">
        {folders.map((folder) => {
          const Icon = folder.icon;
          const isActive = activeFolder === folder.id;
          return (
            <button
              key={folder.id}
              onClick={() => dispatch(setFolder(folder.id))}
              className={`w-full flex items-center space-x-3.5 px-4 py-3 rounded-xl transition-all duration-250 group ${
                isActive 
                  ? 'bg-white/10 text-white font-medium shadow-inner' 
                  : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon size={18} className={`${folder.color} ${isActive ? 'scale-110' : 'group-hover:scale-115'} transition-transform`} />
              <span className="text-sm">{folder.label}</span>
            </button>
          );
        })}

        {/* Admin Section */}
        {user?.role === 'admin' && (
          <div className="pt-6 mt-6 border-t border-white/5">
            <span className="px-4 text-xs font-semibold text-white/30 uppercase tracking-wider block mb-2">Admin Tools</span>
            <button
              onClick={() => dispatch(toggleAdminPanel())}
              className="w-full flex items-center space-x-3.5 px-4 py-3 rounded-xl text-white/60 hover:bg-white/5 hover:text-white transition-all duration-250"
            >
              <Users size={18} className="text-cyan-400" />
              <span className="text-sm">Manage Mailboxes</span>
            </button>
          </div>
        )}
      </nav>

      {/* User Session profile panel */}
      <div className="p-4 border-t border-white/5 bg-black/10 flex items-center justify-between">
        <div className="flex items-center space-x-3 overflow-hidden">
          <div 
            className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm"
            style={{ backgroundColor: user?.avatar_color || '#3b82f6' }}
          >
            {user?.display_name?.charAt(0).toUpperCase() || 'S'}
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-medium text-white truncate">{user?.display_name}</span>
            <span className="text-xs text-white/40 truncate">{user?.email}</span>
          </div>
        </div>
        
        <button 
          onClick={handleLogout}
          className="p-2 rounded-lg text-white/40 hover:bg-white/5 hover:text-red-400 transition-colors"
          title="Logout"
        >
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
