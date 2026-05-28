import React, { useState } from 'react';

const coursesData = {
  'N4 Engineering': {
    subjects: ['Mathematics', 'Engineering Science', 'Industrial Electronics', 'Engineering Drawing'],
    students: [
      { id: 'PC-2025-001', name: 'Thabo Mokoena' },
      { id: 'PC-2025-006', name: 'Siphiwe Dube' },
    ],
  },
  'Management N4': {
    subjects: ['Management Communication', 'Computer Practice', 'Entrepreneurship', 'Financial Management'],
    students: [
      { id: 'PC-2025-002', name: 'Nomsa Sithole' },
    ],
  },
  'ECD Level 4': {
    subjects: ['Child Development', 'Health & Nutrition', 'Learning Programme Design', 'Family & Community'],
    students: [
      { id: 'PC-2025-003', name: 'Lebo Nkosi' },
    ],
  },
  'IT Support N4': {
    subjects: ['Computer Systems', 'Networking', 'Operating Systems', 'IT Support Practice'],
    students: [
      { id: 'PC-2025-004', name: 'Kagiso Baloyi' },
    ],
  },
};

export default function Marks() {
  const [selectedCourse, setSelectedCourse] = useState('');
  const [marks, setMarks] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const course = coursesData[selectedCourse];

  const handleMark = (studentId, subject, value) => {
    setMarks(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [subject]: value,
      }
    }));
  };

  const getAverage = (studentId) => {
    if (!course || !marks[studentId]) return null;
    const values = course.subjects.map(s => parseFloat(marks[studentId]?.[s] || 0));
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    return avg.toFixed(1);
  };

  const getResult = (avg) => {
    if (avg === null) return '';
    return parseFloat(avg) >= 50 ? 'Pass' : 'Fail';
  };

  const handleExport = () => {
    if (!course) return;
    let csv = `Student Number,Student Name,${course.subjects.join(',')},Average,Result\n`;
    course.students.forEach(student => {
      const avg = getAverage(student.id);
      const result = getResult(avg);
      const subjectMarks = course.subjects.map(s => marks[student.id]?.[s] || '0').join(',');
      csv += `${student.id},${student.name},${subjectMarks},${avg || '0'},${result}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedCourse}_marks.csv`;
    a.click();
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Marks & Assessments</h2>
        {submitted && (
          <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
            ✓ Marks submitted successfully
          </span>
        )}
      </div>

      {/* Course Selector */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Course</label>
        <select
          value={selectedCourse}
          onChange={(e) => { setSelectedCourse(e.target.value); setMarks({}); setSubmitted(false); }}
          className="w-full max-w-sm border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">-- Select a course --</option>
          {Object.keys(coursesData).map(c => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Marks Table */}
      {course && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800">{selectedCourse} — Term Marks Capture</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="text-left text-sm text-gray-500">
                  <th className="px-6 py-4">Student</th>
                  {course.subjects.map(subject => (
                    <th key={subject} className="px-4 py-4">{subject}</th>
                  ))}
                  <th className="px-4 py-4">Average</th>
                  <th className="px-4 py-4">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {course.students.map(student => {
                  const avg = getAverage(student.id);
                  const result = getResult(avg);
                  return (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <p className="font-medium">{student.name}</p>
                        <p className="text-gray-400 text-xs">{student.id}</p>
                      </td>
                      {course.subjects.map(subject => (
                        <td key={subject} className="px-4 py-4">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={marks[student.id]?.[subject] || ''}
                            onChange={(e) => handleMark(student.id, subject, e.target.value)}
                            className="w-16 border border-gray-300 rounded px-2 py-1 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="0"
                          />
                        </td>
                      ))}
                      <td className="px-4 py-4 font-bold text-blue-700">
                        {avg ? `${avg}%` : '—'}
                      </td>
                      <td className="px-4 py-4">
                        {result && (
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${result === 'Pass' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {result}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {course && (
        <div className="flex gap-4 justify-end">
          <button
            onClick={handleExport}
            className="px-6 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold rounded-lg">
            📥 Export to CSV
          </button>
          <button
            onClick={() => setSubmitted(true)}
            className="px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg">
            📤 Submit to Department
          </button>
        </div>
      )}
    </div>
  );
}