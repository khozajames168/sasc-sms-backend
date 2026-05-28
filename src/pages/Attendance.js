import React, { useState } from 'react';

const courseStudents = {
  'N4 Engineering': [
    { id: 'PC-2025-001', name: 'Thabo Mokoena' },
    { id: 'PC-2025-006', name: 'Siphiwe Dube' },
  ],
  'Management N4': [
    { id: 'PC-2025-002', name: 'Nomsa Sithole' },
  ],
  'ECD Level 4': [
    { id: 'PC-2025-003', name: 'Lebo Nkosi' },
  ],
  'IT Support N4': [
    { id: 'PC-2025-004', name: 'Kagiso Baloyi' },
  ],
  'Safety (SAMTRAC)': [
    { id: 'PC-2025-005', name: 'Priya Moodley' },
  ],
  'Matric Rewrite': [
    { id: 'PC-2025-007', name: 'Zanele Maseko' },
  ],
};

export default function Attendance() {
  const [selectedCourse, setSelectedCourse] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState({});
  const [saved, setSaved] = useState(false);
  const [history, setHistory] = useState([]);

  const students = courseStudents[selectedCourse] || [];

  const handleAttendance = (studentId, status) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
    setSaved(false);
  };

  const markAll = (status) => {
    const all = {};
    students.forEach(s => all[s.id] = status);
    setAttendance(all);
    setSaved(false);
  };

  const handleSave = () => {
    if (!selectedCourse) return;
    const record = {
      id: Date.now(),
      course: selectedCourse,
      date,
      records: students.map(s => ({
        studentId: s.id,
        name: s.name,
        status: attendance[s.id] || 'Absent',
      })),
      present: students.filter(s => attendance[s.id] === 'Present').length,
      absent: students.filter(s => attendance[s.id] !== 'Present').length,
    };
    setHistory(prev => [record, ...prev]);
    setSaved(true);
  };

  const exportCSV = () => {
    let csv = 'Date,Course,Student Number,Student Name,Status\n';
    history.forEach(record => {
      record.records.forEach(r => {
        csv += `${record.date},${record.course},${r.studentId},${r.name},${r.status}\n`;
      });
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'attendance_register.csv';
    a.click();
  };

  const presentCount = students.filter(s => attendance[s.id] === 'Present').length;
  const absentCount = students.filter(s => attendance[s.id] === 'Absent').length;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Attendance Tracking</h2>
        {history.length > 0 && (
          <button onClick={exportCSV}
            className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium">
            📥 Export Register
          </button>
        )}
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Course</label>
            <select
              value={selectedCourse}
              onChange={(e) => { setSelectedCourse(e.target.value); setAttendance({}); setSaved(false); }}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">-- Select a course --</option>
              {Object.keys(courseStudents).map(c => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      {selectedCourse && (
        <>
          {/* Summary */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-sm p-5">
              <p className="text-sm text-gray-500">Total Students</p>
              <p className="text-3xl font-bold text-blue-900 mt-1">{students.length}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-5">
              <p className="text-sm text-gray-500">Present</p>
              <p className="text-3xl font-bold text-green-600 mt-1">{presentCount}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-5">
              <p className="text-sm text-gray-500">Absent</p>
              <p className="text-3xl font-bold text-red-600 mt-1">{absentCount}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-semibold text-gray-800">{selectedCourse} — {date}</h3>
              <div className="flex gap-3">
                <button onClick={() => markAll('Present')}
                  className="px-4 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200">
                  ✓ Mark All Present
                </button>
                <button onClick={() => markAll('Absent')}
                  className="px-4 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200">
                  ✗ Mark All Absent
                </button>
              </div>
            </div>
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="text-left text-sm text-gray-500">
                  <th className="px-6 py-4">Student Number</th>
                  <th className="px-6 py-4">Student Name</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {students.map(student => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-blue-700 font-medium">{student.id}</td>
                    <td className="px-6 py-4 font-medium">{student.name}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleAttendance(student.id, 'Present')}
                          className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${attendance[student.id] === 'Present' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-green-100'}`}>
                          ✓ Present
                        </button>
                        <button
                          onClick={() => handleAttendance(student.id, 'Absent')}
                          className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${attendance[student.id] === 'Absent' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-red-100'}`}>
                          ✗ Absent
                        </button>
                        <button
                          onClick={() => handleAttendance(student.id, 'Late')}
                          className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${attendance[student.id] === 'Late' ? 'bg-yellow-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-yellow-100'}`}>
                          ⏰ Late
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end gap-4">
            {saved && (
              <span className="flex items-center text-green-600 text-sm font-medium">
                ✓ Register saved successfully
              </span>
            )}
            <button onClick={handleSave}
              className="px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg">
              💾 Save Register
            </button>
          </div>
        </>
      )}

      {/* History */}
      {history.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Attendance History</h3>
          <div className="space-y-3">
            {history.map(record => (
              <div key={record.id} className="bg-white rounded-xl shadow-sm p-5 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">{record.course}</p>
                  <p className="text-sm text-gray-500">{record.date}</p>
                </div>
                <div className="flex gap-6 text-sm">
                  <span className="text-green-600 font-medium">✓ {record.present} Present</span>
                  <span className="text-red-600 font-medium">✗ {record.absent} Absent</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}