import React, { useContext } from 'react';
import { AuthContext, AuthContextType } from '../context/AuthContext';
import { View } from '../App';
import { RealityShieldLogo } from './Icons';
import UserDropdown from './ui/UserDropdown';

interface GlobalNavProps {
    view: View;
    showSplash: () => void;
    showLogin: () => void;
    showSignUp: () => void;
    showDashboard: () => void;
}

const GlobalNav: React.FC<GlobalNavProps> = ({
    view,
    showSplash,
    showLogin,
    showSignUp,
    showDashboard,
}) => {
    const { currentUser, logout } = useContext(AuthContext) as AuthContextType;

    const isDashboardView = view === 'dashboard';
    const isLoginView = view === 'login';
    const isSignupView = view === 'signup';

    return (
        <header className="sticky top-0 left-0 w-full z-40 bg-black/50 backdrop-blur-sm border-b border-neutral-800 animate-fade-in">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <button onClick={showSplash} className="flex items-center gap-2 focus:outline-none">
                        <RealityShieldLogo className="h-8 w-8" />
                        <span className="font-clash text-2xl font-semibold">RealityShield</span>
                    </button>
                    <nav className="flex items-center gap-4">
                        {currentUser ? (
                            <UserDropdown
                                user={currentUser}
                                onLogout={logout}
                                onGoToDashboard={!isDashboardView ? showDashboard : undefined}
                            />
                        ) : (
                            <>
                                {!isLoginView && (
                                    <button
                                        onClick={showLogin}
                                        className="font-semibold text-gray-300 hover:text-white transition-colors focus:outline-none"
                                    >
                                        Login
                                    </button>
                                )}
                                {!isSignupView && (
                                    <button
                                        onClick={showSignUp}
                                        className="font-semibold bg-white text-black py-2 px-5 rounded-full hover:bg-gray-200 transform hover:scale-105 transition-all duration-300 focus:outline-none"
                                    >
                                        Sign Up
                                    </button>
                                )}
                            </>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default GlobalNav;
