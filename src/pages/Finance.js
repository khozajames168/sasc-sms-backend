import React, { useState } from 'react';

const initialStudents = [
  { id: 'PC-2025-001', name: 'Thabo Mokoena', course: 'N4 Engineering', fees: 12000, paid: 12000 },
  { id: 'PC-2025-002', name: 'Nomsa Sithole', course: 'Management N4', fees: 10000, paid: 10000 },
  { id: 'PC-2025-003', name: 'Lebo Nkosi', course: 'ECD Level 4', fees: 8000, paid: 5600 },
  { id: 'PC-2025-004', name: 'Kagiso Baloyi', course: 'IT Support N4', fees: 11000, paid: 11000 },
  { id: 'PC-2025-005', name: 'Priya Moodley', course: 'Safety (SAMTRAC)', fees: 9000, paid: 9000 },
  { id: 'PC-2025-006', name: 'Siphiwe Dube', course: 'N4 Engineering', fees: 12000, paid: 10200 },
  { id: 'PC-2025-007', name: 'Zanele Maseko', course: 'Matric Rewrite', fees: 5000, paid: 4050 },
];

export default function Finance() {
  const [students, setStudents] = useState(initialStudents);
  const [paymentStudent, setPaymentStudent] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [receipts, setReceipts] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  const totalFees = students.reduce((a, b) => a + b.fees, 0);
  const totalPaid = students.reduce((a, b) => a + b.paid, 0);
  const totalOutstanding = totalFees - totalPaid;
  const studentsInArrears = students.filter(s => s.paid < s.fees).length;

  const handlePayment = () => {
    if (!paymentStudent || !paymentAmount) return;
    const amount = parseFloat(paymentAmount);
    setStudents(prev => prev.map(s => {
      if (s.id === paymentStudent.id) {
        const newPaid = Math.min(s.paid + amount, s.fees);
        return { ...s, paid: newPaid };
      }
      return s;
    }));
    const receipt = {
      id: `REC-${Date.now()}`,
      student: paymentStudent.name,
      studentId: paymentStudent.id,
      amount,
      date: new Date().toLocaleDateString('en-ZA'),
      course: paymentStudent.course,
    };
    setReceipts(prev => [receipt, ...prev]);
    setPaymentStudent(null);
    setPaymentAmount('');
    alert(`✅ Payment of R${amount.toLocaleString()} recorded for ${paymentStudent.name}\nReceipt: ${receipt.id}`);
  };

  const exportCSV = () => {
    let csv = 'Student Number,Name,Course,Total Fees,Amount Paid,Outstanding\n';
    students.forEach(s => {
      csv += `${s.id},${s.name},${s.course},R${s.fees},R${s.paid},R${s.fees - s.paid}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'finance_report.csv';
    a.click();
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Finance Module</h2>
        <button onClick={exportCSV}
          className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium">
          📥 Export Report
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <p className="text-sm text-gray-500">Total Fees Billed</p>
          <p className="text-3xl font-bold text-blue-900 mt-1">R{totalFees.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <p className="text-sm text-gray-500">Total Collected</p>
          <p className="text-3xl font-bold text-green-600 mt-1">R{totalPaid.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <p className="text-sm text-gray-500">Outstanding</p>
          <p className="text-3xl font-bold text-red-600 mt-1">R{totalOutstanding.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <p className="text-sm text-gray-500">Students in Arrears</p>
          <p className="text-3xl font-bold text-red-600 mt-1">{studentsInArrears}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        {['overview', 'receipts'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg text-sm font-medium capitalize ${activeTab === tab ? 'bg-blue-700 text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
            {tab === 'overview' ? '📊 Fee Overview' : '🧾 Receipts'}
          </button>
        ))}
      </div>

      {/* Fee Overview Tab */}
      {activeTab === 'overview' && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="text-left text-sm text-gray-500">
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Course</th>
                <th className="px-6 py-4">Total Fees</th>
                <th className="px-6 py-4">Paid</th>
                <th className="px-6 py-4">Outstanding</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {students.map(student => {
                const outstanding = student.fees - student.paid;
                const percent = Math.round((student.paid / student.fees) * 100);
                return (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="font-medium">{student.name}</p>
                      <p className="text-gray-400 text-xs">{student.id}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{student.course}</td>
                    <td className="px-6 py-4">R{student.fees.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-green-600 font-medium">R{student.paid.toLocaleString()}</p>
                        <div className="w-24 bg-gray-200 rounded-full h-1.5 mt-1">
                          <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${percent}%` }}></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {outstanding > 0
                        ? <span className="text-red-600 font-medium">R{outstanding.toLocaleString()}</span>
                        : <span className="text-green-600 font-medium">✓ Paid</span>}
                    </td>
                    <td className="px-6 py-4">
                      {outstanding > 0 && (
                        <button
                          onClick={() => setPaymentStudent(student)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                          Record Payment
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Receipts Tab */}
      {activeTab === 'receipts' && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {receipts.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p className="text-4xl mb-3">🧾</p>
              <p>No receipts yet. Record a payment to generate a receipt.</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="text-left text-sm text-gray-500">
                  <th className="px-6 py-4">Receipt ID</th>
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Course</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {receipts.map(r => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-blue-700 font-medium">{r.id}</td>
                    <td className="px-6 py-4 font-medium">{r.student}</td>
                    <td className="px-6 py-4 text-gray-600">{r.course}</td>
                    <td className="px-6 py-4 text-green-600 font-medium">R{r.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-gray-600">{r.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Payment Modal */}
      {paymentStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Record Payment</h3>
            <p className="text-gray-500 text-sm mb-6">Student: <strong>{paymentStudent.name}</strong></p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount Received (R)</label>
              <input
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. 2400"
              />
            </div>
            <p className="text-sm text-gray-500 mb-6">
              Outstanding: <strong className="text-red-600">R{(paymentStudent.fees - paymentStudent.paid).toLocaleString()}</strong>
            </p>
            <div className="flex gap-4">
              <button onClick={() => setPaymentStudent(null)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handlePayment}
                className="flex-1 px-4 py-3 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg">
                Confirm Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}