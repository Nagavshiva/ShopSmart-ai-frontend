import React, { useState } from 'react';
import LoginForm from './auth/LoginForm';
import RegisterForm from './auth/RegisterForm';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <>
      {isLogin ? <LoginForm /> : <RegisterForm />}
      <div className="text-center mt-4 text-sm">
        {isLogin ? (
          <p>
            Don’t have an account?{' '}
            <span className="text-blue-500 cursor-pointer" onClick={() => setIsLogin(false)}>
              Sign Up
            </span>
          </p>
        ) : (
          <p>
            Already have an account?{' '}
            <span className="text-blue-500 cursor-pointer" onClick={() => setIsLogin(true)}>
              Login
            </span>
          </p>
        )}
      </div>
    </>
  );
};

export default Login;
