import { DraggableNode } from "../../components/draggable-node/DraggableNode";
import { useState, useEffect } from "react";
import styles from "../../styles/pipelineToolbar.module.css";
import { FaMoon, FaSun } from "react-icons/fa";
import { nodeConfigs } from "../../components/nodes/NodeConfig";

export const PipelineToolbar = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check local storage for theme preference
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => {
      const newMode = !prevMode;
      if (newMode) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
      return newMode;
    });
  };
  return (
    <div className={styles.toolbar}>
      <div className={styles.nodeList}>
        {nodeConfigs.map((node) => (
          <DraggableNode
            key={node.type}
            type={node.type}
            label={node.label}
            icon={node.icon}
          />
        ))}
      </div>
      <button className={styles.toggleButton} onClick={toggleDarkMode}>
        {darkMode ? <FaSun /> : <FaMoon />}
      </button>
    </div>
  );
};
