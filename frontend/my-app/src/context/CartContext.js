import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('cartItems');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, size, quantity = 1) => {
    const existingItemIndex = cartItems.findIndex(
      (item) => item._id === product._id && item.size === size
    );

    if (existingItemIndex !== -1) {
      const updatedCart = [...cartItems];
      updatedCart[existingItemIndex].quantity += quantity;
      setCartItems(updatedCart);
    } else {
      setCartItems((prev) => [
        ...prev,
        {
          _id: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
          size,
          quantity,
        },
      ]);
    }
  };

  const removeFromCart = (productId, size) => {
    setCartItems((prev) =>
      prev.filter((item) => !(item._id === productId && item.size === size))
    );
  };

  const updateQuantity = (productId, size, quantity) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === productId && item.size === size
          ? { ...item, quantity }
          : item
      )
    );
  };

  // ✅ Add this to fix your Checkout error
  const getTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        getTotal, // ✅ Make sure this is exposed
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);