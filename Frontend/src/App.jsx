import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { login, logout } from './store/authSlice';
import axios from 'axios';

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    // onAuthStateChanged returns an unsubscribe function that we can use for cleanup
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in.
        try {
          const idToken = await user.getIdToken();
          
          // Verify the token with our backend and get user data from MongoDB
          const { data } = await axios.post("/api/v1/users/google-login", { idToken });
          
          if (data.success) {
            dispatch(login(data.data));
          } else {
            // If backend verification fails, log them out of the app state
            dispatch(logout());
          }
        } catch (error) {
          console.error("Failed to verify user on app load:", error);
          dispatch(logout());
        }
      } else {
        // User is signed out.
        dispatch(logout());
      }
      // Finished checking auth state, we can now show the app
      setLoading(false);
    });

    // Cleanup subscription on component unmount
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
    <>
      {/* <Header /> */}
      <main>
        <Outlet />
      </main>
      {/* <Footer /> */}
    </>
  );
}

export default App;
