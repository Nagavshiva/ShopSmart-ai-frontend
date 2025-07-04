import { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { ShopContext } from './ShopContext';

const ShopContextProvider = (props) => {
    const currency = '$';
    const delivery_fee = 10;
    const backendUrl = import.meta.env.VITE_API_BASE_URL;
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState({});
    const [products, setProducts] = useState([]);
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const navigate = useNavigate();

    const addToCart = async (itemId, size) => {
        if (!size) {
            toast.error('Select Product Size');
            return;
        }

        setCartItems(prevCartItems => {
            const newCartItems = { ...prevCartItems };
            
            if (!newCartItems[itemId]) {
                newCartItems[itemId] = {};
            }
            
            newCartItems[itemId][size] = (newCartItems[itemId][size] || 0) + 1;
            
            return newCartItems;
        });

        if (token) {
            try {
                await axios.post(
                    backendUrl + '/api/cart/add', 
                    { itemId, size }, 
                    { headers: { token } }
                );
            } catch (error) {
                console.error(error);
                toast.error(error.response?.data?.message || error.message);
            }
        }
    };

    const getCartCount = useCallback(() => {
        return Object.values(cartItems).reduce((total, sizes) => {
            return total + Object.values(sizes).reduce((sum, quantity) => {
                return sum + (quantity > 0 ? quantity : 0);
            }, 0);
        }, 0);
    }, [cartItems]);

    const updateQuantity = async (itemId, size, quantity) => {
        if (quantity < 0) return;

        setCartItems(prevCartItems => {
            const newCartItems = { ...prevCartItems };
            
            if (!newCartItems[itemId]) {
                newCartItems[itemId] = {};
            }
            
            newCartItems[itemId][size] = quantity;
            
            return newCartItems;
        });

        if (token) {
            try {
                await axios.post(
                    backendUrl + '/api/cart/update', 
                    { itemId, size, quantity }, 
                    { headers: { token } }
                );
            } catch (error) {
                console.error(error);
                toast.error(error.response?.data?.message || error.message);
            }
        }
    };

    const getCartAmount = useCallback(() => {
        return Object.entries(cartItems).reduce((total, [itemId, sizes]) => {
            const itemInfo = products.find(product => product._id === itemId);
            if (!itemInfo) return total;
            
            return total + Object.entries(sizes).reduce((sum, [ quantity]) => {
                return sum + (quantity > 0 ? itemInfo.price * quantity : 0);
            }, 0);
        }, 0);
    }, [cartItems, products]);

    const getProductsData = useCallback(async () => {
        try {
            const response = await axios.get(backendUrl + '/api/product/list');
            if (response.data.success) {
                console.log("Product data fetched successfully:", response.data.products);
                setProducts(response.data.products.reverse());
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || error.message);
        }
    }, [backendUrl]);

    const getUserCart = useCallback(async (userToken) => {
        if (!userToken) return;
        
        try {
            const response = await axios.post(
                backendUrl + '/api/cart/get',
                {},
                { headers: { token: userToken } }
            );
            if (response.data.success) {
                setCartItems(response.data.cartData || {});
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || error.message);
        }
    }, [backendUrl]);

    useEffect(() => {
        getProductsData();
    }, [getProductsData]);

    useEffect(() => {
        if (token) {
            getUserCart(token);
        }
    }, [token, getUserCart]);

    const value = {
        products,
        currency,
        delivery_fee,
        search,
        setSearch,
        showSearch,
        setShowSearch,
        cartItems,
        addToCart,
        setCartItems,
        getCartCount,
        updateQuantity,
        getCartAmount,
        navigate,
        backendUrl,
        setToken,
        token
    };

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;