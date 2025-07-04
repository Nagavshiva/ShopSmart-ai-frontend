import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { resetCart } from '../redux/cartSlice';

const Verify = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { token } = useSelector((state) => state.user);

  const success = searchParams.get('success');
  const orderId = searchParams.get('orderId');
  const backendUrl = import.meta.env.VITE_API_BASE_URL; 

  const verifyPayment = async () => {
    try {
      if (!token) return;

      const response = await axios.post(
        `${backendUrl}/api/order/verifyStripe`,
        { success, orderId },
        { headers: { token } }
      );

      if (response.data.success) {
        dispatch(resetCart());
        navigate('/orders');
      } else {
        navigate('/cart');
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message || 'Verification failed');
    }
  };

  useEffect(() => {
    verifyPayment();
  }, [token]);

  return <div className="min-h-[40vh] flex items-center justify-center">Verifying payment...</div>;
};

export default Verify;
