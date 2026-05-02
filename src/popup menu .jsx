import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SlideDialog from "./dilaog";

export default function PopupMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();
  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      {/* Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: "6px 20px",
          background: "#3b82f6",
          color: "yellow",
          border: "none",
          borderRadius: "12px",
          cursor: "pointer",
        }}
      >
        item
      </button>

      {/* Popup */}
      <div
        style={{
          position: "absolute",
          top: "calc(100% + 8px)",
          left: -12,
          background: "white",
          border: "1px solid #e0e0e0",
          borderRadius: "10px",
          minWidth: "180px",
          overflow: "hidden",
          transformOrigin: "top left",
          transform: isOpen ? "scale(1)" : "scale(0.9)",
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "all" : "none",
          transition: "transform 0.2s ease, opacity 0.2s ease",
          zIndex: 10,
        }}
      >
        <MenuItem
          onClick={() => navigate("/navbar")}
          icon="📄"
          text="New document"
        />
        <MenuItem
          onClick={() => navigate("/projects")}
          icon="📁"
          text="New folder"
        />
        <hr
          style={{
            margin: "4px 0",
            border: "none",
            borderTop: "1px solid #eee",
          }}
        />
        <MenuItem
          onClick={() => {
            setIsDialogOpen(true);
            setIsOpen(false);
          }}
          icon="⬆️"
          text="Upload file"
        />
        <MenuItem icon="🔗" text="Paste link" />
      </div>
      <SlideDialog
        isOpen={isDialogOpen}
        closeDialog={() => setIsDialogOpen(false)}
      />
    </div>
  );
}

function MenuItem({ icon, text, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "10px 16px",
        width: "100%",
        border: "none",
        background: "none",
        cursor: "pointer",
        fontSize: "14px",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "#f5f5f5")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
    >
      <span>{icon}</span>
      <span>{text}</span>
    </button>
  );
}
