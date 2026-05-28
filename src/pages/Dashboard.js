import Register from './RegisterSASC';
import logo from '../sasc-logo.png';
import Students from './Students';
import ProofOfRegistration from './ProofOfRegistration';
import Marks from './Marks';
import Finance from './Finance';
import Attendance from './Attendance';
import React, { useState } from 'react';

export default function Dashboard() {
  const [activePage, setActivePage] = useState('dashboard');
  const [selectedStudent, setSelectedStudent] = useState(null);

 const navItems = [
    { key: 'dashboard', icon: '📊', label: 'Dashboard' },
    { key: 'register', icon: '📝', label: 'Register Student' },
    { key: 'students', icon: '👥', label: 'Students' },
    { key: 'proof', icon: '📄', label: 'Proof of Registration' },
    { key: 'marks', icon: '🎓', label: 'Marks & Assessments' },
    { key: 'finance', icon: '💰', label: 'Finance' },
    { key: 'attendance', icon: '📅', label: 'Attendance' },
  ];

  const pageTitles = {
    dashboard: 'Dashboard',
    register: 'Register New Student',
    students: 'Students',
    proof: 'Proof of Registration',
    marks: 'Marks & Assessments',
    finance: 'Finance',
    attendance: 'Attendance',
  };

  return (
    <div className="flex h-screen bg-gray-50">

      {/* Sidebar */}
      <div className="w-64 flex flex-col shadow-xl" style={{ background: '#1B1F8A' }}>
        
        {/* Logo */}
        <div className="p-5 border-b border-blue-800">
          <img src={logo} alt="SA Shepherd College" className="w-full" />
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-1">
            {navItems.map(item => (
              <li key={item.key}
                onClick={() => setActivePage(item.key)}
                className="rounded-lg px-4 py-3 cursor-pointer flex items-center gap-3 text-sm transition"
                style={{
                  background: activePage === item.key ? '#E91E8C' : 'transparent',
                  color: 'white',
                  fontWeight: activePage === item.key ? '600' : '400',
                }}>
                <span>{item.icon}</span>
                {item.label}
              </li>
            ))}
          </ul>
        </nav>

        {/* Campus Info */}
        <div className="p-4 border-t border-blue-800">
          <p className="text-xs text-blue-300">DHET Exam Center No.</p>
          <p className="text-xs text-white font-medium">6999 926 54</p>
          <p className="text-xs text-blue-300 mt-2">Burgersfort | Polokwane</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Topbar */}
        <div className="bg-white shadow-sm px-8 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold" style={{ color: '#1B1F8A' }}>
              {pageTitles[activePage]}
            </h2>
            <p className="text-xs text-gray-400">SA Shepherd College Management System</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-700">Administrator</p>
              <p className="text-xs text-gray-400">admin@sashepherdcollege.org.za</p>
            </div>
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
              style={{ background: '#E91E8C' }}>A</div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto">

          {/* Dashboard Home */}
          {activePage === 'dashboard' && (
            <div className="p-8">

              {/* Stats */}
              <div className="grid grid-cols-4 gap-6 mb-8">
                {[
                  { label: 'Total Students', value: '312', sub: '↑ 14 this month', color: '#1B1F8A' },
                  { label: 'Active Courses', value: '32', sub: 'Across all faculties', color: '#8DC63F' },
                  { label: 'Fees Collected', value: 'R184k', sub: 'This month', color: '#1B1F8A' },
                  { label: 'Outstanding Fees', value: 'R62k', sub: '38 students', color: '#E91E8C' },
                ].map(stat => (
                  <div key={stat.label} className="bg-white rounded-xl shadow-sm p-6 border-t-4"
                    style={{ borderColor: stat.color }}>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                    <p className="text-3xl font-bold mt-1" style={{ color: stat.color }}>{stat.value}</p>
                    <p className="text-xs text-gray-400 mt-2">{stat.sub}</p>
                  </div>
                ))}
              </div>

              {/* Campuses */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                {[
                  { name: 'Burgersfort Campus', address: 'Main Road, RCS Building Between CashBuild and Caltex', tel: '010 055 5115', students: 178 },
                  { name: 'Polokwane Campus', address: '17 Rissik Street CNR Landros Mare, next to Engine Garage', tel: '015 008 5102', students: 134 },
                ].map(campus => (
                  <div key={campus.name} className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                        style={{ background: '#1B1F8A' }}>
                        {campus.name[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{campus.name}</p>
                        <p className="text-xs text-gray-400">{campus.tel}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mb-3">{campus.address}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Enrolled students</span>
                      <span className="font-bold text-lg" style={{ color: '#E91E8C' }}>{campus.students}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent Registrations */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-800">Recent Registrations</h3>
                  <button
                    onClick={() => setActivePage('students')}
                    className="text-sm font-medium"
                    style={{ color: '#E91E8C' }}>
                    View all →
                  </button>
                </div>
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs text-gray-400 border-b">
                      <th className="pb-3">Student</th>
                      <th className="pb-3">Course</th>
                      <th className="pb-3">Campus</th>
                      <th className="pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {[
                      { name: 'Thabo Mokoena', course: 'Electrical Engineering N4', campus: 'Burgersfort', status: 'Active' },
                      { name: 'Nomsa Sithole', course: 'Social Auxiliary Work NQF L4', campus: 'Polokwane', status: 'Active' },
                      { name: 'Lebo Nkosi', course: 'ECD Level 4', campus: 'Burgersfort', status: 'Pending' },
                      { name: 'Kagiso Baloyi', course: 'Human Resource N4', campus: 'Polokwane', status: 'Active' },
                      { name: 'Priya Moodley', course: 'First Aid Level 2', campus: 'Burgersfort', status: 'Active' },
                    ].map(s => (
                      <tr key={s.name} className="border-b hover:bg-gray-50">
                        <td className="py-3 font-medium">{s.name}</td>
                        <td className="py-3 text-gray-500">{s.course}</td>
                        <td className="py-3 text-gray-500">{s.campus}</td>
                        <td className="py-3">
                          <span className="px-3 py-1 rounded-full text-xs font-medium"
                            style={{
                              background: s.status === 'Active' ? '#f0fdf4' : '#fefce8',
                              color: s.status === 'Active' ? '#16a34a' : '#ca8a04'
                            }}>
                            {s.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activePage === 'register' && <Register onRegistered={() => setActivePage('students')} />}
          {activePage === 'students' && (
            <Students onSelectStudent={(student) => {
              setSelectedStudent(student);
              setActivePage('proof');
            }} />
          )}
          {activePage === 'proof' && (
            <ProofOfRegistration
              student={selectedStudent}
              onBack={() => setActivePage('students')}
            />
          )}
          {activePage === 'marks' && <Marks />}
          {activePage === 'finance' && <Finance />}
          {activePage === 'attendance' && <Attendance />}

        </div>
      </div>
    </div>
  );
}