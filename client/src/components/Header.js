import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    MagnifyingGlassIcon,
    PlusIcon,
    UserIcon,
    ChevronDownIcon,
    ShieldCheckIcon,
    HomeIcon
} from "@heroicons/react/24/outline";
import { useAuth } from '../contexts/AuthContext';

const Header = ({ onCreatePostClick, onHomeClick, showCreatePost = false }) => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const userMenuRef = useRef(null);

    // Close user menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setUserMenuOpen(false);
            }
        };

        if (userMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [userMenuOpen]);

    return (
        <header className="w-full p-2 border-b border-gray-700 bg-white">
            <div className="flex items-center w-full justify-between">
                <div className="flex items-center min-w-max">
                    <button
                        className="mr-2 md:hidden"
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Open menu"
                    >
                        <svg className="w-7 h-7 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <Link to="/" className="flex items-center">
                        <img
                            src="https://www.redditstatic.com/desktop2x/img/favicon/apple-icon-180x180.png"
                            alt="Reddit Logo"
                            className="w-8 h-8 mr-2"
                        />
                        <h2 className="text-2xl font-bold text-red-500">reddit</h2>
                    </Link>
                </div>
                <div className="flex flex-1 mx-8">
                    <form
                        action=""
                        className="flex flex-1 p-1 px-3 rounded-lg bg-blue-50 border border-gray-300 hover:border-blue-500 max-w-xl"
                    >
                        <MagnifyingGlassIcon className="w-6 h-6 text-gray-300" />
                        <input
                            type="text"
                            placeholder="Search"
                            className="h-6 text-sm p-1 pl-2 pr-0 block w-full bg-blue-50 focus:outline-none rounded"
                        />
                    </form>
                </div>
                <div className="flex items-center min-w-max space-x-2">
                    {user ? (
                        <>
                            <button
                                onClick={onHomeClick}
                                className={`flex items-center px-3 py-1 rounded-full transition-colors duration-150 ${
                                    !showCreatePost
                                        ? 'text-orange-600'
                                        : 'text-gray-600 hover:text-orange-500 hover:bg-orange-50'
                                }`}
                            >
                                <HomeIcon className="w-5 h-5 mr-1" />
                                <span className="font-medium">Home</span>
                            </button>
                            <button
                                className="flex items-center px-3 py-1 text-gray-600 hover:text-orange-500 hover:bg-orange-50 rounded-full transition-colors duration-150"
                                onClick={onCreatePostClick}
                                aria-label="Create post"
                            >
                                <PlusIcon className="w-5 h-5 mr-1" />
                                <span className="font-medium">Create</span>
                            </button>
                            {user.isAdmin && (
                                <Link
                                    to="/admin"
                                    className={`flex items-center px-3 py-1 rounded-full transition-colors duration-150 ${
                                        location.pathname === '/admin'
                                            ? 'bg-orange-100 text-orange-600'
                                            : 'text-gray-600 hover:text-orange-500 hover:bg-orange-50'
                                    }`}
                                    aria-label="Admin dashboard"
                                >
                                    <ShieldCheckIcon className="w-5 h-5 mr-1" />
                                    <span className="font-medium">Admin</span>
                                </Link>
                            )}
                            <div className="relative" ref={userMenuRef}>
                                <button
                                    className="flex items-center p-1 text-gray-600 hover:text-orange-500 hover:bg-orange-50 rounded-full transition-colors duration-150"
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    aria-label="User menu"
                                >
                                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                        {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                                    </div>
                                    <ChevronDownIcon className="w-4 h-4 ml-1" />
                                </button>
                                
                                {userMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                                        <div className="py-1">
                                            <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                                                <div className="font-medium">{user.username}</div>
                                                <div className="text-gray-500 text-xs">{user.email}</div>
                                            </div>

                                            <button
                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                                                onClick={() => {
                                                    logout();
                                                    setUserMenuOpen(false);
                                                }}
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <button
                            className="flex items-center px-3 py-1 border border-orange-500 text-orange-500 bg-white font-bold rounded-full hover:bg-orange-500 hover:text-white transition-colors duration-150 shadow-sm"
                            onClick={() => window.location.reload()}
                        >
                            <UserIcon className="w-5 h-5 mr-1" />
                            Log In
                        </button>
                    )}
                </div>
            </div>
            {menuOpen && (
                <nav className="md:hidden bg-white border-t border-b border-gray-200 py-2 px-4">
                    <ul className="space-y-2">
                        <li>
                            <button 
                                className="block w-full text-left text-gray-700 hover:text-blue-600"
                                onClick={() => {
                                    onHomeClick();
                                    setMenuOpen(false);
                                }}
                            >
                                Home
                            </button>
                        </li>
                        <li>
                            <button 
                                className="block w-full text-left text-gray-700 hover:text-blue-600"
                                onClick={() => {
                                    onCreatePostClick();
                                    setMenuOpen(false);
                                }}
                            >
                                Create Post
                            </button>
                        </li>
                        {user?.isAdmin && (
                            <li>
                                <Link 
                                    to="/admin" 
                                    className="block text-gray-700 hover:text-blue-600"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    Admin Dashboard
                                </Link>
                            </li>
                        )}
                    </ul>
                </nav>
            )}
        </header>
    );
};

export default Header; 