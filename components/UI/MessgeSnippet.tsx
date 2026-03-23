export default function CodeLine({
  line,
  formData,
}: {
  line: string;
  formData: { name: string; email: string; message: string };
}) {
  if (line === "") {
    return (
      <span
        style={{
          lineHeight: "22px",
          fontFamily: "'Fira Code', monospace",
          fontSize: "12px",
        }}
      >
        {" "}
      </span>
    );
  }

  // Colour keywords
  const isKeyword = line.startsWith("const") || line.startsWith("button");
  const isComment = line.startsWith("//");
  const isCloser = line === "}" || line === "})" || line === "})";

  if (isComment)
    return (
      <span
        style={{
          color: "#607B96",
          lineHeight: "22px",
          fontFamily: "'Fira Code', monospace",
          fontSize: "12px",
          whiteSpace: "pre",
        }}
      >
        {line}
      </span>
    );

  // Lines with interpolated form values
  if (line.includes("name:")) {
    return (
      <span
        style={{
          lineHeight: "22px",
          fontFamily: "'Fira Code', monospace",
          fontSize: "12px",
          whiteSpace: "pre",
        }}
      >
        <span style={{ color: "#607B96" }}>{"  "}</span>
        <span style={{ color: "#E99287" }}>name</span>
        <span style={{ color: "#607B96" }}>: </span>
        <span style={{ color: "#FEA55F" }}>&quot;{formData.name}&quot;</span>
        <span style={{ color: "#607B96" }}>,</span>
      </span>
    );
  }
  if (line.includes("email:")) {
    return (
      <span
        style={{
          lineHeight: "22px",
          fontFamily: "'Fira Code', monospace",
          fontSize: "12px",
          whiteSpace: "pre",
        }}
      >
        <span style={{ color: "#607B96" }}>{"  "}</span>
        <span style={{ color: "#E99287" }}>email</span>
        <span style={{ color: "#607B96" }}>: </span>
        <span style={{ color: "#FEA55F" }}>&quot;{formData.email}&quot;</span>
        <span style={{ color: "#607B96" }}>,</span>
      </span>
    );
  }
  if (line.includes("message:")) {
    const truncated = formData.message
      ? formData.message.replace(/\n/g, " ").slice(0, 40)
      : "";
    return (
      <span
        style={{
          lineHeight: "22px",
          fontFamily: "'Fira Code', monospace",
          fontSize: "12px",
          whiteSpace: "pre",
        }}
      >
        <span style={{ color: "#607B96" }}>{"  "}</span>
        <span style={{ color: "#E99287" }}>message</span>
        <span style={{ color: "#607B96" }}>: </span>
        <span style={{ color: "#FEA55F" }}>&quot;{truncated}&quot;</span>
        <span style={{ color: "#607B96" }}>,</span>
      </span>
    );
  }
  if (line.includes("date:")) {
    return (
      <span
        style={{
          lineHeight: "22px",
          fontFamily: "'Fira Code', monospace",
          fontSize: "12px",
          whiteSpace: "pre",
        }}
      >
        <span style={{ color: "#607B96" }}>{"  "}</span>
        <span style={{ color: "#E99287" }}>date</span>
        <span style={{ color: "#607B96" }}>: </span>
        <span style={{ color: "#FEA55F" }}>
          &quot;{new Date().toDateString()}&quot;
        </span>
        <span style={{ color: "#607B96" }}>,</span>
      </span>
    );
  }

  return (
    <span
      style={{
        color: isKeyword ? "#4D5BCE" : isCloser ? "#607B96" : "#43D9AD",
        lineHeight: "22px",
        fontFamily: "'Fira Code', monospace",
        fontSize: "12px",
        whiteSpace: "pre",
      }}
    >
      {line}
    </span>
  );
}
