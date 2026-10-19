import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { Plus, Search, UserPlus, Eye, Mail, Phone, Calendar, Hash, Droplet, Filter, CheckCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const Patients = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterGender, setFilterGender] = useState('All');
    const [filterStatus, setFilterStatus] = useState('All');

    // For navigation to Patient Profile
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        first_name: '', last_name: '', dob: '', gender: 'Male', blood_group: 'O+',
        contact_number: '', email: '', address: '', emergency_contact: '', nic: '', status: 'Active'
    });

    const fetchPatients = async () => {
        try {
            setLoading(true);
            const res = await api.get('/patients');
            setPatients(res.data.data);
        } catch (error) {
            toast.error('Failed to load patients');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPatients();
    }, []);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/patients', formData);
            toast.success('Patient added successfully');
            setShowForm(false);
            fetchPatients();
            setFormData({
                first_name: '', last_name: '', dob: '', gender: 'Male', blood_group: 'O+',
                contact_number: '', email: '', address: '', emergency_contact: '', nic: '', status: 'Active'
            });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add patient');
        }
    };

    const filteredPatients = patients.filter(p => {
        const matchesSearch = p.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (p.nic && p.nic.includes(searchTerm));
        const matchesGender = filterGender === 'All' ? true : p.gender === filterGender;
        // Mock status filtering: assuming 'Active' if no status provided
        const pStatus = p.status || 'Active';
        const matchesStatus = filterStatus === 'All' ? true : pStatus === filterStatus;

        return matchesSearch && matchesGender && matchesStatus;
    });

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-charcoal-900 tracking-tight">Patient Management</h1>
                    <p className="text-charcoal-500 mt-1">Directory of all registered distinct patients</p>
                </div>
                <Button
                    onClick={() => setShowForm(!showForm)}
                    className={showForm ? 'bg-charcoal-100 text-charcoal-700 hover:bg-charcoal-200' : 'bg-primary-600 text-white shadow-md shadow-primary-500/20'}
                >
                    {showForm ? (
                        'Cancel Registration'
                    ) : (
                        <>
                            <UserPlus className="-ml-1 mr-2 h-4 w-4" />
                            Add Patient
                        </>
                    )}
                </Button>
            </div>

            {showForm && (
                <Card className="border border-charcoal-100 shadow-card overflow-hidden">
                    <CardHeader className="border-b border-charcoal-100 bg-charcoal-50/50">
                        <CardTitle className="text-charcoal-900">Register New Patient</CardTitle>
                        <p className="text-sm text-charcoal-500">Enter the patient's personal and contact details.</p>
                    </CardHeader>
                    <CardContent className="pt-6 bg-white">
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-charcoal-700 mb-1.5">First Name</label>
                                <Input required type="text" name="first_name" value={formData.first_name} onChange={handleInputChange} placeholder="Enter first name" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-charcoal-700 mb-1.5">Last Name</label>
                                <Input required type="text" name="last_name" value={formData.last_name} onChange={handleInputChange} placeholder="Enter last name" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-charcoal-700 mb-1.5">Date of Birth</label>
                                <Input required type="date" name="dob" value={formData.dob} onChange={handleInputChange} icon={<Calendar size={18} />} />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-charcoal-700 mb-1.5">Gender</label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleInputChange}
                                    className="flex h-11 w-full rounded-lg border border-charcoal-200 bg-charcoal-50/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                                >
                                    <option>Male</option><option>Female</option><option>Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-charcoal-700 mb-1.5">NIC/ID Document</label>
                                <Input type="text" name="nic" value={formData.nic} onChange={handleInputChange} icon={<Hash size={18} />} placeholder="Identification number" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-charcoal-700 mb-1.5">Blood Group</label>
                                <select
                                    name="blood_group"
                                    value={formData.blood_group}
                                    onChange={handleInputChange}
                                    className="flex h-11 w-full rounded-lg border border-charcoal-200 bg-charcoal-50/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                                >
                                    <option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>AB+</option><option>AB-</option><option>O+</option><option>O-</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-charcoal-700 mb-1.5">Contact Number</label>
                                <Input required type="tel" name="contact_number" value={formData.contact_number} onChange={handleInputChange} icon={<Phone size={18} />} placeholder="+1 (555) 000-0000" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-charcoal-700 mb-1.5">Email Address</label>
                                <Input type="email" name="email" value={formData.email} onChange={handleInputChange} icon={<Mail size={18} />} placeholder="patient@example.com" />
                            </div>

                            <div className="sm:col-span-2">
                                <label className="block text-sm font-medium text-charcoal-700 mb-1.5">Home Address</label>
                                <textarea
                                    required
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    rows="3"
                                    placeholder="Enter full address..."
                                    className="flex w-full rounded-lg border border-charcoal-200 bg-charcoal-50/50 px-3 py-2 text-sm placeholder:text-charcoal-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors resize-none"
                                ></textarea>
                            </div>

                            <div className="sm:col-span-2 flex justify-end pt-4 border-t border-charcoal-100">
                                <Button type="submit" size="lg" className="w-full sm:w-auto shadow-md">
                                    Save Patient Record
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            <Card className="border border-charcoal-100/50 shadow-card">
                <div className="p-4 sm:p-5 border-b border-charcoal-100 flex flex-col lg:flex-row justify-between items-center gap-4 bg-white rounded-t-2xl">
                    <div className="w-full lg:max-w-md relative">
                        <Input
                            type="text"
                            placeholder="Search patients by name or ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            icon={<Search size={18} />}
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                        <div className="flex items-center space-x-2">
                            <Filter className="h-4 w-4 text-charcoal-400" />
                            <select
                                value={filterGender}
                                onChange={(e) => setFilterGender(e.target.value)}
                                className="h-10 rounded-lg border border-charcoal-200 bg-charcoal-50 text-sm text-charcoal-700 font-medium px-3 outline-none focus:ring-1 focus:ring-primary-500"
                            >
                                <option value="All">All Genders</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>
                        <div className="flex items-center space-x-2">
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="h-10 rounded-lg border border-charcoal-200 bg-charcoal-50 text-sm text-charcoal-700 font-medium px-3 outline-none focus:ring-1 focus:ring-primary-500"
                            >
                                <option value="All">All Statuses</option>
                                <option value="Active">Active</option>
                                <option value="Discharged">Discharged</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto bg-white rounded-b-2xl">
                    <table className="min-w-full divide-y divide-charcoal-100">
                        <thead className="bg-charcoal-50/50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-charcoal-500 uppercase tracking-wider">Patient & ID</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-charcoal-500 uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-4 text-center text-xs font-bold text-charcoal-500 uppercase tracking-wider">Vitals</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-charcoal-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-charcoal-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-charcoal-50 bg-white">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center justify-center space-y-3">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                                            <p className="text-charcoal-500 font-medium">Loading patient directory...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredPatients.length > 0 ? (
                                filteredPatients.map((patient) => (
                                    <tr key={patient.id} className="hover:bg-charcoal-50/50 transition-colors group">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-secondary-100 flex items-center justify-center text-primary-700 font-bold border border-secondary-200 shadow-sm">
                                                    {patient.first_name.charAt(0)}{patient.last_name.charAt(0)}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-bold text-charcoal-900 group-hover:text-primary-600 transition-colors">
                                                        {patient.first_name} {patient.last_name}
                                                    </div>
                                                    <div className="text-xs text-charcoal-500 mt-0.5">ID: P-{patient.id.toString().padStart(4, '0')} • {patient.nic}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-charcoal-700 font-medium flex items-center"><Phone className="h-3.5 w-3.5 mr-2 text-charcoal-400" />{patient.contact_number}</div>
                                            <div className="text-xs text-charcoal-500 mt-1 flex items-center"><Mail className="h-3.5 w-3.5 mr-2 text-charcoal-400" />{patient.email || 'No email provided'}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-col items-center justify-center gap-1.5">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-charcoal-100 text-charcoal-700 border border-charcoal-200 shadow-sm">
                                                    {patient.gender}
                                                </span>
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-danger-50 text-danger-700 border border-danger-100 shadow-sm">
                                                    <Droplet className="h-3 w-3 mr-1" /> {patient.blood_group}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border ${(patient.status || 'Active') === 'Active'
                                                        ? 'bg-success-50 text-success-700 border-success-200'
                                                        : 'bg-charcoal-100 text-charcoal-600 border-charcoal-200'
                                                    }`}>
                                                    {(patient.status || 'Active') === 'Active' ? <CheckCircle size={12} /> : <Clock size={12} />}
                                                    <span>{patient.status || 'Active'}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="border-charcoal-200 text-charcoal-700 hover:text-primary-700 hover:border-primary-200 hover:bg-primary-50 transition-all font-semibold shadow-sm"
                                                onClick={() => navigate(`/app/patients/${patient.id}`)}
                                            >
                                                <Eye className="h-4 w-4 mr-2" />
                                                View Profile
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center justify-center text-charcoal-400 space-y-4">
                                            <div className="h-16 w-16 bg-charcoal-50 flex items-center justify-center rounded-2xl">
                                                <Search className="h-8 w-8 text-charcoal-300" />
                                            </div>
                                            <div>
                                                <p className="text-lg font-bold text-charcoal-900">No patients found</p>
                                                <p className="max-w-xs mx-auto text-sm mt-1">We couldn't find any patient matching your current search criteria.</p>
                                            </div>
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

export default Patients;
