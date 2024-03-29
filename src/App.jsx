import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';

import DataContext from './context';
import Header from './components/Header';
import Drawer from './components/Drawer';
import HomePage from './Pages/HomePage';
import FavoritesPage from './Pages/FavoritesPage';
import UserPage from './Pages/UserPage';

function App() {
  const [items, setItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [favoriteStorageItems, setFavoriteStorageItems] = useState([]);
  const [favoriteItems, setFavoriteItems] = useState([]);
  const [cartOpened, setCartOpened] = useState(false);
  const [cartTotal, setCartTotal] = useState(0);
  const [cardsIsDownloading, setCardsIsDownloading] = useState(true);
  const [isOrdered, setIsOrdered] = useState(false);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const loadingItems = async () => {
      try {
        const itemsResponse = await axios.get(
          'https://64020cd7ab6b7399d0b2a6df.mockapi.io/items'
        );
        const cartItemsResponse = await axios.get(
          'https://64020cd7ab6b7399d0b2a6df.mockapi.io/cart'
        );

        setItems(itemsResponse.data);
        setCartItems(cartItemsResponse.data);
        setCardsIsDownloading(false);
      } catch (error) {
        alert(`Что-то пошло не так: ${error}`);
      }
    };
    loadingItems();

    const likedItemsStorage = JSON.parse(
      localStorage.getItem('favoriteStorageItems')
    );
    if (likedItemsStorage) {
      setFavoriteStorageItems(likedItemsStorage);
    }
    setFavoriteItems(likedItemsStorage);

    const storageOrders = JSON.parse(localStorage.getItem('orders'));
    setOrders(storageOrders);
  }, []);

  useEffect(() => {
    const handleUnload = () => {
      localStorage.setItem(
        'favoriteStorageItems',
        JSON.stringify(favoriteItems)
      );
    };
    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, [favoriteItems]);

  useEffect(() => {
    localStorage.setItem(
      'favoriteStorageItems',
      JSON.stringify(favoriteStorageItems)
    );
  }, [favoriteStorageItems]);

  useEffect(() => {
    setCartTotal(cartItems.reduce((acc, item) => acc + item.price, 0));
  }, [cartItems]);

  const deleteCartItem = async (id) => {
    try {
      await axios.delete(
        `https://64020cd7ab6b7399d0b2a6df.mockapi.io/cart/${id}`
      );
      const res = await axios.get(
        'https://64020cd7ab6b7399d0b2a6df.mockapi.io/cart'
      );
      setCartItems(res.data);
    } catch (error) {
      alert(`Что-то пошло не так: ${error}`);
    }
  };

  const addCartItem = async (currentCard) => {
    const isItemOnCart = cartItems.filter(
      (cartItem) =>
        cartItem.title === currentCard.title &&
        cartItem.image === currentCard.image
    );

    if (isItemOnCart.length) {
      const id = isItemOnCart[0].id;
      await deleteCartItem(id);
    } else {
      await axios.post(
        'https://64020cd7ab6b7399d0b2a6df.mockapi.io/cart',
        currentCard
      );
    }

    const res = await axios.get(
      'https://64020cd7ab6b7399d0b2a6df.mockapi.io/cart'
    );
    setCartItems(res.data);
  };

  const closeCart = () => {
    setCartOpened(false);
    setIsOrdered(false);
  };

  const dataContext = {
    items,
    cartItems,
    setCartItems,
    favoriteStorageItems,
    setFavoriteStorageItems,
    cartTotal,
    favoriteItems,
    setFavoriteItems,
    addCartItem,
    cardsIsDownloading,
    deleteCartItem,
    isOrdered,
    setIsOrdered,
    closeCart,
    orders,
    setOrders,
    cartOpened,
  };

  return (
    <DataContext.Provider value={dataContext}>
      <div className="wrapper clear">
        <Header onClickCart={() => setCartOpened(true)} />
        <main>
          <div className="content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/user" element={<UserPage />} />
            </Routes>
          </div>
          <Drawer
            onClickClose={closeCart}
            deleteCartItem={(card) => deleteCartItem(card.id)}
          />
        </main>
      </div>
    </DataContext.Provider>
  );
}

export default App;
