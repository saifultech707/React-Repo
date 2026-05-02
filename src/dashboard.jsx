import { useState } from "react";
import ProjectsPage from "./ProjectsPage";
import UpdatesPage from "./UpdatesPage";
import { useNavigate } from "react-router-dom";
import PopupMenu from "./popup menu ";
// import PopupMenu from "./popup menu";

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const [activeMenu, setActiveMenu] = useState("Dashboard");

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        height: "100%",
        fontFamily: "sans-serif",
        // alignItems: "center",
        // position: "relative",
        margin: 0,
        padding: 0,
      }}
    >
      {/* ================= সাইডবার ================= */}
      <div
        style={{
          width: isSidebarOpen ? "250px" : "80px",
          backgroundColor: "#f2f3f5",
          borderRight: "1px solid #e0e0e0",
          transition: "width 0.3s ease",
          display: "flex",
          flexDirection: "column",
          padding: "20px 10px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "30px",
            padding: "0 10px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "24px", color: "#ff7f50" }}>🌅</span>
            {isSidebarOpen && (
              <span style={{ fontWeight: "bold", fontSize: "18px" }}>
                Code Horizon
              </span>
            )}
          </div>
          <button
            onClick={toggleSidebar}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "18px",
            }}
          >
            {isSidebarOpen ? "⬅️" : "➡️"}
          </button>
        </div>

        <div
          style={{
            background: "#e6f0ff",
            padding: "10px",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "20px",
            cursor: "pointer",
          }}
        >
          <div
            style={{
              background: "#007bff",
              color: "white",
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontWeight: "bold",
            }}
          >
            J
          </div>
          {isSidebarOpen && (
            <span style={{ fontWeight: "500" }}>My Project Space</span>
          )}
          <PopupMenu />
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            flex: 1,
          }}
        >
          <p
            style={{
              fontSize: "12px",
              color: "#888",
              marginLeft: "10px",
              display: isSidebarOpen ? "block" : "none",
            }}
          >
            MENU
          </p>

          <MenuItem
            icon="🏠"
            text="Dashboard"
            isOpen={isSidebarOpen}
            active={activeMenu === "Dashboard"}
            onClick={() => setActiveMenu("Dashboard")}
          />
          <MenuItem
            icon="🚀"
            text="Projects"
            isOpen={isSidebarOpen}
            active={activeMenu === "Projects"}
            onClick={() =>
              setActiveMenu("Projects")
            } /* <-- শুধু 'Projects' লিখুন */
          />
          <MenuItem
            icon="🌿"
            text="Updates"
            isOpen={isSidebarOpen}
            active={activeMenu === "Updates"}
            onClick={() =>
              setActiveMenu("Updates")
            } /* <-- শুধু 'Updates' লিখুন */
          />

          <p
            style={{
              fontSize: "12px",
              color: "#888",
              marginLeft: "10px",
              marginTop: "20px",
              display: isSidebarOpen ? "block" : "none",
            }}
          >
            HELP
          </p>
          <MenuItem icon="📚" text="Knowledgebase" isOpen={isSidebarOpen} />
        </div>

        <div
          style={{
            padding: "10px",
            borderTop: "1px solid #ddd",
            marginTop: "auto",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            cursor: "pointer",
          }}
        >
          <span style={{ fontSize: "20px" }}>👑</span>
          {isSidebarOpen && (
            <span style={{ fontWeight: "500" }}>Upgrade to Pro</span>
          )}
        </div>
      </div>

      {/* ================= মূল কন্টেন্ট ================= */}
      <div
        style={{
          flex: 1,
          background:
            "linear-gradient(135deg, #e0f2fe 0%, #ffffff 50%, #fff7ed 100%)",
          padding: "40px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
        }}
      >
        {/* ৩. কন্ডিশনাল রেন্ডারিং: Dashboard সিলেক্ট থাকলে এটি দেখাবে */}
        {activeMenu === "Dashboard" && (
          <>
            <p style={{ marginTop: "50px", fontSize: "16px", color: "#555" }}>
              Hi jui!
            </p>
            <h1
              style={{
                fontSize: "48px",
                fontWeight: "bold",
                textAlign: "center",
                maxWidth: "600px",
                lineHeight: "1.2",
                marginTop: "10px",
              }}
            >
              What startup are you validating today?
            </h1>
            <p style={{ color: "#666", marginTop: "20px", fontSize: "16px" }}>
              We'll generate the full app structure for you — you can refine it
              after seeing the preview.
            </p>

            <div
              style={{
                background: "white",
                padding: "15px",
                borderRadius: "12px",
                boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
                width: "100%",
                maxWidth: "700px",
                marginTop: "40px",
              }}
            >
              <input
                type="text"
                placeholder="Describe the app you want to create..."
                style={{
                  width: "100%",
                  border: "none",
                  outline: "none",
                  fontSize: "16px",
                  padding: "10px 5px",
                  marginBottom: "15px",
                }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    style={{
                      background: "#3b82f6",
                      color: "white",
                      border: "none",
                      padding: "8px 15px",
                      borderRadius: "20px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    📱 Mobile App
                  </button>
                  <button
                    style={{
                      background: "white",
                      color: "#555",
                      border: "1px solid #ddd",
                      padding: "8px 15px",
                      borderRadius: "20px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    🌐 Website
                  </button>
                  <button
                    onClick={() => navigate("/transition")}
                    style={{
                      background: "white",
                      color: "#555",
                      border: "1px solid #ddd",
                      padding: "8px 15px",
                      borderRadius: "20px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    💻 Web App
                  </button>
                </div>
                <button
                  style={{
                    background: "#bae6fd",
                    color: "#0284c7",
                    border: "none",
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    cursor: "pointer",
                    fontSize: "18px",
                  }}
                >
                  ↑
                </button>
              </div>
            </div>

            <div style={{ marginTop: "50px", textAlign: "center" }}>
              <p style={{ color: "#555", marginBottom: "15px" }}>
                Not sure where to start? Try one of these:
              </p>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "10px",
                  justifyContent: "center",
                  maxWidth: "600px",
                }}
              >
                <Chip icon="📄" text="Reporting Dashboard" />
                <Chip icon="🌱" text="Plant E-Commerce Website" />
                <Chip icon="🚀" text="Onboarding Portal" />
                <Chip icon="📍" text="Restaurant Finder" />
                <Chip icon="🤝" text="Networking App" />
              </div>
            </div>
          </>
        )}
        {/* Dashboard বাদে অন্য মেনুতে ক্লিক করলে এই মেসেজটি দেখাবে */}
        {activeMenu === "Projects" && <ProjectsPage />}{" "}
        {activeMenu === "Updates" && <UpdatesPage />}
        {/* এই ফ্লোটিং আপডেট বারটি সব পেজেই থাকবে */}
        <div
          style={{
            position: "fixed",
            bottom: "60px",
            right: "30px",
            background: "white",
            padding: "12px 20px",
            borderRadius: "3px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            cursor: "pointer",
          }}
        >
          <span style={{ fontSize: "16px" }}>⏳</span>
          <span style={{ fontWeight: "500", color: "#333" }}>
            Updating <strong>2</strong> Projects
          </span>
          <span style={{ marginLeft: "10px" }}>︿</span>
        </div>
      </div>
    </div>
  );
}

function MenuItem({ icon, text, isOpen, active, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "15px",
        padding: "10px",
        borderRadius: "8px",
        cursor: "pointer",
        backgroundColor: active ? "#e0f2fe" : "transparent",
        color: active ? "#0284c7" : "#555",
      }}
    >
      <span style={{ fontSize: "18px" }}>{icon}</span>
      {isOpen && (
        <span style={{ fontWeight: active ? "bold" : "normal" }}>{text}</span>
      )}
      {isOpen && <span style={{ marginLeft: "auto" }}>›</span>}
    </div>
  );
}

function Chip({ icon, text }) {
  return (
    <button
      style={{
        background: "white",
        border: "1px solid #ddd",
        padding: "8px 16px",
        borderRadius: "20px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        color: "#555",
      }}
    >
      <span>{icon}</span>
      <span>{text}</span>
    </button>
  );
}
