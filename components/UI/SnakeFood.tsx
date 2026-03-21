export default function SnakeFood({
  i,
  foodLeft,
}: {
  i: number;
  foodLeft: number;
}) {
  return (
    <div
      style={{
        backgroundColor: "rgba(67, 217, 173, 0.1)",
        borderRadius: "50%",
        display: "flex",
        padding: "5px",
        justifyContent: "center",
        alignItems: "center",
        backdropFilter: "blur(64px)",
        boxShadow: "0px 2px 0px 0px rgba(255, 255, 255, 0.05) inset",
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(67, 217, 173, 0.2)",
          borderRadius: "50%",
          display: "flex",
          padding: "5px",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          key={i}
          style={{
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            background: i < foodLeft ? "#43D9AD" : "rgba(67, 217, 173, 0.2)",
            transition: "all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        ></div>
      </div>
    </div>
  );
}
