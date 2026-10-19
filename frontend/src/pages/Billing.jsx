import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Receipt, DollarSign, Search, CreditCard, Clock, CheckCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const Billing = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const invoices = [
        { id: 'INV-1001', ptName: 'Alice Freeman', date: '2026-10-02', amt: 150.00, status: 'Paid' },
        { id: 'INV-1002', ptName: 'Bob Vance', date: '2026-10-01', amt: 450.00, status: 'Pending' },
        { id: 'INV-1003', ptName: 'Charles Miner', date: '2026-09-30', amt: 2100.00, status: 'Overdue' },
    ];

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Paid': return 'bg-success-50 text-success-700 border-success-200';
            case 'Pending': return 'bg-charcoal-100 text-charcoal-700 border-charcoal-200';
            case 'Overdue': return 'bg-danger-50 text-danger-700 border-danger-200';
            default: return 'bg-charcoal-50 text-charcoal-500 border-charcoal-200';
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-charcoal-900 tracking-tight">Billing & Payments</h1>
                    <p className="text-charcoal-500 mt-1">Manage patient invoices and revenue streams</p>
                </div>
                <Button className="bg-primary-600 text-white shadow-md shadow-primary-500/20">
                    <Receipt className="mr-2 h-4 w-4" />
                    Create Invoice
                </Button>
            </div>

            {/* Financial Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border border-success-200 bg-success-50/50 shadow-sm relative overflow-hidden">
                    <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-success-100 to-transparent pointer-events-none"></div>
                    <CardContent className="p-6">
                        <div className="flex items-center space-x-4 mb-2">
                            <div className="p-3 bg-success-100 rounded-xl text-success-600 border border-success-200">
                                <DollarSign size={24} />
                            </div>
                            <p className="text-sm font-bold text-success-800 uppercase tracking-widest">Total Revenue</p>
                        </div>
                        <h3 className="text-4xl font-black text-success-900 tracking-tight pl-16">$124,500.00</h3>
                    </CardContent>
                </Card>

                <Card className="border border-charcoal-200 bg-charcoal-50/50 shadow-sm relative overflow-hidden">
                    <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-charcoal-100 to-transparent pointer-events-none"></div>
                    <CardContent className="p-6">
                        <div className="flex items-center space-x-4 mb-2">
                            <div className="p-3 bg-charcoal-100 rounded-xl text-charcoal-600 border border-charcoal-200">
                                <Clock size={24} />
                            </div>
                            <p className="text-sm font-bold text-charcoal-700 uppercase tracking-widest">Pending Payments</p>
                        </div>
                        <h3 className="text-4xl font-black text-charcoal-900 tracking-tight pl-16">$14,230.00</h3>
                    </CardContent>
                </Card>

                <Card className="border border-danger-200 bg-danger-50/50 shadow-sm relative overflow-hidden">
                    <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-danger-100 to-transparent pointer-events-none"></div>
                    <CardContent className="p-6">
                        <div className="flex items-center space-x-4 mb-2">
                            <div className="p-3 bg-danger-100 rounded-xl text-danger-600 border border-danger-200">
                                <CreditCard size={24} />
                            </div>
                            <p className="text-sm font-bold text-danger-800 uppercase tracking-widest">Overdue</p>
                        </div>
                        <h3 className="text-4xl font-black text-danger-900 tracking-tight pl-16">$3,450.00</h3>
                    </CardContent>
                </Card>
            </div>

            <Card className="border border-charcoal-100 shadow-card bg-white mt-6">
                <div className="p-4 sm:p-5 border-b border-charcoal-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-charcoal-50/50 rounded-t-2xl">
                    <div className="w-full md:max-w-md relative">
                        <Input
                            type="text"
                            placeholder="Search invoices by patient or ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            icon={<Search size={18} />}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto rounded-b-2xl">
                    <table className="min-w-full divide-y divide-charcoal-100">
                        <thead className="bg-charcoal-50/50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-charcoal-500 uppercase tracking-wider">Invoice ID</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-charcoal-500 uppercase tracking-wider">Patient Name</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-charcoal-500 uppercase tracking-wider">Billing Date</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-charcoal-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-charcoal-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-charcoal-500 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-charcoal-50 bg-white">
                            {invoices.filter(i => i.ptName.toLowerCase().includes(searchTerm.toLowerCase())).map(inv => (
                                <tr key={inv.id} className="hover:bg-charcoal-50/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-charcoal-900">{inv.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-primary-700">{inv.ptName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-charcoal-600 font-medium">{inv.date}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-charcoal-900">${inv.amt.toFixed(2)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded border text-xs font-bold shadow-sm ${getStatusStyle(inv.status)}`}>
                                            {inv.status === 'Paid' && <CheckCircle className="w-3.5 h-3.5 mr-1" />}
                                            {inv.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                        <Button size="sm" variant="outline" className="border-charcoal-200 text-charcoal-700 hover:text-primary-700 hover:border-primary-200 hover:bg-primary-50">
                                            View Details
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

export default Billing;
