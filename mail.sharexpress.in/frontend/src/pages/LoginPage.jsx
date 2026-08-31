import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ShieldAlert } from 'lucide-react';
import { loginStart, loginSuccess, loginFailure } from '../store/authSlice';
import authApi from '../api/auth';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(loginStart());
    try {
      const data = await authApi.login(email, password);
      dispatch(loginSuccess(data));
      navigate('/inbox');
    } catch (err) {
      dispatch(loginFailure(err.response?.data?.detail || err.message || 'Login failed. Please try again.'));
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-[#07080a] relative overflow-hidden select-none">
      
      {/* Background aesthetic decorative light orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[55%] h-[55%] rounded-full bg-indigo-500/10 blur-[150px] pointer-events-none"></div>

      {/* Login Card */}
      <div className="w-full max-w-md p-8 glass-panel rounded-3xl shadow-2xl border border-white/5 animate-in fade-in zoom-in-95 duration-300 relative z-10 mx-4">
        
        {/* Branding header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="h-12 w-12 rounded-2xl bg-blue-500 flex items-center justify-center font-bold text-white shadow-xl shadow-blue-500/15 text-lg mb-4">
            S
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white/95">ShareXpress Mail</h1>
          <p className="text-xs text-white/30 mt-1.5 uppercase font-semibold tracking-wider">Enterprise Communication Portal</p>
        </div>

        {/* Error notification */}
        {error && (
          <div className="p-3.5 mb-6 rounded-xl bg-red-500/10 border border-red-500/10 text-red-400 flex items-center space-x-2.5 text-xs animate-shake">
            <ShieldAlert size={16} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold text-white/40 uppercase tracking-wide">Work Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20" size={15} />
              <input
                type="email"
                placeholder="username@sharexpress.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-xs rounded-xl glass-input text-white/80 placeholder-white/15"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold text-white/40 uppercase tracking-wide">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20" size={15} />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-xs rounded-xl glass-input text-white/80 placeholder-white/15"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-medium text-xs shadow-lg shadow-blue-500/10 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 mt-6"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        {/* Legal policy footer */}
        <div className="mt-8 text-center">
          <p className="text-[10px] text-white/15">Authorized Personnel Only. Actions are logged and audited.</p>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
