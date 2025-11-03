import React from 'react';
import { useAuth } from '../../hooks/useAuth';

const Logout: React.FC = () => {
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      // Optionally, you can redirect the user or show a success message
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <button onClick={handleLogout}>
      Logout
    </button>
  );
};

export default Logout;