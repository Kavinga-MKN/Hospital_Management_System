import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

// Inline SVG Illustration — nurse in hospital waiting room
const HospitalIllustration = () => (
    <svg viewBox="0 0 400 450" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full max-h-[380px]">
        {/* Background floor */}
        <rect x="30" y="360" width="340" height="4" rx="2" fill="#b2dfbf" />

        {/* Door */}
        <rect x="270" y="200" width="100" height="160" rx="8" fill="#e0ebe2" stroke="#a0c8a8" strokeWidth="2" />
        <rect x="280" y="210" width="80" height="135" rx="4" fill="#c8e6cf" />
        {/* Door handle */}
        <circle cx="285" cy="280" r="5" fill="#80b090" />
        {/* Door glass panel */}
        <rect x="300" y="225" width="46" height="60" rx="3" fill="#d4edd8" stroke="#90c49a" strokeWidth="1.5" />
        {/* Door diagonal lines */}
        <line x1="300" y1="225" x2="346" y2="285" stroke="#90c49a" strokeWidth="1" />
        <line x1="346" y1="225" x2="300" y2="285" stroke="#90c49a" strokeWidth="1" />

        {/* Window / blinds */}
        <rect x="30" y="160" width="130" height="140" rx="6" fill="#e8f5e9" stroke="#a5d6a7" strokeWidth="2" />
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
            <rect key={i} x="35" y={170 + i * 12} width="120" height="7" rx="2" fill="#c8e6cf" />
        ))}

        {/* Waiting chairs */}
        {[30, 100, 170].map((x, i) => (
            <g key={i}>
                <rect x={x + 210} y="310" width="42" height="10" rx="4" fill="#a5d6a7" />
                <rect x={x + 215} y="320" width="32" height="38" rx="3" fill="#c8e6cf" />
                <rect x={x + 215} y="280" width="32" height="32" rx="3" fill="#c8e6cf" stroke="#a5d6a7" strokeWidth="1.5" />
                <rect x={x + 213} y="355" width="6" height="8" rx="2" fill="#90c49a" />
                <rect x={x + 239} y="355" width="6" height="8" rx="2" fill="#90c49a" />
            </g>
        ))}

        {/* Clock on wall */}
        <circle cx="245" cy="155" r="30" fill="white" stroke="#a5d6a7" strokeWidth="3" />
        <circle cx="245" cy="155" r="3" fill="#4caf50" />
        <line x1="245" y1="155" x2="245" y2="135" stroke="#2e7d32" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="245" y1="155" x2="260" y2="162" stroke="#4caf50" strokeWidth="2" strokeLinecap="round" />
        {/* Clock ticks */}
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => {
            const rad = (deg - 90) * Math.PI / 180;
            const x1 = 245 + 25 * Math.cos(rad);
            const y1 = 155 + 25 * Math.sin(rad);
            const x2 = 245 + 28 * Math.cos(rad);
            const y2 = 155 + 28 * Math.sin(rad);
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#a5d6a7" strokeWidth="1.5" />;
        })}

        {/* Nurse body */}
        {/* Legs */}
        <rect x="168" y="310" width="22" height="55" rx="10" fill="#4caf50" />
        <rect x="196" y="310" width="22" height="55" rx="10" fill="#4caf50" />
        {/* Shoes */}
        <ellipse cx="179" cy="363" rx="13" ry="7" fill="#1b5e20" />
        <ellipse cx="207" cy="363" rx="13" ry="7" fill="#1b5e20" />
        {/* Uniform */}
        <rect x="158" y="220" width="70" height="100" rx="14" fill="#66bb6a" />
        {/* Stethoscope around neck */}
        <path d="M175 240 Q175 258 185 265 Q195 272 195 258 Q195 250 205 248" stroke="#388e3c" strokeWidth="3" fill="none" strokeLinecap="round" />
        <circle cx="175" cy="240" r="5" fill="#388e3c" />
        <circle cx="205" cy="247" r="6" fill="#2e7d32" />
        {/* Clipboard */}
        <rect x="205" y="235" width="32" height="40" rx="4" fill="#f1f8e9" stroke="#a5d6a7" strokeWidth="2" />
        <rect x="218" y="228" width="10" height="10" rx="3" fill="#a5d6a7" />
        <line x1="211" y1="248" x2="231" y2="248" stroke="#a5d6a7" strokeWidth="1.5" />
        <line x1="211" y1="256" x2="231" y2="256" stroke="#a5d6a7" strokeWidth="1.5" />
        <line x1="211" y1="264" x2="225" y2="264" stroke="#a5d6a7" strokeWidth="1.5" />
        {/* Nurse arm (holding clipboard) */}
        <path d="M225 250 Q232 242 235 255" stroke="#66bb6a" strokeWidth="14" fill="none" strokeLinecap="round" />
        {/* Neck */}
        <rect x="180" y="200" width="26" height="25" rx="8" fill="#ffe0b2" />
        {/* Head */}
        <ellipse cx="193" cy="190" rx="28" ry="30" fill="#ffcc80" />
        {/* Hair */}
        <path d="M165 185 Q165 155 193 152 Q221 155 221 185" fill="#4e342e" />
        <path d="M221 185 Q225 175 220 165" fill="#4e342e" />
        <ellipse cx="193" cy="152" rx="25" ry="10" fill="#4e342e" />
        {/* Eyes */}
        <ellipse cx="184" cy="190" rx="4" ry="4.5" fill="white" />
        <ellipse cx="202" cy="190" rx="4" ry="4.5" fill="white" />
        <ellipse cx="184" cy="191" rx="2.5" ry="3" fill="#3e2723" />
        <ellipse cx="202" cy="191" rx="2.5" ry="3" fill="#3e2723" />
        {/* Smile */}
        <path d="M185 202 Q193 209 201 202" stroke="#bf360c" strokeWidth="2" fill="none" strokeLinecap="round" />
        {/* Cheeks */}
        <ellipse cx="178" cy="200" rx="5" ry="3" fill="#ffab91" opacity="0.6" />
        <ellipse cx="208" cy="200" rx="5" ry="3" fill="#ffab91" opacity="0.6" />
    </svg>
);

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(formData.email, formData.password);
            toast.success('Welcome back!');
            navigate('/app/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            {/* Card */}
            <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">

                {/* ─── LEFT: Login Form ─── */}
                <div className="flex-1 px-10 py-12 flex flex-col justify-center">
                    {/* Logo / Title */}
                    <div className="flex items-center gap-3 mb-8">
                        <svg viewBox="0 0 40 40" className="w-9 h-9" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="20" cy="12" r="9" stroke="#222" strokeWidth="2.5" fill="none" />
                            <line x1="20" y1="12" x2="20" y2="30" stroke="#222" strokeWidth="2.5" strokeLinecap="round" />
                            <path d="M11 30 Q20 38 29 30" stroke="#222" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                            <path d="M20 3 Q24 6 24 10 Q24 7 26 6" stroke="#222" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                        </svg>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Login</h1>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Email */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Email Address"
                                required
                                className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all text-sm"
                            />
                        </div>

                        {/* Password */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Password"
                                required
                                className="w-full pl-12 pr-12 py-3.5 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all text-sm"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 bg-green-500 hover:bg-green-600 active:bg-green-700 text-white font-bold rounded-xl focus:outline-none focus:ring-4 focus:ring-green-300 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 text-sm tracking-wide shadow-md shadow-green-200"
                        >
                            {loading ? 'Signing in...' : 'Login'}
                        </button>
                    </form>



                    {/* Bottom label */}
                    <p className="mt-auto pt-10 text-center text-xs text-gray-300 font-medium tracking-widest uppercase">
                        Oncosurgical Unit
                    </p>
                </div>

                {/* ─── RIGHT: Mint Illustration Panel ─── */}
                <div className="hidden md:flex flex-1 bg-green-50 rounded-r-3xl items-end justify-center pb-0 overflow-hidden">
                    <HospitalIllustration />
                </div>
            </div>
        </div>
    );
};

export default Login;
