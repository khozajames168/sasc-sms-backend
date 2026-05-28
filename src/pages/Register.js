import React, { useState } from 'react';

export default function Register() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    idNumber: '',
    cellNumber: '',
    email: '',
    dateOfBirth: '',
    course: '',
    campus: '',
    startDate: '',
    paymentPlan: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const studentNumber = 'PC-2025-' + Math.floor(Math.random() * 900 + 100);
    alert(`Student registered successfully!\nStudent Number: ${studentNumber}`);
  };

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Register New Student</h2>

      <form onSubmit={handleSubmit}>

        {/* Personal Details */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input name="firstName" value={form.firstName} onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Thabo" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input name="lastName" value={form.lastName} onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Mokoena" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ID / Passport Number</label>
              <input name="idNumber" value={form.idNumber} onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="13-digit ID number" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cell Number</label>
              <input name="cellNumber" value={form.cellNumber} onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. 071 234 5678" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input name="email" type="email" value={form.email} onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="student@email.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
              <input name="dateOfBirth" type="date" value={form.dateOfBirth} onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
        </div>

        {/* Course Details */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Course Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
              <select name="course" value={form.course} onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                <option value="">Select a course</option>
                <option>N4 Engineering</option>
                <option>N5 Engineering</option>
                <option>N6 Engineering</option>
                <option>Management N4</option>
                <option>Management N5</option>
                <option>IT Support N4</option>
                <option>ECD Level 4</option>
                <option>Safety (SAMTRAC)</option>
                <option>Matric Rewrite</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Campus</label>
              <select name="campus" value={form.campus} onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                <option value="">Select campus</option>
                <option>Main Campus</option>
                <option>Branch Campus</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input name="startDate" type="date" value={form.startDate} onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Plan</label>
              <select name="paymentPlan" value={form.paymentPlan} onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                <option value="">Select payment plan</option>
                <option>Full Upfront</option>
                <option>Monthly Instalments</option>
                <option>NSFAS</option>
                <option>Bursary</option>
              </select>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4">
          <button type="button"
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
            Cancel
          </button>
          <button type="submit"
            className="px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg">
            Register Student & Generate Number
          </button>
        </div>

      </form>
    </div>
  );
}