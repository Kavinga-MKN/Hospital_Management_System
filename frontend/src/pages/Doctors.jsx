import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Phone, Mail, Stethoscope, ChevronRight, Activity, MapPin, Filter, Search } from 'lucide-react';
import Button from '../components/ui/Button';

const Doctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterSpec, setFilterSpec] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [docRes, deptRes] = await Promise.all([
                    api.get('/doctors'),
                    api.get('/departments')
                ]);
                setDoctors(docRes.data.data);
                setDepartments(deptRes.data.data);
            } catch (error) {
                toast.error('Failed to load doctors data');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Mock availability for UI purposes
    const getAvailability = (id) => {
        const availabilities = ['Available', 'Busy', 'Unavailable'];
        return availabilities[id % 3];
    };

    const getAvailabilityBadge = (status) => {
        switch (status) {
            case 'Available': return 'bg-primary-50 text-primary-700 border-primary-200';
            case 'Busy': return 'bg-amber-50 text-amber-700 border-amber-200';
            case 'Unavailable': return 'bg-charcoal-100 text-charcoal-600 border-charcoal-200';
            default: return 'bg-charcoal-50 text-charcoal-700 border-charcoal-200';
        }
    };

    const specializations = ['All', ...new Set(doctors.map(d => d.specialization))];

    const filteredDoctors = doctors.filter(d => {
        const matchesSpec = filterSpec === 'All' ? true : d.specialization === filterSpec;
        const matchesSearch = d.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            d.last_name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSpec && matchesSearch;
    });

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-charcoal-900 tracking-tight">Doctors Directory</h1>
                    <p className="text-charcoal-500 mt-1">Manage medical staff and departmental structures</p>
                </div>
            </div>

            {/* Navigation & Filters */}
            <Card className="border border-charcoal-100/50 shadow-sm bg-white p-4">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="w-full sm:max-w-md relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-charcoal-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search doctors by name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 h-10 w-full rounded-lg border border-charcoal-200 bg-charcoal-50/50 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
                        />
                    </div>

                    <div className="flex items-center w-full sm:w-auto space-x-2">
                        <Filter className="h-4 w-4 text-charcoal-400" />
                        <select
                            value={filterSpec}
                            onChange={e => setFilterSpec(e.target.value)}
                            className="h-10 w-full sm:w-auto rounded-lg border border-charcoal-200 bg-charcoal-50/50 px-3 py-2 text-sm text-charcoal-700 font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
                        >
                            {specializations.map(spec => (
                                <option key={spec} value={spec}>{spec}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </Card>

            {/* Doctors Grid */}
            <div className="space-y-4">
                {loading ? (
                    <div className="flex justify-center p-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                    </div>
                ) : filteredDoctors.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredDoctors.map(doctor => {
                            const status = getAvailability(doctor.id);
                            return (
                                <Card key={doctor.id} className="border border-charcoal-100 hover:shadow-card hover:border-primary-200 transition-all duration-300 group overflow-hidden bg-white">
                                    <div className="h-1 bg-gradient-to-r from-primary-400 to-secondary-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <CardContent className="p-6">
                                        <div className="flex justify-between items-start mb-5">
                                            <div className="flex items-center">
                                                <div className="h-14 w-14 rounded-2xl bg-secondary-100 flex items-center justify-center text-primary-700 font-bold text-xl shadow-sm border border-secondary-200">
                                                    {doctor.first_name.charAt(0)}{doctor.last_name.charAt(0)}
                                                </div>
                                                <div className="ml-4">
                                                    <h3 className="text-base font-bold text-charcoal-900 group-hover:text-primary-600 transition-colors">Dr. {doctor.first_name} {doctor.last_name}</h3>
                                                    <p className="text-sm font-semibold text-primary-600/80">{doctor.specialization}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2.5 mb-6">
                                            <div className="flex items-center text-sm font-medium text-charcoal-600">
                                                <div className="w-7 h-7 rounded-lg bg-charcoal-50 flex items-center justify-center mr-3 border border-charcoal-100">
                                                    <Stethoscope className="h-3.5 w-3.5 text-charcoal-500" />
                                                </div>
                                                {doctor.department_name}
                                            </div>
                                            <div className="flex items-center text-sm font-medium text-charcoal-600">
                                                <div className="w-7 h-7 rounded-lg bg-charcoal-50 flex items-center justify-center mr-3 border border-charcoal-100">
                                                    <Phone className="h-3.5 w-3.5 text-charcoal-500" />
                                                </div>
                                                {doctor.phone}
                                            </div>
                                            <div className="flex justify-between items-center text-sm font-medium text-charcoal-600">
                                                <div className="flex items-center">
                                                    <div className="w-7 h-7 rounded-lg bg-charcoal-50 flex items-center justify-center mr-3 border border-charcoal-100">
                                                        <Activity className="h-3.5 w-3.5 text-charcoal-500" />
                                                    </div>
                                                    Consultation
                                                </div>
                                                <span className="font-bold text-charcoal-900">${doctor.consultation_fee}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-4 border-t border-charcoal-100">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-md border text-xs font-bold ${getAvailabilityBadge(status)} shadow-sm`}>
                                                <span className={`h-1.5 w-1.5 rounded-full mr-1.5 ${status === 'Available' ? 'bg-primary-500' : status === 'Busy' ? 'bg-amber-500' : 'bg-charcoal-400'}`}></span>
                                                {status}
                                            </span>
                                            <Button variant="ghost" size="sm" className="text-primary-600 hover:text-primary-700 hover:bg-primary-50 font-semibold">
                                                View Profile
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                ) : (
                    <Card className="border border-charcoal-100 shadow-sm">
                        <CardContent className="p-16 flex flex-col items-center justify-center text-center">
                            <div className="h-16 w-16 bg-charcoal-50 rounded-2xl flex items-center justify-center mb-4 border border-charcoal-100">
                                <Stethoscope className="h-8 w-8 text-charcoal-300" />
                            </div>
                            <h3 className="text-lg font-bold text-charcoal-900">No Doctors Found</h3>
                            <p className="text-charcoal-500 max-w-sm mt-1">There are no doctors matching your current search or filter criteria.</p>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Departments */}
            <div className="space-y-4 pt-4">
                <h2 className="text-xl font-bold text-charcoal-900">Hospital Departments</h2>
                <Card className="border border-charcoal-100 overflow-hidden shadow-card bg-white">
                    <ul className="divide-y divide-charcoal-50">
                        {departments.map(dept => (
                            <li key={dept.id} className="p-4 sm:p-5 hover:bg-charcoal-50/50 transition-colors group cursor-pointer lg:flex justify-between items-center">
                                <div className="flex items-start">
                                    <div className="bg-secondary-100 border border-secondary-200 p-2.5 rounded-xl text-primary-600 mr-4 shadow-sm group-hover:bg-primary-50 transition-colors">
                                        <MapPin className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-charcoal-900 group-hover:text-primary-600 transition-colors">{dept.name}</h3>
                                        <p className="text-sm text-charcoal-500 mt-0.5">{dept.description}</p>
                                    </div>
                                </div>
                                <div className="hidden lg:block text-charcoal-300 group-hover:text-primary-600 transition-colors">
                                    <ChevronRight className="h-5 w-5" />
                                </div>
                            </li>
                        ))}
                        {departments.length === 0 && !loading && (
                            <li className="p-8 text-center text-charcoal-500 font-medium bg-charcoal-50/30">No departments configured yet</li>
                        )}
                    </ul>
                </Card>
            </div>
        </div>
    );
};

export default Doctors;
