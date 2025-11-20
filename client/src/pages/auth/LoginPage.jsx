import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LoginForm from '../../components/auth/LoginForm';
import RegisterForm from '../../components/auth/RegisterForm';
import ForgotPasswordForm from '../../components/auth/ForgotPasswordForm';
import GoogleLoginButton from '../../components/auth/ButtonGoogle';

function LoginPage() {
  const [currentForm, setCurrentForm] = useState('login');

  const toggleForm = (formName) => {
    setCurrentForm(formName);
  };

  const renderForm = () => {
    switch (currentForm) {
      case 'login':
        return (
          <>
            <LoginForm toggleForm={toggleForm} />
            <div className="my-4 text-center">
              <GoogleLoginButton />
            </div>
          </>
        );
      case 'register':
        return <RegisterForm toggleForm={toggleForm} />;
      case 'forgotPassword':
        return <ForgotPasswordForm toggleForm={toggleForm} />;
      default:
        return (
          <>
            <LoginForm toggleForm={toggleForm} />
            <div className="my-4 text-center">
              <GoogleLoginButton />
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen flex overflow-hidden relative">
      <AnimatePresence mode="wait">
        {currentForm === 'login' && (
          <>
            {/* Ảnh bên phải */}
            <motion.div
              key="image-login"
              className="hidden lg:flex absolute right-0 top-0 w-1/2 h-screen items-center justify-center bg-white z-10"
              initial={{ x: window.innerWidth / 2, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -window.innerWidth / 2, opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            >
              <img
                src="/thoitrangnam.jpg"
                alt="Login illustration"
                className="w-full h-full object-cover"
              />
            </motion.div>
            {/* Form bên trái */}
            <motion.div
              key="form-login"
              className="absolute left-0 top-0 w-1/2 h-screen flex items-center justify-center bg-gray-50 p-8 z-20"
              initial={{ x: -window.innerWidth / 2, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: window.innerWidth / 2, opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            >
              <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key="login-form"
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                      {renderForm()}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </>
        )}
        {(currentForm === 'register' || currentForm === 'forgotPassword') && (
          <>
            {/* Ảnh trượt sang trái */}
            <motion.div
              key={`image-${currentForm}`}
              className="hidden lg:flex absolute left-0 top-0 w-1/2 h-screen items-center justify-center bg-white z-10"
              initial={{ x: -window.innerWidth / 2, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: window.innerWidth / 2, opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            >
              <img
                src="/thoitrangnam.jpg"
                alt={`${currentForm} illustration`}
                className="w-full h-full object-cover"
              />
            </motion.div>
            {/* Form trượt sang phải */}
            <motion.div
              key={`form-${currentForm}`}
              className="absolute right-0 top-0 w-1/2 h-screen flex items-center justify-center bg-gray-50 p-8 z-20"
              initial={{ x: window.innerWidth / 2, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -window.innerWidth / 2, opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            >
              <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`${currentForm}-form`}
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 50 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                      {renderForm()}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default LoginPage;