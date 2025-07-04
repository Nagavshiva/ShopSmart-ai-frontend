import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Title from '../components/Title';
import { fetchUserOrders } from '../redux/orderSlice';

const Orders = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.token);
  const currency = '₹';
  const { loading, error } = useSelector((state) => state.order);
  const [orderData, setOrderData] = useState([]);

  const processOrders = useCallback((orders) => {
    const allOrdersItem = [];
    orders.forEach((order) => {
      order.items.forEach((item) => {
        allOrdersItem.push({
          ...item,
          status: order.status,
          payment: order.payment,
          paymentMethod: order.paymentMethod,
          date: order.date,
        });
      });
    });
    setOrderData(allOrdersItem.reverse());
  }, []);

  useEffect(() => {
    if (token) {
      dispatch(fetchUserOrders())
        .unwrap()
        .then((orders) => processOrders(orders))
        .catch((err) => console.error('Failed to fetch orders:', err));
    }
  }, [dispatch, token, processOrders]);

  return (
    <div className="border-t pt-16 px-4 sm:px-8 lg:px-20">
      <div className="text-xl sm:text-2xl md:text-3xl font-semibold">
        <Title text1="MY" text2="ORDERS" />
      </div>

      {loading && <p className="text-sm text-gray-500 mt-4">Loading orders...</p>}
      {error && <p className="text-sm text-red-500 mt-4">{error}</p>}

      <div className="mt-6 space-y-6">
        {orderData.map((item, index) => (
          <div
            key={index}
            className="py-4 px-3 border rounded-md shadow-sm flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
          >
            <div className="flex gap-4 items-start sm:items-center">
              <img className="w-20 h-20 object-cover rounded" src={item.image[0]} alt={item.name} />
              <div className="text-sm sm:text-base text-gray-700">
                <p className="font-semibold">{item.name}</p>
                <div className="mt-1 space-y-1">
                  <p>{currency}{item.price} &nbsp; | &nbsp; Quantity: {item.quantity} &nbsp; | &nbsp; Size: {item.size}</p>
                  <p className="text-xs text-gray-500">
                    Date: {new Date(item.date).toDateString()}
                  </p>
                  <p className="text-xs text-gray-500">
                    Payment: {item.paymentMethod}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-6 md:w-1/2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                <p className="text-sm sm:text-base">{item.status}</p>
              </div>
              <button
                onClick={() => dispatch(fetchUserOrders())}
                className="border border-gray-400 text-sm sm:text-base px-4 py-1.5 rounded hover:bg-gray-100 transition"
              >
                Track Order
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
