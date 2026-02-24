import React, { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const DEFAULTS = {
  employee: {
    skills: [
      "Communication",
      "Teamwork",
      "Technical Knowledge",
      "Problem Solving",
      "Time Management",
    ],
    levels: ["None", "Beginner", "Intermediate", "Advanced", "Expert"],
  },
  board: {
    skills: [
      "Leadership",
      "Strategic Thinking",
      "Financial Acumen",
      "Risk Management",
      "Governance",
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
  const [skills, setSkills] = React.useState<string[]>([
    ...DEFAULTS[type].skills,
  ]);
  const [people, setPeople] = React.useState<string[]>(["Person 1"]);
  // matrix[row][col]: row = skill, col = person
  const [matrix, setMatrix] = React.useState<number[][]>([
    ...DEFAULTS[type].skills.map(() => [0]),
  ]);

  // Skill name change
  const handleSkillChange = (idx: number, value: string) => {
    const updated = [...skills];
    updated[idx] = value;
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
    setSkills([...skills, ""]);
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
                  <input
                    className="w-full border rounded px-2 py-1"
                    style={{
                      background:
                        skillIdx % 2 === 0
                          ? "var(--cambridge-blue)"
                          : "var(--opal)",
                      color: "var(--foreground)",
                      borderColor: "var(--dim-gray)",
                      minWidth: 150,
                    }}
                    value={skill}
                    onChange={(e) =>
                      handleSkillChange(skillIdx, e.target.value)
                    }
                    placeholder="Skill name"
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
    </div>
  );
}
