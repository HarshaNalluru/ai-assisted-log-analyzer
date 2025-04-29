import React from "react";
import Editor from "@monaco-editor/react";

export interface LogViewerProps {
  logContent: string;
}

const LogViewer: React.FC<LogViewerProps> = ({ logContent }) => {
  return (
    <div className="h-full flex flex-col">
      <div className="p-2 bg-gray-800 text-white">
        <h2 className="text-lg font-semibold">Raw Logs</h2>
      </div>
      <div>
        <Editor
          height="100%"
          defaultLanguage="plaintext"
          defaultValue={logContent}
          options={{
            readOnly: true,
            minimap: { enabled: true },
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            wordWrap: "on",
            theme: "vs-dark",
          }}
        />
      </div>
    </div>
  );
};

export default LogViewer;
