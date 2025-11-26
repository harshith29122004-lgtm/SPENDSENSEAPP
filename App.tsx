import React from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import LoginPage from './components/LoginPage';
import SpendSenseApp from './components/SpendSenseApp';
import { User } from './types';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useLocalStorage<string | null>('currentUser', null);
  const [users, setUsers] = useLocalStorage<User[]>('users', []);

  const handleLogin = (email: string) => {
    setCurrentUser(email);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans transition-colors duration-300">
      {currentUser ? (
        <SpendSenseApp 
          currentUserEmail={currentUser} 
          onLogout={handleLogout}
          users={users}
          setUsers={setUsers}
        />
      ) : (
        <LoginPage 
          onLoginSuccess={handleLogin}
          users={users}
          setUsers={setUsers}
        />
      )}
    </div>
  );
};

export default App;