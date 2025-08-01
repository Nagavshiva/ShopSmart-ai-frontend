import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Title from './Title';
import ProductItem from './ProductItem';
import { fetchAllProducts } from '../redux/productSlice';

const LatestCollection = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.product.products);

  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    // Fetch products if not already loaded
    if (products.length === 0) {
      dispatch(fetchAllProducts());
    }
  }, [dispatch, products]);

  useEffect(() => {
    setLatestProducts(products.slice(0, 10));
  }, [products]);

  return (
    <div className='my-10'>
      <div className='text-center py-8 text-3xl'>
        <Title text1={'LATEST'} text2={'COLLECTIONS'} />
        <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the.
        </p>
      </div>

      {/* Rendering Products */}
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
        {latestProducts.map((item, index) => (
          <ProductItem
            key={index}
            id={item._id}
            image={item.image}
            name={item.name}
            price={item.price}
          />
        ))}
      </div>
    </div>
  );
};

export default LatestCollection;
