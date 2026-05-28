import React, { useState } from 'react';
import logo from '../sasc-logo.png';
import { loginAdmin } from '../utils/api';

export default function Login({ onLogin, onStudentPortal }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await loginAdmin(email, password);
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('admin', JSON.stringify(data.admin));
        onLogin();
      } else {
        setError(data.error || 'Invalid email or password');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      
      {/* Left Panel */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between p-12"
        style={{ background: 'linear-gradient(135deg, #1B1F8A 0%, #13166b 100%)' }}>
        <img src={logo} alt="SA Shepherd College" className="w-48" />
        <div>
          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            Empowering Students.<br />
            <span style={{ color: '#E91E8C' }}>Transforming Lives.</span>
          </h1>
          <p className="text-blue-200 text-lg">
            SA Shepherd College Student Management System —
            Burgersfort & Polokwane Campuses
          </p>
        </div>
        <div className="flex gap-6">
          <div className="text-center">
            <p className="text-3xl font-bold" style={{ color: '#8DC63F' }}>2</p>
            <p className="text-blue-300 text-sm">Campuses</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold" style={{ color: '#E91E8C' }}>8</p>
            <p className="text-blue-300 text-sm">Faculties</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-white">DHET</p>
            <p className="text-blue-300 text-sm">Accredited</p>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-md">

          <div className="lg:hidden mb-8 text-center">
            <img src={logo} alt="SA Shepherd College" className="w-40 mx-auto" />
          </div>

          <h2 className="text-2xl font-bold mb-1" style={{ color: '#1B1F8A' }}>
            Welcome Back
          </h2>
          <p className="text-gray-500 mb-8 text-sm">Sign in to access the admin portal</p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 text-sm"
                placeholder="admin@sashepherdcollege.org.za"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 text-sm"
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full text-white font-semibold py-3 rounded-lg transition duration-200 mb-3 disabled:opacity-50"
              style={{ background: '#1B1F8A' }}>
              {loading ? 'Signing in...' : 'Sign In as Admin'}
            </button>
            <button
              type="button"
              onClick={onStudentPortal}
              className="w-full font-semibold py-3 rounded-lg transition duration-200 border-2"
              style={{ color: '#E91E8C', borderColor: '#E91E8C' }}>
              Student Portal Login
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-400 text-center">DHET Exam Center No. 6999 926 54</p>
            <p className="text-xs text-gray-400 text-center mt-1">
              Burgersfort: 010 055 5115 | Polokwane: 015 008 5102
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}