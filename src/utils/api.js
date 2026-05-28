const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const getToken = () => localStorage.getItem('token');

const headers = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getToken()}`,
});

// Auth
export const loginAdmin = async (email, password) => {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
};

export const loginStudent = async (studentNumber, password) => {
  const res = await fetch(`${API_URL}/api/auth/student-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ studentNumber, password }),
  });
  return res.json();
};

// Students
export const getStudents = async () => {
  const res = await fetch(`${API_URL}/api/students`, { headers: headers() });
  return res.json();
};

export const registerStudent = async (data) => {
  const res = await fetch(`${API_URL}/api/students`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(data),
  });
  return res.json();
};

// Stats
export const getStats = async () => {
  const res = await fetch(`${API_URL}/api/stats`, { headers: headers() });
  return res.json();
};

// Marks
export const getMarks = async (course) => {
  const res = await fetch(`${API_URL}/api/marks/${encodeURIComponent(course)}`, { headers: headers() });
  return res.json();
};

export const saveMark = async (data) => {
  const res = await fetch(`${API_URL}/api/marks`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(data),
  });
  return res.json();
};

// Finance
export const getFinance = async () => {
  const res = await fetch(`${API_URL}/api/finance`, { headers: headers() });
  return res.json();
};

export const recordPayment = async (data) => {
  const res = await fetch(`${API_URL}/api/finance/payment`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(data),
  });
  return res.json();
};

// Attendance
export const getAttendance = async () => {
  const res = await fetch(`${API_URL}/api/attendance`, { headers: headers() });
  return res.json();
};

export const saveAttendance = async (data) => {
  const res = await fetch(`${API_URL}/api/attendance`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(data),
  });
  return res.json();
};