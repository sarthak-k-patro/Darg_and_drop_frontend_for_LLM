import React, { useState, useEffect, useRef } from "react";
import { BaseNode } from "./BaseNode";
import { Position } from "reactflow";
import { nodeConfigs } from "./NodeConfig";

// * Regex to match {{some_variable}} where some_variable is a valid JavaScript identifier.
// * Matches double curly braces containing letters, digits, underscores, or $,
// * starting with a letter, underscore, or $.

const variableRegex = /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g;

export const NodeBuilder = ({ id, data }) => {
  // Find the config for the current node type
  const config = nodeConfigs.find((node) => node.type === data?.nodeType);

  // Prepare the initial state for all fields
  const initialState = {};
  if (config) {
    config.fields.forEach((field) => {
      initialState[field.key] = data?.[field.key] ?? field.default;
    });
  }

  const [fieldState, setFieldState] = useState(initialState);

  // Keep track of variable-based input handles
  const [variableHandles, setVariableHandles] = useState([]);

  // For auto-resizing the textarea

  const textAreaRef = useRef(null);

  // Recompute fieldState if config or data changes
  useEffect(() => {
    if (config) {
      const updatedState = {};
      config.fields.forEach((field) => {
        updatedState[field.key] = data?.[field.key] ?? field.default;
      });
      setFieldState(updatedState);
    }
  }, [data, config]);

  // Parse variables in text field and build dynamic input handles
  useEffect(() => {
    if (config?.type === "textNode") {
      const textValue = fieldState.text || "";
      const matches = [...textValue.matchAll(variableRegex)];

      // Creating input handles for each unique variable
      const dynamicHandles = matches.map((match, index) => ({
        id: `var-${match[1]}`,
        position: Position.Left,
        style: { top: 50 + index * 35 },
        label: match[1], // showing variable name beside handle
      }));
      setVariableHandles(dynamicHandles);
    } else {
      setVariableHandles([]);
    }
  }, [fieldState, config?.type]);

  // Auto-resize the textarea as the user types
  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height =
        textAreaRef.current.scrollHeight + "px";
    }
  }, [fieldState.text]);

  // Handle field changes
  const handleChange = (key, value) => {
    setFieldState((prev) => ({
      ...prev,
      [key]: value,
    }));
  };
  if (!config) {
    return <BaseNode id={id} title="Unknown Node" />;
  }

  const allInputHandles = [...(config.inputHandles || []), ...variableHandles];
  return (
    <BaseNode
      id={id}
      title={config.title}
      icon={config.icon}
      inputHandles={allInputHandles}
      outputHandles={config.outputHandles || []}
    >
      {config.fields.map((field) => {
        if (config.type === "textNode" && field.key === "text") {
          return (
            <label key={field.key}>
              {field.label}
              <textarea
                ref={textAreaRef}
                rows={1}
                style={{
                  width: "100%",
                  resize: "none",
                  overflow: "hidden",
                  boxSizing: "border-box",
                }}
                value={fieldState[field.key]}
                onChange={(e) => handleChange(field.key, e.target.value)}
              />
            </label>
          );
        }
        return (
          <label key={field.key}>
            {field.label}
            <input
              type="text"
              value={fieldState[field.key]}
              onChange={(e) => handleChange(field.key, e.target.value)}
            />
          </label>
        );
      })}
    </BaseNode>
  );
};
