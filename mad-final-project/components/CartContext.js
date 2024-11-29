import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const CartContext = createContext();

const BASE_URL = "https://mad-app-firebase-auth-default-rtdb.firebaseio.com/";

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/cart.json`);
        if (response.status === 200 && response.data) {
          const itemsArray = Object.entries(response.data).map(([id, value]) => ({
            id,
            ...value,
            price: value.price ? parseFloat(value.price) : 0,
            basePrice: value.price ? parseFloat(value.price) : 0, // Store original price
          }));
          setCart(itemsArray);
        }
      } catch (error) {
        console.error("Error fetching cart data: ", error.message);
      }
    };

    fetchCart();
  }, []);

  const addToCart = async (newItem) => {
    try {
      const itemToAdd = {
        ...newItem,
        basePrice: newItem.price, // Store original price
        price: newItem.price,
      };
      
      const response = await axios.post(`${BASE_URL}/cart.json`, itemToAdd);
      if (response.status === 200) {
        setCart((prevCart) => [
          ...prevCart,
          {
            id: response.data.name,
            ...itemToAdd,
            price: parseFloat(itemToAdd.price),
            basePrice: parseFloat(itemToAdd.price),
          },
        ]);
        return true;
      }
    } catch (error) {
      console.error("Error adding item to cart: ", error.message);
      throw error;
    }
  };

  const removeFromCart = async (id) => {
    try {
      const response = await axios.delete(`${BASE_URL}/cart/${id}.json`);
      if (response.status === 200) {
        setCart((prevCart) => prevCart.filter((item) => item.id !== id));
        return true;
      }
    } catch (error) {
      console.error("Error removing item from cart: ", error.message);
      throw error;
    }
  };
const handleUpdateQuantity = async (id, newQuantity) => {
  try {
    if (newQuantity <= 0) {
      await removeFromCart(id);
      return;
    }

    const updatedItem = cart.find(item => item.id === id);
    if (updatedItem) {
      const itemToUpdate = {
        ...updatedItem,
        quantity: newQuantity,
        price: updatedItem.basePrice,  // Keep original price
        totalPrice: updatedItem.basePrice * newQuantity  // Add total price calculation
      };

      await axios.put(`${BASE_URL}/cart/${id}.json`, itemToUpdate);
      setCart((prevCart) => prevCart.map((item) =>
        item.id === id ? itemToUpdate : item
      ));
    }
  } catch (error) {
    console.error("Error updating item quantity: ", error.message);
    throw error;
  }
};


  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, handleUpdateQuantity }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
