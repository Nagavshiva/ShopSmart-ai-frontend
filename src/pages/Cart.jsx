import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import CartTotal from '../components/CartTotal';
import { updateCartItem, fetchCart } from '../redux/cartSlice';
import { fetchAllProducts } from '../redux/productSlice';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const products = useSelector((state) => state.product.products);
  const cartItems = useSelector((state) => state.cart.items);
  const currency = '₹';

  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    dispatch(fetchAllProducts());
    dispatch(fetchCart());
  }, [dispatch]);

  useEffect(() => {
    if (products.length > 0) {
      const tempData = [];
      for (const itemId in cartItems) {
        for (const size in cartItems[itemId]) {
          const quantity = cartItems[itemId][size];
          if (quantity > 0) {
            tempData.push({
              _id: itemId,
              size,
              quantity,
            });
          }
        }
      }
      setCartData(tempData);
    }
  }, [cartItems, products]);

  const handleUpdateQuantity = (itemId, size, quantity) => {
    dispatch(updateCartItem({ itemId, size, quantity }));
  };

  return (
    <div className="border-t pt-14 px-4 sm:px-8 lg:px-20">
      <div className="text-2xl mb-3">
        <Title text1={'YOUR'} text2={'CART'} />
      </div>

      {cartData.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          <p className="text-lg font-medium mb-4">Your cart is empty</p>
          <button
            onClick={() => navigate('/collection')}
            className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition"
          >
            CONTINUE SHOPPING
          </button>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-6">
            {cartData.map((item, index) => {
              const productData = products.find((product) => product._id === item._id);
              if (!productData) return null;

              return (
                <div
                  key={index}
                  className="py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                >
                  {/* Product Info */}
                  <div className="flex items-start gap-4 md:gap-6 w-full md:w-3/5 min-w-0">
                    <img
                      className="w-16 sm:w-20 md:w-24 object-cover rounded"
                      src={productData.image[0]}
                      alt=""
                    />
                    <div className="flex flex-col justify-between min-w-0">
                      <p className="text-sm sm:text-base md:text-lg font-medium break-words">
                        {productData.name}
                      </p>
                      <div className="flex items-center flex-wrap gap-3 sm:gap-5 mt-2 text-sm sm:text-base">
                        <p>{currency}{productData.price}</p>
                        <p className="px-2 sm:px-3 sm:py-1 border bg-slate-50">{item.size}</p>
                      </div>
                    </div>
                  </div>

                  {/* Quantity & Delete */}
                  <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-2/5">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          item.quantity > 1 &&
                          handleUpdateQuantity(item._id, item.size, item.quantity - 1)
                        }
                        className="px-2 py-1 border rounded text-sm"
                      >
                        -
                      </button>
                      <span className="w-6 text-center text-sm">{item.quantity}</span>
                      <button
                        onClick={() =>
                          handleUpdateQuantity(item._id, item.size, item.quantity + 1)
                        }
                        className="px-2 py-1 border rounded text-sm"
                      >
                        +
                      </button>
                    </div>

                    {/* Delete Button */}
                    <img
                      onClick={() => handleUpdateQuantity(item._id, item.size, 0)}
                      className="w-4 sm:w-5 cursor-pointer"
                      src={assets.bin_icon}
                      alt="delete"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Continue Shopping Link (Bottom Left) */}
          <div className="mt-8">
            <button
              onClick={() => navigate('/collection')}
              className="text-sm text-gray-700 underline hover:text-black transition"
            >
              ← Continue Shopping
            </button>
          </div>

          {/* Cart Total Section */}
          <div className="flex justify-end mt-10 mb-20">
            <div className="w-full sm:w-[400px]">
              <CartTotal />
              <div className="w-full text-end">
                <button
                  onClick={() => navigate('/place-order')}
                  className="bg-black text-white text-sm mt-6 px-6 py-3 hover:bg-gray-800 transition"
                >
                  PROCEED TO CHECKOUT
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
