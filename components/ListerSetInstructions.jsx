"use client";

import { useState } from "react";

export default function ListerSetInstructions({
  setShowInstructionsForm,
  setFormData,
}) {
  const [count, setCount] = useState(0);

  const handleChange = (e) => {
    e.preventDefault();
    setFormData((prev) => ({ ...prev, instructions: e.target.value }));
    setCount(e.target.value.length);
  };

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex justify-center items-center">
      <div className="bg-white rounded-xl p-6 w-11/12 md:w-[600px] shadow-xl">
        <h3 className="text-lg font-semibold mb-3">Service Instructions</h3>

        <textarea
          className="w-full p-2 border rounded mb-4"
          rows="5"
          maxLength={500}
          onChange={handleChange}
          placeholder="Provide any important information that a customer may need prior to requesting an appointment with you..."
        />

        <div className="text-sm text-gray-500 text-right mb-2">
          {count}/500 characters
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={() => setShowInstructionsForm(false)}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={() => setShowInstructionsForm(false)}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
