import React from "react";
import { motion } from "framer-motion";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { useDispatch } from "react-redux";
import { login } from "../store/authSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const idToken = await user.getIdToken();

      const { data } = await axios.post("/api/v1/users/google-login", {
        idToken,
      });

      if (data.success) {
        dispatch(login(data.data));
        navigate("/workspace"); // Navigate to the workspace after login
      } else {
        console.error("Backend login failed:", data.message);
      }
    } catch (error) {
      console.error("Google sign-in error", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center px-4">
      <motion.h1
        className="text-5xl md:text-7xl font-bold text-gray-800 mb-4"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Welcome to TalentMeld
      </motion.h1>
      <motion.p
        className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        Your personal AI co-pilot for crafting the perfect job application.
        Analyze your resume, tailor it to any job, and generate a compelling
        cover letter in seconds.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Button onClick={handleGoogleLogin} size="lg">
          Login with Google to Get Started
        </Button>
      </motion.div>
    </div>
  );
};

export default Home;
