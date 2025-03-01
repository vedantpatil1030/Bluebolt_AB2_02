import React from "react";
import { useDrag } from "react-dnd";

const componentsList = [
  { id: 1, type: "button", label: "Button" },
  { id: 2, type: "input", label: "Input Field" },
  { id: 3, type: "heading", label: "Heading" },
  { id: 4, type: "textarea", label: "Text Area" },
];

export default function Sidebar({ setComponents }) {
  return (
    <div className="w-1/4 bg-white p-4 shadow-lg">
      <h2 className="text-xl font-bold mb-4">UI Components</h2>
      {componentsList.map((comp) => (
        <DraggableComponent key={comp.id} comp={comp} />
      ))}
    </div>
  );
}

function DraggableComponent({ comp }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "component",
    item: comp,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`p-2 bg-blue-500 text-white rounded-md mb-2 cursor-move ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      {comp.label}
    </div>
  );
}