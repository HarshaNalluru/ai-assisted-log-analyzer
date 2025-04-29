import React, { useRef } from "react";

export interface FileUploaderProps {
  onFileUpload: (content: string) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        onFileUpload(content);
      }
    };
    reader.readAsText(file);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex items-center space-x-2">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelection}
        accept=".log,.txt"
        className="hidden"
      />
      <button
        onClick={handleButtonClick}
        className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
      >
        Upload Log File
      </button>
      <span className="text-sm text-gray-500">or use the sample log</span>
    </div>
  );
};

export default FileUploader;
