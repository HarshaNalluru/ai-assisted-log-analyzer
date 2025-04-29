import React from "react";
import Editor from "@monaco-editor/react";
import "./MonacoWrapper.css";

export interface LogViewerProps {
  logContent: string;
}

const LogViewer: React.FC<LogViewerProps> = ({ logContent }) => {
  return (
    <div className="h-full flex flex-col">
      <div className="p-2 bg-gray-800 text-white">
        <h2 className="text-lg font-semibold">Raw Logs</h2>
      </div>
      <div
        className="flex-grow monaco-wrapper"
        style={{ height: "calc(100% - 40px)" }}
      >
        <Editor
          height="100%"
          defaultLanguage="plaintext"
          defaultValue={logContent}
          className="monaco-editor-custom"
          options={{
            readOnly: true,
            minimap: { enabled: true },
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            wordWrap: "on",
            theme: "vs-dark",
            automaticLayout: true,
          }}
        />
      </div>
    </div>
  );
};

export default LogViewer;
