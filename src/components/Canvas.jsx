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
      className={`w-3/4 h-full bg-white shadow-md p-4 relative overflow-auto ${
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
      <div className="relative w-full h-full group border border-gray-300 rounded-md p-2 bg-white shadow-sm">
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
    case "paragraph":
      return (
        <p
          contentEditable
          onBlur={(e) => updateComponent(comp.id, { text: e.target.innerText })}
          className="w-full h-full border p-2 bg-transparent text-black"
          style={{ outline: "none" }}
        >
          {comp.text}
        </p>
      );
    case "dropdown":
      return (
        <select className="w-full h-full border p-2 bg-white">
          <option>{comp.text}</option>
        </select>
      );
    case "checkbox":
      return (
        <div className="flex items-center">
          <input type="checkbox" className="mr-2" />
          <label>{comp.text}</label>
        </div>
      );
    case "radio":
      return (
        <div className="flex items-center">
          <input type="radio" className="mr-2" />
          <label>{comp.text}</label>
        </div>
      );
    case "datepicker":
      return <input type="date" className="w-full h-full border p-2" />;
    case "slider":
      return <input type="range" className="w-full h-full" />;
    case "toggle":
      return (
        <label className="flex items-center cursor-pointer">
          <input type="checkbox" className="sr-only" />
          <div className="w-10 h-4 bg-gray-400 rounded-full shadow-inner"></div>
          <div className="dot absolute w-6 h-6 bg-white rounded-full shadow -left-1 -top-1 transition"></div>
        </label>
      );
    case "fileupload":
      return <input type="file" className="w-full h-full border p-2" />;
    default:
      return null;
  }
}