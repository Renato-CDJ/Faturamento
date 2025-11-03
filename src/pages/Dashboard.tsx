import React from 'react';
import { useAuth } from '../hooks/useAuth';

const Dashboard: React.FC = () => {
  const { currentUser } = useAuth();

  return (
    <div>
      <h1>Dashboard</h1>
      {currentUser ? (
        <div>
          <h2>Welcome, {currentUser.email}!</h2>
          <p>This is your dashboard where you can manage your data.</p>
          {/* Additional dashboard content can go here */}
        </div>
      ) : (
        <p>Please log in to access your dashboard.</p>
      )}
    </div>
  );
};

export default Dashboard;