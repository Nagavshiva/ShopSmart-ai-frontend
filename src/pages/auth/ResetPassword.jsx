import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { resetPassword } from '../../redux/auth/userSlice';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const ResetPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, user } = useSelector((state) => state.user);
  const phone = user?.user?.phone;

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      phone: phone || '',
    },
  });

  const onSubmit = async (data) => {
    try {
      const res = await dispatch(resetPassword(data)).unwrap();
      if (res?.success) {
        toast.success('Password reset successful');
        navigate('/login');
      } else {
        toast.error(res?.message || 'Reset failed');
      }
    } catch (error) {
      toast.error(error?.message || 'Reset failed');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md p-6 rounded border bg-white shadow"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center">Reset Password</h2>

        {/* Phone - Disabled */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Phone Number</label>
          <input
            {...register('phone')}
            type="tel"
            disabled
            className="w-full px-4 py-2 border border-gray-300 rounded bg-gray-100 text-gray-700 cursor-not-allowed"
          />
        </div>

        {/* OTP */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">OTP</label>
          <input
            {...register('otp', { required: 'OTP is required' })}
            type="text"
            disabled={!phone}
            className="w-full px-4 py-2 border border-gray-300 rounded"
          />
          {errors.otp && <p className="text-red-500 text-sm mt-1">{errors.otp.message}</p>}
        </div>

        {/* New Password with Eye Icon */}
        <div className="mb-4 relative">
          <label className="block text-gray-700 mb-1">New Password</label>
          <input
            {...register('newPassword', {
              required: 'New password is required',
              minLength: { value: 8, message: 'Minimum 8 characters' },
            })}
            type={showNewPassword ? 'text' : 'password'}
            disabled={!phone}
            className="w-full px-4 py-2 border border-gray-300 rounded pr-10"
          />
          <div
            onClick={() => setShowNewPassword((prev) => !prev)}
            className="absolute top-[38px] right-3 cursor-pointer text-gray-600"
          >
            {showNewPassword ? <FiEyeOff /> : <FiEye />}
          </div>
          {errors.newPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.newPassword.message}</p>
          )}
        </div>

        {/* Confirm Password with Eye Icon */}
        <div className="mb-4 relative">
          <label className="block text-gray-700 mb-1">Confirm Password</label>
          <input
            {...register('confirmPassword', {
              required: 'Confirm password is required',
              validate: (value) =>
                value === watch('newPassword') || 'Passwords do not match',
            })}
            type={showConfirmPassword ? 'text' : 'password'}
            disabled={!phone}
            className="w-full px-4 py-2 border border-gray-300 rounded pr-10"
          />
          <div
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            className="absolute top-[38px] right-3 cursor-pointer text-gray-600"
          >
            {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || !phone}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
