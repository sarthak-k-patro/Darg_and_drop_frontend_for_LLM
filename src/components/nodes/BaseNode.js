import { Handle, Position } from "reactflow";
import { motion } from "framer-motion";
import styles from "../../styles/BaseNode.module.css";

export const BaseNode = ({
  id,
  title = "",
  icon,
  inputHandles = [],
  outputHandles = [],
  children,
  style = {},
  selected = false,
}) => {
  const defaultOffset = 20;
  const spacing = 30;

  return (
    <motion.div
      className={`${styles.baseNode} ${selected ? styles.selectedNode : ""} `}
      style={style}
    >
      {icon && <div className={styles.nodeIcon}>{icon}</div>}
      {inputHandles.map((h, i) => {
        const topPosition = h.style?.top ?? defaultOffset + i * spacing;
        const isLeft = h.position === Position.Left;
        return (
          <div key={h.id}>
            <Handle
              type="target"
              position={h.position || Position.Left}
              id={`${id}-${h.id}`}
              className={`${styles.handle} ${styles.handleTarget}`}
              style={{ ...h.style }}
            />
            {h.label && (
              <div
                className={styles.handleLabel}
                style={{
                  top: topPosition - 7,
                  left: isLeft ? "-25px" : undefined,
                }}
              >
                {h.label}
              </div>
            )}
          </div>
        );
      })}
      <div className={styles.title}>{title}</div>
      <div className={styles.children}>{children}</div>
      {outputHandles.map((h, i) => {
        const topPosition = h.style?.top ?? defaultOffset + i * spacing;
        return (
          <Handle
            key={h.id}
            type="source"
            position={h.position || Position.Right}
            id={`${id}-${h.id}`}
            className={`${styles.handle} ${styles.handleSource}`}
            style={{
              top: topPosition,
              ...h.style,
            }}
          />
        );
      })}
    </motion.div>
  );
};
