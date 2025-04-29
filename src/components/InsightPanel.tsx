import React from "react";

export interface InsightPanelProps {
  insights: {
    summary: string;
    details: InsightItem[];
  };
}

export interface InsightItem {
  type: "info" | "warning" | "error" | "success";
  message: string;
  timestamp?: string;
}

const InsightPanel: React.FC<InsightPanelProps> = ({ insights }) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "info":
        return <span className="text-blue-500">ℹ️</span>;
      case "warning":
        return <span className="text-yellow-500">⚠️</span>;
      case "error":
        return <span className="text-red-500">❌</span>;
      case "success":
        return <span className="text-green-500">✅</span>;
      default:
        return <span className="text-blue-500">ℹ️</span>;
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-2 bg-gray-800 text-white">
        <h2 className="text-lg font-semibold">AI-Generated Insights</h2>
      </div>
      <div className="flex-grow p-4 overflow-y-auto bg-gray-50">
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-2">Summary</h3>
          <p className="text-gray-700">{insights.summary}</p>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-2">Details</h3>
          <div className="space-y-3">
            {insights.details.map((item, index) => (
              <div key={index} className="p-3 bg-white rounded shadow">
                <div className="flex items-start">
                  <div className="mr-2">{getTypeIcon(item.type)}</div>
                  <div>
                    <p className="text-gray-800">{item.message}</p>
                    {item.timestamp && (
                      <p className="text-xs text-gray-500 mt-1">
                        {item.timestamp}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsightPanel;
