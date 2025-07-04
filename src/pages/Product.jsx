import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { fetchSingleProduct } from '../redux/productSlice';
import { addToCart } from '../redux/cartSlice';
import { assets } from '../assets/assets';
import RelatedProducts from '../components/RelatedProducts';

const Product = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();

  const productData = useSelector((state) => state.product.product);
  const loading = useSelector((state) => state.product.loading);
  const user = useSelector((state) => state.user.user); // ✅ Get user from Redux
  const currency = '₹';

  const [image, setImage] = useState('');
  const [size, setSize] = useState('');

  useEffect(() => {
    dispatch(fetchSingleProduct(productId));
  }, [dispatch, productId]);

  useEffect(() => {
    if (productData && productData.image?.length > 0) {
      setImage(productData.image[0]);
    }
  }, [productData]);

  const handleAddToCart = () => {
    if (!user) {
      toast.error('Login first to add item to cart'); // ✅ Toast for not logged in
      return;
    }

    if (!size) {
      toast.warning('Please select a size'); // ✅ Toast for size not selected
      return;
    }

    dispatch(addToCart({ itemId: productData._id, size }));
    toast.success('Item added to cart'); // Optional success toast
  };

  if (loading || !productData) return <div className="pt-20 text-center">Loading...</div>;

  return (
    <div className='border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100'>
      {/* Product Details */}
      <div className='flex gap-12 sm:gap-12 flex-col sm:flex-row'>
        {/* Images */}
        <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>
          <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full'>
            {productData.image.map((item, index) => (
              <img
                onClick={() => setImage(item)}
                src={item}
                key={index}
                className='w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer'
                alt=""
              />
            ))}
          </div>
          <div className='w-full sm:w-[80%]'>
            <img className='w-full h-auto' src={image} alt="" />
          </div>
        </div>

        {/* Info */}
        <div className='flex-1'>
          <h1 className='font-medium text-2xl mt-2'>{productData.name}</h1>
          <div className='flex items-center gap-1 mt-2'>
            {[...Array(4)].map((_, i) => (
              <img src={assets.star_icon} key={i} className="w-3.5" alt="star" />
            ))}
            <img src={assets.star_dull_icon} className="w-3.5" alt="star" />
            <p className='pl-2'>(122)</p>
          </div>
          <p className='mt-5 text-3xl font-medium'>{currency}{productData.price}</p>
          <p className='mt-5 text-gray-500 md:w-4/5'>{productData.description}</p>

          <div className='flex flex-col gap-4 my-8'>
            <p>Select Size</p>
            <div className='flex gap-2'>
              {productData.sizes.map((item, index) => (
                <button
                  onClick={() => setSize(item)}
                  className={`border py-2 px-4 cursor-pointer bg-gray-100 ${item === size ? 'bg-orange-500' : ''}`}
                  key={index}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className='bg-black text-white px-8 py-3 text-sm active:bg-gray-700 cursor-pointer'
          >
            ADD TO CART
          </button>

          <hr className='mt-8 sm:w-4/5' />
          <div className='text-sm text-gray-500 mt-5 flex flex-col gap-1'>
            <p>100% Original product.</p>
            <p>Cash on delivery is available on this product.</p>
            <p>Easy return and exchange policy within 7 days.</p>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className='mt-20'>
        <div className='flex'>
          <b className='border px-5 py-3 text-sm'>Description</b>
          <p className='border px-5 py-3 text-sm'>Reviews (122)</p>
        </div>
        <div className='flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500'>
          <p>An e-commerce website is an online platform that facilitates buying and selling of products or services over the internet...</p>
          <p>Products are displayed with detailed descriptions, images, prices, and variations (e.g., sizes, colors).</p>
        </div>
      </div>

      {/* Related */}
      <RelatedProducts
        category={productData.category}
        subCategory={productData.subCategory}
      />
    </div>
  );
};

export default Product;
