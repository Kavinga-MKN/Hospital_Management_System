import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { Pill, Plus, AlertTriangle, CheckCircle, Package } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';

const Pharmacy = () => {
    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchMedicines = async () => {
        try {
            setLoading(true);
            const res = await api.get('/pharmacy/medicines');
            setMedicines(res.data.data);
        } catch (error) {
            toast.error('Failed to load medicines');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMedicines();
    }, []);

    const getStockStatus = (quantity, reorderLevel) => {
        if (quantity <= 0) return { label: 'Out of Stock', color: 'bg-rose-50 text-rose-700 ring-rose-600/20 text-rose-600' };
        if (quantity <= reorderLevel) return { label: 'Low Stock', color: 'bg-amber-50 text-amber-700 ring-amber-600/20 text-amber-600' };
        return { label: 'In Stock', color: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20 text-emerald-600' };
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Pharmacy Inventory</h1>
                    <p className="text-slate-500 mt-1">Manage medicine stock, categories, and expiry dates.</p>
                </div>
                <Button variant="primary">
                    <Plus className="-ml-1 mr-2 h-4 w-4" />
                    Add Medicine
                </Button>
            </div>

            <Card className="border-none ring-1 ring-slate-200">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100 flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">Current Stock Levels</CardTitle>
                    <div className="flex space-x-2 text-sm text-slate-500">
                        <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5"></span> Optimal</span>
                        <span className="flex items-center ml-3"><span className="w-2 h-2 rounded-full bg-amber-500 mr-1.5"></span> Reorder</span>
                    </div>
                </CardHeader>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-white">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Medicine Name</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Batch & Expiry</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Stock Level</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                                        <div className="flex flex-col items-center justify-center space-y-2">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                                            <p>Loading inventory...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : medicines.length > 0 ? (
                                medicines.map(med => {
                                    const status = getStockStatus(med.quantity, med.reorder_level);
                                    return (
                                        <tr key={med.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className={`p-2 rounded-lg mr-3 ${status.quantity <= med.reorder_level ? 'bg-rose-50 text-rose-600' : 'bg-primary-50 text-primary-600'}`}>
                                                        <Pill className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-semibold text-slate-900">{med.name}</div>
                                                        <div className="text-xs text-slate-500 mt-0.5">ID: {med.id}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700">
                                                    {med.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-slate-900 font-medium">#{med.batch_number}</div>
                                                <div className="text-xs text-slate-500 mt-0.5">Exp: {new Date(med.expiry_date).toLocaleDateString()}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <span className="text-lg font-semibold text-slate-900 mr-2">{med.quantity}</span>
                                                    <span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ring-1 ${status.color}`}>
                                                        {status.label}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <Button variant="ghost" size="sm" className="text-primary-600">
                                                    Update
                                                </Button>
                                            </td>
                                        </tr>
                                    )
                                })
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center justify-center text-slate-500 space-y-3">
                                            <Package className="h-10 w-10 text-slate-300" />
                                            <p className="text-lg font-medium text-slate-900">Inventory Empty</p>
                                            <p className="max-w-xs text-sm">There are no medicines currently recorded in the system.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default Pharmacy;
