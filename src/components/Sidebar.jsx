import React, { useState } from "react";
import { useDrag } from "react-dnd";
import { FaSearch, FaChevronDown, FaChevronRight } from "react-icons/fa";

const categories = [
  {
    name: "Basic UI Elements",
    components: [
      { id: 1, type: "button", label: "Button", icon: "🔘" },
      { id: 2, type: "input", label: "Input Field", icon: "🖊" },
      { id: 3, type: "heading", label: "Heading", icon: "🔠" },
      { id: 4, type: "textarea", label: "Text Area", icon: "📝" },
      { id: 5, type: "paragraph", label: "Paragraph", icon: "📄" },
    ],
  },
  {
    name: "Form Components",
    components: [
      { id: 6, type: "dropdown", label: "Dropdown", icon: "⬇️" },
      { id: 7, type: "checkbox", label: "Checkbox", icon: "☑️" },
      { id: 8, type: "radio", label: "Radio Button", icon: "🔘" },
      { id: 9, type: "datepicker", label: "Date Picker", icon: "📅" },
      { id: 10, type: "slider", label: "Slider", icon: "🔀" },
      { id: 11, type: "toggle", label: "Toggle", icon: "🔄" },
      { id: 12, type: "fileupload", label: "File Upload", icon: "📁" },
    ],
  },
  // Add more categories as needed
];

export default function Sidebar({ setComponents }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [openCategories, setOpenCategories] = useState({});

  const toggleCategory = (categoryName) => {
    setOpenCategories((prev) => ({
      ...prev,
      [categoryName]: !prev[categoryName],
    }));
  };

  const filteredCategories = categories.map((category) => ({
    ...category,
    components: category.components.filter((comp) =>
      comp.label.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  }));

  return (
    <div className="w-1/4 bg-white p-4 shadow-lg">
      <h2 className="text-xl font-bold mb-4">UI Components</h2>
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search components..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border rounded-md"
          />
          <FaSearch className="absolute top-2 right-2 text-gray-500" />
        </div>
      </div>
      {filteredCategories.map((category) => (
        <div key={category.name} className="mb-4">
          <button
            onClick={() => toggleCategory(category.name)}
            className="flex items-center justify-between w-full p-2 bg-blue-500 text-white rounded-md"
          >
            {category.name}
            {openCategories[category.name] ? <FaChevronDown /> : <FaChevronRight />}
          </button>
          {openCategories[category.name] && (
            <div className="mt-2">
              {category.components.map((comp) => (
                <DraggableComponent key={comp.id} comp={comp} />
              ))}
            </div>
          )}
        </div>
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
      className={`p-2 bg-blue-500 text-white rounded-md mb-2 cursor-move flex items-center ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <span className="mr-2">{comp.icon}</span>
      {comp.label}
    </div>
  );
}