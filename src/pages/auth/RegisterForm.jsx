import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../redux/auth/userSlice';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import PhoneInput from 'react-phone-input-2';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import 'react-phone-input-2/lib/style.css';

const RegisterForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, loading, error } = useSelector((state) => state.user);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await dispatch(registerUser(data)).unwrap();
      if (res?.token) {
        toast.success('Registered successfully!');
        reset();
      }
    } catch (error) {
      toast.error(error || 'Registration failed');
    }
  };

  useEffect(() => {
    if (token) navigate('/');
  }, [token, navigate]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col items-center w-full max-w-md px-4 mx-auto mt-10 gap-4 text-gray-800"
    >
      <div className="inline-flex items-center gap-2 mb-2 mt-4">
        <p className="text-3xl prata-regular">Sign Up</p>
        <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
      </div>

      {/* Name */}
      <div className="w-full">
        <input
          {...register('name', { required: 'Name is required' })}
          type="text"
          placeholder="Name"
          className="w-full px-3 py-2 border border-gray-800 rounded-md"
        />
        {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
      </div>

      {/* Email */}
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
        {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
      </div>

      {/* Phone */}
      <div className="w-full">
        <Controller
          name="phone"
          control={control}
          rules={{
            required: 'Phone number is required',
            validate: (value) =>
              value.startsWith('91') && value.length === 12
                ? true
                : 'Phone must be a valid 10-digit Indian number',
          }}
          render={({ field }) => (
            <PhoneInput
              {...field}
              country={'in'}
              onlyCountries={['in']}
              countryCodeEditable={false}
              inputProps={{
                name: 'phone',
                required: true,
              }}
              inputClass="!w-full !border !border-gray-800 !py-2 !px-10"
              placeholder="Phone"
            />
          )}
        />
        {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
      </div>

      {/* Password with Eye Icon */}
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
          className="w-full px-3 py-2 pr-10 border border-gray-800 rounded-md"
        />
        <div
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-gray-600"
        >
          {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
        </div>
        {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>}
      </div>

      {/* Submit */}
      <button
        disabled={loading}
        type="submit"
        className="bg-black text-white w-full py-2 rounded-md mt-2 hover:bg-gray-900 transition"
      >
        {loading ? 'Please wait...' : 'Sign Up'}
      </button>

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </form>
  );
};

export default RegisterForm;
