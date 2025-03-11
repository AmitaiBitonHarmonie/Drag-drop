import React, { useRef, useState } from "react";
import "./styles.css"; // ✅ Import CSS

const emails = [
  { id: "1", subject: "Design Review Meeting", sender: "design@company.com" },
  { id: "2", subject: "New Feature Request: Drag & Drop", sender: "product@company.com" },
  { id: "3", subject: "Weekly Team Sync", sender: "alex.m@company.com" },
  { id: "4", subject: "Account Subscription Renewed", sender: "billing@company.com" },
  { id: "5", subject: "Important: Security Update", sender: "security@company.com" },
  { id: "6", subject: "Content Calendar for July", sender: "marketing@company.com" },
];

const MainApp = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isDragging, setDragging] = useState(false);
  const [dropHighlight, setDropHighlight] = useState(false);

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>, emailId: string) => {
    event.dataTransfer.setData("text/plain", emailId);
    event.dataTransfer.effectAllowed = "copyMove";
    setDragging(true);
  };

  const handleDragEnd = () => {
    setDragging(false);
    setDropHighlight(false);

    // ✅ Notify iframe (Domain 2) about drag end
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ type: "DRAG_END" }, "*");
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault(); // ✅ Required to allow drop
    setDropHighlight(true);

    const dragData = {
      type: "DRAG_OVER",
      position: {
        x: event.clientX,
        y: event.clientY,
      },
    };

    // ✅ Send updated drag position to iframe only when hovering over the wrapper
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(dragData, "*");
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    setDropHighlight(false);

    const data = event.dataTransfer.getData("text/plain");

    // ✅ Send drop event to the iframe (Domain 2)
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ type: "DROP_EVENT", data }, "*");
    }
  };

  return (
    <div className="app-container">
      {/* ✅ Inbox Emails */}
      <div className="inbox-container">
        <h2>Inbox</h2>
        <p className="subtitle">Drag emails to folders</p>
        <div className="email-list">
          {emails.map((email) => (
            <div
              key={email.id}
              draggable
              onDragStart={(e) => handleDragStart(e, email.id)}
              onDragEnd={handleDragEnd}
              className="email-item"
            >
              <strong>{email.subject}</strong>
              <p>{email.sender}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ✅ Drop Area for Sidebar (Triggers Drag Position Update) */}
      <div
        className={`drop-container ${dropHighlight ? "highlight-border" : ""}`}
        onDragOver={handleDragOver} // ✅ Now sending position ONLY when hovering over wrapper
        onDragLeave={() => setDropHighlight(false)}
        onDrop={handleDrop}
      >
        <iframe
          ref={iframeRef}
          src="https://daa974208efb.ngrok.app/"
          width="100%"
          height="100%"
          style={{ pointerEvents: isDragging ? "none" : "all" }}
          title="Drag and Drop Iframe"
        />
      </div>
    </div>
  );
};

export default MainApp;
