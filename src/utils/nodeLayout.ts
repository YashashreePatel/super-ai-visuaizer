import { Agent, NodeData, EdgeData } from "@/types";
import React from "react";

export const getPyramidLayout = (agents: Agent[]) => {
  const nodeMap = new Map<string, Agent>();
  const nodes: NodeData[] = [];
  const edges: EdgeData[] = [];

  // Create a map of agents
  agents.forEach((agent) => {
    nodeMap.set(agent.agent_id, agent);
  });

  // Define hierarchy levels
  const levels = new Map<number, Agent[]>();
  let maxDepth = 0;

  // Assign levels based on parent-child hierarchy
  const assignLevels = (agent: Agent, level = 0) => {
    if (!levels.has(level)) levels.set(level, []);
    levels.get(level)?.push(agent);
    maxDepth = Math.max(maxDepth, level);

    agents.forEach((child) => {
      if (child.parent_id === agent.agent_id) {
        assignLevels(child, level + 1);
      }
    });
  };

  // Find root nodes and initiate hierarchy assignment
  agents.forEach((agent) => {
    if (!agent.parent_id) {
      assignLevels(agent);
    }
  });

  // Generate positions dynamically for pyramid layout
  const ySpacing = 150;
  const xSpacing = 250;

  levels.forEach((agentsAtLevel, level) => {
    const y = level * ySpacing;
    const xStart = -((agentsAtLevel.length - 1) * xSpacing) / 2;

    agentsAtLevel.forEach((agent, index) => {
      nodes.push({
        id: agent.agent_id,
        position: { x: xStart + index * xSpacing, y },
        data: {
          label: React.createElement(
            "div",
            {},
            React.createElement("strong", {}, index),
            React.createElement("br"),
            React.createElement("strong", {}, agent.role_name),
            React.createElement("br"),
            React.createElement("small", {}, `ID: ${agent.agent_id}`),
            React.createElement("br"),
            React.createElement("em", {}, `System: ${agent.system_prompt}`),
            React.createElement("br"),
            React.createElement("em", {}, `Task: ${agent.task_prompt}`)
          ),
        },
      });

      if (agent.parent_id) {
        edges.push({
          id: `e-${agent.parent_id}-${agent.agent_id}`,
          source: agent.parent_id,
          target: agent.agent_id,
        });
      }
    });
  });

  return { nodes, edges };
};
