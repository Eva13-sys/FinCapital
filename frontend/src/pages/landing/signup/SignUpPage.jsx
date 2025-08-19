import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../../../config/firebase';
import { db } from '../../../config/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { sendEmailVerification } from 'firebase/auth';


const SignUpPage = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (form.password !== form.confirmPassword) {
            setError('Passwords do not match.');
            setLoading(false);
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
            const user = userCredential.user;

            // 1. Save user to Firestore
            await setDoc(doc(db, 'users', user.uid), {
                name: form.name,
                email: form.email,
                createdAt: new Date(),
            });

            // 2. Send email verification
            await sendEmailVerification(user);

            alert('Signup successful! Please verify your email before logging in.');
            navigate('/login');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    const handleGoogleSignup = async () => {
        setLoading(true);
        try {
            await signInWithPopup(auth, provider);
            navigate('/dashboard');
        } catch (err) {
            setError('Google Sign-In failed: ' + err.message);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-[#FAFAFA]">
            {/* Left Image */}
            <div className="md:w-1/2 w-full h-64 md:h-auto">
                <img
                    src="/media/main.png"
                    alt="Signup Visual"
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Right Form Section */}
            <div className="md:w-1/2 w-full flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-md bg-white shadow-md p-8 rounded-lg border border-gray-200">
                    <h2 className="text-3xl font-bold text-[#0A192F] mb-2 text-center">Create Account</h2>
                    <p className="text-sm text-gray-600 mb-6 text-center">Join our financial community today</p>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            value={form.name}
                            onChange={handleChange}
                            required
                            className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-[#0077FF]"
                            disabled={loading}
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-[#0077FF]"
                            disabled={loading}
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={form.password}
                            onChange={handleChange}
                            required
                            className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-[#0077FF]"
                            disabled={loading}
                        />
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            required
                            className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-[#0077FF]"
                            disabled={loading}
                        />

                        <button
                            type="submit"
                            className="w-full bg-[#0077FF] text-white p-3 rounded font-semibold hover:bg-blue-600 transition disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? 'Creating Account...' : 'Sign Up'}
                        </button>
                    </form>

                    <div className="my-4 text-center text-gray-500">or</div>

                    <button
                        onClick={handleGoogleSignup}
                        className="w-full flex items-center justify-center gap-2 border border-[#CCCCCC] p-3 rounded font-medium bg-white hover:bg-gray-100 transition disabled:opacity-50"
                        disabled={loading}
                    >
                        <img
                            src="https://www.google.com/favicon.ico"
                            alt="Google"
                            className="w-5 h-5"
                        />
                        Continue with Google
                    </button>

                    <p className="mt-6 text-sm text-center text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="text-[#0077FF] font-semibold hover:underline">
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;
