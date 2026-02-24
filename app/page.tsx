"use client";

import React from "react";
import { SkillMatrix } from "./SkillMatrix";

export default function Home() {
  const [matrixType, setMatrixType] = React.useState<string | null>(null);

  return (
    <div
      className="flex min-h-screen items-center justify-center font-sans"
      style={{ background: "var(--background)", color: "var(--foreground)" }}
    >
      <main
        className="flex min-h-screen w-full flex-col items-center justify-center py-12 px-4"
        style={{
          background: "var(--slate-gray)",
          width: "100vw",
          maxWidth: "100vw",
        }}
      >
        <h1
          className="text-3xl font-bold mb-8"
          style={{ color: "var(--white)" }}
        >
          Skill Matrix Generator
        </h1>
        {!matrixType ? (
          <div className="flex flex-col gap-6">
            <p className="text-lg" style={{ color: "var(--white)" }}>
              Select the type of skill matrix:
            </p>
            <button
              className="rounded-lg px-6 py-3 font-semibold"
              style={{
                background: "var(--tan)",
                color: "var(--dim-gray)",
                border: "1px solid var(--dim-gray)",
              }}
              onClick={() => setMatrixType("employee")}
            >
              Employee Schedule
            </button>
            <button
              className="rounded-lg px-6 py-3 font-semibold"
              style={{
                background: "var(--tan)",
                color: "var(--dim-gray)",
                border: "1px solid var(--dim-gray)",
              }}
              onClick={() => setMatrixType("board")}
            >
              Board of Directors
            </button>
          </div>
        ) : (
          <div>
            <button
              className="mb-6 text-sm underline"
              style={{
                color: "var(--white)",
                paddingLeft: 24,
                paddingRight: 24,
              }}
              onClick={() => setMatrixType(null)}
            >
              ← Back
            </button>
            <p
              className="text-lg mb-4"
              style={{
                color: "var(--white)",
                paddingLeft: 24,
                paddingRight: 24,
              }}
            >
              {matrixType === "employee"
                ? "Employee Schedule Skill Matrix"
                : "Board of Directors Skill Matrix"}
            </p>
            <SkillMatrix type={matrixType as "employee" | "board"} />
          </div>
        )}
      </main>
    </div>
  );
}
