import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import api from '../axios/config';
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";

import { Viewer, Worker } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const Workspace = () => {
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setError("");
      setResumeFile(file);
      setStatusText("Uploading and parsing resume...");
      setIsLoading(true);

      const formData = new FormData();
      formData.append("resume", file);

      try {
        const user = auth.currentUser;
        if (!user) {
          throw new Error("You must be logged in to upload a resume.");
        }
        const token = await user.getIdToken();

        const response = await api.post("/users/parse-resume", formData, {
          headers: { 
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`
          },
        });
        setResumeText(response.data.data.text);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to upload or parse resume.");
        setResumeFile(null);
        console.error(err);
      } finally {
        setIsLoading(false);
        setStatusText("");
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles: 1,
  });

  const handleAnalyze = async () => {
    setStatusText("Analyzing your Resume...");
    setIsLoading(true);
    setError("");
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("You must be logged in to analyze documents.");
      }
      const token = await user.getIdToken();

      const response = await api.post("/users/analyze", {
        resumeText,
        jobDescription,
      }, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.data.success) {
        const reportId = response.data.data._id;
        navigate(`/report/${reportId}`);
      } else {
        setError(response.data.message || "Analysis failed. Please try again.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred during analysis.");
      console.error(err);
    } finally {
      setIsLoading(false);
      setStatusText("");
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-80px)] bg-gray-100 dark:bg-gray-900">
      {/* Left Panel: Resume Upload and Viewer */}
      <div className="w-full md:w-1/2 p-4 md:p-6 flex flex-col border-r border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Your Resume</h2>
        {!resumeFile ? (
          <div
            {...getRootProps()}
            className="flex-grow border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center text-center p-8 cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <p className="text-gray-600 dark:text-gray-400">Drop the resume here ...</p>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">
                Drag 'n' drop your resume here, or click to select a file (PDF or DOCX)
              </p>
            )}
          </div>
        ) : (
          <div className="flex-grow overflow-hidden border rounded-lg bg-gray-300 dark:bg-gray-800">
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
              {resumeFile.type === "application/pdf" ? (
                <div className="h-full">
                  <Viewer fileUrl={URL.createObjectURL(resumeFile)} />
                </div>
              ) : (
                <div className="p-4 bg-white dark:bg-gray-900 rounded-md text-gray-700 dark:text-gray-200 whitespace-pre-wrap h-full overflow-auto">
                  {resumeText || "DOCX content..."}
                </div>
              )}
            </Worker>
          </div>
        )}
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>

      {/* Right Panel: Job Description and Analysis */}
      <div className="w-full md:w-1/2 p-4 md:p-6 flex flex-col">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Job Description</h2>
        <Textarea
          placeholder="Paste the job description here..."
          className="flex-grow text-base dark:bg-gray-800 dark:text-gray-200"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />
        <Button
          onClick={handleAnalyze}
          disabled={!resumeText || !jobDescription || isLoading}
          className="mt-4 w-full cursor-pointer"
          size="lg"
        >
          {isLoading ? statusText : "Analyze"}
        </Button>
      </div>
    </div>
  );
};

export default Workspace;
