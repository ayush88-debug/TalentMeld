import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from '../axios/config';
import { auth } from "../firebase";
import { Copy, Check, Info, WandSparkles, PenLine, CheckCircle2, AlertTriangle, Target, KeyRound, Lightbulb, FileText } from "lucide-react";
//  eslint-disable-next-line no-unused-vars
import { motion, useAnimation } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

const Report = () => {
  const { reportId } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [coverLetter, setCoverLetter] = useState("");
  const [selectedTone, setSelectedTone] = useState("Professional");
  const [isGenerating, setIsGenerating] = useState(false);

  const [isCoverLetterCopied, setIsCoverLetterCopied] = useState(false);
  const [copiedSuggestionId, setCopiedSuggestionId] = useState(null);

  const [progressValue, setProgressValue] = useState(0);
  const controls = useAnimation();

  useEffect(() => {
    const fetchReport = async () => {
      if (!reportId) return;
      try {
        const idToken = await auth.currentUser.getIdToken();
        const { data } = await api.get(`/users/report/${reportId}`, {
          headers: { Authorization: `Bearer ${idToken}` },
        });

        if (data.success) {
          setReport(data.data);
          setCoverLetter(data.data.generatedCoverLetter);
        } else {
          setError("Failed to fetch the report.");
        }
      } catch (err) {
        setError("An error occurred while fetching the report.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [reportId]);

  useEffect(() => {
    if (report?.matchScore) {
      controls.start({
        width: `${report.matchScore}%`,
        transition: { duration: 1, ease: "easeInOut" },
      });
      const timeout = setTimeout(() => setProgressValue(report.matchScore), 300);
      return () => clearTimeout(timeout);
    }
  }, [report, controls]);

  const getScoreTextColor = (score) => {
    if (score >= 75) return "text-green-500";
    if (score >= 50) return "text-yellow-500";
    return "text-red-500";
  };

  const getScoreBgColor = (score) => {
    if (score >= 75) return "bg-green-500";
    if (score >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };
  
  const handleCoverLetterCopy = () => {
    navigator.clipboard.writeText(coverLetter);
    setIsCoverLetterCopied(true);
    setTimeout(() => setIsCoverLetterCopied(false), 2000);
  };

  const handleSuggestionCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedSuggestionId(id);
    setTimeout(() => setCopiedSuggestionId(null), 2000);
  };

  const handleGenerateNewTone = async () => {
    if (!selectedTone || isGenerating) return;

    setIsGenerating(true);
    setError("");
    setCoverLetter(`Generating a new cover letter with a ${selectedTone} tone...`);

    try {
      const idToken = await auth.currentUser.getIdToken();
      const response = await api.post('/users/regenerate-cover-letter', {
        reportId: reportId,
        tone: selectedTone,
      }, {
        headers: { Authorization: `Bearer ${idToken}` },
      });

      if (response.data.success) {
        setCoverLetter(response.data.data.coverLetter);
      } else {
        setError("Failed to generate new cover letter.");
        setCoverLetter(report.generatedCoverLetter);
      }
    } catch (err) {
      setError("An error occurred during generation.");
      setCoverLetter(report.generatedCoverLetter);
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-black">Loading Report...</div>;
  if (error) return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>;
  if (!report) return <div className="flex justify-center items-center min-h-screen">Report not found.</div>;

  return (
    <div className="bg-gray-50 dark:bg-black text-gray-800 dark:text-gray-200 min-h-screen">
      <div className="container mx-auto p-4 md:p-8">
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">{report.jobTitle}</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-1">{report.companyName}</p>
        </motion.header>

        <Tabs defaultValue="resume-analysis" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-200 dark:bg-gray-800 rounded-lg p-1">
            <TabsTrigger value="resume-analysis" className="data-[state=active]:bg-white dark:data-[state=active]:bg-black data-[state=active]:shadow-sm cursor-pointer">Resume Analysis</TabsTrigger>
            <TabsTrigger value="cover-letter" className="data-[state=active]:bg-white dark:data-[state=active]:bg-black data-[state=active]:shadow-sm cursor-pointer">Cover Letter</TabsTrigger>
          </TabsList>

          <TabsContent value="resume-analysis" className="mt-6">
            <div className="grid gap-8">
              {/* ATS Score Card */}
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.1 }}>
                <Card className="bg-white dark:bg-gray-900 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center text-2xl font-semibold">
                      <Target className="h-6 w-6 mr-2" />
                      ATS Match Score
                    </CardTitle>
                    <CardDescription>How your resume stacks up against the job description.</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <div className={`text-7xl font-bold ${getScoreTextColor(report.matchScore)}`}>{progressValue}
                      <span className="text-4xl text-gray-400">/100</span>
                    </div>
                    <Progress value={progressValue} className="w-full mt-4 h-3" colorClassName={getScoreBgColor(report.matchScore)} />
                  </CardContent>
                </Card>
              </motion.div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Language Analysis Card */}
                {report.languageAnalysis && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
                    <Card className="bg-white dark:bg-gray-900 shadow-lg h-full">
                      <CardHeader>
                        <CardTitle className="flex items-center text-2xl font-semibold">
                          <PenLine className="h-6 w-6 mr-2" />
                          Language & Tone
                        </CardTitle>
                        <CardDescription>{report.languageAnalysis.overallFeedback}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted-foreground">Grammar Score</span>
                          <span className={`font-bold text-lg ${getScoreTextColor(report.languageAnalysis.score)}`}>{report.languageAnalysis.score}/100</span>
                        </div>
                        <Progress value={report.languageAnalysis.score} className="h-2" colorClassName={getScoreBgColor(report.languageAnalysis.score)} />
                        <h4 className="font-semibold mt-4 mb-2">Improvements:</h4>
                        <ul className="list-none space-y-2">
                          {report.languageAnalysis.improvements.map((item, i) => (
                            <li key={i} className="flex items-start text-sm">
                              <Info className="h-4 w-4 mr-2 mt-0.5 shrink-0 text-blue-500" />
                              <span className="text-muted-foreground">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* Keyword Analysis Card */}
                {report.keywordAnalysis && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
                    <Card className="bg-white dark:bg-gray-900 shadow-lg h-full">
                      <CardHeader>
                        <CardTitle className="flex items-center text-2xl font-semibold">
                          <KeyRound className="h-6 w-6 mr-2" />
                          Keyword Analysis
                        </CardTitle>
                        <CardDescription>Keywords from the job description found in your resume.</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div>
                            <h4 className="flex items-center font-semibold mb-3 text-green-600 dark:text-green-400">
                              <CheckCircle2 className="h-5 w-5 mr-2" />
                              Found Keywords
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {report.keywordAnalysis.found.length > 0 ? (
                                report.keywordAnalysis.found.map((keyword) => (
                                  <div key={keyword} className="text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-2.5 py-1 rounded-full">
                                    {keyword}
                                  </div>
                                ))
                              ) : <p className="text-sm text-muted-foreground">None found.</p>}
                            </div>
                          </div>
                          <div>
                            <h4 className="flex items-center font-semibold mb-3 text-yellow-600 dark:text-yellow-400">
                              <AlertTriangle className="h-5 w-5 mr-2" />
                              Missing Keywords
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {report.keywordAnalysis.missing.length > 0 ? (
                                report.keywordAnalysis.missing.map((keyword) => (
                                  <div key={keyword} className="text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 px-2.5 py-1 rounded-full">
                                    {keyword}
                                  </div>
                                ))
                              ) : <p className="text-sm text-muted-foreground">None missing!</p>}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </div>

              {/* Actionable Improvements */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }}>
                <h3 className="flex items-center text-2xl font-semibold text-gray-900 dark:text-white">
                  <Lightbulb className="h-6 w-6 mr-2" />
                  Actionable Improvements
                </h3>
                <Accordion type="single" collapsible className="w-full mt-4" defaultValue="item-0">
                  {report.resumeSuggestions.map((sectionItem, index) => (
                    <AccordionItem value={`item-${index}`} key={index} className="border-b dark:border-gray-700">
                      <AccordionTrigger className="text-lg font-medium hover:no-underline text-gray-800 dark:text-gray-200 py-4 cursor-pointer">
                        {sectionItem.section}
                      </AccordionTrigger>
                      <AccordionContent>
                        {sectionItem.suggestions.map((item, subIndex) => {
                           const suggestionId = `${index}-${subIndex}`;
                           return (
                             <motion.div
                                key={suggestionId}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: subIndex * 0.1 }}
                             >
                              <div className="p-4 mb-4 border-l-4 border-indigo-500 bg-gray-100 dark:bg-gray-800 rounded-r-md">
                                <div className="flex items-start">
                                  <Info className="h-5 w-5 text-indigo-500 mr-3 mt-1 flex-shrink-0" />
                                  <p className="text-base text-black dark:text-gray-300">{item.insight}</p>
                                </div>
                                <div className="mt-4 space-y-3">
                                  <div className="p-3 bg-white dark:bg-gray-700 rounded-md border-l-4 border-red-400">
                                    <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Original Text:</p>
                                    <p className="text-gray-600 dark:text-gray-300 mt-1 whitespace-pre-wrap">{item.original}</p>
                                  </div>
                                  <div className="p-3 bg-white dark:bg-gray-700 rounded-md border-l-4 border-green-500 relative">
                                    <div className="flex justify-between items-center mb-1">
                                      <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Suggestion:</p>
                                      <Button variant="ghost" size="icon-sm" className="absolute top-1 right-1 h-7 w-7" onClick={() => handleSuggestionCopy(item.suggestion, suggestionId)}>
                                        {copiedSuggestionId === suggestionId ? (
                                          <Check className="h-4 w-4 text-green-500" />
                                        ) : (
                                          <Copy className="h-4 w-4" />
                                        )}
                                      </Button>
                                    </div>
                                    <p className="text-gray-800 dark:text-white mt-1 pr-8 whitespace-pre-wrap">{item.suggestion}</p>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                           )
                        })}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </motion.div>
            </div>
          </TabsContent>

          <TabsContent value="cover-letter" className="mt-6">
             <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
                <Card className="bg-white dark:bg-gray-900 shadow-lg">
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                          <div>
                              <CardTitle className="flex items-center text-2xl font-semibold">
                                <FileText className="h-6 w-6 mr-2" />
                                Cover Letter
                              </CardTitle>
                              <CardDescription>Tailored for the role based on your resume.</CardDescription>
                          </div>
                          <div className="flex items-center gap-2 w-full sm:w-auto">
                              <Select onValueChange={setSelectedTone} defaultValue="Professional">
                                <SelectTrigger className="w-full sm:w-[150px] cursor-pointer">
                                    <SelectValue placeholder="Select a tone" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Professional">Professional</SelectItem>
                                    <SelectItem value="Enthusiastic">Enthusiastic</SelectItem>
                                    <SelectItem value="Concise">Concise</SelectItem>
                                </SelectContent>
                              </Select>
                              <Button className={'cursor-pointer'} onClick={handleGenerateNewTone} disabled={isGenerating}>
                                <WandSparkles className="h-4 w-4 mr-2" />
                                {isGenerating ? "Generating..." : "Generate"}
                              </Button>
                              <Button className={'cursor-pointer'} variant="outline" size="icon" onClick={handleCoverLetterCopy}>
                                {isCoverLetterCopied ? <Check className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5" />}
                              </Button>
                          </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="p-6 border dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 min-h-[400px] prose dark:prose-invert max-w-none">
                          <p className="whitespace-pre-wrap">{coverLetter}</p>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Report;