import React, { useState, useEffect } from "react";

const IframePage = () => {
  const [receivedData, setReceivedData] = useState<string | null>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== "http://localhost:3000") return; // Ensure it's from the expected domain

      if (event.data?.type === "DROP_EVENT") {
        console.log("Received Data:", event.data.data);
        setReceivedData(event.data.data);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <div>
      <h1>Iframe Page (Domain2)</h1>
      <div
        style={{
          width: "100%",
          height: "300px",
          backgroundColor: "lightgray",
          textAlign: "center",
          lineHeight: "300px",
        }}
      >
        Drop Here
      </div>

      {/* ✅ Display received text data */}
      {receivedData && (
        <div style={{ marginTop: "20px", padding: "10px", backgroundColor: "#e0f7fa" }}>
          <h3>Received Text:</h3>
          <p>{receivedData}</p>
        </div>
      )}
    </div>
  );
};

export default IframePage;
