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
import styles from "../style.module.css";
import "@/app/globals.css";

interface Props {
  data: { agents: Agent[] };
  onUpdatedData: (daya: { agents: Agent[] }) => void;
}

const AgentGraph: React.FC<Props> = ({ data, onUpdatedData }) => {
  const defaultViewport = { x: 0, y: 0, zoom: 1.5 };
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
          <div className={`${styles.node}`}>
            <div className={`${styles.node_id}`}>
              ID: {agent.agent_id}
            </div>
            <div className={`${styles.node_head}`}>
              {agent.role_name}
            </div>
            <div className={`${styles.node_body}`}>
              <div> System: {agent.system_prompt} </div>
              <div> Task: {agent.task_prompt} </div>
            </div>
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
    setEdges(newEdges);

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
      
      // Optionally update the selected node's data here if you need to reflect changes in the graph
      if (selectedNode) {
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
                      <div className={`${styles.nodes}`}>
                        <strong>{updatedRoleName}</strong>
                        <small>ID: {selectedNode.id}</small>
                        <em>System: {updatedSystemPrompt}</em>
                        <em>Task: {updatedTaskPrompt}</em>
                      </div>
                    ),
                  },
                }
              : node
          )
        );

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
      }
    }, [selectedNode]
  );

  return (
    <div className="relative flex h-screen items-center justify-center">
      <div className="w-full h-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={(_, node) => setSelectedNode(node)}
          defaultViewport={defaultViewport}
          minZoom={0.2}
          maxZoom={4}
          attributionPosition="bottom-left"
          fitView
          fitViewOptions={{ padding: 0.5 }}
          
        >
          <Controls />
          <Background />
        </ReactFlow>
      </div>
      <div className={`absolute top-[250px] right-[50px] w-[400px] ${selectedNode ? '' : 'hidden'} p-4 items-center bg-white text-[#3D3D3D] rounded-[10px] z-10`}>
        <AgentSidebar node={selectedNode} updateNodeData={updateNodeData} />
      </div>
    </div>
  );
};

export default AgentGraph;
