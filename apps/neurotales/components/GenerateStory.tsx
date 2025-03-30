"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function GenerateStory({ userId }: { userId: string }) {
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    scenario: "",
    childName: "",
    age: "",
    pronouns: "they/them",
    specialNeedsDetails: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/generate-story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, userId, age: Number(form.age) }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push(`/stories/${data.storyId}`);
      } else {
        alert("Error: " + data.error);
      }
    } catch (error) {
      console.error(error);
      alert("Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <input
        name="title"
        placeholder="Title"
        value={form.title}
        onChange={handleChange}
        className="w-full p-2 border rounded-lg mb-2"
      />
      <input
        name="scenario"
        placeholder="Scenario"
        value={form.scenario}
        onChange={handleChange}
        className="w-full p-2 border rounded-lg mb-2"
      />
      <input
        name="childName"
        placeholder="Child's Name"
        value={form.childName}
        onChange={handleChange}
        className="w-full p-2 border rounded-lg mb-2"
      />
      <input
        name="age"
        placeholder="Age"
        type="number"
        value={form.age}
        onChange={handleChange}
        className="w-full p-2 border rounded-lg mb-2"
      />
      <input
        name="pronouns"
        placeholder="Pronouns"
        value={form.pronouns}
        onChange={handleChange}
        className="w-full p-2 border rounded-lg mb-2"
      />
      <textarea
        name="specialNeedsDetails"
        placeholder="Special Needs Details"
        value={form.specialNeedsDetails}
        onChange={handleChange}
        className="w-full p-2 border rounded-lg mb-2"
        rows={3}
      />

      <button
        onClick={handleSubmit}
        disabled={loading || !form.title || !form.scenario}
        className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg"
      >
        {loading ? "Generating..." : "Create Story"}
      </button>
    </div>
  );
}
