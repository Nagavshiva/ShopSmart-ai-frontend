import React, { useState } from 'react';
import Title from '../components/Title';
import CartTotal from '../components/CartTotal';
import { assets } from '../assets/assets';
import { useDispatch, useSelector } from 'react-redux';
import { placeOrderCOD, placeOrderRazorpay, placeOrderStripe } from '../redux/orderSlice';
import { resetCart } from '../redux/cartSlice';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PlaceOrder = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items: cartItems } = useSelector((state) => state.cart);
  const { products } = useSelector((state) => state.product); // You must have productSlice for this
  const { token, user } = useSelector((state) => state.user);
  const delivery_fee = 10;

  const [method, setMethod] = useState('cod');
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', street: '',
    city: '', state: '', zipcode: '', country: '', phone: ''
  });

  const onChangeHandler = e => setFormData(d => ({ ...d, [e.target.name]: e.target.value }));

  const getCartAmount = () => {
    let total = 0;
    Object.entries(cartItems).forEach(([id, sizes]) => {
      Object.entries(sizes).forEach(([size, qty]) => {
        if (qty > 0) {
          const product = products.find(p => p._id === id);
          if (product) total += product.price * qty;
        }
      });
    });
    return total;
  };

  const buildItems = () => {
    return Object.entries(cartItems).flatMap(([id, sizes]) =>
      Object.entries(sizes).map(([size, qty]) => {
        if (qty > 0) {
          const product = products.find(p => p._id === id);
          return {
            ...product,
            size,
            quantity: qty,
          };
        }
        return null;
      }).filter(Boolean)
    );
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const items = buildItems();
    const amount = getCartAmount() + delivery_fee;
    const address = formData;

    const payload = {
      userId: user._id,
      items,
      amount,
      address,
      email: formData.email,
    };

    try {
      if (method === 'cod') {
        await dispatch(placeOrderCOD(payload)).unwrap();
        dispatch(resetCart());
        navigate('/orders');
      }

      if (method === 'stripe') {
        const sessionUrl = await dispatch(placeOrderStripe(payload)).unwrap();
        window.location.href = sessionUrl;
      }

      if (method === 'razorpay') {
        const order = await dispatch(placeOrderRazorpay(payload)).unwrap();
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: order.amount,
          currency: order.currency,
          name: 'Order Payment',
          description: 'Order Payment',
          order_id: order.id,
          handler: async (resp) => {
            const res = await axios.post('/order/verifyRazorpay', resp, { headers: { token } });
            if (res.data.success) {
              dispatch(resetCart());
              navigate('/orders');
            } else {
              toast.error(res.data.message);
            }
          },
        };
        new window.Razorpay(options).open();
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Order failed');
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t">
      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
        <div className="text-xl sm:text-2xl my-3"><Title text1="DELIVERY" text2="INFORMATION" /></div>
        <div className="flex gap-3">
          <input required name="firstName" value={formData.firstName} onChange={onChangeHandler} placeholder="First name" className="border rounded px-3 py-2 w-full" />
          <input required name="lastName" value={formData.lastName} onChange={onChangeHandler} placeholder="Last name" className="border rounded px-3 py-2 w-full" />
        </div>
        <input required type="email" name="email" value={formData.email} onChange={onChangeHandler} placeholder="Email address" className="border rounded px-3 py-2 w-full" />
        <input required name="street" value={formData.street} onChange={onChangeHandler} placeholder="Street address" className="border rounded px-3 py-2 w-full" />
        <div className="flex gap-3">
          <input required name="city" value={formData.city} onChange={onChangeHandler} placeholder="City" className="border rounded px-3 py-2 w-full" />
          <input name="state" value={formData.state} onChange={onChangeHandler} placeholder="State (optional)" className="border rounded px-3 py-2 w-full" />
        </div>
        <div className="flex gap-3">
          <input required type="text" name="zipcode" value={formData.zipcode} onChange={onChangeHandler} placeholder="Zip code" className="border rounded px-3 py-2 w-full" />
          <input required name="country" value={formData.country} onChange={onChangeHandler} placeholder="Country" className="border rounded px-3 py-2 w-full" />
        </div>
        <input required type="tel" name="phone" value={formData.phone} onChange={onChangeHandler} placeholder="Phone number" className="border rounded px-3 py-2 w-full" />
      </div>

      <div className="mt-8 sm:mt-0 sm:ml-8 w-full sm:max-w-xs">
        <CartTotal />
        <Title text1="PAYMENT" text2="METHOD" />
        <div className="flex flex-col gap-3">
          <div onClick={() => setMethod('stripe')} className={`flex items-center gap-3 border p-2 cursor-pointer ${method === 'stripe' ? 'border-green-500' : ''}`}>
            <span className={`w-3 h-3 rounded-full border ${method === 'stripe' ? 'bg-green-500' : ''}`} />
            <img src={assets.stripe_logo} alt="Stripe" className="h-6" />
          </div>
          <div onClick={() => setMethod('razorpay')} className={`flex items-center gap-3 border p-2 cursor-pointer ${method === 'razorpay' ? 'border-green-500' : ''}`}>
            <span className={`w-3 h-3 rounded-full border ${method === 'razorpay' ? 'bg-green-500' : ''}`} />
            <img src={assets.razorpay_logo} alt="Razorpay" className="h-6" />
          </div>
          <div onClick={() => setMethod('cod')} className={`flex items-center gap-3 border p-2 cursor-pointer ${method === 'cod' ? 'border-green-500' : ''}`}>
            <span className={`w-3 h-3 rounded-full border ${method === 'cod' ? 'bg-green-500' : ''}`} />
            <span className="text-sm">Cash on Delivery</span>
          </div>
        </div>
        <button type="submit" className="mt-6 w-full bg-black text-white py-3 rounded">PLACE ORDER</button>
      </div>
    </form>
  );
};

export default PlaceOrder;
