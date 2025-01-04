import React from "react";
import { getBezierPath } from "reactflow";

function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
  data,
}) {
  // data may contain: { onEdgeRemove }
  const onEdgeRemove = data?.onEdgeRemove;
  //  detect dark mode from html
  const isDarkMode = document.documentElement.classList.contains("dark");
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  const circleColor = isDarkMode ? "#333333" : "#ffffff";
  const strokeColor = isDarkMode ? "#ffffff" : "#333333";
  const handleRemove = () => {
    if (typeof onEdgeRemove === "function") {
      onEdgeRemove(id);
    }
  };
  return (
    <>
      <path
        id={id}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
        style={{ stroke: strokeColor, strokeWidth: 2, fill: "none" }}
      />
      <g
        transform={`translate(${labelX}, ${labelY})`}
        style={{ cursor: "pointer" }}
        onClick={handleRemove}
      >
        <circle
          cx="0"
          cy="0"
          r="10"
          fill={circleColor}
          stroke={strokeColor}
          strokeWidth="2"
        />
        <text
          x="0"
          y="0"
          textAnchor="middle"
          dominantBaseline="middle"
          fill={strokeColor}
          style={{ fontSize: "14px", fontWeight: "bold", userSelect: "none" }}
        >
          x
        </text>
      </g>
    </>
  );
}
export default CustomEdge;
