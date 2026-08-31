import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Star, Paperclip, Search, RefreshCw, Mail, Trash2 } from 'lucide-react';
import { fetchEmailsStart, fetchEmailsSuccess, fetchEmailsFailure, selectEmail, toggleStar, removeEmails } from '../store/mailSlice';
import mailApi from '../api/mail';

const EmailList = () => {
  const dispatch = useDispatch();
  const { emails, selectedEmail, activeFolder, loading } = useSelector((state) => state.mail);
  const [searchTerm, setSearchTerm] = useState('');

  const loadEmails = async () => {
    dispatch(fetchEmailsStart());
    try {
      const data = await mailApi.getFolderEmails(activeFolder);
      dispatch(fetchEmailsSuccess(data));
    } catch (e) {
      dispatch(fetchEmailsFailure(e.message || 'Failed to load mail.'));
    }
  };

  useEffect(() => {
    loadEmails();
  }, [activeFolder]);

  const handleStarClick = async (e, id) => {
    e.stopPropagation();
    dispatch(toggleStar(id));
    try {
      await mailApi.flagEmails([id], { starred: true }); // toggle server flag
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteClick = async (e, id) => {
    e.stopPropagation();
    dispatch(removeEmails([id]));
    try {
      await mailApi.moveEmails([id], 'trash');
    } catch (err) {
      console.error(err);
    }
  };

  // Filter local search
  const filteredEmails = emails.filter((mail) => {
    const query = searchTerm.toLowerCase();
    return (
      mail.subject.toLowerCase().includes(query) ||
      mail.from_address.toLowerCase().includes(query) ||
      (mail.body_text && mail.body_text.toLowerCase().includes(query))
    );
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    
    // If today, show time, else show date
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div className="w-96 flex flex-col border-r border-white/5 h-full bg-black/10 select-none">
      {/* Search Header */}
      <div className="p-4 border-b border-white/5 flex items-center space-x-2 bg-black/20">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" size={16} />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl glass-input text-white/80 placeholder-white/20"
          />
        </div>
        <button
          onClick={loadEmails}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
          title="Refresh"
        >
          <RefreshCw size={15} className={`${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Email Container */}
      <div className="flex-1 overflow-y-auto divide-y divide-white/5">
        {loading && emails.length === 0 ? (
          // Skeleton loading
          Array.from({ length: 5 }).map((_, idx) => (
            <div key={idx} className="p-5 space-y-3.5">
              <div className="flex justify-between">
                <div className="h-4 w-28 rounded shimmer-loading"></div>
                <div className="h-3 w-10 rounded shimmer-loading"></div>
              </div>
              <div className="h-4 w-44 rounded shimmer-loading"></div>
              <div className="h-3 w-64 rounded shimmer-loading"></div>
            </div>
          ))
        ) : filteredEmails.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center text-white/20">
            <Mail size={42} className="stroke-[1] mb-3 text-white/10" />
            <p className="text-sm font-medium">No conversations</p>
            <p className="text-xs text-white/10 mt-1">This folder is empty.</p>
          </div>
        ) : (
          filteredEmails.map((mail) => {
            const isSelected = selectedEmail?.id === mail.id;
            return (
              <div
                key={mail.id}
                onClick={() => dispatch(selectEmail(mail))}
                className={`p-4.5 cursor-pointer flex flex-col transition-all duration-200 border-l-3 relative ${
                  isSelected 
                    ? 'bg-white/5 border-blue-500' 
                    : 'hover:bg-white/3 border-transparent'
                } ${!mail.read ? 'bg-white/[0.02]' : ''}`}
              >
                {/* Meta details (sender, time, read status) */}
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center space-x-2">
                    {!mail.read && (
                      <span className="w-2 h-2 rounded-full bg-blue-500 ring-4 ring-blue-500/20 flex-shrink-0"></span>
                    )}
                    <span className={`text-sm truncate max-w-[160px] ${!mail.read ? 'text-white font-semibold' : 'text-white/70'}`}>
                      {mail.from_name || mail.from_address}
                    </span>
                  </div>
                  <span className="text-xs text-white/40">{formatDate(mail.date)}</span>
                </div>

                {/* Subject & Preview */}
                <h4 className={`text-xs truncate mb-1 ${!mail.read ? 'text-white font-medium' : 'text-white/80'}`}>
                  {mail.subject || '(No Subject)'}
                </h4>
                <p className="text-xs text-white/40 line-clamp-2 leading-relaxed mb-3">
                  {mail.body_text || mail.subject}
                </p>

                {/* Toolbars/badges */}
                <div className="flex items-center justify-between text-white/30">
                  <div className="flex items-center space-x-1.5">
                    {mail.attachments?.length > 0 && <Paperclip size={13} className="text-white/40" />}
                  </div>
                  <div className="flex items-center space-x-2.5 opacity-0 hover:opacity-100 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => handleStarClick(e, mail.id)}
                      className={`p-1 hover:bg-white/5 rounded transition-colors ${
                        mail.starred ? 'text-amber-400' : 'hover:text-white/60'
                      }`}
                    >
                      <Star size={14} fill={mail.starred ? 'currentColor' : 'none'} />
                    </button>
                    {activeFolder !== 'trash' && (
                      <button
                        onClick={(e) => handleDeleteClick(e, mail.id)}
                        className="p-1 hover:bg-white/5 rounded text-white/30 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default EmailList;
