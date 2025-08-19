import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../../config/firebase';

const ResetPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Password reset email sent!');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 py-8">
      <div className="min-h-screen flex items-center justify-center bg-[#f9f9f9] px-4">
        <form onSubmit={handleReset} className="bg-white shadow-md p-8 rounded-lg w-full max-w-sm">
          <h2 className="text-2xl font-semibold mb-4 text-center">Reset Password</h2>
          {message && <div className="text-green-600 mb-3">{message}</div>}
          {error && <div className="text-red-600 mb-3">{error}</div>}
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded mb-4 focus:outline-none"
            required
          />
          <button
            type="submit"
            className="w-full bg-[#0077FF] text-white py-2 rounded hover:bg-blue-600"
          >
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
