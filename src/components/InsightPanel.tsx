import React, { useState } from "react";
import { downloadInsightsAsJSON } from "../utils/logAnalyzer";

export interface ChunkResponse {
  chunk_range: [number, number];
  purpose: string;
  details: string[];
}

export interface ChunkGroup {
  chunkIndex: number;
  chunkRange: [number, number];
  subchunks: ChunkResponse[];
}

export interface InsightPanelProps {
  insights: {
    summary: string;
    details: ChunkGroup[];
  };
}

const InsightPanel: React.FC<InsightPanelProps> = ({ insights }) => {
  const [openChunks, setOpenChunks] = useState<{ [key: number]: boolean }>({});
  const [openSubchunks, setOpenSubchunks] = useState<{
    [key: string]: boolean;
  }>({});

  const toggleChunk = (idx: number) => {
    setOpenChunks((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };
  const toggleSubchunk = (chunkIdx: number, subIdx: number) => {
    const key = `${chunkIdx}-${subIdx}`;
    setOpenSubchunks((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleDownload = () => {
    downloadInsightsAsJSON(insights);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-2 bg-gray-800 text-white flex justify-between items-center">
        <h2 className="text-lg font-semibold">AI-Generated Insights</h2>
        {insights.details && insights.details.length > 0 && (
          <button
            onClick={handleDownload}
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors"
            title="Download insights as JSON file"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="inline-block h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Download
          </button>
        )}
      </div>
      <div className="flex-grow p-4 overflow-y-auto bg-gray-50">
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-2">Summary</h3>
          <p className="text-gray-700">{insights.summary}</p>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-2">Details</h3>
          <div className="space-y-3">
            {Array.isArray(insights.details) && insights.details.length > 0 ? (
              insights.details.map((group, idx) => (
                <div key={idx} className="bg-white rounded shadow">
                  <button
                    className="w-full flex justify-between items-center px-4 py-3 text-left focus:outline-none focus:ring-2 focus:ring-blue-400"
                    onClick={() => toggleChunk(idx)}
                    aria-expanded={!!openChunks[idx]}
                  >
                    <span className="font-semibold text-blue-700">
                      Chunk {group.chunkIndex + 1} [Lines {group.chunkRange[0]}-
                      {group.chunkRange[1]}]
                    </span>
                    <span className="ml-2 text-gray-400">
                      {openChunks[idx] ? "▼" : "▶"}
                    </span>
                  </button>
                  {openChunks[idx] && (
                    <div className="px-4 pb-4 pt-2 space-y-2">
                      {Array.isArray(group.subchunks) &&
                      group.subchunks.length > 0 ? (
                        group.subchunks.map((sub, subIdx) => (
                          <div
                            key={subIdx}
                            className="bg-gray-50 rounded border"
                          >
                            <button
                              className="w-full flex justify-between items-center px-4 py-2 text-left focus:outline-none focus:ring-2 focus:ring-blue-200"
                              onClick={() => toggleSubchunk(idx, subIdx)}
                              aria-expanded={
                                !!openSubchunks[`${idx}-${subIdx}`]
                              }
                            >
                              <span className="font-semibold text-blue-600">
                                [Lines {sub.chunk_range[0]}-{sub.chunk_range[1]}
                                ]: {sub.purpose}
                              </span>
                              <span className="ml-2 text-gray-400">
                                {openSubchunks[`${idx}-${subIdx}`] ? "▼" : "▶"}
                              </span>
                            </button>
                            {openSubchunks[`${idx}-${subIdx}`] && (
                              <ul className="list-disc pl-8 py-2">
                                {sub.details.map((detail, dIdx) => (
                                  <li key={dIdx} className="text-gray-800">
                                    {detail}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="text-gray-500 italic">
                          No subchunks available
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-gray-500 italic">No details available</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsightPanel;
