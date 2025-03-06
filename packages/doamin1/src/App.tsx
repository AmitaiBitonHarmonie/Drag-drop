import React, { useRef, useEffect, useState } from "react";

const MainApp = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isDragging, setDragging] = useState(false);

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>, text: string) => {
    event.dataTransfer.setData("text/plain", text);
    event.dataTransfer.effectAllowed = "copyMove";
    setDragging(true);
  };

  const handleDragEnd = () => {
    setDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);

    const data = event.dataTransfer.getData("text/plain");
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ type: "DROP_EVENT", data }, "http://localhost:3001");
    }
  };

  return (
    <div>
      <h2>Main Page (Domain 1)</h2>

      {/* Draggable Elements */}
      <div
        draggable
        onDragStart={(e) => handleDragStart(e, "Dragged Item 1")}
        onDragEnd={handleDragEnd}
        style={{
          padding: "10px",
          margin: "10px",
          backgroundColor: "lightblue",
          cursor: "grab",
        }}
      >
        Drag me to the iframe!
      </div>

      {/* Drop Area with Iframe */}
      <div
        id="drop-area"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        style={{
          width: "600px",
          height: "400px",
          border: "2px solid black",
          position: "relative",
        }}
      >
        <iframe
          ref={iframeRef}
          src="http://localhost:3001"
          width="100%"
          height="100%"
          style={{ pointerEvents: isDragging ? "none" : "all" }}
        />
      </div>
    </div>
  );
};

export default MainApp;
