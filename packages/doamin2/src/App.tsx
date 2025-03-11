import React, { useEffect, useState, useRef } from "react";
import "./styles.css";

const folders = [
  { id: "inbox", name: "Inbox" },
  { id: "starred", name: "Starred" },
  { id: "sent", name: "Sent" },
  { id: "drafts", name: "Drafts" },
  { id: "personal", name: "Personal" },
  { id: "work", name: "Work" },
  { id: "finance", name: "Finance" },
  { id: "travel", name: "Travel" },
  { id: "archive", name: "Archive" },
  { id: "spam", name: "Spam" },
  { id: "trash", name: "Trash" },
];

const Sidebar = () => {
  const [highlightedFolder, setHighlightedFolder] = useState<string | null>(null);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const folderRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const lastHoveredFolder = useRef<string | null>(null); // Store last hovered folder

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === "DRAG_OVER") {
        const { position } = event.data;
        detectClosestFolder(position);
      }

      if (event.data.type === "DRAG_END") {
        setHighlightedFolder(null);
      }

      if (event.data.type === "DROP_EVENT") {
        handleDropInSidebar();
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const detectClosestFolder = (position: { x: number; y: number }) => {
    let closestFolder = null;
    let minDistance = Infinity;

    Object.entries(folderRefs.current).forEach(([folderId, element]) => {
      if (element) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const distance = Math.sqrt((centerX - position.x) ** 2 + (centerY - position.y) ** 2);

        if (distance < minDistance) {
          minDistance = distance;
          closestFolder = folderId;
        }
      }
    });

    if (closestFolder) {
      setHighlightedFolder(closestFolder);
      lastHoveredFolder.current = closestFolder; // Store last hovered folder
    }
  };

  const handleDropInSidebar = () => {
    if (lastHoveredFolder.current) {
      const folderName = folders.find((f) => f.id === lastHoveredFolder.current)?.name;
      if (folderName) {
        setSavedMessage(` ✅ Saved successfully to ${folderName}`);
        setTimeout(() => setSavedMessage(null), 2000); // Hide after 2 sec
      }
    }
  };

  return (
    <div className="sidebar">
      <h2>Folders</h2>
      <p className="subtitle">Drop emails to organize</p>
      <div className="folder-list">
        {folders.map((folder) => (
          <div
            key={folder.id}
            ref={(el) => {
              if (el) folderRefs.current[folder.id] = el;
            }}
            className={`folder-item ${highlightedFolder === folder.id ? "highlight" : ""}`}
          >
            {folder.name}
          </div>
        ))}
      </div>

      {/* ✅ Snackbar Message */}
      {savedMessage && (
        <div  className="snackbar">
          {savedMessage}
        </div>
      )}
    </div>
  );
};

export default Sidebar;
