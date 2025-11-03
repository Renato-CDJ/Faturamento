import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const Profile: React.FC = () => {
  const { currentUser } = useContext(AuthContext);

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Perfil do Usuário</h1>
      <p><strong>Email:</strong> {currentUser.email}</p>
      <p><strong>ID do Usuário:</strong> {currentUser.uid}</p>
      {/* Adicione mais informações do usuário conforme necessário */}
    </div>
  );
};

export default Profile;