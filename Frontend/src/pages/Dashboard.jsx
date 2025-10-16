import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from '../axios/config'
import { auth } from "../firebase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const Dashboard = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const idToken = await auth.currentUser.getIdToken();
        const response = await api.get("/users/reports", {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });
        if (response.data.success) {
          setReports(response.data.data);
        } else {
          setError("Failed to fetch reports.");
        }
      } catch (err) {
        setError("An error occurred while fetching your reports.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) {
    return <div className="text-center py-10">Loading your analysis history...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
          My Analysis History
        </h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          Revisit your past resume and cover letter analyses.
        </p>
      </motion.div>

      {reports.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-10 text-center"
        >
          <p className="text-gray-500">You haven't analyzed any resumes yet.</p>
          <Button onClick={() => navigate('/workspace')} className="mt-4">
            Start a New Analysis
          </Button>
        </motion.div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reports.map((report, index) => (
            <motion.div
              key={report._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card 
                className="bg-white dark:bg-gray-900 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => navigate(`/report/${report._id}`)}
              >
                <CardHeader>
                  <CardTitle className="truncate">{report.jobTitle}</CardTitle>
                  <CardDescription>{report.companyName}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                    <span>
                      {new Date(report.createdAt).toLocaleDateString()}
                    </span>
                    <Button variant="link" className="p-0 h-auto">View Report</Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;