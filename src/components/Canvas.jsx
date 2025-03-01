import React from "react";
import { useDrop } from "react-dnd";
import { Rnd } from "react-rnd";

export default function Canvas({ components, setComponents }) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "component",
    drop: (item, monitor) => addComponent(item, monitor),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const addComponent = (item, monitor) => {
    const offset = monitor.getClientOffset();
    setComponents((prev) => [
      ...prev,
      { ...item, id: Date.now(), x: offset.x, y: offset.y, width: 100, height: 50, text: item.label },
    ]);
  };

  const updateComponent = (id, newProps) => {
    setComponents((prev) =>
      prev.map((comp) => (comp.id === id ? { ...comp, ...newProps } : comp))
    );
  };

  const deleteComponent = (id) => {
    setComponents((prev) => prev.filter((comp) => comp.id !== id));
  };

  return (
    <div
      ref={drop}
      className={`w-3/4 h-full bg-white shadow-md p-4 relative ${
        isOver ? "bg-gray-200" : ""
      }`}
    >
      <h2 className="text-xl font-bold mb-4">Design Area</h2>
      {components.map((comp) => (
        <RndComponent key={comp.id} comp={comp} updateComponent={updateComponent} deleteComponent={deleteComponent} />
      ))}
    </div>
  );
}

function RndComponent({ comp, updateComponent, deleteComponent }) {
  return (
    <Rnd
      size={{ width: comp.width, height: comp.height }}
      position={{ x: comp.x, y: comp.y }}
      onDragStop={(e, d) => updateComponent(comp.id, { x: d.x, y: d.y })}
      onResizeStop={(e, direction, ref, delta, position) => {
        updateComponent(comp.id, {
          width: ref.style.width,
          height: ref.style.height,
          ...position,
        });
      }}
      bounds="parent"
    >
      <div className="relative w-full h-full group">
        <ComponentRenderer comp={comp} updateComponent={updateComponent} />
        <button
          onClick={() => deleteComponent(comp.id)}
          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
          &times;
        </button>
      </div>
    </Rnd>
  );
}

function ComponentRenderer({ comp, updateComponent }) {
  switch (comp.type) {
    case "button":
      return (
        <div className="w-full h-full bg-blue-600 text-white rounded text-center flex items-center justify-center">
          <input
            type="text"
            value={comp.text}
            onChange={(e) => updateComponent(comp.id, { text: e.target.value })}
            className="bg-transparent border-none text-white text-center w-full h-full"
            style={{ outline: "none" }}
          />
        </div>
      );
    case "input":
      return <input type="text" placeholder="Enter text" className="w-full h-full border p-2" />;
    case "heading":
      return <h1 className="w-full h-full text-2xl font-bold">{comp.text}</h1>;
    case "textarea":
      return (
        <textarea
          value={comp.text}
          onChange={(e) => updateComponent(comp.id, { text: e.target.value })}
          className="w-full h-full border p-2 bg-transparent text-black"
          style={{ outline: "none", resize: "none" }}
        />
      );
    default:
      return null;
  }
}