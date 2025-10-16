import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { login, logout } from './store/authSlice';
import api from './axios/config'; // Make sure you have this file
import Header from './components/Header'; 
import Footer from './components/Footer';

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const idToken = await user.getIdToken();
          
          const { data } = await api.post("/users/set-token", { idToken });

          if (data.success) {
            dispatch(login(data.data));
          } else {
            dispatch(logout());
          }
        } catch (error) {
          console.error("Failed to verify user on app load:", error);
          dispatch(logout());
        }
      } else {
        dispatch(logout());
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default App;