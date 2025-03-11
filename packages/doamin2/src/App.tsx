import React, { useEffect, useState } from "react";
import "./styles.css";
const folders = [
  { id: "inbox", name: "Inbox" },
  { id: "starred", name: "Starred" },
  { id: "sent", name: "Sent" },
  { id: "drafts", name: "Drafts" },
  { id: "personal", name: "Personal" },
  { id: "work", name: "Work" },
  { id: "finance", name: "Finance" },      // ✅ Added more folders
  { id: "travel", name: "Travel" },
  { id: "archive", name: "Archive" },
  { id: "spam", name: "Spam" },
  { id: "trash", name: "Trash" },
];

const Sidebar = () => {
  const [highlightedFolder, setHighlightedFolder] = useState<string | null>(null);
  const [showSnackbar, setShowSnackbar] = useState(false);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // 🔴 Check if event.origin matches the current domain correctly
      if (!event.origin.includes("ngrok")) return; // ✅ Allow all ngrok URLs (not best for production)
  
      const { type, data } = event.data;
      if (type === "DROP_EVENT") {
        setHighlightedFolder(null);
        setShowSnackbar(true);
        setTimeout(() => setShowSnackbar(false), 3000);
      }
    };
  
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);
  


  return (
    <div className="sidebar">
      <h2>Folders</h2>
      <p className="subtitle">Drop emails to organize</p>
      <div className="folder-list">
        {folders.map((folder) => (
          <div
            key={folder.id}
            className={`folder-item ${highlightedFolder === folder.id ? "highlight" : ""}`}
            onDragOver={(e) => {
              e.preventDefault();
              setHighlightedFolder(folder.id);
            }}
            onDragLeave={() => setHighlightedFolder(null)}
            onDrop={(e) => {
              e.preventDefault();
              setHighlightedFolder(null);
              window.parent.postMessage({ type: "DROP_EVENT", folderId: folder.id }, "https://4e4131a4c751.ngrok.app/");
            }}
          >
            {folder.name}
          </div>
        ))}
      </div>

      {/* ✅ Snackbar Notification */}
      {showSnackbar && <div className="snackbar">✅ Email saved successfully!</div>}
    </div>
  );
};

export default Sidebar;
