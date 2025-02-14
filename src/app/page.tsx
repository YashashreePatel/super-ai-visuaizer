'use client';
import JsonUploader from "@/components/JsonUploader";
import AgentGraph from "@/components/AgentGraph";
import { useState } from "react";
import { Agent } from "@/types";

export default function Home() {
  const [jsonData, setJsonData] = useState<{agents: Agent[]}>();
  const [updatedData, setUpdatedData] = useState<{agents: Agent[]}>();
  console.log("json::::", jsonData);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/3 p-4 border-r">
        <h1 className="text-xl font-bold mb-4">AI Agent Visualizer</h1>
        <JsonUploader onUpload={setJsonData} updatedData={updatedData} />
      </div>

      {/* Graph Visualization */}
      <div className="w-2/3">
        {jsonData ? <AgentGraph data={jsonData} onUpdatedData={setUpdatedData} /> : <p className="text-center mt-10">Upload a JSON file to visualize</p>}
      </div>
    </div>
  );
}
