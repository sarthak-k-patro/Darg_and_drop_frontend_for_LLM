import React, { useState, useEffect, useRef } from "react";
import { BaseNode } from "./BaseNode";
import { Position } from "reactflow";
import { nodeConfigs } from "./NodeConfig";

const variableRegex = /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g;

export const NodeBuilder = ({ id, data }) => {
  const config = nodeConfigs.find((node) => node.type === data?.nodeType);
  const initialState = {};
  if (config) {
    config.fields.forEach((field) => {
      initialState[field.key] = data?.[field.key] ?? field.default;
    });
  }

  const [fieldState, setFieldState] = useState(initialState);
  const [variableHandles, setVariableHandles] = useState([]);
  const textAreaRef = useRef(null);

  useEffect(() => {
    if (config) {
      const updatedState = {};
      config.fields.forEach((field) => {
        updatedState[field.key] = data?.[field.key] ?? field.default;
      });
      setFieldState(updatedState);
    }
  }, [data, config]);

  useEffect(() => {
    if (config?.type === "textNode") {
      const textValue = fieldState.text || "";
      const matches = [...textValue.matchAll(variableRegex)];

      const dynamicHandles = matches.map((match, index) => {
        const labelStyle = {
          left: `-${match[1].length * 7.55}px `,
        };
        return {
          id: `var-${match[1]}`,
          position: Position.Left,
          style: { top: 50 + index * 20 },
          label: match[1],
          labelStyle,
        };
      });
      setVariableHandles(dynamicHandles);
    } else {
      setVariableHandles([]);
    }
  }, [fieldState, config?.type]);

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height =
        textAreaRef.current.scrollHeight + "px";
    }
  }, [fieldState.text]);

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
