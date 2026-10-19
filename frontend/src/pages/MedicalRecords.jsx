import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { FileText, Search, Activity, Heart, Thermometer, Filter, Download } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const MedicalRecords = () => {
    const [searchTerm, setSearchTerm] = useState('');

    // Mock records data
    const records = [
        { id: 'REC-001', ptName: 'Alice Freeman', type: 'General Checkup', date: '2026-10-02', doc: 'Dr. Sarah Jenkins', desc: 'Patient reports mild fatigue. Vitals normal.' },
        { id: 'REC-002', ptName: 'Bob Vance', type: 'Cardiology', date: '2026-09-28', doc: 'Dr. Michael Chen', desc: 'ECG clear. Blood pressure elevated (135/85).' },
        { id: 'REC-003', ptName: 'Charles Miner', type: 'Orthopedics', date: '2026-09-15', doc: 'Dr. Emily Stanton', desc: 'X-Ray of left ankle. Sprain confirmed. Rest prescribed.' },
    ];

    const filteredRecords = records.filter(r => r.ptName.toLowerCase().includes(searchTerm.toLowerCase()) || r.id.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="space-y-6 animate-in fade-in duration-500 max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-charcoal-900 tracking-tight">Medical Records</h1>
                    <p className="text-charcoal-500 mt-1">Cross-department patient clinical history logs</p>
                </div>
                <Button className="bg-primary-600 text-white shadow-md shadow-primary-500/20">
                    Create New Record
                </Button>
            </div>

            {/* Quick Stats/Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border border-charcoal-100 shadow-sm">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold text-charcoal-500 uppercase">Total Records</p>
                            <h3 className="text-3xl font-black text-charcoal-900 mt-1">1,248</h3>
                        </div>
                        <div className="h-12 w-12 rounded-xl bg-charcoal-50 flex items-center justify-center border border-charcoal-100">
                            <FileText className="h-6 w-6 text-charcoal-400" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="border border-primary-200 shadow-sm bg-primary-50/30">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold text-primary-700 uppercase">Added This Month</p>
                            <h3 className="text-3xl font-black text-primary-900 mt-1">112</h3>
                        </div>
                        <div className="h-12 w-12 rounded-xl bg-primary-100 flex items-center justify-center border border-primary-200">
                            <Activity className="h-6 w-6 text-primary-600" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="border border-secondary-200 shadow-sm bg-secondary-50/50">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold text-secondary-800 uppercase">Records Reviewed</p>
                            <h3 className="text-3xl font-black text-secondary-900 mt-1">84%</h3>
                        </div>
                        <div className="h-12 w-12 rounded-xl bg-secondary-100 flex items-center justify-center border border-secondary-200">
                            <Heart className="h-6 w-6 text-secondary-700" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="border border-charcoal-100/50 shadow-card bg-white mt-6">
                <div className="p-4 sm:p-5 border-b border-charcoal-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-charcoal-50/30 rounded-t-2xl">
                    <div className="w-full md:max-w-md relative">
                        <Input
                            type="text"
                            placeholder="Search records by patient or ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            icon={<Search size={18} />}
                        />
                    </div>
                    <Button variant="outline" className="border-charcoal-200 text-charcoal-700 bg-white shadow-sm w-full md:w-auto">
                        <Filter className="h-4 w-4 mr-2" /> Filter Log
                    </Button>
                </div>

                {/* Timeline / List View */}
                <CardContent className="p-6">
                    <div className="relative border-l-2 border-charcoal-100 ml-3 space-y-10 py-4">
                        {filteredRecords.map((record) => (
                            <div key={record.id} className="relative pl-8 group">
                                <span className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-primary-50 border-2 border-primary-500 shadow-sm group-hover:bg-primary-500 transition-colors"></span>
                                <div className="bg-white border border-charcoal-100 p-5 rounded-2xl shadow-sm group-hover:shadow-md transition-shadow">
                                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="text-sm font-bold text-primary-600">{record.date}</span>
                                                <span className="text-xs font-bold bg-charcoal-100 text-charcoal-700 px-2 py-0.5 rounded uppercase tracking-wider">{record.id}</span>
                                            </div>
                                            <h3 className="text-lg font-bold text-charcoal-900">{record.type}</h3>
                                            <p className="text-sm text-charcoal-500 mb-4">{record.desc}</p>

                                            <div className="flex items-center gap-4 text-sm font-medium text-charcoal-700">
                                                <div className="flex items-center bg-charcoal-50 px-3 py-1.5 rounded-lg border border-charcoal-100">
                                                    <span className="text-charcoal-400 mr-2">Patient:</span> {record.ptName}
                                                </div>
                                                <div className="flex items-center bg-charcoal-50 px-3 py-1.5 rounded-lg border border-charcoal-100">
                                                    <span className="text-charcoal-400 mr-2">Doctor:</span> {record.doc}
                                                </div>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="sm" className="shrink-0 text-charcoal-500 hover:text-primary-700 hover:bg-primary-50">
                                            <Download className="h-4 w-4 mr-2" />
                                            Export
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

        </div>
    );
};

export default MedicalRecords;
