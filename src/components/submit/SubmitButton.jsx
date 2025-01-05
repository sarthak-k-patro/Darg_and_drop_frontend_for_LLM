import { useStore } from "../../state-management/store";
import styles from "../../styles/submit.module.css";

export const SubmitButton = () => {
  const { nodes, edges } = useStore((state) => ({
    nodes: state.nodes,
    edges: state.edges,
  }));

  const handleSubmit = async () => {
    // Filter out invalid edges
    const validEdges = edges.filter((edge) => {
      const sourceNodeExists = nodes.some((node) => node.id === edge.source);
      const targetNodeExists = nodes.some((node) => node.id === edge.target);
      return sourceNodeExists && targetNodeExists;
    });

    // Extract node IDs and valid edge connections
    const nodeIds = nodes.map((node) => node.id);
    const edgeConnections = validEdges.map(
      (edge) => `${edge.source}->${edge.target}`
    );

    // Create URLSearchParams and append nodes and edges
    const params = new URLSearchParams();
    nodeIds.forEach((node) => params.append("nodes", node));
    edgeConnections.forEach((edge) => params.append("edges", edge));

    try {
      const response = await fetch("http://localhost:8000/pipelines/parse", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Error: ${errorData.detail}`);
        return;
      }

      const data = await response.json();
      alert(`Response: ${JSON.stringify(data)}`);
    } catch (error) {
      alert(`Fetch Error: ${error.message}`);
    }
  };

  return (
    <span className={styles.container}>
      <button className={styles.button} onClick={handleSubmit}>
        Submit
      </button>
    </span>
  );
};
