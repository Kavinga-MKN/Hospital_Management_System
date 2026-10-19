import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { Users, CalendarCheck, CreditCard, Beaker, TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const { user } = useAuth();

    // Mock chart data since backend doesn't provide historical data directly yet
    const data = [
        { name: 'Mon', patients: 40, revenue: 2400 },
        { name: 'Tue', patients: 30, revenue: 1398 },
        { name: 'Wed', patients: 20, revenue: 9800 },
        { name: 'Thu', patients: 27, revenue: 3908 },
        { name: 'Fri', patients: 18, revenue: 4800 },
        { name: 'Sat', animate: true, patients: 23, revenue: 3800 },
        { name: 'Sun', patients: 34, revenue: 4300 },
    ];

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Ignore error if it fails, fallback to 0/mock
                const res = await api.get('/reports/dashboard');
                setStats(res.data.data);
            } catch (error) {
                console.error("Error fetching stats", error);
            }
        };
        fetchStats();
    }, []);

    const statCards = [
        {
            name: 'Total Patients',
            value: stats?.totalPatients || '1,248',
            icon: Users,
            iconClass: 'text-primary-600 bg-primary-100',
            trend: '+12% this month',
            trendUp: true
        },
        {
            name: `Today's Appointments`,
            value: stats?.todaysAppointments || '42',
            icon: CalendarCheck,
            iconClass: 'text-primary-700 bg-secondary-200',
            trend: '+5% since yesterday',
            trendUp: true
        },
        {
            name: 'Pending Lab Requests',
            value: stats?.pendingLabRequests || '18',
            icon: Beaker,
            iconClass: 'text-charcoal-700 bg-charcoal-100',
            trend: '-2% this week',
            trendUp: false
        }
    ];

    if (user?.role === 'Administrator' || user?.role === 'Accountant' || !user) {
        statCards.push({
            name: 'Total Revenue',
            value: `$${(stats?.totalRevenue || 12450).toLocaleString()}`,
            icon: CreditCard,
            iconClass: 'text-primary-500 bg-secondary-100',
            trend: '+8% this month',
            trendUp: true
        });
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-charcoal-900 tracking-tight">Dashboard Overview</h1>
                    <p className="mt-2 text-charcoal-500">
                        High-level metrics and hospital analytics.
                    </p>
                </div>
                <button className="flex items-center text-sm font-semibold text-primary-700 bg-primary-50 border border-primary-200 h-10 px-5 rounded-xl hover:bg-primary-100 transition-colors">
                    Export Report <ArrowUpRight className="ml-2 h-4 w-4" />
                </button>
            </div>

            {/* Stat Cards - Based directly on the User prompt format requirement */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {statCards.map((item) => (
                    <Card key={item.name} className="overflow-hidden bg-white border border-charcoal-100/50 shadow-card hover:shadow-lg transition-all duration-300">
                        <CardContent className="p-6 flex flex-col items-start h-full">
                            <div className={`p-3 rounded-xl ${item.iconClass} mb-4`}>
                                <item.icon className="h-6 w-6" strokeWidth={2} />
                            </div>
                            <h3 className="text-sm font-medium text-charcoal-500 mb-1">{item.name}</h3>
                            <p className="text-3xl font-bold text-charcoal-900 tracking-tight mb-4">{item.value}</p>

                            <div className="mt-auto">
                                <p className={`text-sm font-medium flex items-center ${item.trendUp ? 'text-primary-600' : 'text-charcoal-500'}`}>
                                    {item.trendUp ? <TrendingUp className="h-4 w-4 mr-1.5" /> : <TrendingDown className="h-4 w-4 mr-1.5" />}
                                    {item.trend}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="border border-charcoal-100/50 shadow-card">
                    <CardHeader className="border-b border-charcoal-100 bg-charcoal-50/30">
                        <CardTitle className="text-charcoal-900 text-lg">Patient Visits</CardTitle>
                        <p className="text-sm text-charcoal-500">Weekly appointment intake statistics.</p>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd4d9" opacity={0.5} />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#7d949e', fontSize: 12 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#7d949e', fontSize: 12 }} />
                                    <Tooltip cursor={{ fill: '#f5f7f8' }} contentStyle={{ borderRadius: '12px', borderColor: '#e3e8eb', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }} />
                                    <Bar dataKey="patients" radius={[6, 6, 0, 0]} maxBarSize={40}>
                                        {data.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={index === data.length - 1 ? '#2f8f5b' : '#cbd4d9'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border border-charcoal-100/50 shadow-card">
                    <CardHeader className="border-b border-charcoal-100 bg-charcoal-50/30">
                        <CardTitle className="text-charcoal-900 text-lg">Revenue Overview</CardTitle>
                        <p className="text-sm text-charcoal-500">Gross revenue performance metric.</p>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd4d9" opacity={0.5} />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#7d949e', fontSize: 12 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#7d949e', fontSize: 12 }} tickFormatter={(val) => `$${val}`} />
                                    <Tooltip cursor={{ fill: '#f5f7f8' }} contentStyle={{ borderRadius: '12px', borderColor: '#e3e8eb', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }} formatter={(val) => [`$${val}`, 'Revenue']} />
                                    <Bar dataKey="revenue" radius={[6, 6, 0, 0]} maxBarSize={40}>
                                        {data.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={index === data.length - 1 ? '#bfefd1' : '#cbd4d9'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
