import React, { useState } from "react";
import { processLogQuery } from "../utils/logAnalyzer";

export interface QueryPanelProps {
  logContent: string;
}

const QueryPanel: React.FC<QueryPanelProps> = ({ logContent }) => {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      const result = processLogQuery(query, logContent);
      setAnswer(result);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-3">Ask about these logs</h3>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., Why did message processing fail?"
            className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isLoading ? "Thinking..." : "Ask"}
          </button>
        </div>
      </form>

      {answer && (
        <div className="mt-4 p-3 bg-gray-50 rounded border border-gray-200">
          <h4 className="text-sm font-semibold text-gray-500 mb-1">Answer:</h4>
          <p className="text-gray-800">{answer}</p>
        </div>
      )}
    </div>
  );
};

export default QueryPanel;
