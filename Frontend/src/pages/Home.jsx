import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../store/authSlice";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import api from '../axios/config';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { UploadCloud, FileScan, WandSparkles, ArrowRight } from "lucide-react";

const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  },
};

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authStatus = useSelector((state) => state.auth.status);

  const handleGoogleLogin = async () => {
      try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        const idToken = await user.getIdToken();

        const { data } = await api.post("/users/login", { idToken });

        if (data.success) {
          dispatch(login(data.data));
          navigate("/workspace");
        } else {
          console.error("Backend login failed:", data.message);
        }
      } catch (error) {
        console.error("Google sign-in error", error);
      }
  };

  const GoogleLogo = () => (
    <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
      <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
      <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.565-3.461-11.083-8.125l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
      <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.24,4.168-4.099,5.591l6.19,5.238C42.022,35.219,44,30.023,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
    </svg>
  );
  
  const CTAButton = () => (
    authStatus ? (
      <Button onClick={() => navigate('/workspace')} className="mt-8 px-8 text-md py-6 cursor-pointer">
        Go to Your Workspace <ArrowRight className="ml-2 h-5 w-5" />
      </Button>
    ) : (
      <Button onClick={handleGoogleLogin} className="mt-8 px-8 text-md py-6 cursor-pointer" variant="outline">
        <GoogleLogo />
        Get Started with Google
      </Button>
    )
  );

  return (
    <div className="bg-background text-foreground min-h-screen">
      {/* Hero Section */}
      <motion.section 
        className="container mx-auto flex flex-col items-center justify-center text-center min-h-[calc(100vh-80px)] px-4"
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
      >
        <motion.h1
          className="text-5xl md:text-7xl font-bold tracking-tighter mb-4"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Stop Guessing. Start Impressing.
        </motion.h1>
        <motion.p
          className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          TalentMeld is your personal AI co-pilot for job applications. Get instant, data-driven feedback on your resume and generate a perfect cover letter tailored to any job description.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <CTAButton />
        </motion.div>
      </motion.section>

      {/* How It Works Section */}
      <motion.section 
        className="py-20 bg-muted/30 dark:bg-muted/10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
      >
        <div className="container mx-auto text-center px-4">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">Three Simple Steps to Success</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-16">Get from application to interview faster than ever before.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center">
              <div className="bg-primary/10 text-primary p-4 rounded-full mb-4">
                <UploadCloud size={32} />
              </div>
              <h3 className="text-2xl font-semibold mb-2">1. Upload</h3>
              <p className="text-muted-foreground">Submit your current resume and the job description for the role you want.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-primary/10 text-primary p-4 rounded-full mb-4">
                <FileScan size={32} />
              </div>
              <h3 className="text-2xl font-semibold mb-2">2. Analyze</h3>
              <p className="text-muted-foreground">Our AI performs a deep analysis, scoring your resume against the job and identifying key areas for improvement.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-primary/10 text-primary p-4 rounded-full mb-4">
                <WandSparkles size={32} />
              </div>
              <h3 className="text-2xl font-semibold mb-2">3. Improve</h3>
              <p className="text-muted-foreground">Receive actionable suggestions and a perfectly tailored cover letter to make your application stand out.</p>
            </div>
          </div>
        </div>
      </motion.section>
      
      {/* Features Section */}
      <motion.section 
        className="py-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        <div className="container mx-auto px-4">
            <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">Everything You Need to Get Hired</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Go beyond simple keyword matching with our intelligent analysis.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="p-6">
                    <CardHeader>
                        <CardTitle className="text-2xl">Honest ATS Match Score</CardTitle>
                        <CardDescription>Get a realistic score based on skills, experience relevance, and keyword alignment, so you know exactly where you stand.</CardDescription>
                    </CardHeader>
                </Card>
                <Card className="p-6">
                    <CardHeader>
                        <CardTitle className="text-2xl">Actionable Resume Suggestions</CardTitle>
                        <CardDescription>Receive specific, copy-paste ready suggestions to rephrase and quantify your achievements, tailored to the job.</CardDescription>
                    </CardHeader>
                </Card>
                <Card className="p-6">
                    <CardHeader>
                        <CardTitle className="text-2xl">Smart Cover Letter Generation</CardTitle>
                        <CardDescription>Instantly create a concise, professional cover letter that tells a compelling story based on your unique experience.</CardDescription>
                    </CardHeader>
                </Card>
                 <Card className="p-6">
                    <CardHeader>
                        <CardTitle className="text-2xl">Language & Tone Analysis</CardTitle>
                        <CardDescription>Ensure your resume's language is professional, active, and error-free with our grammar and tone evaluation.</CardDescription>
                    </CardHeader>
                </Card>
            </div>
        </div>
      </motion.section>

      {/* Final CTA Section */}
      <motion.section 
        className="py-20 bg-muted/30 dark:bg-muted/10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        variants={sectionVariants}
      >
        <div className="container mx-auto text-center px-4">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">Ready to Land Your Dream Job?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">Stop wasting time on applications that don't get seen. Start building a resume that gets results.</p>
            <CTAButton />
        </div>
      </motion.section>
    </div>
  );
};

export default Home;