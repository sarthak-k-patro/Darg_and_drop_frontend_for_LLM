import { FaArrowRight, FaRobot, FaSignOutAlt } from "react-icons/fa";
export const nodeConfigs = [
  {
    type: "inputNode",
    label: "Input",
    title: "Input Node",
    icon: <FaArrowRight />,
    inputHandles: [],
    outputHandles: [{ id: "value" }],
    fields: [
      { key: "inputName", label: "Name", default: "InputName" },
      {
        key: "inputType",
        label: "Type",
        default: "Text",
        type: "select",
        options: ["Text", "File"],
      },
    ],
  },
  {
    type: "llmNode",
    label: "LLM",
    title: "LLM Node",
    icon: <FaRobot />,
    inputHandles: [{ id: "system" }, { id: "prompt" }],
    outputHandles: [{ id: "response" }],
    fields: [
      {
        key: "description",
        label: "Description",
        default: "This is a LLM Node",
      },
    ],
  },
  {
    type: "outputNode",
    label: "Output",
    title: "Output Node",
    icon: <FaSignOutAlt />,
    inputHandles: [{ id: "value" }],
    outputHandles: [],
    fields: [
      { key: "outputName", label: "Name:", default: "OutputName" },
      {
        key: "outputType",
        label: "Type",
        default: "Text",
      },
    ],
  },
  {
    type: "textNode",
    label: "Text",
    title: "Text Node",
    inputHandles: [],
    outputHandles: [{ id: "output" }],
    fields: [{ key: "text", label: "Text", default: "{{input}}" }],
  },
];
