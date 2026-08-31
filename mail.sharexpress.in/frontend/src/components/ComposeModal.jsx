import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X, Send, Paperclip, Minimize2, Eye, Trash2 } from 'lucide-react';
import { closeCompose } from '../store/uiSlice';
import mailApi from '../api/mail';

const ComposeModal = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.ui.isComposeOpen);
  const composeData = useSelector((state) => state.ui.composeData);

  const [to, setTo] = useState(composeData.to?.join(', ') || '');
  const [cc, setCc] = useState(composeData.cc?.join(', ') || '');
  const [bcc, setBcc] = useState(composeData.bcc?.join(', ') || '');
  const [subject, setSubject] = useState(composeData.subject || '');
  const [body, setBody] = useState(composeData.body || '');
  const [showCcBcc, setShowCcBcc] = useState(false);
  const [sending, setSending] = useState(false);
  
  // Attachments State
  const [uploading, setUploading] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setUploading(true);
    try {
      for (const file of files) {
        const metadata = await mailApi.uploadAttachment(file);
        setAttachments((prev) => [...prev, metadata]);
      }
    } catch (err) {
      alert('Failed to upload file: ' + (err.response?.data?.detail || err.message));
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (id) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!to) return alert('Please enter at least one recipient in the To field.');

    setSending(true);
    try {
      const payload = {
        to: to.split(',').map(email => email.trim()).filter(Boolean),
        cc: cc ? cc.split(',').map(email => email.trim()).filter(Boolean) : [],
        bcc: bcc ? bcc.split(',').map(email => email.trim()).filter(Boolean) : [],
        subject: subject || '(No Subject)',
        body_html: `<p style="white-space: pre-wrap;">${body}</p>`,
        body_text: body,
        attachment_ids: attachments.map(a => a.id)
      };
      
      await mailApi.sendEmail(payload);
      dispatch(closeCompose());
    } catch (err) {
      alert('Failed to send email: ' + (err.response?.data?.detail || err.message));
    } finally {
      setSending(false);
    }
  };

  const handleSaveDraft = async () => {
    try {
      const payload = {
        to: to ? to.split(',').map(email => email.trim()).filter(Boolean) : [],
        cc: cc ? cc.split(',').map(email => email.trim()).filter(Boolean) : [],
        bcc: bcc ? bcc.split(',').map(email => email.trim()).filter(Boolean) : [],
        subject: subject || '',
        body_html: `<p style="white-space: pre-wrap;">${body}</p>`,
        attachment_ids: attachments.map(a => a.id)
      };
      await mailApi.saveDraft(payload);
      alert('Draft saved successfully.');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-2xl glass-panel-deep rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-white/10 animate-in fade-in zoom-in duration-200">
        {/* Header toolbar */}
        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
          <span className="text-sm font-semibold text-white/95 tracking-wide">Compose Message</span>
          <div className="flex items-center space-x-2">
            <button 
              onClick={handleSaveDraft}
              className="text-xs py-1.5 px-3 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
            >
              Save Draft
            </button>
            <button 
              onClick={() => dispatch(closeCompose())}
              className="p-1.5 rounded-lg text-white/40 hover:bg-white/5 hover:text-white transition-all"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Input Fields */}
        <form onSubmit={handleSend} className="flex-1 flex flex-col p-6 space-y-4">
          <div className="space-y-3">
            <div className="flex items-center border-b border-white/5 pb-2">
              <span className="w-12 text-xs font-medium text-white/40 uppercase tracking-wider">To:</span>
              <input
                type="text"
                placeholder="recipients separated by commas"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="flex-1 bg-transparent border-none text-sm text-white/90 placeholder-white/20 focus:outline-none"
                required
              />
              <button 
                type="button"
                onClick={() => setShowCcBcc(!showCcBcc)}
                className="text-[10px] font-semibold text-blue-400 uppercase hover:underline"
              >
                {showCcBcc ? 'Hide Cc/Bcc' : 'Cc/Bcc'}
              </button>
            </div>

            {showCcBcc && (
              <div className="space-y-3 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="flex items-center border-b border-white/5 pb-2">
                  <span className="w-12 text-xs font-medium text-white/40 uppercase tracking-wider">Cc:</span>
                  <input
                    type="text"
                    placeholder="cc recipients"
                    value={cc}
                    onChange={(e) => setCc(e.target.value)}
                    className="flex-1 bg-transparent border-none text-sm text-white/90 placeholder-white/20 focus:outline-none"
                  />
                </div>
                <div className="flex items-center border-b border-white/5 pb-2">
                  <span className="w-12 text-xs font-medium text-white/40 uppercase tracking-wider">Bcc:</span>
                  <input
                    type="text"
                    placeholder="bcc recipients"
                    value={bcc}
                    onChange={(e) => setBcc(e.target.value)}
                    className="flex-1 bg-transparent border-none text-sm text-white/90 placeholder-white/20 focus:outline-none"
                  />
                </div>
              </div>
            )}

            <div className="flex items-center border-b border-white/5 pb-2">
              <span className="w-12 text-xs font-medium text-white/40 uppercase tracking-wider">Subj:</span>
              <input
                type="text"
                placeholder="subject line"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="flex-1 bg-transparent border-none text-sm text-white/90 placeholder-white/20 focus:outline-none"
              />
            </div>
          </div>

          {/* Textarea Editor */}
          <textarea
            placeholder="Write your email details here..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="flex-1 min-h-[200px] bg-transparent border-none text-sm text-white/80 placeholder-white/15 focus:outline-none resize-none leading-relaxed"
          ></textarea>

          {/* Render Uploaded Attachments */}
          {attachments.length > 0 && (
            <div className="space-y-2 max-h-[120px] overflow-y-auto border-t border-white/5 pt-3">
              <span className="text-xs font-semibold text-white/40 uppercase tracking-wider block">Attachments:</span>
              <div className="grid grid-cols-2 gap-2">
                {attachments.map((att) => (
                  <div key={att.id} className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5 text-xs text-white/80">
                    <span className="truncate max-w-[180px] font-medium" title={att.filename}>{att.filename}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-white/40">{(att.size_bytes / 1024).toFixed(1)} KB</span>
                      <button
                        type="button"
                        onClick={() => removeAttachment(att.id)}
                        className="text-red-400 hover:text-red-300 p-1 rounded-md hover:bg-white/5 transition-colors"
                        title="Remove file"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Hidden File Input */}
          <input
            type="file"
            multiple
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Footer toolbar */}
          <div className="pt-4 border-t border-white/5 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all disabled:opacity-50 flex items-center space-x-1.5"
                title="Add attachment"
              >
                <Paperclip size={16} />
                {uploading && <span className="text-[10px] text-white/40">Uploading...</span>}
              </button>
            </div>
            
            <button
              type="submit"
              disabled={sending || uploading}
              className="flex items-center space-x-2 py-2.5 px-6 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium shadow-md shadow-blue-500/10 transition-all disabled:opacity-50"
            >
              <Send size={14} />
              <span>{sending ? 'Sending...' : 'Send Message'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ComposeModal;
