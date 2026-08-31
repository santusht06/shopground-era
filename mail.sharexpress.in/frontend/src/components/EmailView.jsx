import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Trash2, CornerUpLeft, CornerUpRight, Star,
  MoreVertical, Paperclip, Download, Mail
} from 'lucide-react';
import DOMPurify from 'dompurify';
import { removeEmails, toggleStar, selectEmail } from '../store/mailSlice';
import { openCompose } from '../store/uiSlice';
import mailApi from '../api/mail';

const EmailView = () => {
  const dispatch = useDispatch();
  const selectedEmail = useSelector((state) => state.mail.selectedEmail);
  const activeFolder = useSelector((state) => state.mail.activeFolder);

  if (!selectedEmail) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-black/5 select-none h-full">
        <div className="w-16 h-16 rounded-3xl glass-panel flex items-center justify-center text-white/10 mb-4 shadow-xl">
          <Mail size={28} className="stroke-[1.25]" />
        </div>
        <p className="text-sm font-medium text-white/40">No message selected</p>
        <p className="text-xs text-white/15 mt-1">Select an item from the list to read it.</p>
      </div>
    );
  }

  const handleStar = async () => {
    dispatch(toggleStar(selectedEmail.id));
    try {
      await mailApi.flagEmails([selectedEmail.id], { starred: !selectedEmail.starred });
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async () => {
    dispatch(removeEmails([selectedEmail.id]));
    try {
      if (activeFolder === 'trash') {
        await mailApi.purgeEmails([selectedEmail.id]);
      } else {
        await mailApi.moveEmails([selectedEmail.id], 'trash');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleReply = () => {
    dispatch(openCompose({
      to: [selectedEmail.from_address],
      subject: `Re: ${selectedEmail.subject}`,
      body: `<br/><br/><blockquote>On ${new Date(selectedEmail.date).toLocaleString()}, ${selectedEmail.from_name || selectedEmail.from_address} wrote:<br/>${selectedEmail.body_html || selectedEmail.body_text}</blockquote>`
    }));
  };

  const handleForward = () => {
    dispatch(openCompose({
      subject: `Fwd: ${selectedEmail.subject}`,
      body: `<br/><br/>---------- Forwarded message ---------<br/>From: ${selectedEmail.from_address}<br/>Date: ${new Date(selectedEmail.date).toLocaleString()}<br/>Subject: ${selectedEmail.subject}<br/><br/>${selectedEmail.body_html || selectedEmail.body_text}`
    }));
  };

  const handleDownload = async (url, filename) => {
    try {
      const response = await mailApi.downloadAttachment(url);
      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      alert('Failed to download file: ' + err.message);
    }
  };

  const cleanHTML = selectedEmail.body_html 
    ? DOMPurify.sanitize(selectedEmail.body_html) 
    : `<p style="white-space: pre-wrap;">${selectedEmail.body_text || ''}</p>`;

  return (
    <div className="flex-1 flex flex-col h-full bg-black/[0.05] overflow-hidden">
      {/* Control Toolbar */}
      <div className="p-4 border-b border-white/5 flex items-center justify-between bg-black/25">
        <div className="flex items-center space-x-1.5">
          <button
            onClick={handleReply}
            className="flex items-center space-x-2 py-2 px-3.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-colors text-xs font-medium"
          >
            <CornerUpLeft size={14} />
            <span>Reply</span>
          </button>
          <button
            onClick={handleForward}
            className="flex items-center space-x-2 py-2 px-3.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-colors text-xs font-medium"
          >
            <CornerUpRight size={14} />
            <span>Forward</span>
          </button>
          
          <span className="w-[1px] h-5 bg-white/10 mx-2"></span>

          <button
            onClick={handleDelete}
            className="p-2 rounded-lg bg-white/5 hover:bg-red-500/10 text-white/60 hover:text-red-400 transition-colors"
            title={activeFolder === 'trash' ? 'Delete permanently' : 'Move to trash'}
          >
            <Trash2 size={15} />
          </button>
          <button
            onClick={handleStar}
            className={`p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors ${
              selectedEmail.starred ? 'text-amber-400' : 'text-white/60'
            }`}
            title="Star message"
          >
            <Star size={15} fill={selectedEmail.starred ? 'currentColor' : 'none'} />
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors">
            <MoreVertical size={15} />
          </button>
        </div>
      </div>

      {/* Main Email Reader */}
      <div className="flex-1 overflow-y-auto p-8 space-y-6">
        {/* Subject Header */}
        <div className="space-y-4">
          <h1 className="text-xl font-bold tracking-tight text-white/95">
            {selectedEmail.subject || '(No Subject)'}
          </h1>
          
          {/* Sender & Recipient profile */}
          <div className="flex items-center justify-between pb-6 border-b border-white/5">
            <div className="flex items-center space-x-4">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white shadow-inner"
                style={{ backgroundColor: selectedEmail.avatar_color || '#3b82f6' }}
              >
                {selectedEmail.from_name?.charAt(0).toUpperCase() || selectedEmail.from_address.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col">
                <div className="flex items-center space-x-1.5">
                  <span className="text-sm font-semibold text-white">{selectedEmail.from_name || selectedEmail.from_address}</span>
                  <span className="text-xs text-white/40 font-mono">&lt;{selectedEmail.from_address}&gt;</span>
                </div>
                <div className="text-xs text-white/30 mt-0.5">
                  <span>To: {selectedEmail.to?.join(', ')}</span>
                  {selectedEmail.cc?.length > 0 && <span className="ml-2">CC: {selectedEmail.cc.join(', ')}</span>}
                </div>
              </div>
            </div>
            
            <div className="text-xs text-white/40">
              {new Date(selectedEmail.date).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Email Body text/html content */}
        <div 
          className="prose prose-invert max-w-none text-white/80 leading-relaxed text-sm p-4 rounded-2xl glass-panel"
          dangerouslySetInnerHTML={{ __html: cleanHTML }}
        />

        {/* Attachments Section if any */}
        {selectedEmail.attachments?.length > 0 && (
          <div className="space-y-3 pt-6 border-t border-white/5">
            <div className="flex items-center space-x-2 text-white/40 text-xs font-semibold uppercase tracking-wider">
              <Paperclip size={13} />
              <span>Attachments ({selectedEmail.attachments.length})</span>
            </div>
            
            <div className="grid grid-cols-2 gap-3.5">
              {selectedEmail.attachments.map((att) => (
                <div key={att.id} className="p-3.5 rounded-xl glass-panel hover:bg-white/5 transition-all flex items-center justify-between group">
                  <div className="flex items-center space-x-3 overflow-hidden">
                    <div className="p-2 bg-white/5 rounded-lg text-white/60">
                      <Paperclip size={16} />
                    </div>
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-xs font-medium text-white/85 truncate">{att.filename}</span>
                      <span className="text-[10px] text-white/30">{(att.size_bytes / 1024 / 1024).toFixed(2)} MB</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDownload(att.url, att.filename)}
                    className="p-2 bg-white/5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all opacity-0 group-hover:opacity-100"
                    title="Download attachment"
                  >
                    <Download size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailView;
