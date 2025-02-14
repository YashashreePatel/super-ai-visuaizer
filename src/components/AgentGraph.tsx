import React, { useState, useEffect, useCallback } from "react";
import ReactFlow, {
  Controls,
  Background,
  Node,
  Edge,
  applyNodeChanges,
  applyEdgeChanges,
} from "reactflow";
import "reactflow/dist/style.css";
import { Agent } from "@/types"; // Your Agent interface
import AgentSidebar from "@/components/AgentSidebar";

interface Props {
  data: { agents: Agent[] };
  onUpdatedData: (daya: { agents: Agent[] }) => void;
}

const AgentGraph: React.FC<Props> = ({ data, onUpdatedData }) => {
  
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [updatedData, setUpdatedData] = useState<{ agents: Agent[] }>({ agents: data.agents });

  // Initialize nodes and edges based on data
  useEffect(() => {
    if (!updatedData?.agents) return;

    const newNodes: Node[] = updatedData.agents.map((agent) => ({
      id: agent.agent_id,
      data: {
        label: (
          <div
            style={{
              background: "#fff",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              boxShadow: "2px 2px 10px rgba(0,0,0,0.1)",
              textAlign: "center",
            }}
          >
            <strong>{agent.role_name}</strong> <br />
            <small>ID: {agent.agent_id}</small> <br />
            <em>System: {agent.system_prompt}</em> <br />
            <em>Task: {agent.task_prompt}</em>
          </div>
        ),
        role_name: agent.role_name,
        system_prompt: agent.system_prompt,
        task_prompt: agent.task_prompt,
      },
      position: { x: agent.positionX, y: agent.positionY },
    }));

    const newEdges: Edge[] = updatedData.agents.flatMap((agent) =>
      agent.related_agents.map((relatedAgent) => ({
        id: `${agent.agent_id}-${relatedAgent}`,
        source: agent.agent_id,
        target: relatedAgent,
        animated: true,
      }))
    );

    setNodes(newNodes);
    console.log("nodesssssalll:", nodes);
    setEdges(newEdges);
    console.log("edgessssalll:", edges);

    onUpdatedData(updatedData);
  }, [data, updatedData, onUpdatedData]);

  // Handle node changes
  const onNodesChange = useCallback(
    (changes: any) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  // Handle edge changes
  const onEdgesChange = useCallback(
    (changes: any) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  // Function to update the node data from the sidebar
  const updateNodeData = useCallback(
    (updatedRoleName: string, updatedSystemPrompt: string, updatedTaskPrompt: string) => {
      console.log("updatedroleeee::::", updatedRoleName);
      
      // Optionally update the selected node's data here if you need to reflect changes in the graph
      if (selectedNode) {
        console.log("selecteddddd::::", selectedNode.id);
        setNodes((nds) =>
          nds.map((node) =>
            node.id === selectedNode.id
              ? {
                  ...node,
                  data: {
                    ...node.data,
                    role_name: updatedRoleName,
                    system_prompt: updatedSystemPrompt,
                    task_prompt: updatedTaskPrompt,
                    label: (
                      <div
                        style={{
                          background: "#fff",
                          padding: "10px",
                          borderRadius: "8px",
                          border: "1px solid #ccc",
                          boxShadow: "2px 2px 10px rgba(0,0,0,0.1)",
                          textAlign: "center",
                        }}
                      >
                        <strong>{updatedRoleName}</strong> <br />
                        <small>ID: {selectedNode.id}</small> <br />
                        <em>System: {updatedSystemPrompt}</em> <br />
                        <em>Task: {updatedTaskPrompt}</em>
                      </div>
                    ),
                  },
                }
              : node
          )
        );

        console.log("nodeeeesssss::::", nodes[0].id);

        setUpdatedData((prevData) => ({
          agents: prevData.agents.map((agent) =>
            agent.agent_id === selectedNode.id
              ? {
                  ...agent,
                  role_name: updatedRoleName,
                  system_prompt: updatedSystemPrompt,
                  task_prompt: updatedTaskPrompt,
                }
              : agent
          ),
        }));
        console.log("updatedddd;::::", updatedData);
      }
    }, [selectedNode]
  );

  return (
    <div className="flex h-screen">
      <div className="w-3/4 h-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={(_, node) => setSelectedNode(node)}
          fitView
        >
          <Controls />
          <Background />
        </ReactFlow>
      </div>
      <AgentSidebar node={selectedNode} updateNodeData={updateNodeData} />
    </div>
  );
};

export default AgentGraph;
