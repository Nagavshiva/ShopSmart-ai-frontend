import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../redux/auth/userSlice';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, loading, error } = useSelector((state) => state.user);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = (data) => {
    dispatch(loginUser(data)).then((res) => {
      if (res.payload?.token) {
        toast.success('Login successful!');
        reset();
      } else {
        toast.error(res.payload || 'Login failed');
      }
    });
  };

  useEffect(() => {
    if (token) navigate('/');
  }, [token, navigate]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col items-center w-full max-w-md px-4 mx-auto mt-10 gap-4 text-gray-800"
    >
      <div className="inline-flex items-center gap-2 mb-2 mt-6">
        <p className="text-3xl prata-regular">Login</p>
        <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
      </div>

      {/* Email Field */}
      <div className="w-full">
        <input
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Invalid email format',
            },
            validate: (value) => {
              const allowedDomains = [
                'gmail.com',
                'yahoo.com',
                'outlook.com',
                'hotmail.com',
                'protonmail.com',
                'icloud.com',
              ];
              const domain = value.split('@')[1];
              return allowedDomains.includes(domain) || 'Unsupported email domain';
            },
          })}
          type="email"
          placeholder="Email"
          className="w-full px-3 py-2 border border-gray-800 rounded-md"
        />
        {errors.email && (
          <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Password Field */}
      <div className="w-full relative">
        <input
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: 8,
              message: 'Minimum 8 characters',
            },
          })}
          type={showPassword ? 'text' : 'password'}
          placeholder="Password"
          className="w-full px-3 py-2 border border-gray-800 rounded-md pr-10"
        />
        <div
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute top-6 right-3 transform -translate-y-1/2 cursor-pointer text-gray-600"
        >
          {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
        </div>
        {errors.password && (
          <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
        )}
        <div className="text-right mt-1">
          <Link
            to="/forgot-password"
            className="text-blue-600 text-sm hover:underline"
          >
            Forgot Password?
          </Link>
        </div>
      </div>

      {/* Submit Button */}
      <button
        disabled={loading}
        type="submit"
        className="bg-black text-white w-full py-2 rounded-md mt-2 hover:bg-gray-900 transition"
      >
        {loading ? 'Please wait...' : 'Sign In'}
      </button>

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </form>
  );
};

export default LoginForm;
