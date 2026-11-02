import React, { useState } from 'react';
import { Shield, User, DollarSign, Calendar, LogOut, Activity } from 'lucide-react';

export default function App() {
  const [role, setRole] = useState(null); // 'admin', 'patient', or null
  const [activeTab, setActiveTab] = useState('dashboard');

  // Handle Login Simulation
  const handleLogin = (selectedRole) => {
    setRole(selectedRole);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setRole(null);
  };

  // 1. LOGIN SCREEN
  if (!role) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full bg-slate-800 p-8 rounded-xl shadow-xl border border-slate-700">
          <div className="flex items-center justify-center mb-6 text-blue-400">
            <Activity size={48} />
          </div>
          <h1 className="text-2xl font-bold text-center mb-2">Hospital Management System</h1>
          <p className="text-slate-400 text-center mb-8">Select your portal to log in for Review</p>
          
          <div className="space-y-4">
            <button
              onClick={() => handleLogin('admin')}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 py-3 rounded-lg font-semibold transition"
            >
              <Shield size={20} /> Login as Admin
            </button>
            <button
              onClick={() => handleLogin('patient')}
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 py-3 rounded-lg font-semibold transition"
            >
              <User size={20} /> Login as Patient
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. MAIN DASHBOARDS (ADMIN & PATIENT)
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 text-blue-400 font-bold text-xl mb-8">
            <Activity /> MedCore HMS
          </div>
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left transition ${
                activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              <Calendar size={18} /> Dashboard
            </button>
            <button
              onClick={() => setActiveTab('billing')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left transition ${
                activeTab === 'billing' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              <DollarSign size={18} /> Billing & Invoices
            </button>
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-400 hover:text-red-300 transition px-4 py-2"
        >
          <LogOut size={18} /> Logout
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-10 overflow-y-auto">
        <header className="flex justify-between items-center mb-8 pb-4 border-b border-slate-800">
          <h2 className="text-2xl font-bold capitalize">
            {role} Portal — {activeTab}
          </h2>
          <span className="bg-slate-800 px-3 py-1 rounded-full text-sm text-slate-400 border border-slate-700">
            Role: <strong className="text-white uppercase">{role}</strong>
          </span>
        </header>

        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                <p className="text-slate-400 text-sm">Total Appointments</p>
                <h3 className="text-3xl font-bold mt-2">24</h3>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                <p className="text-slate-400 text-sm">Active Patients</p>
                <h3 className="text-3xl font-bold mt-2">142</h3>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                <p className="text-slate-400 text-sm">Pending Bills</p>
                <h3 className="text-3xl font-bold mt-2">5</h3>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
              <h3 className="font-semibold text-lg mb-4">Recent System Activity</h3>
              <p className="text-slate-400 text-sm">System is fully synchronized and online for review.</p>
            </div>
          </div>
        )}

        {activeTab === 'billing' && (
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
            <h3 className="font-semibold text-lg mb-4">Patient Billing & Invoices</h3>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-sm">
                  <th className="py-3">Invoice ID</th>
                  <th className="py-3">Patient Name</th>
                  <th className="py-3">Amount</th>
                  <th className="py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-sm">
                <tr>
                  <td className="py-3">#INV-101</td>
                  <td className="py-3">John Doe</td>
                  <td className="py-3">$150.00</td>
                  <td className="py-3 text-emerald-400 font-medium">Paid</td>
                </tr>
                <tr>
                  <td className="py-3">#INV-102</td>
                  <td className="py-3">Jane Smith</td>
                  <td className="py-3">$320.00</td>
                  <td className="py-3 text-amber-400 font-medium">Pending</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}