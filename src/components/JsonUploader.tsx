import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface JsonUploaderProps {
  onUpload: (data: any) => void;
  updatedData: any;
}


const JsonUploader: React.FC<JsonUploaderProps> = ({ onUpload, updatedData }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        onUpload(json);
      } catch (error) {
        console.error("Invalid JSON file:", error);
      }
    };

    reader.readAsText(file);
  }, [onUpload]);

  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: { 'application/json': ['.json'] } });

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(updatedData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "updated_agents.json";
    a.click();
  };
  

  return (
    <div>
      <div {...getRootProps()} className="border-2 border-dashed p-6 text-center cursor-pointer">
        <input {...getInputProps()} />
        <p>Drag & drop a JSON file here, or click to select</p>
      </div>
      <button onClick={handleExport} className="my-10 px-4 py-2 bg-blue-600 text-white">Export JSON</button>
    </div>
  );
};

export default JsonUploader;
