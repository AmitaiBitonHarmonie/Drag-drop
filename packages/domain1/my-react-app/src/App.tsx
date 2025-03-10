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
  const [dropHighlight, setDropHighlight] = useState(false);

  const [isDragging, setIsDragging] = useState(false);
  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    
    // For cross-domain drag and drop, we can only use text/plain
    const jsonData = JSON.stringify("data");
    
    // Set plain text data for cross-domain compatibility
    e.dataTransfer.setData('text/plain', jsonData);
    e.dataTransfer.effectAllowed = 'move';
    
    // Create a custom drag ghost image
    const ghostElement = document.createElement('div');
    ghostElement.classList.add('email-drag-ghost');
    ghostElement.innerHTML = `
      <div class="bg-white p-4 rounded-lg shadow-lg border border-primary w-64">
        <p class="font-medium text-sm truncate">${"subject"}</p>
        <p class="text-xs text-muted-foreground truncate">${"sender"}</p>
      </div>
    `;
    document.body.appendChild(ghostElement);
    
    // Position the ghost element off-screen initially
    ghostElement.style.position = 'fixed';
    ghostElement.style.top = '-9999px';
    ghostElement.style.left = '-9999px';
    
    // Set custom drag image
    e.dataTransfer.setDragImage(ghostElement, 30, 30);
    
    // Clean up ghost element after a small delay
    setTimeout(() => {
      if (document.body.contains(ghostElement)) {
        document.body.removeChild(ghostElement);
      }
    }, 100);
    
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    
    // Remove any lingering ghost elements
    const ghosts = document.querySelectorAll('.email-drag-ghost');
    ghosts.forEach(ghost => {
      if (document.body.contains(ghost)) {
        document.body.removeChild(ghost);
      }
    });
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    setDropHighlight(false);

    const data = event.dataTransfer.getData("text/plain");
    // ✅ Send drop event to the iframe (Domain2)
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ type: "DROP_EVENT", data }, "https://e8c86e50346a.ngrok.app ");
    }
  };

  return (
    <div className="app-container">
      {/* ✅ Inbox Emails */}
      <div className="inbox-container">
        <h2>Inbox</h2>
        <p className="subtitle">Drag emails to folders</p>
        <div className="email-list" onDragStart={handleDragStart}>
          {emails.map((email) => (
            <div
              key={email.id}
              draggable="true"
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              className="email-item"
            >
              <strong>{email.subject}</strong>
              <p>{email.sender}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ✅ Drop Area for Sidebar */}
      <div
        className={`drop-container ${dropHighlight ? "highlight-border" : ""}`}
      >
        <iframe
          ref={iframeRef}
          src="https://e8c86e50346a.ngrok.app "
          width="100%"
          height="100%"
        />
      </div>
    </div>
  );
};

export default MainApp;
