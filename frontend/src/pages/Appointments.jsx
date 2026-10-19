import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { Plus, Check, X, Clock, Calendar as CalendarIcon, User, UserPlus, Stethoscope, ChevronRight, Activity } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const Appointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    const [formData, setFormData] = useState({
        patient_id: '', doctor_id: '', appointment_date: '', appointment_time: '', reason: ''
    });

    const fetchData = async () => {
        try {
            setLoading(true);
            const [aptRes, patRes, docRes] = await Promise.all([
                api.get('/appointments'),
                api.get('/patients'),
                api.get('/doctors')
            ]);
            setAppointments(aptRes.data.data);
            setPatients(patRes.data.data);
            setDoctors(docRes.data.data);

            if (patRes.data.data.length > 0) setFormData(f => ({ ...f, patient_id: patRes.data.data[0].id }));
            if (docRes.data.data.length > 0) setFormData(f => ({ ...f, doctor_id: docRes.data.data[0].id }));
        } catch (error) {
            toast.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/appointments', formData);
            toast.success('Appointment booked successfully');
            setShowForm(false);
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to book appointment');
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await api.patch(`/appointments/${id}/status`, { status });
            toast.success(`Appointment ${status.toLowerCase()}`);
            fetchData();
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Confirmed': return 'bg-primary-50 text-primary-700 border-primary-200';
            case 'Completed': return 'bg-success-50 text-success-700 border-success-200';
            case 'Cancelled': return 'bg-danger-50 text-danger-700 border-danger-200';
            default: return 'bg-charcoal-100 text-charcoal-700 border-charcoal-200'; // Pending
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Confirmed': return <Check className="h-3.5 w-3.5 mr-1.5" />;
            case 'Completed': return <Check className="h-3.5 w-3.5 mr-1.5" />; // Double check could go here
            case 'Cancelled': return <X className="h-3.5 w-3.5 mr-1.5" />;
            default: return <Clock className="h-3.5 w-3.5 mr-1.5" />;
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-charcoal-900 tracking-tight">Appointments</h1>
                    <p className="text-charcoal-500 mt-1">Schedule and manage patient consultations</p>
                </div>
                <Button
                    onClick={() => setShowForm(!showForm)}
                    className={showForm ? 'bg-charcoal-100 text-charcoal-700 hover:bg-charcoal-200' : 'bg-primary-600 text-white shadow-md shadow-primary-500/20'}
                >
                    {showForm ? 'Cancel Booking' : <><Plus className="-ml-1 mr-2 h-4 w-4" /> Book Appointment</>}
                </Button>
            </div>

            {showForm && (
                <Card className="border border-charcoal-100 shadow-card">
                    <CardHeader className="border-b border-charcoal-100 bg-charcoal-50/50">
                        <CardTitle className="text-charcoal-900">Book New Appointment</CardTitle>
                        <p className="text-sm text-charcoal-500 mt-1">Select a patient and doctor to schedule a visit.</p>
                    </CardHeader>
                    <CardContent className="pt-6 bg-white">
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-2 lg:grid-cols-3">
                            <div className="lg:col-span-1">
                                <label className="block text-sm font-medium text-charcoal-700 mb-1.5">Select Patient</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 h-4 w-4 text-charcoal-400" />
                                    <select name="patient_id" required value={formData.patient_id} onChange={e => setFormData({ ...formData, patient_id: e.target.value })} className="pl-10 flex h-11 w-full rounded-lg border border-charcoal-200 bg-charcoal-50/50 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors text-charcoal-900 font-medium">
                                        {patients.map(p => <option key={p.id} value={p.id}>{p.first_name} {p.last_name}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="lg:col-span-2">
                                <label className="block text-sm font-medium text-charcoal-700 mb-1.5">Select Doctor</label>
                                <div className="relative">
                                    <Stethoscope className="absolute left-3 top-3 h-4 w-4 text-charcoal-400" />
                                    <select name="doctor_id" required value={formData.doctor_id} onChange={e => setFormData({ ...formData, doctor_id: e.target.value })} className="pl-10 flex h-11 w-full rounded-lg border border-charcoal-200 bg-charcoal-50/50 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors text-charcoal-900 font-medium">
                                        {doctors.map(d => <option key={d.id} value={d.id}>Dr. {d.first_name} {d.last_name}  •  {d.department_name}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="border-t border-charcoal-100 pt-6 sm:col-span-2 lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-charcoal-700 mb-1.5">Date</label>
                                    <Input required type="date" name="appointment_date" value={formData.appointment_date} onChange={e => setFormData({ ...formData, appointment_date: e.target.value })} icon={<CalendarIcon size={18} />} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-charcoal-700 mb-1.5">Time</label>
                                    <Input required type="time" name="appointment_time" value={formData.appointment_time} onChange={e => setFormData({ ...formData, appointment_time: e.target.value })} icon={<Clock size={18} />} />
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-charcoal-700 mb-1.5">Reason for Visit</label>
                                    <Input required type="text" name="reason" placeholder="e.g. Regular Checkup, Fever..." value={formData.reason} onChange={e => setFormData({ ...formData, reason: e.target.value })} icon={<Activity size={18} />} />
                                </div>
                            </div>

                            <div className="sm:col-span-2 lg:col-span-3 flex justify-end pt-2">
                                <Button type="submit" size="lg" className="w-full sm:w-auto shadow-md">Confirm Booking</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            {/* Cascade List View */}
            <div className="space-y-4">
                {loading ? (
                    <div className="flex justify-center p-12 bg-white rounded-2xl border border-charcoal-100 shadow-sm">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                    </div>
                ) : appointments.length > 0 ? (
                    appointments.map(apt => (
                        <Card key={apt.id} className="border border-charcoal-100 shadow-sm hover:shadow-md transition-shadow group bg-white overflow-hidden">
                            <div className="flex flex-col md:flex-row h-full">
                                {/* Left Time/Date Block */}
                                <div className="bg-charcoal-50/80 p-5 md:w-56 shrink-0 flex flex-col justify-center items-start md:items-center border-b md:border-b-0 md:border-r border-charcoal-100 group-hover:bg-primary-50/30 transition-colors">
                                    <div className="text-sm font-bold text-charcoal-500 uppercase tracking-wide mb-1 flex items-center"><CalendarIcon className="h-4 w-4 mr-2" />{new Date(apt.appointment_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                                    <div className="text-2xl font-black text-charcoal-900 tracking-tight">{apt.appointment_time.slice(0, 5)}</div>
                                    <div className="mt-4 w-full">
                                        <span className={`flex justify-center items-center w-full px-2.5 py-1.5 rounded border text-xs font-bold shadow-sm ${getStatusStyle(apt.status)}`}>
                                            {getStatusIcon(apt.status)}
                                            {apt.status}
                                        </span>
                                    </div>
                                </div>

                                {/* Right Details Block */}
                                <div className="p-5 flex-1 flex flex-col sm:flex-row justify-between items-start gap-4">
                                    {/* People */}
                                    <div className="space-y-4 flex-1">
                                        <div>
                                            <p className="text-xs font-semibold text-charcoal-400 uppercase tracking-wider mb-1">Consulting Physician</p>
                                            <div className="flex items-center group-hover:text-primary-700 transition-colors">
                                                <div className="w-8 h-8 rounded-full bg-secondary-100 border border-secondary-200 text-primary-700 flex items-center justify-center font-bold text-xs mr-3">
                                                    {apt.doctor_first?.charAt(0)}{apt.doctor_last?.charAt(0)}
                                                </div>
                                                <span className="font-bold text-charcoal-900 text-lg">Dr. {apt.doctor_first} {apt.doctor_last}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-charcoal-400 uppercase tracking-wider mb-1 flex items-center">Patient</p>
                                            <div className="flex items-center">
                                                <User className="h-4 w-4 mr-2 text-charcoal-400" />
                                                <span className="font-semibold text-charcoal-700">{apt.patient_first} {apt.patient_last}</span>
                                            </div>
                                        </div>
                                        {apt.reason && (
                                            <div className="bg-charcoal-50 p-3 rounded-lg border border-charcoal-100 text-sm text-charcoal-700 inline-block">
                                                <span className="font-semibold mr-2 text-charcoal-900">Reason:</span>
                                                {apt.reason}
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex sm:flex-col gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                                        {apt.status !== 'Completed' && apt.status !== 'Cancelled' && (
                                            <>
                                                {apt.status === 'Pending' && (
                                                    <Button
                                                        onClick={() => updateStatus(apt.id, 'Confirmed')}
                                                        variant="outline"
                                                        className="flex-1 sm:flex-none border-primary-200 text-primary-700 hover:bg-primary-50 bg-white"
                                                    >
                                                        <Check className="h-4 w-4 sm:mr-2" />
                                                        <span className="hidden sm:inline">Confirm</span>
                                                    </Button>
                                                )}
                                                <Button
                                                    onClick={() => updateStatus(apt.id, 'Completed')}
                                                    variant="outline"
                                                    className="flex-1 sm:flex-none border-success-200 text-success-700 hover:bg-success-50 bg-white"
                                                >
                                                    <Activity className="h-4 w-4 sm:mr-2" />
                                                    <span className="hidden sm:inline">Complete</span>
                                                </Button>
                                                <Button
                                                    onClick={() => updateStatus(apt.id, 'Cancelled')}
                                                    variant="outline"
                                                    className="flex-1 sm:flex-none border-danger-200 text-danger-700 hover:bg-danger-50 bg-white"
                                                >
                                                    <X className="h-4 w-4 sm:mr-2" />
                                                    <span className="hidden sm:inline">Cancel</span>
                                                </Button>
                                            </>
                                        )}
                                        {apt.status === 'Completed' && (
                                            <div className="flex items-center text-sm font-semibold text-success-600 bg-success-50 px-3 py-2 rounded-lg border border-success-100">
                                                <Check className="h-5 w-5 mr-2" /> Visit Logged
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))
                ) : (
                    <Card className="border border-charcoal-100 shadow-sm bg-white">
                        <CardContent className="flex flex-col items-center justify-center p-16 text-charcoal-500">
                            <div className="h-16 w-16 bg-charcoal-50 border border-charcoal-100 rounded-2xl flex items-center justify-center mb-4">
                                <CalendarIcon className="h-8 w-8 text-charcoal-300" />
                            </div>
                            <h3 className="text-xl font-bold text-charcoal-900 mb-1">No Appointments</h3>
                            <p className="max-w-xs text-center text-sm mt-1">There are no consultations scheduled in the system right now.</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default Appointments;
