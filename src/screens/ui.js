import { useState, useRef, useCallback } from "react";
import ReactFlow, { Controls, Background, MiniMap } from "reactflow";
import { useStore } from "../store";
import { shallow } from "zustand/shallow";
import { NodeBuilder } from "../components/nodes/NodeBuilder";
import CustomEdge from "../components/CustomEdge";
import styles from "../styles/Ui.module.css";
import "reactflow/dist/style.css";

const gridsize = 20;
const proOptions = { hideAttribution: true };
const nodeTypes = {
  nodeBuilder: NodeBuilder,
};
const edgeTypes = {
  custom: CustomEdge,
};
const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
});

export const PipelineUI = () => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const {
    nodes,
    edges,
    getNodeID,
    addNode,
    onNodesChange,
    onEdgesChange,
    onConnect,
  } = useStore(selector, shallow);
  const [highlightNodeId, setHighlightNodeId] = useState(null);
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  //   Called when user starts dragging a connection
  const onConnectStartHandler = (event, { nodeId }) => {
    setHighlightNodeId(nodeId);
  };
  //   Called when user finisher/cancels a connection
  const onConnectEndHandler = () => {
    setHighlightNodeId(null);
  };

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const dataTransfer = event?.dataTransfer?.getData(
        "application/reactflow"
      );
      if (!dataTransfer) return;
      const appData = JSON.parse(dataTransfer);
      const { nodeType: type } = appData || {};
      if (!type) return;
      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      const nodeID = getNodeID(type);
      const newNode = {
        id: nodeID,
        type: "nodeBuilder",
        position,
        data: { nodeType: type },
      };
      addNode(newNode);
    },
    [reactFlowInstance, addNode, getNodeID]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  //   Updated edge removal to use the React Flow "remove" change type

  const onEdgeRemove = useCallback(
    (edgeId) => {
      onEdgesChange([{ id: edgeId, type: "remove" }]);
    },
    [onEdgesChange]
  );

  // Pass onEdgeRemove in data to CustomEdge
  const extendedEdges = edges.map((edge) => ({
    ...edge,
    type: "custom",
    data: { onEdgeRemove },
  }));
  const highlightedNodes = nodes.map((node) =>
    node.id === highlightNodeId
      ? { ...node, className: styles.highlightedNode }
      : node
  );

  const onNodeClick = (event, node) => {
    setSelectedNodeId((prev) => (prev === node.id ? null : node.id));
  };
  const nodesWithSelection = highlightedNodes.map((node) => ({
    ...node,
    selected: node.id === selectedNodeId,
  }));

  return (
    <div ref={reactFlowWrapper} className={styles.uiContainer}>
      <ReactFlow
        nodes={nodesWithSelection}
        edges={extendedEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onConnectStart={onConnectStartHandler}
        onConnectEnd={onConnectEndHandler}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onInit={setReactFlowInstance}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        proOptions={proOptions}
        snapGrid={[gridsize, gridsize]}
        connectionLineType="smoothstep"
        onNodeClick={onNodeClick}
        className={styles.flowArea}
      >
        <Background color="#aaa" gap={gridsize} />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
};
