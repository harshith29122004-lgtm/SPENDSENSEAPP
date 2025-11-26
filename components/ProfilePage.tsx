import React, { useState, useMemo } from 'react';
import { User } from '../types';

interface ProfilePageProps {
  currentUserEmail: string;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  onLogout: () => void;
  onBack: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ currentUserEmail, users, setUsers, onLogout, onBack }) => {
  const currentUser = useMemo(() => users.find(u => u.email === currentUserEmail), [users, currentUserEmail]);

  const [name, setName] = useState(currentUser?.name || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (password && password.length < 8) {
        setMessage({ type: 'error', text: 'New password must be at least 8 characters long.' });
        return;
    }

    if (password && password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match.' });
      return;
    }

    setUsers(prevUsers => prevUsers.map(user => {
      if (user.email === currentUserEmail) {
        return {
          ...user,
          name: name.trim(),
          password: password ? password : user.password,
        };
      }
      return user;
    }));

    setMessage({ type: 'success', text: 'Profile updated successfully!' });
    setPassword('');
    setConfirmPassword('');
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action is irreversible and all your data will be lost.')) {
      // Remove user from users array
      setUsers(prevUsers => prevUsers.filter(user => user.email !== currentUserEmail));
      // Remove user's specific data from localStorage
      localStorage.removeItem(`transactions_${currentUserEmail}`);
      localStorage.removeItem(`budget_${currentUserEmail}`);
      // Log the user out
      onLogout();
    }
  };

  if (!currentUser) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">Error: Could not find user data.</p>
        <button onClick={onBack} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-6 md:p-8 rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">My Profile</h2>
        <button onClick={onBack} className="text-blue-500 hover:underline">
            &larr; Back to Dashboard
        </button>
      </div>
      
      {/* Profile Info Form */}
      <form onSubmit={handleUpdateProfile} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
          <input
            id="email" type="email" disabled
            value={currentUser.email}
            className="mt-1 w-full px-3 py-2 bg-gray-100 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-md text-gray-500 dark:text-gray-400"
          />
        </div>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
          <input
            id="name" type="text" required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Change Password</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Leave blank to keep your current password.</p>
        </div>

        <div>
            <label htmlFor="password"className="block text-sm font-medium text-gray-700 dark:text-gray-300">New Password</label>
            <input
                id="password" name="password" type="password"
                value={password} onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="8+ characters"
            />
        </div>
        <div>
            <label htmlFor="confirm-password"className="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm New Password</label>
            <input
                id="confirm-password" name="confirm-password" type="password"
                value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
        </div>
        
        {message && (
          <p className={`text-sm text-center ${message.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
            {message.text}
          </p>
        )}
        
        <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              Save Changes
            </button>
        </div>
      </form>

      {/* Danger Zone */}
      <div className="mt-8 pt-6 border-t border-red-500/30">
        <h3 className="text-lg font-medium text-red-600 dark:text-red-500">Danger Zone</h3>
        <div className="mt-4 flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <div>
            <p className="font-semibold text-gray-800 dark:text-gray-200">Delete this account</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Once you delete your account, there is no going back.</p>
          </div>
          <button
            onClick={handleDeleteAccount}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
