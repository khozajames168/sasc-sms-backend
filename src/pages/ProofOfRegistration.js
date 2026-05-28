import React from 'react';

export default function ProofOfRegistration({ student, onBack }) {
  const today = new Date().toLocaleDateString('en-ZA', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  if (!student) {
    return (
      <div className="p-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Proof of Registration</h3>
          <p className="text-gray-500">Go to the Students page and click "View Proof" on any student.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <button onClick={onBack} className="mb-6 text-blue-600 hover:text-blue-800 flex items-center gap-2 text-sm">
        ← Back to Students
      </button>

      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200">

          {/* Header */}
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-200">
            <div className="w-16 h-16 bg-blue-900 rounded-xl flex items-center justify-center">
              <span className="text-white text-2xl font-bold">P</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-blue-900">Pinnacle College</h1>
              <p className="text-gray-500">Official Proof of Registration</p>
              <p className="text-gray-400 text-sm">Accredited Private College — South Africa</p>
            </div>
            <div className="ml-auto w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <p className="text-xs text-gray-400">QR Code</p>
                <p className="text-2xl">▦</p>
              </div>
            </div>
          </div>

          {/* Student Details */}
          <div className="space-y-3 mb-8">
            {[
              { label: 'Student Name', value: `${student.firstName} ${student.lastName}` },
              { label: 'Student Number', value: student.id },
              { label: 'Course Enrolled', value: student.course },
              { label: 'Campus', value: student.campus },
              { label: 'Registration Date', value: today },
              { label: 'Academic Year', value: '2025' },
              { label: 'Status', value: student.status },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-500 text-sm">{label}</span>
                <span className="font-semibold text-gray-800">{value}</span>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800 text-center">
              This document serves as official proof of registration at Pinnacle College.
              Valid for the 2025 academic year.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => window.print()}
              className="px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg">
              🖨️ Print Document
            </button>
            <button
              className="px-6 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold rounded-lg">
              📧 Send to Student
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}