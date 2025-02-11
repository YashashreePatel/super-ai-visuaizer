import React, { useState, useEffect } from "react";
import ReactFlow, { Background, Controls, Node, Edge } from "reactflow";
import "reactflow/dist/style.css";

interface Agent {
  agent_id: string;
  parent_id: string | null;
  related_agents: string[];
  role_name: string;
  system_prompt: string;
  task_prompt: string;
  positionX: number;
  positionY: number;
}

interface Props {
  data: { agents: Agent[] };
}

const AgentGraph: React.FC<Props> = ({ data }) => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  useEffect(() => {
    if (!data?.agents) return;

    const newNodes: Node[] = data.agents.map((agent) => ({
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
      },
      position: { x: agent.positionX, y: agent.positionY },
    }));

    const newEdges: Edge[] = data.agents.flatMap((agent) =>
      agent.related_agents.map((relatedAgent) => ({
        id: `${agent.agent_id}-${relatedAgent}`,
        source: agent.agent_id,
        target: relatedAgent,
        animated: true,
      }))
    );

    setNodes(newNodes);
    setEdges(newEdges);
  }, [data]);

  return (
    <div className="h-screen w-full border">
      <ReactFlow nodes={nodes} edges={edges} fitView>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default AgentGraph;
