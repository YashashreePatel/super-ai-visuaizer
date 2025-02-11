import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface JsonUploaderProps {
  onUpload: (data: any) => void;
}

const JsonUploader: React.FC<JsonUploaderProps> = ({ onUpload }) => {
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

  return (
    <div {...getRootProps()} className="border-2 border-dashed p-6 text-center cursor-pointer">
      <input {...getInputProps()} />
      <p>Drag & drop a JSON file here, or click to select</p>
    </div>
  );
};

export default JsonUploader;
