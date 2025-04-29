import React, { useState, useEffect } from "react";
import "./App.css";
import LogViewer from "./components/LogViewer";
import InsightPanel from "./components/InsightPanel";
import QueryPanel from "./components/QueryPanel";
import FileUploader from "./components/FileUploader";
import { analyzeLogFile, InsightItem } from "./utils/logAnalyzer";

function App() {
  const [logContent, setLogContent] = useState<string>("");
  const [insights, setInsights] = useState<{
    summary: string;
    details: InsightItem[];
  }>({
    summary: "No logs loaded yet.",
    details: [],
  });

  // Load sample log file on component mount
  useEffect(() => {
    fetch("/sample-amqp.log")
      .then((response) => response.text())
      .then((data) => {
        setLogContent(data);
        const logInsights = analyzeLogFile(data);
        setInsights(logInsights);
      })
      .catch((error) => console.error("Error loading sample log:", error));
  }, []);

  const handleFileUpload = (content: string) => {
    setLogContent(content);
    const logInsights = analyzeLogFile(content);
    setInsights(logInsights);
  };
  return (
    <div className="App min-h-screen flex flex-col bg-gray-100">
      <header className="bg-gray-800 text-white p-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">AMQP Log Analyzer</h1>
          <p className="text-sm text-gray-300">
            Analyze and understand your AMQP logs with AI-powered insights
          </p>
        </div>
      </header>

      <div className="container mx-auto p-4 flex-grow flex flex-col">
        <div className="mb-4 bg-white p-4 rounded-lg shadow">
          <FileUploader onFileUpload={handleFileUpload} />
        </div>
        <div className="float-container">
          <div className="float-child">
            <LogViewer logContent={logContent} />
          </div>
          <div className="float-child">
            <div className="bg-white rounded-lg shadow overflow-hidden h-[50vh]">
              <InsightPanel insights={insights} />
            </div>
            <QueryPanel logContent={logContent} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
