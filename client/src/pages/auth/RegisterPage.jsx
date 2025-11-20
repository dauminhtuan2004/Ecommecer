import { useState } from 'react';
import RegisterForm from '../../components/auth/RegisterForm';
import LoginForm from '../../components/auth/LoginForm';

function RegisterPage({ initialForm = 'register' }) {
  const [formType, setFormType] = useState(initialForm);

  const toggleForm = (type) => {
    setFormType(type);
  };

  return (
    <div className="bg-gray-100 flex items-center justify-center h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        {formType === 'register' ? <RegisterForm toggleForm={toggleForm} /> : <LoginForm toggleForm={toggleForm} />}
      </div>
    </div>
  );
}

export default RegisterPage;