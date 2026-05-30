const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const getToken = () => localStorage.getItem('token');
const getAdmin = () => JSON.parse(localStorage.getItem('admin') || '{}');
const getPermissions = () => JSON.parse(localStorage.getItem('permissions') || '{}');
const getCollege = () => JSON.parse(localStorage.getItem('college') || '{}');

const headers = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getToken()}`,
});

export { getAdmin, getPermissions, getCollege };

// Auth
export const loginAdmin = async (email, password) => {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (data.token) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('admin', JSON.stringify(data.admin));
    localStorage.setItem('permissions', JSON.stringify(data.permissions));
    localStorage.setItem('college', JSON.stringify(data.college));
    localStorage.setItem('role', data.role);
  }
  return data;
};

export const loginStudent = async (studentNumber, password) => {
  const res = await fetch(`${API_URL}/api/auth/student-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ studentNumber, password }),
  });
  return res.json();
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('admin');
  localStorage.removeItem('permissions');
  localStorage.removeItem('college');
  localStorage.removeItem('role');
};
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('admin');
  localStorage.removeItem('permissions');
  localStorage.removeItem('college');
  localStorage.removeItem('role');
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

// Notifications
export const getNotifications = async () => {
  const res = await fetch(`${API_URL}/api/notifications`, { headers: headers() });
  return res.json();
};

export const markNotificationRead = async (id) => {
  const res = await fetch(`${API_URL}/api/notifications/${id}/read`, {
    method: 'PATCH',
    headers: headers(),
  });
  return res.json();
};

// Invoices
export const getInvoices = async () => {
  const res = await fetch(`${API_URL}/api/invoices`, { headers: headers() });
  return res.json();
};