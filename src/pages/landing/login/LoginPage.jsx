import React, { useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../../../config/firebase';
import { Link, useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // // 🔐 Replace with your real login endpoint
            // const response = await fetch('YOUR_API_ENDPOINT/login', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify(form),
            await signInWithEmailAndPassword(auth, form.email, form.password);
            navigate('/dashboard');
        }
        catch (err) {
            setError('Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    // if (!response.ok) {
    //     throw new Error('Invalid credentials');
    // }
    const handleGoogleLogin = async () => {
        setLoading(true);
        setError('');
        try {
            // Firebase Google sign in
            await signInWithPopup(auth, provider);
            navigate('/dashboard');
        } catch (err) {
            setError('Google sign-in failed');
        } finally {
            setLoading(false);
        }
    };


    // const handleGoogleLogin = () => {
    //     setLoading(true);
    //     setError('');
    //     try {
    //         // 🔁 Implement Google OAuth redirection
    //         window.location.href = 'YOUR_GOOGLE_OAUTH_URL';
    //     } catch (err) {
    //         setError('Google login failed');
    //         setLoading(false);
    //     }
    // };

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-[#FAFAFA]">
            {/* Left Side - Hero Image */}
            <div className="md:w-1/2 hidden md:flex items-center justify-center bg-[#F5F5F5]">
                <img
                    src="/media/main.png"
                    alt="Login Visual"
                    className="w-full h-full object-cover rounded-r-xl shadow-xl max-h-screen"
                />
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-6">
                <form
                    onSubmit={handleSubmit}
                    className="bg-white w-full max-w-md border border-[#E0E0E0] p-8 rounded-lg shadow-lg"
                >
                    <h2 className="text-2xl font-bold mb-6 text-center text-[#0A192F]">
                        Login to your account
                    </h2>

                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
                            {error}
                        </div>
                    )}

                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={form.email}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        className="w-full mb-4 px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#0077FF]"
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        className="w-full mb-4 px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#0077FF]"
                    />
                    <p className="text-sm mt-2 text-right">
                        <Link to="/reset-password" className="text-[#0077FF] hover:underline">
                            Forgot Password?
                        </Link>
                    </p>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#0077FF] text-white py-3 rounded font-semibold hover:bg-blue-600 transition disabled:opacity-50"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>

                    <div className="my-4 text-center text-gray-500">or</div>

                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 border border-[#CCCCCC] py-3 bg-white rounded font-medium hover:bg-gray-100 transition disabled:opacity-50"
                    >
                        <img
                            src="https://www.google.com/favicon.ico"
                            alt="Google"
                            className="w-5 h-5"
                        />
                        Continue with Google
                    </button>

                    <p className="mt-6 text-sm text-center text-gray-600">
                        Don’t have an account?{' '}
                        <Link to="/signup"
                            className="text-[#0077FF] font-semibold hover:underline"
                        >
                            Sign Up
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
