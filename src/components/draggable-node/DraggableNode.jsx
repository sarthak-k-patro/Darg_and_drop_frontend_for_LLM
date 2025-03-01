import styles from "../../styles/draggableNode.module.css";

// The Draggable nodes in the toolbar (top bar where nodes are present)
export const DraggableNode = ({ type, label, icon }) => {
  const onDragStart = (event, nodeType) => {
    const appData = { nodeType };
    event.target.style.cursor = "grabbing";
    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify(appData)
    );
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div
      className={styles.draggableNode}
      onDragStart={(event) => onDragStart(event, type)}
      onDragEnd={(event) => (event.target.style.cursor = "grab")}
      draggable
    >
      <span className={styles.draggableNodeLabel}>
        {icon && <span className={styles.nodeIcon}>{icon}</span>}
        {label}
      </span>
    </div>
  );
};
