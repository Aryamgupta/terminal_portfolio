"use client";
import Typewriter from "typewriter-effect";

export default function TypeWritterRole({ roles }: { roles: string[] }) {
  return (
    <h2
      style={{
        color: "#4D5BCE",
        fontSize: "clamp(18px, 2.5vw, 28px)",
        fontWeight: 400,
        display: "flex",
        alignItems: "center",
        gap: "10px",
        fontFamily: "'Fira Code', monospace",
      }}
    >
      <span style={{ color: "#43D9AD" }}>&gt;</span>

      {roles.length > 0 && (
        <Typewriter
          options={{
            strings: roles,
            autoStart: true,
            loop: true,
            delay: 50,
            deleteSpeed: 30,
          }}
        />
      )}
    </h2>
  );
}
