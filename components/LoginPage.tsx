
import React, { useState } from 'react';
import { User } from '../types';

interface LoginPageProps {
    onLogin: (user: User) => void;
}

const termsText = `[Service Terms]
1. Purpose: This service allows users to track their piano practice progress.
2. Personal Data: We collect your name and ID effectively to provide individual tracking. 
3. Data storage: All data is stored locally on your browser. Clearing browser cache will lose your data.
4. Disclaimer: This is a prototype service.`;

const USERS_STORAGE_KEY = 'piano_users';

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
    const [isLoginMode, setIsLoginMode] = useState(true);

    // Login State
    const [loginId, setLoginId] = useState('');
    const [loginPw, setLoginPw] = useState('');
    const [loginError, setLoginError] = useState('');

    // Signup State
    const [username, setUsername] = useState('');
    const [signupId, setSignupId] = useState('');
    const [signupPw, setSignupPw] = useState('');
    const [agreed, setAgreed] = useState(false);
    const [signupError, setSignupError] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setLoginError('');

        const usersStr = localStorage.getItem(USERS_STORAGE_KEY);
        const users: User[] = usersStr ? JSON.parse(usersStr) : [];

        const user = users.find(u => u.id === loginId && u.password === loginPw);

        if (user) {
            onLogin(user);
        } else {
            setLoginError('Invalid ID or Password.');
        }
    };

    const handleSignup = (e: React.FormEvent) => {
        e.preventDefault();
        setSignupError('');

        // Validation
        if (!agreed) {
            setSignupError('You must agree to the terms.');
            return;
        }
        if (!/^[a-z0-9]+$/.test(signupId)) {
            setSignupError('ID must be lowercase letters and numbers only.');
            return;
        }
        if (!/^\d{4}$/.test(signupPw)) {
            setSignupError('Password must be exactly 4 digits.');
            return;
        }
        if (!username.trim()) {
            setSignupError('Please enter your name.');
            return;
        }

        const usersStr = localStorage.getItem(USERS_STORAGE_KEY);
        const users: User[] = usersStr ? JSON.parse(usersStr) : [];

        if (users.some(u => u.id === signupId)) {
            setSignupError('This ID is already taken.');
            return;
        }

        const newUser: User = {
            id: signupId,
            username,
            password: signupPw
        };

        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([...users, newUser]));

        // Auto login after signup
        onLogin(newUser);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200 p-4 font-sans text-gray-800">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 transition-all duration-300">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Piano Tracker</h1>
                    <p className="text-gray-500">
                        {isLoginMode ? 'Welcome back! Please login.' : 'Start your journey today.'}
                    </p>
                </div>

                {isLoginMode ? (
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">ID</label>
                            <input
                                type="text"
                                value={loginId}
                                onChange={(e) => setLoginId(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                placeholder="Enter your ID"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input
                                type="password"
                                value={loginPw}
                                onChange={(e) => setLoginPw(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                placeholder="4-digit code"
                                maxLength={4}
                            />
                        </div>

                        {loginError && <p className="text-red-500 text-sm text-center">{loginError}</p>}

                        <button
                            type="submit"
                            className="w-full py-3 bg-gray-900 hover:bg-black text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                        >
                            Login
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleSignup} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Terms of Service</label>
                            <textarea
                                readOnly
                                value={termsText}
                                className="w-full h-24 p-2 text-xs text-gray-500 bg-gray-100 rounded-lg border border-gray-200 resize-none focus:outline-none"
                            />
                            <div className="mt-2 flex items-center">
                                <input
                                    id="agree"
                                    type="checkbox"
                                    checked={agreed}
                                    onChange={(e) => setAgreed(e.target.checked)}
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <label htmlFor="agree" className="ml-2 text-sm text-gray-600">I agree to the terms.</label>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                                    placeholder="Your Name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">ID</label>
                                <input
                                    type="text"
                                    value={signupId}
                                    onChange={(e) => setSignupId(e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                                    placeholder="a-z, 0-9"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password (4 digits)</label>
                            <input
                                type="password"
                                value={signupPw}
                                onChange={(e) => setSignupPw(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-center tracking-widest"
                                placeholder="0000"
                                maxLength={4}
                            />
                        </div>

                        {signupError && <p className="text-red-500 text-sm text-center">{signupError}</p>}

                        <button
                            type="submit"
                            className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                        >
                            Create Account
                        </button>
                    </form>
                )}

                <div className="mt-6 text-center">
                    <button
                        onClick={() => {
                            setIsLoginMode(!isLoginMode);
                            setLoginError('');
                            setSignupError('');
                        }}
                        className="text-sm text-gray-500 hover:text-gray-800 underline decoration-gray-300 underline-offset-4"
                    >
                        {isLoginMode ? "Don't have an account? Sign Up" : "Already have an account? Login"}
                    </button>
                </div>

                {/* Admin Portal Link */}
                <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                    <a
                        href="/admin"
                        className="text-xs text-gray-400 hover:text-blue-500 transition-colors inline-flex items-center gap-1"
                    >
                        🔐 Admin Portal
                    </a>
                </div>
            </div>

        </div>
    );
};

export default LoginPage;
