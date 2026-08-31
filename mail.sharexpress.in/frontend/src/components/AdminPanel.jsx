import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X, UserPlus, Trash2, Key, Shield, ShieldAlert, Check } from 'lucide-react';
import { setAdminPanel } from '../store/uiSlice';
import mailApi from '../api/mail';

const AdminPanel = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.ui.isAdminPanelOpen);
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // New user form states
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [addingUser, setAddingUser] = useState(false);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await mailApi.adminListUsers();
      setUsers(data);
    } catch (e) {
      setError(e.response?.data?.detail || e.message || 'Failed to list mailboxes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadUsers();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setAddingUser(true);
    try {
      const payload = {
        email,
        display_name: displayName,
        password,
        role
      };
      await mailApi.adminCreateUser(payload);
      // reset form
      setEmail('');
      setDisplayName('');
      setPassword('');
      setRole('user');
      // reload
      await loadUsers();
    } catch (err) {
      alert('Failed to provision mailbox: ' + (err.response?.data?.detail || err.message));
    } finally {
      setAddingUser(false);
    }
  };

  const handleToggleSuspend = async (user) => {
    const nextStatus = !user.disabled;
    try {
      await mailApi.adminUpdateUser(user.id, { disabled: nextStatus });
      setUsers(users.map(u => u.id === user.id ? { ...u, disabled: nextStatus } : u));
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!confirm('Are you sure you want to permanently delete this mailbox and all of its emails? This cannot be undone.')) {
      return;
    }
    try {
      await mailApi.adminDeleteUser(id);
      setUsers(users.filter(u => u.id !== id));
    } catch (err) {
      alert('Failed to delete user: ' + err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-4xl h-[85vh] glass-panel-deep rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-white/10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center space-x-2.5">
            <Shield size={18} className="text-blue-500" />
            <h2 className="text-sm font-semibold text-white tracking-wide">Enterprise Mailbox Administration</h2>
          </div>
          <button 
            onClick={() => dispatch(setAdminPanel(false))}
            className="p-1.5 rounded-lg text-white/40 hover:bg-white/5 hover:text-white transition-all"
          >
            <X size={15} />
          </button>
        </div>

        {/* Content body split layout */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Left panel — List Users */}
          <div className="flex-1 flex flex-col border-r border-white/5 overflow-hidden">
            <div className="p-4 bg-black/10 border-b border-white/5 flex justify-between items-center">
              <span className="text-xs font-semibold text-white/40 uppercase tracking-wider">Mailboxes ({users.length})</span>
            </div>
            
            <div className="flex-1 overflow-y-auto divide-y divide-white/5">
              {loading ? (
                <div className="p-6 text-center text-white/40 text-xs">Loading mailboxes...</div>
              ) : error ? (
                <div className="p-6 text-center text-red-400 text-xs">{error}</div>
              ) : users.length === 0 ? (
                <div className="p-6 text-center text-white/20 text-xs">No active mailboxes configured.</div>
              ) : (
                users.map((u) => (
                  <div key={u.id} className="p-4.5 flex items-center justify-between hover:bg-white/3 transition-colors">
                    <div className="flex items-center space-x-3.5 overflow-hidden">
                      <div 
                        className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm"
                        style={{ backgroundColor: u.avatar_color }}
                      >
                        {u.display_name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex flex-col overflow-hidden">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-semibold text-white truncate">{u.display_name}</span>
                          {u.role === 'admin' && (
                            <span className="text-[9px] bg-blue-500/10 text-blue-400 border border-blue-500/10 px-1.5 py-0.5 rounded font-mono font-bold uppercase">Admin</span>
                          )}
                          {u.disabled && (
                            <span className="text-[9px] bg-red-500/10 text-red-400 border border-red-500/10 px-1.5 py-0.5 rounded font-mono font-bold uppercase">Suspended</span>
                          )}
                        </div>
                        <span className="text-xs text-white/30 truncate mt-0.5">{u.email}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleToggleSuspend(u)}
                        className={`p-2 rounded-lg text-xs font-medium transition-all ${
                          u.disabled 
                            ? 'bg-green-500/10 text-green-400 border border-green-500/10 hover:bg-green-500/20' 
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/10 hover:bg-amber-500/20'
                        }`}
                        title={u.disabled ? 'Enable Account' : 'Suspend Account'}
                      >
                        {u.disabled ? 'Activate' : 'Suspend'}
                      </button>
                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        className="p-2 rounded-lg bg-red-500/10 border border-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
                        title="Delete Mailbox"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right panel — Create User */}
          <div className="w-80 p-6 flex flex-col bg-white/[0.01]">
            <span className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-4 block">Provision Mailbox</span>
            
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold text-white/40 uppercase tracking-wide">Display Name</label>
                <input
                  type="text"
                  placeholder="e.g. Hr Office"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl glass-input text-white/80 placeholder-white/15"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold text-white/40 uppercase tracking-wide">Email Address</label>
                <input
                  type="email"
                  placeholder="hr@sharexpress.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl glass-input text-white/80 placeholder-white/15"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold text-white/40 uppercase tracking-wide">Initial Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl glass-input text-white/80 placeholder-white/15"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold text-white/40 uppercase tracking-wide">Account Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl glass-input bg-[#1c1c1e] text-white/80 placeholder-white/15 focus:outline-none"
                >
                  <option value="user">User Mailbox</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={addingUser}
                className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold shadow-md shadow-blue-500/10 transition-all disabled:opacity-50 mt-6"
              >
                <UserPlus size={14} />
                <span>{addingUser ? 'Provisioning...' : 'Create Mailbox'}</span>
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
};

export default AdminPanel;
