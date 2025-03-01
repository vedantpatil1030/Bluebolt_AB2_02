import React from "react";

export default function AISuggestions({ components }) {
  return (
    <div className="w-1/4 bg-gray-100 p-4">
      <h2 className="text-lg font-bold">AI Suggestions</h2>
      {components.length > 0 ? (
        <p className="text-sm mt-2">Try changing the font size for better readability.</p>
      ) : (
        <p className="text-sm mt-2">Add some components to get AI suggestions.</p>
      )}
    </div>
  );
}
