import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function AuthForm() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await login({ username, password });
      } else {
        await register({ username, email, password, displayName, bio });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="flex flex-col items-center">
            <img
              src="https://www.redditstatic.com/desktop2x/img/favicon/apple-icon-180x180.png"
              alt="Reddit Logo"
              className="w-12 h-12 mb-4"
            />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {mode === 'login' ? 'Log In' : 'Sign Up'}
            </h2>
            <p className="text-gray-500 text-sm mb-6 text-center">
              {mode === 'login' ? 'By continuing, you agree to our User Agreement and Privacy Policy.' : 'By continuing, you agree to our User Agreement and Privacy Policy.'}
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder={mode === 'login' ? 'Username or Email' : 'Username'}
                className="w-full px-3 py-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 placeholder-gray-400 transition-colors duration-150"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
              />
            </div>
            
            {mode === 'register' && (
              <>
                <div>
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full px-3 py-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 placeholder-gray-400 transition-colors duration-150"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Display Name"
                    className="w-full px-3 py-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 placeholder-gray-400 transition-colors duration-150"
                    value={displayName}
                    onChange={e => setDisplayName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <textarea
                    placeholder="Bio (optional)"
                    className="w-full px-3 py-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 placeholder-gray-400 resize-none transition-colors duration-150"
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    rows={3}
                  />
                </div>
              </>
            )}
            
            <div>
              <input
                type="password"
                placeholder="Password"
                className="w-full px-3 py-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 placeholder-gray-400 transition-colors duration-150"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            
            {error && (
              <div className="text-red-600 text-sm text-center bg-red-50 border border-red-200 rounded-md p-3">
                {error}
              </div>
            )}
            
            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 shadow-sm"
              disabled={loading}
            >
              {loading ? 'Please wait...' : mode === 'login' ? 'Log In' : 'Sign Up'}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            {mode === 'login' ? (
              <p className="text-gray-500 text-sm">
                New to Reddit?{' '}
                <button 
                  className="text-orange-500 hover:text-orange-600 font-medium underline transition-colors duration-150"
                  onClick={() => setMode('register')}
                >
                  Sign Up
                </button>
              </p>
            ) : (
              <p className="text-gray-500 text-sm">
                Already have an account?{' '}
                <button 
                  className="text-orange-500 hover:text-orange-600 font-medium underline transition-colors duration-150"
                  onClick={() => setMode('login')}
                >
                  Log In
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 