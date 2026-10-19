import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Users, Calendar, FileText, FlaskConical, Pill, Receipt, ChevronRight } from 'lucide-react';
import Button from '../components/ui/Button';

const Landing = () => {
    return (
        <div className="min-h-screen bg-charcoal-900 text-white font-sans selection:bg-primary-500 selection:text-white">

            {/* Header / Navbar */}
            <header className="absolute top-0 left-0 right-0 z-50 px-6 lg:px-12 py-6 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-primary-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
                        <Activity className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-white">CareSync</span>
                </div>

                <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-charcoal-200">
                    <a href="#" className="text-white hover:text-primary-300 transition-colors">Home</a>
                    <a href="#services" className="hover:text-white transition-colors">Services</a>
                    <a href="#" className="hover:text-white transition-colors">About</a>
                </nav>

                <div className="flex items-center space-x-4">
                    <Link to="/login" className="text-sm font-medium text-white hover:text-primary-300 transition-colors">
                        Sign In
                    </Link>
                    <Link to="/register">
                        <Button className="bg-primary-500 hover:bg-primary-600 border-none">
                            Get Started
                        </Button>
                    </Link>
                </div>
            </header>

            {/* Hero Section */}
            <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                {/* Background decorative glows */}
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-900/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 opacity-50 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary-900/30 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 opacity-50 pointer-events-none"></div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-center">

                    {/* Left: Text Content */}
                    <div className="w-full lg:w-1/2 text-center lg:text-left pt-12 lg:pt-0">
                        <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6">
                            Modern Hospital Management, <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary-300 to-primary-400">
                                Simplified.
                            </span>
                        </h1>
                        <p className="text-charcoal-300 text-lg lg:text-xl max-w-2xl mx-auto lg:mx-0 mb-10 leading-relaxed">
                            A unified, intelligent SaaS platform designed to comprehensively manage patients, doctors, appointments, medical records, laboratories, and billing.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
                            <Link to="/login">
                                <Button size="lg" className="w-full sm:w-auto bg-primary-500 hover:bg-primary-600 text-white font-semibold text-base py-6 px-8 shadow-lg shadow-primary-500/25 group">
                                    Sign In To Dashboard
                                    <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                            <Link to="/register">
                                <Button size="lg" variant="outline" className="w-full sm:w-auto border-charcoal-600 text-white hover:bg-charcoal-800 hover:text-white font-semibold text-base py-6 px-8">
                                    Create Free Account
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Right: Abstract Illustration */}
                    <div className="w-full lg:w-1/2 mt-16 lg:mt-0 relative hidden md:block">
                        <div className="aspect-square relative w-full max-w-lg mx-auto">
                            <div className="absolute inset-0 bg-gradient-to-tr from-charcoal-800 to-charcoal-800/20 border border-charcoal-700/50 rounded-3xl p-8 backdrop-blur-sm shadow-2xl flex flex-col justify-between">
                                {/* Mock UI Header */}
                                <div className="flex items-center justify-between mb-8 opacity-70">
                                    <div className="flex space-x-2">
                                        <div className="w-3 h-3 rounded-full bg-charcoal-600"></div>
                                        <div className="w-3 h-3 rounded-full bg-charcoal-600"></div>
                                    </div>
                                    <div className="w-24 h-2 rounded-full bg-charcoal-700"></div>
                                </div>

                                {/* Mock Content Bars */}
                                <div className="space-y-4 mb-auto">
                                    <div className="h-4 w-3/4 rounded-full bg-charcoal-600"></div>
                                    <div className="h-4 w-1/2 rounded-full bg-primary-500/80"></div>
                                    <div className="h-4 w-5/6 rounded-full bg-charcoal-700"></div>
                                </div>

                                {/* Mock Data Blocks */}
                                <div className="grid grid-cols-2 gap-4 mt-8">
                                    <div className="bg-charcoal-700/50 h-24 rounded-2xl border border-charcoal-600/30"></div>
                                    <div className="bg-secondary-500/20 h-24 rounded-2xl border border-secondary-500/30"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Features Section */}
            <div id="services" className="bg-background py-24 border-t border-charcoal-800">
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold text-charcoal-900 tracking-tight">Everything you need to run a modern facility</h2>
                        <p className="mt-4 text-charcoal-500 text-lg">CareSync handles all critical operational nodes of your healthcare business.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Feature Cards */}
                        <div className="bg-white p-8 rounded-2xl shadow-card border border-charcoal-100/50 hover:shadow-lg transition-shadow group">
                            <div className="h-12 w-12 bg-secondary-100 text-primary-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Users className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-bold text-charcoal-900 mb-2">Patient Management</h3>
                            <p className="text-charcoal-500 leading-relaxed">Comprehensive registration, demography tracking, and secure medical history storage.</p>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-card border border-charcoal-100/50 hover:shadow-lg transition-shadow group">
                            <div className="h-12 w-12 bg-secondary-100 text-primary-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Calendar className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-bold text-charcoal-900 mb-2">Appointment Scheduling</h3>
                            <p className="text-charcoal-500 leading-relaxed">Effortlessly manage doctor schedules, book slots, and dispatch automated status tracking.</p>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-card border border-charcoal-100/50 hover:shadow-lg transition-shadow group">
                            <div className="h-12 w-12 bg-secondary-100 text-primary-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <FileText className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-bold text-charcoal-900 mb-2">Medical Records</h3>
                            <p className="text-charcoal-500 leading-relaxed">Detailed timeline views of checkups, diagnoses, notes, and prescriptions for continuous care.</p>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-card border border-charcoal-100/50 hover:shadow-lg transition-shadow group">
                            <div className="h-12 w-12 bg-secondary-100 text-primary-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <FlaskConical className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-bold text-charcoal-900 mb-2">Laboratory</h3>
                            <p className="text-charcoal-500 leading-relaxed">Queue and process sample tests, link results directly to patients, and alert presiding doctors.</p>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-card border border-charcoal-100/50 hover:shadow-lg transition-shadow group">
                            <div className="h-12 w-12 bg-secondary-100 text-primary-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Pill className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-bold text-charcoal-900 mb-2">Pharmacy</h3>
                            <p className="text-charcoal-500 leading-relaxed">Intelligent inventory logging, stock expiry alerts, and secure prescription dispensing workflows.</p>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-card border border-charcoal-100/50 hover:shadow-lg transition-shadow group">
                            <div className="h-12 w-12 bg-secondary-100 text-primary-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Receipt className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-bold text-charcoal-900 mb-2">Billing</h3>
                            <p className="text-charcoal-500 leading-relaxed">Seamlessly generate invoices spanning consultations, lab tests, and dispensed medications.</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Landing;
