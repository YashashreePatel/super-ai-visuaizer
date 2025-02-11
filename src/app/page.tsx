'use client';
import JsonUploader from "@/components/JsonUploader";
import AgentGraph from "@/components/AgentGraph";
import { useState } from "react";

export default function Home() {
  const [jsonData, setJsonData] = useState<any>(null);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/3 p-4 border-r">
        <h1 className="text-xl font-bold mb-4">AI Agent Visualizer</h1>
        <JsonUploader onUpload={setJsonData} />
      </div>

      {/* Graph Visualization */}
      <div className="w-2/3">
        {jsonData ? <AgentGraph data={jsonData} /> : <p className="text-center mt-10">Upload a JSON file to visualize</p>}
      </div>
    </div>
  );
}
