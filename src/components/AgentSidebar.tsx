import React, { useState, useEffect } from "react";
import { Node } from "reactflow";

interface AgentSidebarProps {
  node?: Node | null;
  updateNodeData: (roleName: string, systemPrompt: string, taskPrompt: string) => void;
}

const AgentSidebar: React.FC<AgentSidebarProps> = ({ node, updateNodeData }) => {
  const [roleName, setRoleName] = useState<string>("");
  const [systemPrompt, setSystemPrompt] = useState<string>("");
  const [taskPrompt, setTaskPrompt] = useState<string>("");

  useEffect(() => {
    if (node) {
      setRoleName(node.data.role_name);
      setSystemPrompt(node.data.system_prompt);
      setTaskPrompt(node.data.task_prompt);
    }
  }, [node]); // This will run only when `node` changes

  useEffect(() => {
    if (node) {
      updateNodeData(roleName, systemPrompt, taskPrompt);
    }
  }, [roleName, systemPrompt, taskPrompt, node, updateNodeData]);

  if (!node) return <div className="w-1/4 p-4 border-l">Select an agent to edit</div>;

  return (
    <div className="w-1/4 p-4 border-l">
      <h2 className="text-xl font-bold">Edit Agent</h2>
      <label className="block mt-2">Role Name</label>
      <input
        name="role_name"
        value={roleName}
        onChange={(e) => setRoleName(e.target.value)} // Update role name
        className="w-full border p-2 text-black"
      />
      
      <label className="block mt-2">System Prompt</label>
      <textarea
        value={systemPrompt}
        onChange={(e) => setSystemPrompt(e.target.value)} // Update system prompt
        className="w-full border p-2 text-black"
      />

      <label className="block mt-2">Task Prompt</label>
      <textarea
        value={taskPrompt}
        onChange={(e) => setTaskPrompt(e.target.value)} // Update task prompt
        className="w-full border p-2 text-black"
      />
    </div>
  );
};

export default AgentSidebar;
