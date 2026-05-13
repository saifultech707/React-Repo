import { useState } from "react";
import ProjectsPage from "./ProjectsPage";
import UpdatesPage from "./UpdatesPage";
import AboutUsPage from "./aboutUsPage";
import showimage from "./assets/note-thanun-CYlPykF-qAM-unsplash.jpg";

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // 🟢 এখানে ডিফল্ট স্টেট "Dashboard"
  const [activeMenu, setActiveMenu] = useState("Dashboard");

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
     

      {/* ================= মূল কন্টেন্ট ================= */}
      <div style={{ flex: 1, overflowY: "auto", background: "#fff" }}>
        {/* ১. হোম/ড্যাশবোর্ড ভিউ */}
        {activeMenu === "Dashboard" && (
          <>
            {/* টপ নেভিগেশন */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "20px 40px",
                alignItems: "center",
                borderBottom: "1px solid #eee",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "30px",
                  fontWeight: "500",
                  color: "#555",
                }}
              >
                <span
                  onClick={() => setActiveMenu("Dashboard")}
                  style={{ color: "#FE5D37", cursor: "pointer" }}
                >
                  Home
                </span>
                {/* 🔴 ভুল ছিল: "a", 🟢 ঠিক করা হলো: "AboutUs" */}
                <span
                  onClick={() => setActiveMenu("AboutUs")}
                  style={{ cursor: "pointer" }}
                >
                  About Us
                </span>
                {/* 🔴 ভুল ছিল: "aboutUsPage", 🟢 ঠিক করা হলো: "Projects" */}
                <span
                  onClick={() => setActiveMenu("Projects")}
                  style={{ cursor: "pointer" }}
                >
                  Classes
                </span>
                <span style={{ cursor: "pointer" }}>Contact Us</span>
              </div>
              <button
                style={{
                  background: "#FE5D37",
                  color: "white",
                  border: "none",
                  padding: "10px 25px",
                  borderRadius: "30px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                Join Us ›
              </button>
            </div>

            {/* হিরো সেকশন */}
            <div
              style={{
                display: "flex",
                padding: "60px 40px",
                alignItems: "center",
                background: "#fff",
              }}
            >
              <div style={{ flex: 1 }}>
                <h1
                  style={{
                    fontSize: "56px",
                    color: "#103741",
                    lineHeight: "1.2",
                    marginBottom: "20px",
                  }}
                >
                  The Best Kindergarten School For Your Child
                </h1>
                <p
                  style={{
                    color: "#666",
                    fontSize: "18px",
                    marginBottom: "30px",
                  }}
                >
                  Vero elitr justo clita lorem. Rebum gubergren ea est ipsum
                  diam lorem erat.
                </p>
                <div style={{ display: "flex", gap: "15px" }}>
                  <button
                    onClick={() => setActiveMenu("AboutUs")} // 🟢 ঠিক করা হলো
                    style={{
                      background: "#FE5D37",
                      color: "white",
                      padding: "15px 35px",
                      borderRadius: "30px",
                      border: "none",
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                  >
                    Learn More
                  </button>
                  <button
                    onClick={() => setActiveMenu("Projects")} // 🟢 ঠিক করা হলো
                    style={{
                      background: "#103741",
                      color: "white",
                      padding: "15px 35px",
                      borderRadius: "30px",
                      border: "none",
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                  >
                    Our Classes
                  </button>
                </div>
              </div>
              <div style={{ flex: 1, textAlign: "right" }}>
                <div
                  style={{
                    width: "450px",
                    height: "450px",
                    background: "#eee",
                    borderRadius: "50%",
                    display: "inline-block",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={showimage}
                    alt="Child"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* ৩. ফ্যাসিলিটি সেকশন (রঙিন গোল কার্ড) */}
            <div style={{ padding: "60px 40px", textAlign: "center" }}>
              <h2
                style={{
                  fontSize: "36px",
                  color: "#103741",
                  marginBottom: "40px",
                }}
              >
                School Facilities
              </h2>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "25px",
                  flexWrap: "wrap",
                }}
              >
                <FacilityCard
                  icon="🚌"
                  title="Bus Service"
                  color="#FFF5F3"
                  textColor="#FE5D37"
                />
                <FacilityCard
                  icon="⚽"
                  title="Playground"
                  color="#F0F9F1"
                  textColor="#198754"
                />
                <FacilityCard
                  icon="🍱"
                  title="Healthy Canteen"
                  color="#FFF9EE"
                  textColor="#FFC107"
                />
                <FacilityCard
                  icon="🎨"
                  title="Creative Arts"
                  color="#F1F8FF"
                  textColor="#0D6EFD"
                />
              </div>
            </div>
          </>
        )}

        {/* ২. কন্ডিশনাল পেজ রেন্ডারিং */}
        {activeMenu === "Projects" && <ProjectsPage />}
        {activeMenu === "AboutUs" && <AboutUsPage />}
        {activeMenu === "Updates" && <UpdatesPage />}

        {/* ফুটার (সব পেজের নিচে থাকবে) */}
        <div
          style={{
            background: "#103741",
            color: "white",
            padding: "40px",
            marginTop: "50px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
            }}
          >
            <div>
              <h3>Get In Touch</h3>
              <p>📍 Saidpur, Nilphamari, Bangladesh</p>
              <p>📞 +880 1XXX XXXXXX</p>
            </div>
            <div>
              <h3>Quick Links</h3>
              <p
                onClick={() => setActiveMenu("AboutUs")}
                style={{ cursor: "pointer" }}
              >
                About Us
              </p>
              <p style={{ cursor: "pointer" }}>Contact Us</p>
            </div>
            <div>
              <h3>Newsletter</h3>
              <input
                type="email"
                placeholder="Your Email"
                style={{ padding: "10px", borderRadius: "5px", border: "none" }}
              />
              <button
                style={{
                  background: "#FE5D37",
                  border: "none",
                  padding: "10px",
                  color: "white",
                  marginLeft: "5px",
                  borderRadius: "5px",
                }}
              >
                SignUp
              </button>
            </div>
          </div>
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
        padding: "12px",
        borderRadius: "8px",
        cursor: "pointer",
        backgroundColor: active ? "#FE5D37" : "transparent",
        color: active ? "white" : "#555",
        marginBottom: "5px",
      }}
    >
      <span style={{ fontSize: "18px" }}>{icon}</span>
      {isOpen && (
        <span style={{ fontWeight: active ? "bold" : "normal" }}>{text}</span>
      )}
    </div>
  );
}

function FacilityCard({ icon, title, color, textColor }) {
  return (
    <div
      style={{
        width: "180px",
        padding: "30px 20px",
        borderRadius: "50%",
        background: color,
        textAlign: "center",
        border: `1px solid ${color}`,
      }}
    >
      <div style={{ fontSize: "40px", marginBottom: "10px" }}>{icon}</div>
      <h4 style={{ color: textColor, margin: 0 }}>{title}</h4>
    </div>
  );
}
