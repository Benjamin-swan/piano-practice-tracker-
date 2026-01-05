import React, { useState, useEffect } from 'react';
import { User } from '../types';

const USERS_STORAGE_KEY = 'piano_users';

// Admin Credentials from Environment Variables
const ADMIN_ID = import.meta.env.VITE_ADMIN_ID;
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;

const AdminPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Login State
    const [loginId, setLoginId] = useState('');
    const [loginPw, setLoginPw] = useState('');
    const [loginError, setLoginError] = useState('');

    useEffect(() => {
        if (isAuthenticated) {
            const usersStr = localStorage.getItem(USERS_STORAGE_KEY);
            setUsers(usersStr ? JSON.parse(usersStr) : []);
        }
    }, [isAuthenticated]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setLoginError('');

        if (loginId === ADMIN_ID && loginPw === ADMIN_PASSWORD) {
            setIsAuthenticated(true);
        } else {
            setLoginError('Invalid Admin ID or Password.');
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setLoginId('');
        setLoginPw('');
    };

    // If not authenticated, show Admin Login
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 p-4 font-sans text-gray-100">
                <div className="bg-slate-700 rounded-2xl shadow-2xl w-full max-w-md p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">🔐 Admin Portal</h1>
                        <p className="text-gray-300 text-sm">
                            Please login to continue.
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-200 mb-1">Admin ID</label>
                            <input
                                type="text"
                                value={loginId}
                                onChange={(e) => setLoginId(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg bg-slate-600 border border-slate-500 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400 outline-none transition-all"
                                placeholder="Enter admin ID"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-200 mb-1">Password</label>
                            <input
                                type="password"
                                value={loginPw}
                                onChange={(e) => setLoginPw(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg bg-slate-600 border border-slate-500 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400 outline-none transition-all"
                                placeholder="Enter password"
                            />
                        </div>

                        {loginError && <p className="text-red-400 text-sm text-center">{loginError}</p>}

                        <button
                            type="submit"
                            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                        >
                            Login
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <a href="/" className="text-blue-400 hover:underline hover:text-blue-300 text-sm">
                            ← Back to Student Tracker
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    // If authenticated, show User List
    return (
        <div className="min-h-screen bg-slate-50 p-8 font-sans">
            <div className="max-w-4xl mx-auto">
                <header className="mb-8 border-b border-gray-200 pb-4 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">🎹 Director Portal</h1>
                        <p className="text-gray-500 text-sm">Registered Accounts Database</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600">
                            Admin: <span className="font-semibold text-gray-900">Director</span>
                        </span>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </header>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Username
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    User ID
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Password (PIN)
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{user.username}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500 font-mono bg-gray-100 inline-block px-2 py-0.5 rounded">
                                            {user.id}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {user.password}
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="px-6 py-12 text-center text-gray-400">
                                        No registered users found in this browser.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="mt-8 text-center">
                    <a href="/" className="text-blue-500 hover:underline hover:text-blue-600 text-sm">
                        ← Back to Student Tracker
                    </a>
                </div>
            </div>
        </div>
    );
};

export default AdminPage;
