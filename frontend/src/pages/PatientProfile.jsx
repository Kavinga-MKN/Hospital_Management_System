import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import {
    ArrowLeft, User, Phone, Mail, MapPin, Droplet, Hash,
    Calendar, CheckCircle, Clock, Activity, FileText, Beaker, Receipt
} from 'lucide-react';
import toast from 'react-hot-toast';

import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';

const PatientProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('Overview');

    const tabs = ['Overview', 'Appointments', 'Medical Records', 'Lab Results', 'Billing'];

    useEffect(() => {
        const fetchPatient = async () => {
            try {
                setLoading(true);
                // Mock endpoint or use generic fetch for single patient
                // Since api.get(`/patients/${id}`) might not exist yet, we'll try to fetch all and filter
                const res = await api.get('/patients');
                const found = res.data.data.find(p => p.id.toString() === id);
                if (found) {
                    setPatient(found);
                } else {
                    toast.error('Patient not found');
                    navigate('/app/patients');
                }
            } catch (error) {
                toast.error('Failed to load patient profile');
                navigate('/app/patients');
            } finally {
                setLoading(false);
            }
        };
        fetchPatient();
    }, [id, navigate]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500"></div>
                <p className="text-charcoal-500 font-medium">Loading patient profile...</p>
            </div>
        );
    }

    if (!patient) return null;

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header & Back Action */}
            <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm" onClick={() => navigate('/app/patients')} className="border-charcoal-200 text-charcoal-600 hover:bg-charcoal-50 p-2">
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-charcoal-900 tracking-tight">Patient Profile</h1>
                    <p className="text-sm text-charcoal-500 mt-0.5">ID: P-{patient.id.toString().padStart(4, '0')} • Registered on {new Date(patient.created_at).toLocaleDateString()}</p>
                </div>
            </div>

            {/* Profile Hero Card */}
            <Card className="border-none shadow-card bg-charcoal-900 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

                <CardContent className="p-8 relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
                    {/* Avatar */}
                    <div className="w-28 h-28 shrink-0 rounded-2xl bg-gradient-to-br from-primary-400 to-secondary-500 p-1 shadow-xl">
                        <div className="w-full h-full bg-charcoal-900 rounded-xl flex items-center justify-center text-4xl font-bold text-white">
                            {patient.first_name.charAt(0)}{patient.last_name.charAt(0)}
                        </div>
                    </div>

                    {/* Basic Info */}
                    <div className="flex-1 text-center md:text-left space-y-4">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight">{patient.first_name} {patient.last_name}</h2>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-2">
                                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-primary-500/20 text-primary-300 border border-primary-500/30">
                                    <User size={14} className="mr-1.5" />
                                    {patient.gender} • {new Date().getFullYear() - new Date(patient.dob).getFullYear()} yrs
                                </span>
                                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                                    <Droplet size={14} className="mr-1.5" />
                                    Blood Type {patient.blood_group}
                                </span>
                                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-charcoal-700 text-charcoal-200 border border-charcoal-600">
                                    <Hash size={14} className="mr-1.5" />
                                    {patient.nic}
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-8 text-sm text-charcoal-300">
                            <div className="flex items-center justify-center md:justify-start">
                                <Phone size={14} className="mr-2 text-primary-400 shrink-0" />
                                <span>{patient.contact_number}</span>
                            </div>
                            <div className="flex items-center justify-center md:justify-start">
                                <Mail size={14} className="mr-2 text-primary-400 shrink-0" />
                                <span>{patient.email || 'No email provided'}</span>
                            </div>
                            <div className="flex items-start justify-center md:justify-start sm:col-span-2">
                                <MapPin size={14} className="mr-2 text-primary-400 shrink-0 mt-0.5" />
                                <span>{patient.address || 'No address on file'}</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Content Tabs */}
            <div className="flex space-x-1 p-1 bg-charcoal-100/50 rounded-xl overflow-x-auto">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 whitespace-nowrap min-w-max px-4 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${activeTab === tab
                                ? 'bg-white text-primary-700 shadow-sm border border-charcoal-200'
                                : 'text-charcoal-500 hover:text-charcoal-700 hover:bg-charcoal-100'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Tab Views */}
            <div className="min-h-[400px]">
                {/* OVERVIEW TAB */}
                {activeTab === 'Overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in zoom-in-[0.98] duration-300">
                        <Card className="lg:col-span-2 border-charcoal-100 shadow-card">
                            <CardHeader className="border-b border-charcoal-100/50 bg-charcoal-50/30">
                                <CardTitle className="text-charcoal-900 flex items-center">
                                    <Activity className="h-5 w-5 mr-2 text-primary-600" />
                                    Recent Activity
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="space-y-6">
                                    {/* Mock Timeline item */}
                                    <div className="relative pl-6 border-l-2 border-charcoal-100 pb-2">
                                        <div className="absolute top-0 left-[-9px] h-4 w-4 rounded-full bg-primary-100 border-2 border-primary-500 shadow-sm"></div>
                                        <p className="text-sm text-charcoal-500 font-medium mb-1">Today, 10:30 AM</p>
                                        <h4 className="text-charcoal-900 font-semibold mb-1">General Checkup Appointment</h4>
                                        <p className="text-sm text-charcoal-600">Consultation with Dr. Sarah Jenkins completed.</p>
                                    </div>
                                    <div className="relative pl-6 border-l-2 border-charcoal-100 pb-2">
                                        <div className="absolute top-0 left-[-9px] h-4 w-4 rounded-full bg-charcoal-50 border-2 border-charcoal-300"></div>
                                        <p className="text-sm text-charcoal-500 font-medium mb-1">Oct 12, 2026</p>
                                        <h4 className="text-charcoal-900 font-semibold mb-1">Lab Results Uploaded</h4>
                                        <p className="text-sm text-charcoal-600">Complete Blood Count (CBC) results available.</p>
                                    </div>
                                    <div className="relative pl-6">
                                        <div className="absolute top-0 left-[-9px] h-4 w-4 rounded-full bg-charcoal-50 border-2 border-charcoal-300"></div>
                                        <p className="text-sm text-charcoal-500 font-medium mb-1">Sep 01, 2026</p>
                                        <h4 className="text-charcoal-900 font-semibold mb-1">Patient Registered</h4>
                                        <p className="text-sm text-charcoal-600">Profile successfully created in CareSync.</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-charcoal-100 shadow-card">
                            <CardHeader className="border-b border-charcoal-100/50 bg-charcoal-50/30">
                                <CardTitle className="text-charcoal-900 flex items-center">
                                    <FileText className="h-5 w-5 mr-2 text-primary-600" />
                                    Vital Signs
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center bg-charcoal-50 p-3 rounded-xl border border-charcoal-100 text-sm">
                                        <span className="font-medium text-charcoal-600">Heart Rate</span>
                                        <span className="font-bold text-charcoal-900">72 bpm</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-charcoal-50 p-3 rounded-xl border border-charcoal-100 text-sm">
                                        <span className="font-medium text-charcoal-600">Blood Pressure</span>
                                        <span className="font-bold text-charcoal-900">120/80</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-charcoal-50 p-3 rounded-xl border border-charcoal-100 text-sm">
                                        <span className="font-medium text-charcoal-600">Temperature</span>
                                        <span className="font-bold text-charcoal-900">98.6 °F</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-primary-50 p-3 rounded-xl border border-primary-100 text-sm">
                                        <span className="font-medium text-primary-700">Weight</span>
                                        <span className="font-bold text-primary-900">165 lbs</span>
                                    </div>
                                </div>
                                <p className="text-xs text-charcoal-400 mt-4 text-center">Last updated: Today, 10:30 AM</p>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* OTHER TABS - Placeholder specifically utilizing Charcoal/Mint empty states */}
                {activeTab !== 'Overview' && (
                    <Card className="border-charcoal-100 shadow-card animate-in fade-in duration-300">
                        <CardContent className="h-[400px] flex flex-col items-center justify-center text-center p-8">
                            <div className="h-20 w-20 bg-charcoal-50 border border-charcoal-100 rounded-3xl flex items-center justify-center mb-6 shadow-sm">
                                {activeTab === 'Appointments' && <Calendar className="h-10 w-10 text-charcoal-300" />}
                                {activeTab === 'Medical Records' && <FileText className="h-10 w-10 text-charcoal-300" />}
                                {activeTab === 'Lab Results' && <Beaker className="h-10 w-10 text-charcoal-300" />}
                                {activeTab === 'Billing' && <Receipt className="h-10 w-10 text-charcoal-300" />}
                            </div>
                            <h3 className="text-xl font-bold text-charcoal-900 mb-2">No {activeTab.toLowerCase()} found</h3>
                            <p className="text-charcoal-500 max-w-sm mb-6">
                                We couldn't find any data attached to this patient for {activeTab}. Records will populate here once they are created.
                            </p>
                            <Button className="bg-white border-2 border-primary-500 text-primary-700 hover:bg-primary-50">
                                Create New Record
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>

        </div>
    );
};

export default PatientProfile;
