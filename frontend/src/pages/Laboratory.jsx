import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Beaker, FlaskConical, Filter, Clock, CheckCircle, Search, FileText } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const Laboratory = () => {
    const [searchTerm, setSearchTerm] = useState('');

    // Mock Lab Requests
    const labRequests = [
        { id: 'LAB-001', ptName: 'Alice Freeman', test: 'Complete Blood Count', doc: 'Dr. Sarah Jenkins', status: 'Pending', date: '2026-10-02' },
        { id: 'LAB-002', ptName: 'Bob Vance', test: 'Lipid Panel', doc: 'Dr. Michael Chen', status: 'Completed', date: '2026-10-01' },
        { id: 'LAB-003', ptName: 'Charles Miner', test: 'Liver Function', doc: 'Dr. Emily Stanton', status: 'In Process', date: '2026-10-02' },
        { id: 'LAB-004', ptName: 'David Wallace', test: 'Thyroid Panel', doc: 'Dr. Sarah Jenkins', status: 'Pending', date: '2026-10-02' },
    ];

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Completed': return 'bg-success-50 text-success-700 border-success-200';
            case 'In Process': return 'bg-primary-50 text-primary-700 border-primary-200';
            default: return 'bg-charcoal-100 text-charcoal-700 border-charcoal-200'; // Pending
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-charcoal-900 tracking-tight">Laboratory</h1>
                    <p className="text-charcoal-500 mt-1">Manage test requests and diagnostic results</p>
                </div>
                <Button className="bg-primary-600 text-white shadow-md shadow-primary-500/20">
                    <FlaskConical className="mr-2 h-4 w-4" />
                    New Test Request
                </Button>
            </div>

            {/* Top Stat Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { title: 'Pending Tests', count: 12, icon: Clock, color: 'charcoal' },
                    { title: 'In Process', count: 5, icon: Beaker, color: 'primary' },
                    { title: 'Completed Today', count: 24, icon: CheckCircle, color: 'success' },
                    { title: 'Critical Flags', count: 2, icon: FileText, color: 'danger' },
                ].map((stat, idx) => (
                    <Card key={idx} className={`border shadow-sm border-${stat.color}-200 bg-${stat.color}-50/30`}>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`h-10 w-10 rounded-lg flex items-center justify-center bg-${stat.color}-100 border border-${stat.color}-200 text-${stat.color}-600`}>
                                    <stat.icon size={20} />
                                </div>
                            </div>
                            <div>
                                <h3 className={`text-3xl font-black text-${stat.color}-900`}>{stat.count}</h3>
                                <p className={`text-sm font-semibold uppercase tracking-wider text-${stat.color}-700 mt-1`}>{stat.title}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Main Lab Requests Table */}
            <Card className="border border-charcoal-100 shadow-card bg-white mt-6">
                <div className="p-4 sm:p-5 border-b border-charcoal-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-charcoal-50/50 rounded-t-2xl">
                    <div className="w-full md:max-w-md relative">
                        <Input
                            type="text"
                            placeholder="Search tests by Patient or ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            icon={<Search size={18} />}
                        />
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <Button variant="outline" className="border-charcoal-200 text-charcoal-700 bg-white">
                            <Filter className="h-4 w-4 mr-2" /> Categories
                        </Button>
                    </div>
                </div>

                <div className="overflow-x-auto rounded-b-2xl">
                    <table className="min-w-full divide-y divide-charcoal-100">
                        <thead className="bg-charcoal-50/50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-charcoal-500 uppercase tracking-wider">Request ID</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-charcoal-500 uppercase tracking-wider">Patient Name</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-charcoal-500 uppercase tracking-wider">Test Ordered</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-charcoal-500 uppercase tracking-wider">Referring Doctor</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-charcoal-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-charcoal-500 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-charcoal-50 bg-white">
                            {labRequests.filter(r => r.ptName.toLowerCase().includes(searchTerm.toLowerCase())).map(req => (
                                <tr key={req.id} className="hover:bg-charcoal-50/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-charcoal-900">{req.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-bold text-charcoal-900">{req.ptName}</div>
                                        <div className="text-xs text-charcoal-500 mt-0.5">{req.date}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-primary-700">{req.test}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-charcoal-600">{req.doc}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded border text-xs font-bold shadow-sm ${getStatusStyle(req.status)}`}>
                                            {req.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                        <Button size="sm" variant="outline" className="border-charcoal-200 text-primary-700 hover:bg-primary-50">
                                            {req.status === 'Completed' ? 'View Results' : 'Update Status'}
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default Laboratory;
