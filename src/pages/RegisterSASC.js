import React, { useState, useRef } from 'react';

const COURSES = {
  'Health Faculty': [
    { name: 'Safety Management (OHS) L2', deposit: 1850, monthly: 1054, total: 14500, duration: '1 Year' },
    { name: 'Safety Management (OHS) L2 - Distance/Online', deposit: 1750, monthly: 979, total: 13500, duration: '1 Year' },
    { name: 'Occupational Health & Safety (OHS) L5', deposit: 2450, monthly: 1125, total: 17850, duration: '15 Months' },
    { name: 'OHS L5 - Distance/Online', deposit: 2100, monthly: 1000, total: 16800, duration: '15 Months' },
    { name: 'Social Auxiliary Work NQF Level 4', deposit: 1950, monthly: 1870, total: 15000, duration: '1 Year' },
    { name: 'Social Auxiliary Work NQF L4 - Distance/Online', deposit: 1950, monthly: 900, total: 13000, duration: '1 Year' },
    { name: 'Social Auxiliary Work NQF L4 (With Computer)', deposit: 2200, monthly: 1191, total: 16500, duration: '1 Year' },
    { name: 'Social Auxiliary Level 5 SAQA ID: 98890', deposit: 2100, monthly: 1050, total: 16800, duration: '15 Months' },
    { name: 'Health Promotion Officer L3 Full Qualification', deposit: 2100, monthly: 1050, total: 16800, duration: '15 Months' },
    { name: 'Health Promotion Officer - Distance/Online', deposit: 2000, monthly: 985, total: 15800, duration: '15 Months' },
  ],
  'Engineering Faculty': [
    { name: 'Diesel & Motor Mechanic N1-N6', deposit: 1350, monthly: 1200, total: 3750, duration: '2 Months' },
    { name: 'Mechanical Engineering N1-N6', deposit: 1200, monthly: 1100, total: 3400, duration: '2 Months' },
    { name: 'Electrical Engineering N1-N6', deposit: 800, monthly: 800, total: 2400, duration: '2 Months' },
    { name: 'Rigging Course N1-N6', deposit: 650, monthly: 400, total: 1450, duration: '2 Months' },
    { name: 'Fitting & Turning N1-N6', deposit: 1350, monthly: 1030, total: 6500, duration: '5 Months' },
    { name: 'Instrumentation N4-N6', deposit: 1500, monthly: 850, total: 3200, duration: '2 Months' },
  ],
  'Education Faculty': [
    { name: 'Diploma Early Childhood Full Time', deposit: 2700, monthly: 1250, total: 24000, duration: '18 Months' },
    { name: 'Diploma Early Childhood Full Time (With Computer)', deposit: 2800, monthly: 1300, total: 25000, duration: '18 Months' },
    { name: 'Diploma Early Childhood Distance/Online', deposit: 2550, monthly: 1200, total: 22750, duration: '18 Months' },
    { name: 'Early Childhood Development L4 HWSETA', deposit: 2300, monthly: 1200, total: 15500, duration: '12 Months' },
    { name: 'ECD Level 4 Distance/Online', deposit: 2000, monthly: 1090, total: 14000, duration: '12 Months' },
    { name: 'ECD L4 Full Time (With Computer)', deposit: 2500, monthly: 1300, total: 16800, duration: '12 Months' },
    { name: 'Early Childhood (ECD) NQF L4 SAQA ID 97542', deposit: 1950, monthly: 920, total: 13000, duration: '12 Months' },
  ],
  'Business Faculty': [
    { name: 'Human Resource N4-N6 Full Time', deposit: 1300, monthly: 840, total: 5500, duration: '6 Months' },
    { name: 'Human Resource N4-N6 Distance/Online', deposit: 1100, monthly: 680, total: 4500, duration: '6 Months' },
    { name: 'Tourism Management N4-N6 Full Time', deposit: 1300, monthly: 725, total: 10000, duration: '12 Months' },
    { name: 'Tourism Management N4-N6 Full Time', deposit: 1700, monthly: 950, total: 16000, duration: '18 Months' },
    { name: 'Management Assistance N4-N6', deposit: 1200, monthly: 875, total: 5250, duration: '6 Months' },
    { name: 'Public Relations N4-N6', deposit: 1000, monthly: 583, total: 4500, duration: '6 Months' },
  ],
  'Mining & Construction Safety': [
    { name: 'HIRA', deposit: 1400, monthly: 0, total: 2900, duration: '2 Weeks' },
    { name: 'SHAMTRACK', deposit: 1400, monthly: 0, total: 2900, duration: '2 Weeks' },
    { name: 'SHE RAP', deposit: 1400, monthly: 0, total: 2900, duration: '2 Weeks' },
    { name: 'Basic Fire Fighting', deposit: 1400, monthly: 0, total: 2900, duration: '2 Weeks' },
    { name: 'Working at Heights', deposit: 1400, monthly: 0, total: 2900, duration: '1 Week' },
    { name: 'COMSOC 01', deposit: 1000, monthly: 0, total: 2000, duration: '3 Days' },
    { name: 'COMSOC 02', deposit: 1250, monthly: 0, total: 2500, duration: '3 Days' },
    { name: 'COMSOC 03', deposit: 1750, monthly: 0, total: 3500, duration: '3 Days' },
    { name: 'First Aid Level 1', deposit: 750, monthly: 0, total: 1500, duration: '3 Days' },
    { name: 'First Aid Level 2', deposit: 1250, monthly: 0, total: 2500, duration: '3 Days' },
    { name: 'First Aid Level 3', deposit: 1750, monthly: 0, total: 3500, duration: '3 Days' },
  ],
  'Mining Machinery Training': [
    { name: 'Front Loader', deposit: 4800, monthly: 0, total: 4800, duration: '8 Days' },
    { name: 'TLB', deposit: 4800, monthly: 0, total: 4800, duration: '8 Days' },
    { name: 'Bob Cat', deposit: 4800, monthly: 0, total: 4800, duration: '8 Days' },
    { name: 'Dump Truck', deposit: 4800, monthly: 0, total: 4800, duration: '8 Days' },
    { name: 'UV', deposit: 5300, monthly: 0, total: 5300, duration: '8 Days' },
    { name: 'Forklift (7 Days)', deposit: 1700, monthly: 0, total: 1700, duration: '7 Days' },
    { name: 'Drill Rig', deposit: 4950, monthly: 0, total: 4950, duration: '8 Days' },
    { name: 'Bulldozer', deposit: 4800, monthly: 0, total: 4800, duration: '8 Days' },
    { name: 'LHD Scoop', deposit: 4800, monthly: 0, total: 4800, duration: '8 Days' },
  ],
  'Security Courses': [
    { name: 'Security Grade EDC', deposit: 1900, monthly: 0, total: 1900, duration: '3 Weeks' },
    { name: 'Security Grade E', deposit: 750, monthly: 0, total: 750, duration: '1 Week' },
    { name: 'Security Grade D', deposit: 750, monthly: 0, total: 750, duration: '1 Week' },
    { name: 'Security Grade C', deposit: 750, monthly: 0, total: 750, duration: '1 Week' },
    { name: 'Security Grade B', deposit: 850, monthly: 0, total: 850, duration: '1 Week' },
    { name: 'Security Grade A', deposit: 1000, monthly: 0, total: 1000, duration: '2 Weeks' },
  ],
  'Matric Rewrite': [
    { name: 'Matric Rewrite - 1 Subject', deposit: 500, monthly: 350, total: 2600, duration: '6 Months' },
    { name: 'Matric Rewrite - 2 Subjects', deposit: 500, monthly: 650, total: 4400, duration: '6 Months' },
    { name: 'Matric Rewrite - 3 Subjects', deposit: 500, monthly: 850, total: 5600, duration: '6 Months' },
    { name: 'Matric Rewrite - 4 Subjects', deposit: 500, monthly: 1000, total: 6500, duration: '6 Months' },
  ],
};

export default function RegisterSASC({ onRegistered }) {
  const [step, setStep] = useState(1);
  const [photo, setPhoto] = useState(null);
  const [idDoc, setIdDoc] = useState(null);
  const [grade12Doc, setGrade12Doc] = useState(null);
  const [proofOfPayment, setProofOfPayment] = useState(null);
  const [selectedFaculty, setSelectedFaculty] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const photoRef = useRef();

  const [form, setForm] = useState({
    title: '', firstName: '', lastName: '', idNumber: '',
    dateOfBirth: '', maritalStatus: '', gender: '', homeLanguage: '',
    address: '', homeTel: '', cellNumber: '', email: '',
    isSACitizen: 'Yes', passportNumber: '', studyMode: '',
    campus: '', accommodation: '', previousSchool: '',
    qualificationObtained: '', subjects: '', payerType: '',
    payerName: '', payerIdNumber: '', payerAddress: '',
    payerCell: '', hearAboutUs: '', studentConsent: false, payerConsent: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setPhoto(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { registerStudent } = await import('../utils/api');
      const data = await registerStudent({
        ...form,
        faculty: selectedFaculty,
        course: selectedCourse?.name,
        deposit: selectedCourse?.deposit,
        monthly: selectedCourse?.monthly,
        total: selectedCourse?.total,
        duration: selectedCourse?.duration,
        photo,
      });
      if (data.student_number) {
        alert(`✅ Student registered successfully!\nStudent Number: ${data.student_number}\nDefault Password: Last 6 digits of ID number`);
        onRegistered(data);
      } else {
        alert('Error: ' + (data.error || 'Registration failed'));
      }
    } catch (err) {
      alert('Connection error. Please try again.');
    }
    setLoading(false);
  };

  const inputClass = "w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:border-transparent";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold" style={{ color: '#1B1F8A' }}>Student Registration</h2>
        <p className="text-gray-500 text-sm mt-1">SA Shepherd College — Official Admission Form</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center mb-8">
        {[
          { num: 1, label: 'Personal Info' },
          { num: 2, label: 'Course' },
          { num: 3, label: 'Documents' },
          { num: 4, label: 'Payer Details' },
          { num: 5, label: 'Confirm' },
        ].map((s, i) => (
          <React.Fragment key={s.num}>
            <div className="flex flex-col items-center">
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white"
                style={{ background: step >= s.num ? '#1B1F8A' : '#d1d5db' }}>
                {step > s.num ? '✓' : s.num}
              </div>
              <p className="text-xs mt-1 text-gray-500">{s.label}</p>
            </div>
            {i < 4 && <div className="flex-1 h-1 mx-2 rounded" style={{ background: step > s.num ? '#1B1F8A' : '#e5e7eb' }}></div>}
          </React.Fragment>
        ))}
      </div>

      {/* Step 1 */}
      {step === 1 && (
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h3 className="font-bold text-gray-800 mb-6 text-lg">Personal Information</h3>
          <div className="flex items-center gap-6 mb-8">
            <div className="w-28 h-32 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden cursor-pointer hover:border-blue-400 transition"
              onClick={() => photoRef.current.click()}>
              {photo
                ? <img src={photo} alt="Student" className="w-full h-full object-cover" />
                : <div className="text-center p-2"><p className="text-3xl">📷</p><p className="text-xs text-gray-400 mt-1">Click to upload</p></div>
              }
            </div>
            <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
            <div>
              <p className="font-medium text-gray-700">Student Photo</p>
              <p className="text-sm text-gray-400 mt-1">Upload a clear passport-style photo</p>
              <button onClick={() => photoRef.current.click()}
                className="mt-2 px-4 py-2 text-sm rounded-lg text-white font-medium"
                style={{ background: '#1B1F8A' }}>Upload Photo</button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelClass}>Title *</label>
              <select name="title" value={form.title} onChange={handleChange} className={inputClass} required>
                <option value="">Select</option>
                <option>Mr</option><option>Mrs</option><option>Miss</option><option>Ms</option><option>Dr</option>
              </select>
            </div>
            <div><label className={labelClass}>Gender *</label>
              <select name="gender" value={form.gender} onChange={handleChange} className={inputClass} required>
                <option value="">Select</option>
                <option>Male</option><option>Female</option><option>Other</option>
              </select>
            </div>
            <div><label className={labelClass}>First Name *</label>
              <input name="firstName" value={form.firstName} onChange={handleChange} className={inputClass} placeholder="First name" required />
            </div>
            <div><label className={labelClass}>Last Name *</label>
              <input name="lastName" value={form.lastName} onChange={handleChange} className={inputClass} placeholder="Last name" required />
            </div>
            <div><label className={labelClass}>ID Number *</label>
              <input name="idNumber" value={form.idNumber} onChange={handleChange} className={inputClass} placeholder="13-digit SA ID number" maxLength={13} required />
            </div>
            <div><label className={labelClass}>Date of Birth *</label>
              <input name="dateOfBirth" type="date" value={form.dateOfBirth} onChange={handleChange} className={inputClass} required />
            </div>
            <div><label className={labelClass}>Marital Status *</label>
              <select name="maritalStatus" value={form.maritalStatus} onChange={handleChange} className={inputClass}>
                <option value="">Select</option>
                <option>Single</option><option>Married</option><option>Divorced</option><option>Widowed</option>
              </select>
            </div>
            <div><label className={labelClass}>Home Language *</label>
              <select name="homeLanguage" value={form.homeLanguage} onChange={handleChange} className={inputClass}>
                <option value="">Select</option>
                <option>Sepedi</option><option>Zulu</option><option>Xhosa</option><option>Afrikaans</option>
                <option>English</option><option>Tswana</option><option>Sotho</option><option>Tsonga</option>
                <option>Swati</option><option>Venda</option><option>Ndebele</option>
              </select>
            </div>
            <div className="col-span-2"><label className={labelClass}>Residential Address *</label>
              <input name="address" value={form.address} onChange={handleChange} className={inputClass} placeholder="Full residential address" required />
            </div>
            <div><label className={labelClass}>Cell Number *</label>
              <input name="cellNumber" value={form.cellNumber} onChange={handleChange} className={inputClass} placeholder="e.g. 071 234 5678" required />
            </div>
            <div><label className={labelClass}>Email Address</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} className={inputClass} placeholder="student@email.com" />
            </div>
            <div><label className={labelClass}>Home Telephone</label>
              <input name="homeTel" value={form.homeTel} onChange={handleChange} className={inputClass} placeholder="Optional" />
            </div>
            <div><label className={labelClass}>South African Citizen? *</label>
              <select name="isSACitizen" value={form.isSACitizen} onChange={handleChange} className={inputClass}>
                <option>Yes</option><option>No</option>
              </select>
            </div>
            {form.isSACitizen === 'No' && (
              <div className="col-span-2"><label className={labelClass}>Passport Number *</label>
                <input name="passportNumber" value={form.passportNumber} onChange={handleChange} className={inputClass} placeholder="Passport number" />
              </div>
            )}
          </div>
          <div className="mt-6 pt-6 border-t border-gray-100">
            <h4 className="font-semibold text-gray-700 mb-4">Previous Education</h4>
            <div className="grid grid-cols-2 gap-4">
              <div><label className={labelClass}>Name of Previous School *</label>
                <input name="previousSchool" value={form.previousSchool} onChange={handleChange} className={inputClass} placeholder="School name" required />
              </div>
              <div><label className={labelClass}>Qualification / Grade Passed *</label>
                <input name="qualificationObtained" value={form.qualificationObtained} onChange={handleChange} className={inputClass} placeholder="e.g. Grade 12" required />
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-6">
            <button onClick={() => setStep(2)}
              className="px-8 py-3 text-white font-semibold rounded-lg"
              style={{ background: '#1B1F8A' }}>
              Next: Course Selection →
            </button>
          </div>
        </div>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h3 className="font-bold text-gray-800 mb-6 text-lg">Course Selection</h3>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div><label className={labelClass}>Select Faculty *</label>
              <select value={selectedFaculty}
                onChange={(e) => { setSelectedFaculty(e.target.value); setSelectedCourse(null); }}
                className={inputClass}>
                <option value="">-- Select Faculty --</option>
                {Object.keys(COURSES).map(f => <option key={f}>{f}</option>)}
              </select>
            </div>
            <div><label className={labelClass}>Campus *</label>
              <select name="campus" value={form.campus} onChange={handleChange} className={inputClass} required>
                <option value="">Select Campus</option>
                <option>Burgersfort Campus</option>
                <option>Polokwane Campus</option>
              </select>
            </div>
            <div><label className={labelClass}>Study Mode *</label>
              <select name="studyMode" value={form.studyMode} onChange={handleChange} className={inputClass} required>
                <option value="">Select</option>
                <option>Full Time</option>
                <option>Part Time</option>
                <option>Online / Distance Learning</option>
              </select>
            </div>
            <div><label className={labelClass}>Accommodation</label>
              <select name="accommodation" value={form.accommodation} onChange={handleChange} className={inputClass}>
                <option value="">Select</option>
                <option>Required</option>
                <option>Not Required</option>
              </select>
            </div>
          </div>
          {selectedFaculty && (
            <div>
              <label className={labelClass}>Select Course *</label>
              <div className="space-y-3 mt-2 max-h-80 overflow-y-auto pr-2">
                {COURSES[selectedFaculty].map(course => (
                  <div key={course.name}
                    onClick={() => setSelectedCourse(course)}
                    className="border-2 rounded-xl p-4 cursor-pointer transition"
                    style={{
                      borderColor: selectedCourse?.name === course.name ? '#E91E8C' : '#e5e7eb',
                      background: selectedCourse?.name === course.name ? '#fdf2f8' : 'white'
                    }}>
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-800">{course.name}</p>
                      <span className="text-xs px-3 py-1 rounded-full text-white font-medium"
                        style={{ background: '#8DC63F' }}>{course.duration}</span>
                    </div>
                    <div className="flex gap-6 mt-2 text-sm">
                      <span className="text-gray-500">Deposit: <strong style={{ color: '#1B1F8A' }}>R{course.deposit.toLocaleString()}</strong></span>
                      {course.monthly > 0 && <span className="text-gray-500">Monthly: <strong style={{ color: '#1B1F8A' }}>R{course.monthly.toLocaleString()}</strong></span>}
                      <span className="text-gray-500">Total: <strong style={{ color: '#E91E8C' }}>R{course.total.toLocaleString()}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {selectedCourse && (
            <div className="mt-6 p-4 rounded-xl" style={{ background: '#f0f4ff' }}>
              <p className="font-semibold" style={{ color: '#1B1F8A' }}>Selected: {selectedCourse.name}</p>
              <p className="text-sm text-gray-600 mt-1">
                Deposit: R{selectedCourse.deposit.toLocaleString()} |
                {selectedCourse.monthly > 0 && ` Monthly: R${selectedCourse.monthly.toLocaleString()} |`} Total: R{selectedCourse.total.toLocaleString()} | Duration: {selectedCourse.duration}
              </p>
            </div>
          )}
          <div className="mt-6">
            <label className={labelClass}>Subjects Registering For *</label>
            <textarea name="subjects" value={form.subjects} onChange={handleChange}
              className={inputClass} rows={3}
              placeholder="List the subjects you are registering for..." />
          </div>
          <div className="flex justify-between mt-6">
            <button onClick={() => setStep(1)}
              className="px-8 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50">← Back</button>
            <button onClick={() => setStep(3)}
              disabled={!selectedCourse || !form.campus || !form.studyMode}
              className="px-8 py-3 text-white font-semibold rounded-lg disabled:opacity-50"
              style={{ background: '#1B1F8A' }}>Next: Documents →</button>
          </div>
        </div>
      )}

      {/* Step 3 */}
      {step === 3 && (
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h3 className="font-bold text-gray-800 mb-2 text-lg">Document Uploads</h3>
          <p className="text-gray-500 text-sm mb-6">Please upload the required documents to complete registration.</p>
          <div className="space-y-4">
            {[
              { label: 'Certified ID / Passport Document *', key: 'id', state: idDoc, setter: setIdDoc },
              { label: 'Certified Grade 12 Results / Last Grade Report *', key: 'grade12', state: grade12Doc, setter: setGrade12Doc },
              { label: 'Proof of Payment (Registration Fee)', key: 'payment', state: proofOfPayment, setter: setProofOfPayment },
            ].map(doc => (
              <div key={doc.key} className="border-2 border-dashed border-gray-300 rounded-xl p-6">
                <label className="font-medium text-gray-700 block mb-2">{doc.label}</label>
                <input type="file" accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => doc.setter(e.target.files[0])}
                  className="block w-full text-sm text-gray-500" />
                {doc.state && (
                  <p className="text-sm mt-2 font-medium" style={{ color: '#8DC63F' }}>✓ {doc.state.name} uploaded</p>
                )}
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 rounded-xl bg-yellow-50 border border-yellow-200">
            <p className="text-sm text-yellow-800"><strong>Registration Fee:</strong> R500 Reg Fee + R700 Admin fee required. Please upload proof of payment above.</p>
          </div>
          <div className="flex justify-between mt-6">
            <button onClick={() => setStep(2)}
              className="px-8 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50">← Back</button>
            <button onClick={() => setStep(4)}
              className="px-8 py-3 text-white font-semibold rounded-lg"
              style={{ background: '#1B1F8A' }}>Next: Payer Details →</button>
          </div>
        </div>
      )}

      {/* Step 4 */}
      {step === 4 && (
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h3 className="font-bold text-gray-800 mb-6 text-lg">Payer Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2"><label className={labelClass}>Who is paying for this account? *</label>
              <select name="payerType" value={form.payerType} onChange={handleChange} className={inputClass} required>
                <option value="">Select</option>
                <option>Self</option><option>Parents / Guardian</option><option>Employer</option><option>Bursary</option>
              </select>
            </div>
            <div><label className={labelClass}>Name of Person / Entity *</label>
              <input name="payerName" value={form.payerName} onChange={handleChange} className={inputClass} placeholder="Full name or company name" required />
            </div>
            <div><label className={labelClass}>ID Number *</label>
              <input name="payerIdNumber" value={form.payerIdNumber} onChange={handleChange} className={inputClass} placeholder="13-digit ID number" maxLength={13} />
            </div>
            <div className="col-span-2"><label className={labelClass}>Physical Address *</label>
              <input name="payerAddress" value={form.payerAddress} onChange={handleChange} className={inputClass} placeholder="Full address" required />
            </div>
            <div><label className={labelClass}>Cell Number *</label>
              <input name="payerCell" value={form.payerCell} onChange={handleChange} className={inputClass} placeholder="e.g. 071 234 5678" required />
            </div>
            <div><label className={labelClass}>Where did you hear about us?</label>
              <select name="hearAboutUs" value={form.hearAboutUs} onChange={handleChange} className={inputClass}>
                <option value="">Select</option>
                <option>Billboards</option><option>Newspaper</option><option>Website</option>
                <option>Radio</option><option>Friends / Family</option><option>Other</option>
              </select>
            </div>
          </div>
          <div className="mt-6 p-4 rounded-xl bg-blue-50 border border-blue-200">
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" name="payerConsent" checked={form.payerConsent} onChange={handleChange} className="mt-1" />
              <p className="text-sm text-blue-800"><strong>Payer Declaration:</strong> I accept full responsibility for tuition fees payment and agree to pay monthly instalments before the 3rd of each month. I agree that fees are payable even if the student does not attend lectures.</p>
            </label>
          </div>
          <div className="flex justify-between mt-6">
            <button onClick={() => setStep(3)}
              className="px-8 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50">← Back</button>
            <button onClick={() => setStep(5)}
              disabled={!form.payerType || !form.payerName || !form.payerConsent}
              className="px-8 py-3 text-white font-semibold rounded-lg disabled:opacity-50"
              style={{ background: '#1B1F8A' }}>Next: Review & Confirm →</button>
          </div>
        </div>
      )}

      {/* Step 5 */}
      {step === 5 && (
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h3 className="font-bold text-gray-800 mb-6 text-lg">Review & Confirm Registration</h3>
          <div className="flex items-center gap-6 mb-6 p-4 bg-gray-50 rounded-xl">
            {photo
              ? <img src={photo} alt="Student" className="w-20 h-24 object-cover rounded-lg border-2" style={{ borderColor: '#1B1F8A' }} />
              : <div className="w-20 h-24 bg-gray-200 rounded-lg flex items-center justify-center text-3xl">👤</div>
            }
            <div>
              <p className="text-xl font-bold" style={{ color: '#1B1F8A' }}>{form.title} {form.firstName} {form.lastName}</p>
              <p className="text-gray-500">{form.idNumber}</p>
              <p className="text-gray-500">{form.cellNumber}</p>
              <p className="text-gray-500">{form.email}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            {[
              { label: 'Course', value: selectedCourse?.name },
              { label: 'Faculty', value: selectedFaculty },
              { label: 'Campus', value: form.campus },
              { label: 'Study Mode', value: form.studyMode },
              { label: 'Duration', value: selectedCourse?.duration },
              { label: 'Deposit Required', value: `R${selectedCourse?.deposit?.toLocaleString()}` },
              { label: 'Monthly Fee', value: selectedCourse?.monthly > 0 ? `R${selectedCourse?.monthly?.toLocaleString()}` : 'N/A' },
              { label: 'Total Fees', value: `R${selectedCourse?.total?.toLocaleString()}` },
              { label: 'Payer', value: form.payerName },
              { label: 'Payment Type', value: form.payerType },
            ].map(item => (
              <div key={item.label} className="py-3 border-b border-gray-100">
                <p className="text-xs text-gray-400">{item.label}</p>
                <p className="font-semibold text-gray-800">{item.value}</p>
              </div>
            ))}
          </div>
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 mb-6">
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" name="studentConsent" checked={form.studentConsent} onChange={handleChange} className="mt-1" />
              <p className="text-xs text-gray-600"><strong>Student Declaration:</strong> I declare that all information provided is true and correct. I agree to comply with all SA Shepherd College rules, regulations and policies. I understand that fees are payable in full regardless of attendance.</p>
            </label>
          </div>
          <div className="flex justify-between">
            <button onClick={() => setStep(4)}
              className="px-8 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50">← Back</button>
            <button onClick={handleSubmit}
              disabled={!form.studentConsent || loading}
              className="px-8 py-3 text-white font-semibold rounded-lg disabled:opacity-50"
              style={{ background: '#E91E8C' }}>
              {loading ? 'Registering...' : '✓ Complete Registration'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}