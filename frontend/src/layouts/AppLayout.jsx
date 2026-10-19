import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard, Users, UserRound, Calendar, Pill,
    FileText, Activity, LogOut, Menu, X, Bell, Search,
    Settings, Receipt, FlaskConical, ClipboardList
} from 'lucide-react';

const AppLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user, logout, hasPermission } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    // Define all available navigation items
    const allNavigation = [
        { name: 'Dashboard', href: '/app/dashboard', icon: LayoutDashboard, roles: ['Administrator', 'Doctor', 'Nurse', 'Receptionist', 'Pharmacist', 'Accountant'] },
        { name: 'Patients', href: '/app/patients', icon: Users, roles: ['Administrator', 'Doctor', 'Nurse', 'Receptionist'] },
        { name: 'Doctors', href: '/app/doctors', icon: UserRound, roles: ['Administrator', 'Patient', 'Receptionist'] },
        { name: 'Appointments', href: '/app/appointments', icon: Calendar, roles: ['Administrator', 'Doctor', 'Receptionist', 'Nurse'] },
        { name: 'Medical Records', href: '/app/records', icon: ClipboardList, roles: ['Administrator', 'Doctor', 'Nurse'] },
        { name: 'Laboratory', href: '/app/laboratory', icon: FlaskConical, roles: ['Administrator', 'Doctor'] },
        { name: 'Pharmacy', href: '/app/pharmacy', icon: Pill, roles: ['Administrator', 'Pharmacist', 'Doctor'] },
        { name: 'Billing', href: '/app/billing', icon: Receipt, roles: ['Administrator', 'Accountant', 'Receptionist'] },
        { name: 'Staff', href: '/app/staff', icon: FileText, roles: ['Administrator'] },
        { name: 'Settings', href: '/app/settings', icon: Settings, roles: ['Administrator'] },
    ];

    // Filter navigation based on user role
    const navigation = allNavigation.filter(item => {
        if (!item.roles) return true; // If no roles defined, show to all
        return hasPermission(item.roles);
    });

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    };

    return (
        <div className="h-screen flex overflow-hidden bg-background">

            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-20 bg-charcoal-900/50 backdrop-blur-sm transition-opacity lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* SIDEBAR */}
            <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-charcoal-900 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} shadow-2xl lg:shadow-none`}>
                <div className="flex flex-col h-full">
                    {/* Sidebar Logo */}
                    <div className="h-20 flex items-center px-6 border-b border-charcoal-800 shrink-0">
                        <Activity className="h-8 w-8 text-secondary-300" />
                        <span className="ml-3 text-xl font-bold text-white tracking-tight">CareSync</span>
                    </div>

                    {/* Navigation Menu */}
                    <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                        {navigation.map((item) => {
                            const isActive = location.pathname.startsWith(item.href);
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${isActive
                                        ? 'bg-secondary-300 text-charcoal-900 shadow-sm'
                                        : 'text-charcoal-300 hover:bg-charcoal-800 hover:text-white'
                                        }`}
                                >
                                    <item.icon
                                        className={`mr-3 h-5 w-5 flex-shrink-0 transition-colors ${isActive ? 'text-primary-800' : 'text-charcoal-400 group-hover:text-secondary-300'
                                            }`}
                                        strokeWidth={isActive ? 2.5 : 2}
                                    />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Bottom Logout */}
                    <div className="p-4 border-t border-charcoal-800 shrink-0">
                        <button
                            onClick={handleLogout}
                            className="group flex w-full items-center px-4 py-3 text-sm font-medium text-charcoal-300 rounded-xl hover:bg-charcoal-800 hover:text-white transition-colors"
                        >
                            <LogOut className="mr-3 h-5 w-5 text-charcoal-500 group-hover:text-rose-400 transition-colors" />
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

                {/* TOP HEADER */}
                <header className="h-20 flex items-center justify-between bg-white px-4 sm:px-6 lg:px-10 shrink-0 relative z-10 border-b border-charcoal-100/50">
                    {/* Left component: Hamburger + Greeting */}
                    <div className="flex items-center flex-1">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="mr-4 text-charcoal-500 hover:text-charcoal-900 lg:hidden p-2 rounded-lg hover:bg-charcoal-50 transition-colors"
                        >
                            <Menu className="h-6 w-6" />
                        </button>

                        <div className="hidden sm:block">
                            <h2 className="text-xl font-bold text-charcoal-900 tracking-tight">
                                {getGreeting()}, {user?.first_name || 'Admin'}
                            </h2>
                            <p className="text-sm text-charcoal-500 mt-0.5">
                                CareSync Hospital Management System
                            </p>
                        </div>
                    </div>

                    {/* Right component: Search + Tools */}
                    <div className="flex items-center space-x-5 sm:space-x-8">
                        {/* Search (Desktop) */}
                        <div className="hidden lg:flex relative max-w-xs w-64 lg:w-80">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-charcoal-400" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-2.5 border border-charcoal-200 rounded-full bg-charcoal-50/50 text-charcoal-900 placeholder-charcoal-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent sm:text-sm transition-all"
                                placeholder="Search everything..."
                            />
                        </div>

                        {/* Notifications */}
                        <button className="relative p-2.5 text-charcoal-400 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-colors group">
                            <Bell className="h-5 w-5 group-hover:animate-pulse" />
                            <span className="absolute top-2 right-2.5 block h-2 w-2 rounded-full bg-danger ring-2 ring-white" />
                        </button>

                        {/* User Profile */}
                        <div className="flex items-center space-x-3 pl-6 border-l border-charcoal-100">
                            <div className="flex flex-col items-end hidden md:flex">
                                <span className="text-sm font-bold text-charcoal-900">{user?.first_name || 'Admin'} {user?.last_name || 'User'}</span>
                                <span className="text-xs font-medium text-charcoal-500">{user?.role || 'Administrator'}</span>
                            </div>
                            <button className="h-11 w-11 rounded-full bg-secondary-100 flex items-center justify-center text-primary-700 font-bold border border-secondary-200 hover:ring-2 hover:ring-primary-500 hover:ring-offset-2 transition-all shadow-sm">
                                {user?.first_name ? user.first_name.charAt(0) : 'A'}{user?.last_name ? user.last_name.charAt(0) : 'U'}
                            </button>
                        </div>
                    </div>
                </header>

                {/* SCROLLABLE PAGE CONTENT */}
                <main className="flex-1 relative overflow-y-auto focus:outline-none">
                    <div className="py-8 px-4 sm:px-6 lg:px-10 max-w-[1600px] mx-auto min-h-full">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AppLayout;
