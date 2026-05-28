import React, { useState } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import StudentPortal from './pages/StudentPortal';

function App() {
  const [view, setView] = useState('login');

  return (
    <div>
      {view === 'login' && (
        <Login
          onLogin={() => setView('dashboard')}
          onStudentPortal={() => setView('student')}
        />
      )}
      {view === 'dashboard' && <Dashboard />}
      {view === 'student' && (
        <StudentPortal onBackToAdmin={() => setView('login')} />
      )}
    </div>
  );
}

export default App;