import React, { useState } from 'react';

const sampleStudents = [
  { id: 'PC-2025-001', firstName: 'Thabo', lastName: 'Mokoena', course: 'N4 Engineering', campus: 'Main Campus', cell: '071 234 5678', status: 'Active', balance: 0 },
  { id: 'PC-2025-002', firstName: 'Nomsa', lastName: 'Sithole', course: 'Management N4', campus: 'Main Campus', cell: '082 345 6789', status: 'Active', balance: 0 },
  { id: 'PC-2025-003', firstName: 'Lebo', lastName: 'Nkosi', course: 'ECD Level 4', campus: 'Branch Campus', cell: '073 456 7890', status: 'Pending', balance: 2400 },
  { id: 'PC-2025-004', firstName: 'Kagiso', lastName: 'Baloyi', course: 'IT Support N4', campus: 'Main Campus', cell: '084 567 8901', status: 'Active', balance: 0 },
  { id: 'PC-2025-005', firstName: 'Priya', lastName: 'Moodley', course: 'Safety (SAMTRAC)', campus: 'Main Campus', cell: '076 678 9012', status: 'Active', balance: 0 },
  { id: 'PC-2025-006', firstName: 'Siphiwe', lastName: 'Dube', course: 'N4 Engineering', campus: 'Main Campus', cell: '079 789 0123', status: 'Active', balance: 1800 },
  { id: 'PC-2025-007', firstName: 'Zanele', lastName: 'Maseko', course: 'Matric Rewrite', campus: 'Branch Campus', cell: '071 890 1234', status: 'Pending', balance: 950 },
];

export default function Students({ onSelectStudent }) {
  const [search, setSearch] = useState('');
  const [filterCourse, setFilterCourse] = useState('');

  const filtered = sampleStudents.filter(s => {
    const fullName = `${s.firstName} ${s.lastName}`.toLowerCase();
    const matchSearch = fullName.includes(search.toLowerCase()) || s.id.includes(search);
    const matchCourse = filterCourse ? s.course === filterCourse : true;
    return matchSearch && matchCourse;
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Students</h2>
        <span className="bg-blue-100 text-blue-800 text-sm px-4 py-1 rounded-full">{filtered.length} students</span>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name or student number..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={filterCourse}
          onChange={(e) => setFilterCourse(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">All Courses</option>
          <option>N4 Engineering</option>
          <option>Management N4</option>
          <option>ECD Level 4</option>
          <option>IT Support N4</option>
          <option>Safety (SAMTRAC)</option>
          <option>Matric Rewrite</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr className="text-left text-sm text-gray-500">
              <th className="px-6 py-4">Student Number</th>
              <th className="px-6 py-4">Full Name</th>
              <th className="px-6 py-4">Course</th>
              <th className="px-6 py-4">Cell</th>
              <th className="px-6 py-4">Balance</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-gray-100">
            {filtered.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-blue-700 font-medium">{student.id}</td>
                <td className="px-6 py-4 font-medium">{student.firstName} {student.lastName}</td>
                <td className="px-6 py-4 text-gray-600">{student.course}</td>
                <td className="px-6 py-4 text-gray-600">{student.cell}</td>
                <td className="px-6 py-4">
                  {student.balance > 0
                    ? <span className="text-red-600 font-medium">R{student.balance.toLocaleString()}</span>
                    : <span className="text-green-600">Paid</span>}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${student.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {student.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => onSelectStudent(student)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    View Proof
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}