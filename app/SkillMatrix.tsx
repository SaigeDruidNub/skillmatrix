import React, { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const COOPERATIVE_SKILLS = [
  {
    name: "Collaboration",
    description: "Works effectively with others to achieve shared goals.",
  },
  {
    name: "Conflict Resolution",
    description: "Manages and resolves interpersonal conflicts constructively.",
  },
  {
    name: "Inclusivity",
    description:
      "Promotes and values diversity and inclusion in the workplace.",
  },
  {
    name: "Adaptability",
    description: "Adjusts effectively to new situations and challenges.",
  },
  {
    name: "Ethical Practice",
    description: "Acts with integrity and upholds ethical standards.",
  },
];

const DEFAULTS = {
  employee: {
    skills: [
      {
        name: "Communication",
        description:
          "Clearly conveys information and ideas through a variety of media to individuals or groups.",
      },
      {
        name: "Teamwork",
        description:
          "Works cooperatively and collaboratively with others to achieve collective goals.",
      },
      {
        name: "Technical Knowledge",
        description:
          "Possesses and applies the specific technical knowledge and skills required for the job.",
      },
      {
        name: "Problem Solving",
        description: "Identifies problems and develops logical solutions.",
      },
      {
        name: "Time Management",
        description:
          "Effectively manages time and priorities to meet deadlines.",
      },
      ...COOPERATIVE_SKILLS,
    ],
    levels: ["None", "Beginner", "Intermediate", "Advanced", "Expert"],
  },
  board: {
    skills: [
      {
        name: "Leadership",
        description:
          "Guides and motivates others to achieve organizational goals.",
      },
      {
        name: "Strategic Thinking",
        description:
          "Develops effective strategies aligned with organizational vision and goals.",
      },
      {
        name: "Financial Acumen",
        description:
          "Understands and applies financial principles to decision-making.",
      },
      {
        name: "Risk Management",
        description:
          "Identifies, assesses, and mitigates risks to the organization.",
      },
      {
        name: "Governance",
        description:
          "Ensures compliance with policies, regulations, and best practices.",
      },
      ...COOPERATIVE_SKILLS,
    ],
    levels: ["None", "Basic", "Proficient", "Highly Skilled", "Authority"],
  },
};

export function SkillMatrix({ type }: { type: "employee" | "board" }) {
  const matrixRef = useRef<HTMLDivElement>(null);

  const handleSavePDF = async () => {
    if (!matrixRef.current) return;
    const element = matrixRef.current;
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [canvas.width, canvas.height],
    });
    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save("skill-matrix.pdf");
  };
  const [skills, setSkills] = React.useState<
    { name: string; description: string }[]
  >([...DEFAULTS[type].skills]);
  const [people, setPeople] = React.useState<string[]>(["Person 1"]);
  // matrix[row][col]: row = skill, col = person
  const [matrix, setMatrix] = React.useState<number[][]>([
    ...DEFAULTS[type].skills.map(() => [0]),
  ]);

  // Skill name change
  const handleSkillChange = (idx: number, value: string) => {
    const updated = [...skills];
    updated[idx] = { ...updated[idx], name: value };
    setSkills(updated);
  };

  const handleSkillDescChange = (idx: number, value: string) => {
    const updated = [...skills];
    updated[idx] = { ...updated[idx], description: value };
    setSkills(updated);
  };

  // Person name change
  const handlePersonChange = (idx: number, value: string) => {
    const updated = [...people];
    updated[idx] = value;
    setPeople(updated);
  };

  // Level change for a skill/person
  const handleLevelChange = (
    skillIdx: number,
    personIdx: number,
    value: number,
  ) => {
    const updated = matrix.map((row, i) =>
      i === skillIdx
        ? row.map((cell, j) => (j === personIdx ? value : cell))
        : row,
    );
    setMatrix(updated);
  };

  // Add a new skill (row)
  const addSkill = () => {
    setSkills([...skills, { name: "", description: "" }]);
    setMatrix([...matrix, Array(people.length).fill(0)]);
  };

  // Remove a skill (row)
  const removeSkill = (idx: number) => {
    setSkills(skills.filter((_, i) => i !== idx));
    setMatrix(matrix.filter((_, i) => i !== idx));
  };

  // Add a new person (column)
  const addPerson = () => {
    setPeople([...people, `Person ${people.length + 1}`]);
    setMatrix(matrix.map((row) => [...row, 0]));
  };

  // Remove a person (column)
  const removePerson = (idx: number) => {
    setPeople(people.filter((_, i) => i !== idx));
    setMatrix(matrix.map((row) => row.filter((_, j) => j !== idx)));
  };

  return (
    <div
      className="w-full"
      style={{ maxWidth: "100vw", paddingLeft: 24, paddingRight: 24 }}
    >
      <div className="flex justify-end mb-4">
        <button
          className="rounded px-4 py-2 text-sm font-medium"
          style={{
            background: "var(--tan)",
            color: "var(--foreground)",
            border: "1px solid var(--dim-gray)",
          }}
          onClick={handleSavePDF}
        >
          Save as PDF
        </button>
      </div>
      <div
        ref={matrixRef}
        className="overflow-x-auto"
        style={{ paddingBottom: 24 }}
      >
        <table
          className="w-full border-collapse mb-4"
          style={{ background: "var(--opal)" }}
        >
          <thead>
            <tr>
              <th
                className="border-b px-4 py-2 text-left"
                style={{ background: "var(--tan)", color: "var(--foreground)" }}
              >
                Skill
              </th>
              {people.map((person, idx) => (
                <th
                  key={idx}
                  className="border-b px-4 py-2 text-left"
                  style={{
                    background: "var(--tan)",
                    color: "var(--foreground)",
                  }}
                >
                  <div className="flex items-center gap-2">
                    <input
                      className="border rounded px-2 py-1"
                      style={{
                        background: "var(--tan)",
                        color: "var(--foreground)",
                        borderColor: "var(--dim-gray)",
                        minWidth: 120,
                      }}
                      value={person}
                      onChange={(e) => handlePersonChange(idx, e.target.value)}
                      placeholder={`Person ${idx + 1}`}
                    />
                    <button
                      style={{ color: "var(--rosy-brown)" }}
                      className="hover:underline"
                      onClick={() => removePerson(idx)}
                      title="Remove person"
                      disabled={people.length === 1}
                    >
                      ✕
                    </button>
                  </div>
                </th>
              ))}
              <th
                className="border-b px-4 py-2"
                style={{ background: "var(--tan)" }}
              ></th>
            </tr>
          </thead>
          <tbody>
            {skills.map((skill, skillIdx) => (
              <tr
                key={skillIdx}
                style={{
                  background:
                    skillIdx % 2 === 0
                      ? "var(--cambridge-blue)"
                      : "var(--opal)",
                }}
              >
                <td className="border-b px-4 py-2">
                  <div style={{ marginBottom: 4 }}>
                    <input
                      className="w-full border rounded px-2 py-1 mb-1"
                      style={{
                        background:
                          skillIdx % 2 === 0
                            ? "var(--cambridge-blue)"
                            : "var(--opal)",
                        color: "var(--foreground)",
                        borderColor: "var(--dim-gray)",
                        minWidth: 150,
                        fontWeight: 600,
                      }}
                      value={skill.name}
                      onChange={(e) =>
                        handleSkillChange(skillIdx, e.target.value)
                      }
                      placeholder="Skill name"
                    />
                  </div>
                  <textarea
                    className="w-full border rounded px-2 py-1"
                    style={{
                      background:
                        skillIdx % 2 === 0
                          ? "var(--cambridge-blue)"
                          : "var(--opal)",
                      color: "var(--foreground)",
                      borderColor: "var(--dim-gray)",
                      fontSize: 13,
                      minHeight: 32,
                      resize: "vertical",
                    }}
                    value={skill.description}
                    onChange={(e) =>
                      handleSkillDescChange(skillIdx, e.target.value)
                    }
                    placeholder="Skill description"
                  />
                </td>
                {people.map((_, personIdx) => (
                  <td className="border-b px-4 py-2" key={personIdx}>
                    <select
                      className="w-full border rounded px-2 py-1"
                      style={{
                        background:
                          skillIdx % 2 === 0
                            ? "var(--cambridge-blue)"
                            : "var(--opal)",
                        color: "var(--foreground)",
                        borderColor: "var(--dim-gray)",
                      }}
                      value={matrix[skillIdx][personIdx]}
                      onChange={(e) =>
                        handleLevelChange(
                          skillIdx,
                          personIdx,
                          Number(e.target.value),
                        )
                      }
                    >
                      {DEFAULTS[type].levels.map((level, i) => (
                        <option key={level} value={i}>
                          {level}
                        </option>
                      ))}
                    </select>
                  </td>
                ))}
                <td className="border-b px-4 py-2 text-center">
                  <button
                    style={{ color: "var(--rosy-brown)" }}
                    className="hover:underline"
                    onClick={() => removeSkill(skillIdx)}
                    title="Remove skill"
                    disabled={skills.length === 1}
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex gap-2 mb-2">
        <button
          className="rounded px-4 py-2 text-sm font-medium"
          style={{
            background: "var(--tan)",
            color: "var(--foreground)",
            border: "1px solid var(--dim-gray)",
          }}
          onClick={addSkill}
        >
          + Add Skill
        </button>
        <button
          className="rounded px-4 py-2 text-sm font-medium"
          style={{
            background: "var(--tan)",
            color: "var(--foreground)",
            border: "1px solid var(--dim-gray)",
          }}
          onClick={addPerson}
        >
          + Add Person
        </button>
      </div>

      {/* Rating Scale Key */}
      <div
        className="mb-8 mt-4 p-4 rounded"
        style={{
          background: "var(--opal)",
          border: "1px solid var(--dim-gray)",
          maxWidth: 600,
        }}
      >
        <div className="font-semibold mb-2">Rating Scale Key:</div>
        {type === "employee" ? (
          <ul className="text-sm list-disc pl-6">
            <li>
              <b>None</b>: No experience or knowledge in this area.
            </li>
            <li>
              <b>Beginner</b>: Basic awareness or understanding; requires
              supervision.
            </li>
            <li>
              <b>Intermediate</b>: Can perform tasks independently; solid
              understanding.
            </li>
            <li>
              <b>Advanced</b>: Deep knowledge; can mentor others and handle
              complex tasks.
            </li>
            <li>
              <b>Expert</b>: Recognized authority; innovates and sets direction
              in this area.
            </li>
          </ul>
        ) : (
          <ul className="text-sm list-disc pl-6">
            <li>
              <b>None</b>: No experience or knowledge in this area.
            </li>
            <li>
              <b>Basic</b>: Understands fundamentals; limited practical
              experience.
            </li>
            <li>
              <b>Proficient</b>: Applies knowledge effectively; can contribute
              to decisions.
            </li>
            <li>
              <b>Highly Skilled</b>: Deep expertise; leads and mentors in this
              area.
            </li>
            <li>
              <b>Authority</b>: Recognized expert; shapes strategy and best
              practices.
            </li>
          </ul>
        )}
      </div>
    </div>
  );
}
