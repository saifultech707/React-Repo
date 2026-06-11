import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import ProjectsPage from "./Classes";
import AboutUsPage from "./aboutUsPage";
import ContactUsPage from "./contactus";
import AdmissionPage from "./AdmissionPage";
import ClassRoutinePage from "./ClassRoutine";
import ResultPage from "./ResultPage";

// ================= আপনার পাঠানো নতুন ছবিগুলো =================
import campusBg from "./assets/higjschool.png";
import scienceLab from "./assets/brooke-cagle--uHVRvDr7pg-unsplash.jpg";
import studentLife from "./assets/national-cancer-institute-N_aihp118p8-unsplash.jpg";

// পুরনো খেলার ৪টি ইমেজ
import playImg1 from "./assets/marcus-wallis-mUtQXjjLPbw-unsplash.jpg";
import playImg2 from "./assets/aksh-yadav-bY4cqxp7vos-unsplash.jpg";
import playImg3 from "./assets/mudassir-ali-DvreeyPXQww-unsplash.jpg";
import playImg4 from "./assets/vicky-adams-gywHscPZwMM-unsplash.jpg";
import "./dashboard.css";

export default function Dashboard() {
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigate = useNavigate();

  // 🟢 নোটিশ এডিট করার জন্য State
  const [noticeText, setNoticeText] = useState(
    "📢 আমাদের এখানে ২০২৬ শিক্ষাবর্ষে ষষ্ঠ থেকে দশম শ্রেণী পর্যন্ত সীমিত আসনে ভর্তি চলছে! 🎒 আগামী সপ্তাহে স্কুল প্রাঙ্গণে বার্ষিক ক্রীড়া প্রতিযোগিতা অনুষ্ঠিত হতে যাচ্ছে। বিস্তারিত জানতে 'Contact Us' পেজে যোগাযোগ করুন। 📞",
  );
  const [isEditingNotice, setIsEditingNotice] = useState(false);
  const [tempNotice, setTempNotice] = useState(noticeText);

  // 🟢 AuthForm থেকে সেভ করা রোলটি এখানে চেক করা হচ্ছে
  const userRole = localStorage.getItem("userRole") || "user";

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const docRef = doc(db, "settings", "notice");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().text) {
          const fetchedNotice = docSnap.data().text;
          setNoticeText(fetchedNotice);
          setTempNotice(fetchedNotice);
        }
      } catch (error) {
        console.error("Error fetching notice:", error);
      }
    };
    fetchNotice();
  }, []);

  const saveNotice = async () => {
    try {
      await setDoc(doc(db, "settings", "notice"), { text: tempNotice }, { merge: true });
      setNoticeText(tempNotice);
      setIsEditingNotice(false);
      alert("Notice updated successfully!");
    } catch (error) {
      console.error("Error updating notice:", error);
      alert("Failed to update notice.");
    }
  };

  const navLinksList = (
    <>
      <span
        onClick={() => {
          setActiveMenu("Dashboard");
          setIsDrawerOpen(false);
        }}
        className={`nav-link ${activeMenu === "Dashboard" ? "active" : ""}`}
      >
        Home
      </span>
      <span
        onClick={() => {
          setActiveMenu("AboutUs");
          setIsDrawerOpen(false);
        }}
        className={`nav-link ${activeMenu === "AboutUs" ? "active" : ""}`}
      >
        About Us
      </span>
      {userRole === "admin" && (
        <span
          onClick={() => {
            setActiveMenu("Projects");
            setIsDrawerOpen(false);
          }}
          className={`nav-link ${activeMenu === "Projects" ? "active" : ""}`}
        >
          Classes
        </span>
      )}
      {userRole === "admin" && (
        <span
          onClick={() => {
            setActiveMenu("ClassRoutine");
            setIsDrawerOpen(false);
          }}
          className={`nav-link ${activeMenu === "ClassRoutine" ? "active" : ""}`}
        >
          Class Routine
        </span>
      )}
      <span
        onClick={() => {
          setActiveMenu("Result");
          setIsDrawerOpen(false);
        }}
        className={`nav-link ${activeMenu === "Result" ? "active" : ""}`}
      >
        Result
      </span>
      <span
        onClick={() => {
          setActiveMenu("Admission");
          setIsDrawerOpen(false);
        }}
        className={`nav-link ${activeMenu === "Admission" ? "active" : ""}`}
      >
        Admission
      </span>
      <span
        onClick={() => {
          setActiveMenu("ContactUs");
          setIsDrawerOpen(false);
        }}
        className={`nav-link ${activeMenu === "ContactUs" ? "active" : ""}`}
      >
        Contact Us
      </span>
    </>
  );

  const navActionsList = (
    <>
      {userRole !== "user" && userRole !== "guest" && (
        <>
          <button
            className="btn-modern"
            onClick={() => {
              navigate("/profile");
              setIsDrawerOpen(false);
            }}
            style={{
              background: "#3b82f6",
              color: "white",
              border: "none",
              padding: "10px 22px",
              borderRadius: "30px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            My Profile
          </button>
        </>
      )}
      {userRole === "admin" && (
        <button
          className="btn-modern"
          onClick={() => {
            navigate("/");
            setIsDrawerOpen(false);
          }}
          style={{
            background: "#103741",
            color: "white",
            border: "none",
            padding: "10px 25px",
            borderRadius: "30px",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          + Create Teacher Auth
        </button>
      )}
      <button
        className="btn-modern"
        onClick={() => {
          localStorage.removeItem("userRole");
          setIsDrawerOpen(false);
          navigate("/");
        }}
        style={{
          background: "#ef4444",
          color: "white",
          border: "none",
          padding: "10px 25px",
          borderRadius: "30px",
          fontWeight: "600",
          cursor: "pointer",
        }}
      >
        Logout
      </button>
    </>
  );

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          background: "var(--bg-light)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* 📢 ১. টপ হরাইজন্টাল অটো স্ক্রোলিং নোটিশ বার */}
        <div
          className="notice-bar"
          style={{
            color: "white",
            padding: "10px 20px",
            position: "relative",
            display: "flex",
            alignItems: "center",
            zIndex: 101,
            minHeight: "45px",
          }}
        >
          {isEditingNotice ? (
            <div
              style={{
                display: "flex",
                width: "100%",
                gap: "10px",
                alignItems: "center",
              }}
            >
              <input
                type="text"
                value={tempNotice}
                onChange={(e) => setTempNotice(e.target.value)}
                style={{
                  flex: 1,
                  padding: "10px 15px",
                  borderRadius: "8px",
                  border: "none",
                  outline: "none",
                  fontFamily: "inherit",
                  fontSize: "14px",
                  boxShadow: "inset 0 2px 4px rgba(0,0,0,0.1)",
                }}
              />
              <button
                onClick={saveNotice}
                className="btn-modern"
                style={{
                  background: "#10b981",
                  color: "white",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Save
              </button>
              <button
                onClick={() => setIsEditingNotice(false)}
                className="btn-modern"
                style={{
                  background: "#ef4444",
                  color: "white",
                  border: "none",
                  padding: "10px 15px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Cancel
              </button>
            </div>
          ) : (
            <>
              <div
                style={{
                  flex: 1,
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  position: "relative",
                }}
              >
                <style>{`
                  @keyframes scrollNotice { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
                `}</style>
                <div
                  style={{
                    display: "inline-block",
                    animation: "scrollNotice 25s linear infinite",
                    fontWeight: "500",
                    letterSpacing: "0.5px",
                    fontSize: "15px",
                    textShadow: "0 1px 2px rgba(0,0,0,0.2)",
                  }}
                >
                  {noticeText}
                </div>
              </div>
              {userRole === "admin" && (
                <button
                  className="btn-modern"
                  onClick={() => setIsEditingNotice(true)}
                  style={{
                    background: "#FE5D37",
                    color: "white",
                    border: "none",
                    padding: "6px 18px",
                    borderRadius: "20px",
                    marginLeft: "20px",
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: "bold",
                    flexShrink: 0,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                  }}
                >
                  ✏️ Edit Notice
                </button>
              )}
            </>
          )}
        </div>

        {/* টপ নেভিগেশন */}
        <div className="top-nav-wrapper">
          <button
            className="hamburger-btn"
            onClick={() => setIsDrawerOpen(true)}
          >
            ☰
          </button>
          <div className="nav-links-container">{navLinksList}</div>
          <div className="nav-actions-container">{navActionsList}</div>
        </div>

        {/* 🟢 Drawer Overlay */}
        <div
          className={`drawer-overlay ${isDrawerOpen ? "open" : ""}`}
          onClick={() => setIsDrawerOpen(false)}
        ></div>

        {/* 🟢 Drawer Menu */}
        <div className={`drawer ${isDrawerOpen ? "open" : ""}`} style={{ overflowY: 'auto' }}>
          <button
            className="drawer-close-btn"
            onClick={() => setIsDrawerOpen(false)}
          >
            ✕
          </button>
          <div className="drawer-links-container">{navLinksList}</div>
          <div className="drawer-actions-container">{navActionsList}</div>
        </div>

        {/* 🟢 ৩. ডাইনামিক কন্টেন্ট এরিয়া */}
        <div style={{ flex: 1 }}>
          {activeMenu === "Dashboard" && (
            <>
              {/* 🟢 হিরো সেকশন */}
              <div
                className="hero-section-container"
                style={{
                  display: "flex",
                  padding: "120px 60px",
                  alignItems: "center",
                  backgroundImage: `linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.4) 100%), url(${campusBg})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center center",
                  backgroundAttachment: "fixed",
                  background: "linear-gradient(135deg, #e0f2fe 0%, #ffffff 50%, #fff7ed 100%)",
                  minHeight: "650px",
                  boxSizing: "border-box",
                  gap: "50px",
                  width: "100%",
                }}
              >
                <div
                  style={{ flex: 1.2, maxWidth: "650px" }}
                  className="hero-text-content"
                >
                  <div
                    style={{
                      display: "inline-block",
                      background: "rgba(232, 230, 236, 0.94)",
                      color: "#FE5D37",
                      padding: "8px 16px",
                      borderRadius: "20px",
                      fontWeight: "600",
                      marginBottom: "20px",
                      border: "1px solid rgba(254, 93, 55, 0.2)",
                    }}
                  >
                    🚀 Welcome to Excellence
                  </div>
                  <h1
                    className="hero-title"
                    style={{
                      fontSize: "64px",
                      color: "#103741",
                      lineHeight: "1.1",
                      marginBottom: "25px",
                      fontWeight: "700",
                    }}
                  >
                    School Dashboard
                  </h1>
                  <p
                    className="hero-desc"
                    style={{
                      color: "#444",
                      fontSize: "20px",
                      marginBottom: "40px",
                      fontWeight: "400",
                      lineHeight: "1.6",
                    }}
                  >
                    Nurturing young minds with a modern curriculum, world-class
                    facilities, and a loving environment. Give your child the
                    head start they deserve.
                  </p>
                  <div
                    style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}
                  >
                    <button
                      className="btn-modern"
                      onClick={() => setActiveMenu("AboutUs")}
                      style={{
                        background: "#FE5D37",
                        color: "white",
                        padding: "16px 40px",
                        borderRadius: "30px",
                        border: "none",
                        fontWeight: "600",
                        cursor: "pointer",
                        fontSize: "16px",
                      }}
                    >
                      Learn More
                    </button>
                    {userRole === "admin" && (
                      <button
                        className="btn-modern"
                        onClick={() => setActiveMenu("Projects")}
                        style={{
                          background: "#103741",
                          color: "white",
                          padding: "16px 40px",
                          borderRadius: "30px",
                          border: "none",
                          fontWeight: "600",
                          cursor: "pointer",
                          fontSize: "16px",
                        }}
                      >
                        Our Classes
                      </button>
                    )}
                  </div>
                </div>

                {/* <div
                  className="hero-image-content"
                  style={{
                    flex: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <div
                    className="hero-image-wrapper"
                    style={{
                      width: "480px",
                      height: "480px",
                      borderRadius: "50%",
                      display: "flex",
                      overflow: "hidden",
                      boxShadow: "0 25px 50px -12px rgba(16, 55, 65, 0.3)",
                    }}
                  >
                    <img
                      src={studentLife}
                      alt="Child Learning"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                </div> */}
                {/* ===== CAROUSEL - hero-image-content এর জায়গায় ===== */}
<div
  className="hero-image-content"
  style={{
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  }}
>
  <HeroCarousel images={[studentLife, scienceLab, playImg1, playImg2, playImg3]} />
</div>
              </div>

              {/* ফ্যাসিলিটি সেকশন */}
              <div
                style={{
                  padding: "80px 40px",
                  textAlign: "center",
                  background: "#f8fafc",
                }}
              >
                <div style={{ marginBottom: "50px" }}>
                  <h4
                    style={{
                      color: "#FE5D37",
                      fontWeight: "600",
                      letterSpacing: "1px",
                      textTransform: "uppercase",
                      margin: "0 0 10px 0",
                    }}
                  >
                    Why Choose Us
                  </h4>
                  <h2
                    style={{
                      fontSize: "42px",
                      color: "#103741",
                      margin: 0,
                      fontWeight: "700",
                    }}
                  >
                    Our Premium Facilities
                  </h2>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "30px",
                    flexWrap: "wrap",
                  }}
                >
                  <FacilityCard
                    icon="🚌"
                    title="Bus Service"
                    color="#fff"
                    iconBg="#FFE5E0"
                    iconColor="#FE5D37"
                    onClick={() => setActiveMenu("BusService")}
                  />
                  <FacilityCard
                    icon="⚽"
                    title="Playground"
                    color="#fff"
                    iconBg="#E6F4EA"
                    iconColor="#198754"
                    onClick={() => setActiveMenu("Playground")}
                  />
                  <FacilityCard
                    icon="🍱"
                    title="Healthy Canteen"
                    color="#fff"
                    iconBg="#FFF4D6"
                    iconColor="#FFC107"
                    onClick={() => setActiveMenu("Canteen")}
                  />
                  <FacilityCard
                    icon="🎨"
                    title="Creative Arts"
                    color="#fff"
                    iconBg="#E8F1FF"
                    iconColor="#0D6EFD"
                    onClick={() => setActiveMenu("Arts")}
                  />
                  <FacilityCard
                    icon="🔬"
                    title="Study Center"
                    color="#fff"
                    iconBg="#FDE2EC"
                    iconColor="#E91E63"
                    onClick={() => setActiveMenu("ScienceLab")}
                  />
                </div>
              </div>
            </>
          )}

          {/* ================= অন্যান্য ফ্যাসিলিটি পেজগুলো ================= */}
          {activeMenu === "BusService" && (
            <div className="sub-page-wrapper">
              <div style={facilityHeader}>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "15px" }}
                >
                  <span
                    style={{
                      fontSize: "32px",
                      background: "#FFE5E0",
                      padding: "10px",
                      borderRadius: "12px",
                    }}
                  >
                    🚌
                  </span>
                  <h2 style={{ margin: 0, fontSize: "28px", color: "#103741" }}>
                    Transport & Bus Service Details
                  </h2>
                </div>
                <button
                  className="btn-modern"
                  onClick={() => setActiveMenu("Dashboard")}
                  style={backBtnStyle}
                >
                  ← Back to Home
                </button>
              </div>
              <p style={{ color: "#666", fontSize: "16px", lineHeight: "1.6" }}>
                We provide safe and secure transport facilities for students
                across the city with real-time GPS tracking and dedicated
                support staff on every route.
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                  gap: "20px",
                  marginTop: "30px",
                }}
              >
                <div style={infoCardStyle}>
                  <h3 style={{ color: "#FE5D37", margin: "0 0 10px 0" }}>
                    Route A (Main City)
                  </h3>
                  <p style={{ margin: "5px 0", color: "#555" }}>
                    <strong>Driver:</strong> Aslam Uddin
                  </p>
                  <p style={{ margin: "5px 0", color: "#555" }}>
                    <strong>Phone:</strong> 01711-XXXXXX
                  </p>
                  <div
                    style={{
                      marginTop: "15px",
                      display: "inline-block",
                      background: "#f0fdf4",
                      color: "#166534",
                      padding: "5px 12px",
                      borderRadius: "20px",
                      fontSize: "14px",
                      fontWeight: "600",
                    }}
                  >
                    Time: 7:30 AM
                  </div>
                </div>
                <div style={infoCardStyle}>
                  <h3 style={{ color: "#FE5D37", margin: "0 0 10px 0" }}>
                    Route B (Suburbs)
                  </h3>
                  <p style={{ margin: "5px 0", color: "#555" }}>
                    <strong>Driver:</strong> Milon Khan
                  </p>
                  <p style={{ margin: "5px 0", color: "#555" }}>
                    <strong>Phone:</strong> 01822-XXXXXX
                  </p>
                  <div
                    style={{
                      marginTop: "15px",
                      display: "inline-block",
                      background: "#f0fdf4",
                      color: "#166534",
                      padding: "5px 12px",
                      borderRadius: "20px",
                      fontSize: "14px",
                      fontWeight: "600",
                    }}
                  >
                    Time: 7:15 AM
                  </div>
                </div>
                <div style={infoCardStyle}>
                  <h3 style={{ color: "#FE5D37", margin: "0 0 10px 0" }}>
                    Route C (North Zone)
                  </h3>
                  <p style={{ margin: "5px 0", color: "#555" }}>
                    <strong>Driver:</strong> Biplob Hossain
                  </p>
                  <p style={{ margin: "5px 0", color: "#555" }}>
                    <strong>Phone:</strong> 01933-XXXXXX
                  </p>
                  <div
                    style={{
                      marginTop: "15px",
                      display: "inline-block",
                      background: "#f0fdf4",
                      color: "#166534",
                      padding: "5px 12px",
                      borderRadius: "20px",
                      fontSize: "14px",
                      fontWeight: "600",
                    }}
                  >
                    Time: 7:40 AM
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeMenu === "Playground" && (
            <div className="sub-page-wrapper">
              <div style={facilityHeader}>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "15px" }}
                >
                  <span
                    style={{
                      fontSize: "32px",
                      background: "#E6F4EA",
                      padding: "10px",
                      borderRadius: "12px",
                    }}
                  >
                    ⚽
                  </span>
                  <h2 style={{ margin: 0, fontSize: "28px", color: "#103741" }}>
                    Our School Playground & Sports Gallery
                  </h2>
                </div>
                <button
                  className="btn-modern"
                  onClick={() => setActiveMenu("Dashboard")}
                  style={backBtnStyle}
                >
                  ← Back to Home
                </button>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                  gap: "25px",
                  marginTop: "30px",
                }}
              >
                {[
                  { img: playImg1, title: "Cricket Ground Dusk View" },
                  { img: playImg2, title: "Stadium Under Floodlights" },
                  { img: playImg3, title: "Live Match Action" },
                  { img: playImg4, title: "Kids Playing Silhouette" },
                ].map((item, index) => (
                  <div
                    key={index}
                    style={{
                      background: "white",
                      borderRadius: "16px",
                      overflow: "hidden",
                      boxShadow: "0 8px 25px rgba(0,0,0,0.06)",
                      border: "1px solid #eee",
                      transition: "transform 0.3s",
                      cursor: "pointer",
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.transform = "translateY(-5px)")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.transform = "translateY(0)")
                    }
                  >
                    <img
                      src={item.img}
                      alt={item.title}
                      style={{
                        width: "100%",
                        height: "240px",
                        objectFit: "cover",
                      }}
                    />
                    <div style={{ padding: "20px" }}>
                      <h4
                        style={{
                          margin: 0,
                          color: "#103741",
                          fontSize: "16px",
                          fontWeight: "600",
                        }}
                      >
                        {item.title}
                      </h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeMenu === "Canteen" && (
            <div className="sub-page-wrapper">
              <div style={facilityHeader}>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "15px" }}
                >
                  <span
                    style={{
                      fontSize: "32px",
                      background: "#FFF4D6",
                      padding: "10px",
                      borderRadius: "12px",
                    }}
                  >
                    🍱
                  </span>
                  <h2 style={{ margin: 0, fontSize: "28px", color: "#103741" }}>
                    Healthy Canteen Weekly Menu
                  </h2>
                </div>
                <button
                  className="btn-modern"
                  onClick={() => setActiveMenu("Dashboard")}
                  style={backBtnStyle}
                >
                  ← Back to Home
                </button>
              </div>
              <div
                style={{
                  overflowX: "auto",
                  borderRadius: "12px",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
                  marginTop: "25px",
                }}
              >
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    textAlign: "left",
                    background: "#fff",
                  }}
                >
                  <thead>
                    <tr style={{ background: "#FFC107", color: "white" }}>
                      <th style={thStyle}>Day</th>
                      <th style={thStyle}>Breakfast (8:30 AM)</th>
                      <th style={thStyle}>Lunch / Snacks (1:00 PM)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={trStyle}>
                      <td style={tdStyle}>
                        <strong>Sunday</strong>
                      </td>
                      <td style={tdStyle}>Milk & Honey Oats with Nuts</td>
                      <td style={tdStyle}>Fresh Fruit Bowl & Egg Sandwich</td>
                    </tr>
                    <tr style={trStyle}>
                      <td style={tdStyle}>
                        <strong>Monday</strong>
                      </td>
                      <td style={tdStyle}>Homemade Roti & Vegetables</td>
                      <td style={tdStyle}>Chicken Khichuri (Low Oil)</td>
                    </tr>
                    <tr style={trStyle}>
                      <td style={tdStyle}>
                        <strong>Tuesday</strong>
                      </td>
                      <td style={tdStyle}>Pancakes with Maple Syrup</td>
                      <td style={tdStyle}>Veggie Fried Rice & Chicken</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeMenu === "Arts" && (
            <div className="sub-page-wrapper">
              <div style={facilityHeader}>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "15px" }}
                >
                  <span
                    style={{
                      fontSize: "32px",
                      background: "#E8F1FF",
                      padding: "10px",
                      borderRadius: "12px",
                    }}
                  >
                    🎨
                  </span>
                  <h2 style={{ margin: 0, fontSize: "28px", color: "#103741" }}>
                    Creative Arts & Crafts Club
                  </h2>
                </div>
                <button
                  className="btn-modern"
                  onClick={() => setActiveMenu("Dashboard")}
                  style={backBtnStyle}
                >
                  ← Back to Home
                </button>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "25px",
                  flexWrap: "wrap",
                  marginTop: "30px",
                }}
              >
                <div
                  style={{
                    ...infoCardStyle,
                    borderLeft: "6px solid #0D6EFD",
                    flex: "1 1 300px",
                  }}
                >
                  <h3
                    style={{
                      color: "#103741",
                      fontSize: "20px",
                      margin: "0 0 10px 0",
                    }}
                  >
                    Drawing Classes
                  </h3>
                  <p style={{ color: "#666", lineHeight: "1.5" }}>
                    Unlock the inner artist with our professional drawing
                    sessions.
                  </p>
                  <div
                    style={{
                      marginTop: "15px",
                      display: "inline-block",
                      background: "#eff6ff",
                      color: "#1d4ed8",
                      padding: "8px 15px",
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontWeight: "500",
                    }}
                  >
                    🗓️ Every Sun & Tue at 11:00 AM
                  </div>
                </div>
                <div
                  style={{
                    ...infoCardStyle,
                    borderLeft: "6px solid #FE5D37",
                    flex: "1 1 300px",
                  }}
                >
                  <h3
                    style={{
                      color: "#103741",
                      fontSize: "20px",
                      margin: "0 0 10px 0",
                    }}
                  >
                    Music & Rhythm
                  </h3>
                  <p style={{ color: "#666", lineHeight: "1.5" }}>
                    Vocal training and instrument practice for creative
                    development.
                  </p>
                  <div
                    style={{
                      marginTop: "15px",
                      display: "inline-block",
                      background: "#fff1f2",
                      color: "#e11d48",
                      padding: "8px 15px",
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontWeight: "500",
                    }}
                  >
                    🗓️ Every Mon & Wed at 12:30 PM
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeMenu === "ScienceLab" && (
            <div className="sub-page-wrapper">
              <div style={facilityHeader}>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "15px" }}
                >
                  <span
                    style={{
                      fontSize: "32px",
                      background: "#FDE2EC",
                      padding: "10px",
                      borderRadius: "12px",
                    }}
                  >
                    🔬
                  </span>
                  <h2 style={{ margin: 0, fontSize: "28px", color: "#103741" }}>
                    Study Center & Science Lab
                  </h2>
                </div>
                <button
                  className="btn-modern"
                  onClick={() => setActiveMenu("Dashboard")}
                  style={backBtnStyle}
                >
                  ← Back to Home
                </button>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "40px",
                  alignItems: "center",
                  flexWrap: "wrap",
                  marginTop: "30px",
                  background: "#f8fafc",
                  padding: "30px",
                  borderRadius: "16px",
                  border: "1px solid #e2e8f0",
                }}
              >
                <img
                  src={scienceLab}
                  alt="Lab"
                  style={{
                    width: "350px",
                    height: "250px",
                    objectFit: "cover",
                    borderRadius: "16px",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                  }}
                />
                <div style={{ flex: 1, minWidth: "300px" }}>
                  <h3
                    style={{
                      fontSize: "24px",
                      color: "#103741",
                      margin: "0 0 15px 0",
                    }}
                  >
                    Igniting Curiosity
                  </h3>
                  <p
                    style={{
                      color: "#555",
                      fontSize: "16px",
                      lineHeight: "1.7",
                      margin: "0 0 20px 0",
                    }}
                  >
                    We provide a modern Science Lab and a quiet, resourceful
                    Study Center. Our hands-on approach cultivates curiosity,
                    enabling students to explore basic scientific concepts
                    safely and interactively.
                  </p>
                  <ul
                    style={{
                      color: "#444",
                      paddingLeft: "20px",
                      lineHeight: "1.8",
                    }}
                  >
                    <li>Fully equipped with child-safe apparatus.</li>
                    <li>Guided experiments every Thursday.</li>
                    <li>Extensive library section included.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* 🟢 আপনার আগের তৈরি করা অরিজিনাল পেজগুলো এখানে রেন্ডার হচ্ছে */}
          {activeMenu === "Projects" && <ProjectsPage />}
          {activeMenu === "AboutUs" && <AboutUsPage />}
          {activeMenu === "Admission" && <AdmissionPage />}
          {activeMenu === "ClassRoutine" && <ClassRoutinePage />}
          {activeMenu === "Result" && <ResultPage />}
          {activeMenu === "ContactUs" && <ContactUsPage />}
        </div>

        {/* ফুটার সেকশন */}
        <div
          style={{
            background: "#103741",
            color: "white",
            padding: "60px 40px",
            marginTop: "auto",
          }}
        >
          <div
            style={{
              maxWidth: "1200px",
              margin: "0 auto",
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "40px",
            }}
          >
            <div style={{ flex: "1 1 250px" }}>
              <h3
                style={{
                  fontSize: "28px",
                  marginBottom: "20px",
                  color: "#FE5D37",
                  fontWeight: "700",
                }}
              >
                School Dashboard
              </h3>
              <p
                style={{
                  color: "#cbd5e1",
                  lineHeight: "1.6",
                  marginBottom: "15px",
                }}
              >
                Providing the best foundation for your child's future with care
                and modern education.
              </p>
              <p
                style={{
                  margin: "10px 0",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                📍 Saidpur, Nilphamari, Bangladesh
              </p>
              <p
                style={{
                  margin: "10px 0",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                📞 +880 1XXX XXXXXX
              </p>
            </div>
            <div style={{ flex: "1 1 200px" }}>
              <h3
                style={{
                  fontSize: "20px",
                  marginBottom: "20px",
                  borderBottom: "2px solid #FE5D37",
                  paddingBottom: "10px",
                  display: "inline-block",
                }}
              >
                Quick Links
              </h3>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <span
                  onClick={() => setActiveMenu("AboutUs")}
                  style={{
                    cursor: "pointer",
                    color: "#cbd5e1",
                    transition: "color 0.2s",
                  }}
                  onMouseOver={(e) => (e.target.style.color = "#fff")}
                  onMouseOut={(e) => (e.target.style.color = "#cbd5e1")}
                >
                  → About Us
                </span>
                {userRole === "admin" && (
                  <span
                    onClick={() => setActiveMenu("Projects")}
                    style={{
                      cursor: "pointer",
                      color: "#cbd5e1",
                      transition: "color 0.2s",
                    }}
                    onMouseOver={(e) => (e.target.style.color = "#fff")}
                    onMouseOut={(e) => (e.target.style.color = "#cbd5e1")}
                  >
                    → Classes
                  </span>
                )}
                <span
                  onClick={() => setActiveMenu("Admission")}
                  style={{
                    cursor: "pointer",
                    color: "#cbd5e1",
                    transition: "color 0.2s",
                  }}
                  onMouseOver={(e) => (e.target.style.color = "#fff")}
                  onMouseOut={(e) => (e.target.style.color = "#cbd5e1")}
                >
                  → Admission
                </span>
                <span
                  onClick={() => setActiveMenu("ContactUs")}
                  style={{
                    cursor: "pointer",
                    color: "#cbd5e1",
                    transition: "color 0.2s",
                  }}
                  onMouseOver={(e) => (e.target.style.color = "#fff")}
                  onMouseOut={(e) => (e.target.style.color = "#cbd5e1")}
                >
                  → Contact Us
                </span>
              </div>
            </div>
            <div style={{ flex: "1 1 300px" }}>
              <h3
                style={{
                  fontSize: "20px",
                  marginBottom: "20px",
                  borderBottom: "2px solid #FE5D37",
                  paddingBottom: "10px",
                  display: "inline-block",
                }}
              >
                Newsletter
              </h3>
              <p style={{ color: "#cbd5e1", marginBottom: "20px" }}>
                Subscribe to our newsletter to get latest updates and news.
              </p>
              <div
                style={{
                  display: "flex",
                  background: "#fff",
                  borderRadius: "8px",
                  overflow: "hidden",
                }}
              >
                <input
                  type="email"
                  placeholder="Your Email"
                  style={{
                    flex: 1,
                    padding: "12px 15px",
                    border: "none",
                    outline: "none",
                    fontSize: "14px",
                  }}
                />
                <button
                  className="btn-modern"
                  style={{
                    background: "#FE5D37",
                    border: "none",
                    padding: "0 25px",
                    color: "white",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  SignUp
                </button>
              </div>
            </div>
          </div>
          <div
            style={{
              textAlign: "center",
              marginTop: "50px",
              paddingTop: "20px",
              borderTop: "1px solid rgba(255,255,255,0.1)",
              color: "#cbd5e1",
              fontSize: "14px",
            }}
          >
            © {new Date().getFullYear()} School Dashboard. All Rights
            Reserved.
          </div>
        </div>
      </div>
    </div>
  );
}
function HeroCarousel({ images }) {
  const [active, setActive] = useState(0);

  const prev = () => setActive((p) => (p - 1 + images.length) % images.length);
  const next = () => setActive((p) => (p + 1) % images.length);

  const getPos = (i) => {
    const diff = (i - active + images.length) % images.length;
    if (diff === 0) return "center";
    if (diff === 1) return "right1";
    if (diff === 2) return "right2";
    if (diff === images.length - 1) return "left1";
    if (diff === images.length - 2) return "left2";
    return "hidden";
  };

  const cardStyles = {
    center: {
      transform: "translateX(0px) scale(1) rotateY(0deg)",
      zIndex: 10,
      opacity: 1,
      filter: "brightness(1)",
    },
    right1: {
      transform: "translateX(160px) scale(0.85) rotateY(-15deg)",
      zIndex: 6,
      opacity: 0.85,
      filter: "brightness(0.75)",
    },
    right2: {
      transform: "translateX(250px) scale(0.75) rotateY(-25deg)",
      zIndex: 3,
      opacity: 0.5,
      filter: "brightness(0.5)",
    },
    left1: {
      transform: "translateX(-160px) scale(0.85) rotateY(15deg)",
      zIndex: 6,
      opacity: 0.85,
      filter: "brightness(0.75)",
    },
    left2: {
      transform: "translateX(-250px) scale(0.75) rotateY(25deg)",
      zIndex: 3,
      opacity: 0.5,
      filter: "brightness(0.5)",
    },
    hidden: {
      transform: "translateX(0px) scale(0.5)",
      zIndex: 0,
      opacity: 0,
      filter: "brightness(0.3)",
    },
  };

  return (
    <div style={{ position: "relative", width: "100%", maxWidth: "500px", height: "400px", perspective: "1000px" }}>
      {images.map((img, i) => {
        const pos = getPos(i);
        const s = cardStyles[pos];
        return (
          <div
            key={i}
            onClick={() => setActive(i)}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              marginLeft: "-100px",
              marginTop: "-140px",
              width: "200px",
              height: "280px",
              borderRadius: "18px",
              overflow: "hidden",
              cursor: "pointer",
              transition: "all 0.5s cubic-bezier(0.4,0,0.2,1)",
              boxShadow: pos === "center"
                ? "0 25px 50px rgba(16,55,65,0.35)"
                : "0 10px 25px rgba(0,0,0,0.2)",
              ...s,
            }}
          >
            <img
              src={img}
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none" }}
            />
          </div>
        );
      })}

      {/* নেভ বাটন */}
      <button
        onClick={prev}
        style={{
          position: "absolute",
          bottom: "0px",
          left: "50%",
          marginLeft: "-80px",
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          border: "2px solid rgba(255,255,255,0.7)",
          background: "rgba(255,255,255,0.2)",
          color: "#103741",
          fontSize: "18px",
          cursor: "pointer",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 20,
        }}
      >
        ‹
      </button>
      <button
        onClick={next}
        style={{
          position: "absolute",
          bottom: "0px",
          left: "50%",
          marginLeft: "40px",
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          border: "none",
          background: "#FE5D37",
          color: "white",
          fontSize: "18px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 20,
          boxShadow: "0 4px 12px rgba(254,93,55,0.4)",
        }}
      >
        ›
      </button>

      {/* ডট ইন্ডিকেটর */}
      <div style={{ position: "absolute", bottom: "8px", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "6px" }}>
        {images.map((_, i) => (
          <div
            key={i}
            onClick={() => setActive(i)}
            style={{
              width: i === active ? "20px" : "7px",
              height: "7px",
              borderRadius: "4px",
              background: i === active ? "#FE5D37" : "rgba(16,55,65,0.3)",
              transition: "all 0.3s",
              cursor: "pointer",
            }}
          />
        ))}
      </div>
    </div>
  );
}
// ================= স্টাইলস এবং সাব-কম্পোনেন্ট =================
function FacilityCard({ icon, title, color, iconBg, iconColor, onClick }) {
  return (
    <div
      className="facility-card-modern"
      onClick={onClick}
      style={{ background: color }}
    >
      <div
        className="icon-wrapper"
        style={{ background: iconBg, color: iconColor }}
      >
        {icon}
      </div>
      <h4
        style={{
          color: "#103741",
          margin: 0,
          fontWeight: "600",
          fontSize: "18px",
        }}
      >
        {title}
      </h4>
    </div>
  );
}

const facilityHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "30px",
  borderBottom: "1px solid #eee",
  paddingBottom: "20px",
};

const backBtnStyle = {
  background: "#FE5D37",
  color: "white",
  border: "none",
  padding: "10px 22px",
  borderRadius: "30px",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "14px",
};

const infoCardStyle = {
  background: "#fff",
  padding: "25px",
  borderRadius: "16px",
  border: "1px solid #f1f5f9",
  boxShadow: "0 4px 15px rgba(0,0,0,0.03)",
  transition: "transform 0.3s",
};

const thStyle = { padding: "16px", fontSize: "15px", fontWeight: "600" };
const tdStyle = { padding: "16px", fontSize: "14px", color: "#444" };
const trStyle = {
  borderBottom: "1px solid #f1f5f9",
  transition: "background 0.2s",
};
