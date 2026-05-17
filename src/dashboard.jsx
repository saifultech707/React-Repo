import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProjectsPage from "./ProjectsPage";
import AboutUsPage from "./aboutUsPage";
import ContactUsPage from "./contactus";
import showimage from "./assets/note-thanun-CYlPykF-qAM-unsplash.jpg";

// 🟢 আপনার পাঠানো খেলার ৪টি ইমেজ
import playImg1 from "./assets/marcus-wallis-mUtQXjjLPbw-unsplash.jpg";
import playImg2 from "./assets/aksh-yadav-bY4cqxp7vos-unsplash.jpg";
import playImg3 from "./assets/mudassir-ali-DvreeyPXQww-unsplash.jpg";
import playImg4 from "./assets/vicky-adams-gywHscPZwMM-unsplash.jpg";

export default function Dashboard() {
  // এখানে ডিফল্ট স্টেট "Dashboard"
  const [activeMenu, setActiveMenu] = useState("Dashboard");

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {/* ================= মূল কন্টেন্ট ================= */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          background: "#fff",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            background: "#103741", // স্কুলের গাঢ় নীল থিম কালার
            color: "white",
            padding: "15px 20px",
            textAlign: "center",
            overflow: "hidden",
            whiteSpace: "nowrap",
            position: "relative",
            display: "flex",
            alignItems: "center",
            borderBottom: "2px solid #FE5D37", // নিচে চিকন কমলা বর্ডার
            fontSize: "17px",
            zIndex: 101,
          }}
        >
          {/* রিঅ্যাক্টের ভেতরে সিএসএস অ্যানিমেশন ইনজেক্ট করার উপায় */}
          <style>{`
            @keyframes scrollNotice {
              0% { transform: translateX(100%); }
              100% { transform: translateX(-100%); }
            }
          `}</style>

          <div
            style={{
              display: "inline-block",
              animation: "scrollNotice 25s linear infinite", // ২৫ সেকেন্ড পর পর লুপ হবে, স্পীড বাড়াতে চাইলে সেকেন্ড কমিয়ে দিন
              fontWeight: "500",
              letterSpacing: "0.5px",
            }}
          >
            📢 আমাদের এখানে ২০২৬ শিক্ষাবর্ষে প্লে থেকে পঞ্চম শ্রেণী পর্যন্ত
            সীমিত আসনে ভর্তি চলছে! 🎒 আগামী সপ্তাহে স্কুল প্রাঙ্গণে বার্ষিক
            ক্রীড়া প্রতিযোগিতা অনুষ্ঠিত হতে যাচ্ছে। বিস্তারিত জানতে "Contact Us"
            পেজে যোগাযোগ করুন। 📞
          </div>
        </div>
        {/* ১. টপ নেভিগেশন (সব পেজেই এটি ওপরে ফিক্সড থাকবে) */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "20px 40px",
            alignItems: "center",
            borderBottom: "1px solid #eee",
            background: "#fff",
            position: "sticky",
            top: 0,
            zIndex: 100,
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
              style={{
                color: activeMenu === "Dashboard" ? "#FE5D37" : "#555",
                cursor: "pointer",
                fontWeight: activeMenu === "Dashboard" ? "bold" : "500",
              }}
            >
              Home
            </span>
            <span
              onClick={() => setActiveMenu("AboutUs")}
              style={{
                color: activeMenu === "AboutUs" ? "#FE5D37" : "#555",
                cursor: "pointer",
                fontWeight: activeMenu === "AboutUs" ? "bold" : "500",
              }}
            >
              About Us
            </span>
            <span
              onClick={() => setActiveMenu("Projects")}
              style={{
                color: activeMenu === "Projects" ? "#FE5D37" : "#555",
                cursor: "pointer",
                fontWeight: activeMenu === "Projects" ? "bold" : "500",
              }}
            >
              Classes
            </span>
            <span
              onClick={() => setActiveMenu("ContactUs")}
              style={{
                color: activeMenu === "ContactUs" ? "#FE5D37" : "#555",
                cursor: "pointer",
                fontWeight: activeMenu === "ContactUs" ? "bold" : "500",
              }}
            >
              Contact Us
            </span>
          </div>
          <button
            onClick={() => setActiveMenu("ContactUs")}
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

        {/* ২. ডাইনামিক কন্টেন্ট এরিয়া */}
        <div style={{ flex: 1 }}>
          {/* ================= প্রধান হোম ভিউ ================= */}
          {activeMenu === "Dashboard" && (
            <>
              {/* হিরো সেকশন */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  padding: "60px 40px",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "#fff",
                  gap: "40px",
                  width: "100%",
                  boxSizing: "border-box",
                }}
              >
                <div style={{ flex: 1.2, maxWidth: "600px" }}>
                  <h1
                    style={{
                      fontSize: "52px",
                      color: "#103741",
                      lineHeight: "1.2",
                      marginBottom: "20px",
                      fontWeight: "bold",
                    }}
                  >
                    The Best Kindergarten School For Your Child
                  </h1>
                  <p
                    style={{
                      color: "#666",
                      fontSize: "18px",
                      marginBottom: "30px",
                      lineHeight: "1.6",
                    }}
                  >
                    Vero elitr justo clita lorem. Rebum gubergren ea est ipsum
                    diam lorem erat.
                  </p>
                  <div style={{ display: "flex", gap: "15px" }}>
                    <button
                      onClick={() => setActiveMenu("AboutUs")}
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
                      onClick={() => setActiveMenu("Projects")}
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

                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                  }}
                >
                  <img
                    src={showimage}
                    alt="Kindergarten Children"
                    style={{
                      width: "100%",
                      maxWidth: "480px",
                      height: "380px",
                      objectFit: "cover",
                      borderRadius: "24px",
                      boxShadow: "0 15px 35px rgba(16, 55, 65, 0.12)",
                    }}
                  />
                </div>
              </div>

              {/* ৩. স্কুল ফ্যাসিলিটি সেকশন (সবগুলোতে ক্লিকের ব্যবস্থা করা হয়েছে) */}
              <div
                style={{
                  padding: "60px 40px",
                  textAlign: "center",
                  background: "#fff",
                }}
              >
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
                    onClick={() => setActiveMenu("BusService")}
                  />
                  <FacilityCard
                    icon="⚽"
                    title="Playground"
                    color="#F0F9F1"
                    textColor="#198754"
                    onClick={() => setActiveMenu("Playground")}
                  />
                  <FacilityCard
                    icon="🍱"
                    title="Healthy Canteen"
                    color="#FFF9EE"
                    textColor="#FFC107"
                    onClick={() => setActiveMenu("Canteen")}
                  />
                  <FacilityCard
                    icon="🎨"
                    title="Creative Arts"
                    color="#F1F8FF"
                    textColor="#0D6EFD"
                    onClick={() => setActiveMenu("Arts")}
                  />
                </div>
              </div>
            </>
          )}

          {/* ================= 🚌 BUS SERVICE DETAILS ================= */}
          {activeMenu === "BusService" && (
            <div style={facilityPageWrapper}>
              <div style={facilityHeader}>
                <h2>🚌 Transport & Bus Service Details</h2>
                <button
                  onClick={() => setActiveMenu("Dashboard")}
                  style={backBtnStyle}
                >
                  ← Back to Home
                </button>
              </div>
              <p style={{ color: "#666" }}>
                We provide safe and secure transport facilities for students
                across the city.
              </p>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "15px",
                  marginTop: "30px",
                }}
              >
                <div style={infoCardStyle}>
                  <strong>Route A (Main City):</strong> Driver: Aslam Uddin |
                  Phone: 01711-XXXXXX | Time: 7:30 AM
                </div>
                <div style={infoCardStyle}>
                  <strong>Route B (Suburbs):</strong> Driver: Milon Khan |
                  Phone: 01822-XXXXXX | Time: 7:15 AM
                </div>
                <div style={infoCardStyle}>
                  <strong>Route C (North Zone):</strong> Driver: Biplob Hossain
                  | Phone: 01933-XXXXXX | Time: 7:40 AM
                </div>
              </div>
            </div>
          )}

          {/* ================= ⚽ PLAYGROUND GALLERY ================= */}
          {activeMenu === "Playground" && (
            <div style={facilityPageWrapper}>
              <div style={facilityHeader}>
                <h2>⚽ Our School Playground & Sports Gallery</h2>
                <button
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
                  marginTop: "20px",
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
                      boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
                      border: "1px solid #eee",
                    }}
                  >
                    <img
                      src={item.img}
                      alt={item.title}
                      style={{
                        width: "100%",
                        height: "220px",
                        objectFit: "cover",
                      }}
                    />
                    <div style={{ padding: "15px" }}>
                      <h4 style={{ margin: 0, color: "#103741" }}>
                        {item.title}
                      </h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= 🍱 HEALTHY CANTEEN DETAILS ================= */}
          {activeMenu === "Canteen" && (
            <div style={facilityPageWrapper}>
              <div style={facilityHeader}>
                <h2>🍱 Healthy Canteen Weekly Menu</h2>
                <button
                  onClick={() => setActiveMenu("Dashboard")}
                  style={backBtnStyle}
                >
                  ← Back to Home
                </button>
              </div>
              <p style={{ color: "#666" }}>
                Our school canteen serves 100% hygienic and nutritious food
                curated by nutritionists.
              </p>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  marginTop: "25px",
                  textAlign: "left",
                }}
              >
                <thead>
                  <tr style={{ background: "#FFC107", color: "white" }}>
                    <th style={thStyle}>Day</th>
                    <th style={thStyle}>Breakfast</th>
                    <th style={thStyle}>Lunch / Snacks</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={trStyle}>
                    <td style={tdStyle}>Sunday</td>
                    <td style={tdStyle}>Milk & Honey Oats</td>
                    <td style={tdStyle}>Fresh Fruit Bowl & Egg Sandwich</td>
                  </tr>
                  <tr style={trStyle}>
                    <td style={tdStyle}>Monday</td>
                    <td style={tdStyle}>Homemade Roti & Vegetables</td>
                    <td style={tdStyle}>Chicken Khichuri (Low Oil)</td>
                  </tr>
                  <tr style={trStyle}>
                    <td style={tdStyle}>Tuesday</td>
                    <td style={tdStyle}>Egg & Toast with Fruit Juice</td>
                    <td style={tdStyle}>Vegetable Pasta & Noodles</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* ================= 🎨 CREATIVE ARTS DETAILS ================= */}
          {activeMenu === "Arts" && (
            <div style={facilityPageWrapper}>
              <div style={facilityHeader}>
                <h2>🎨 Creative Arts & Crafts Club</h2>
                <button
                  onClick={() => setActiveMenu("Dashboard")}
                  style={backBtnStyle}
                >
                  ← Back to Home
                </button>
              </div>
              <p style={{ color: "#666" }}>
                We foster child creativity through daily drawing, origami, and
                music lessons.
              </p>
              <div
                style={{
                  display: "flex",
                  gap: "20px",
                  flexWrap: "wrap",
                  marginTop: "30px",
                }}
              >
                <div
                  style={{
                    ...infoCardStyle,
                    borderLeft: "5px solid #0D6EFD",
                    flex: "1 1 250px",
                  }}
                >
                  <h3>Drawing Classes</h3>
                  <p>Every Sunday & Tuesday at 11:00 AM</p>
                </div>
                <div
                  style={{
                    ...infoCardStyle,
                    borderLeft: "5px solid #FE5D37",
                    flex: "1 1 250px",
                  }}
                >
                  <h3>Music & Rhythm</h3>
                  <p>Every Monday & Wednesday at 12:30 PM</p>
                </div>
              </div>
            </div>
          )}

          {/* বাকি প্রধান পেজগুলোর রেন্ডারিং */}
          {activeMenu === "Projects" && <ProjectsPage />}
          {activeMenu === "AboutUs" && <AboutUsPage />}
          {activeMenu === "ContactUs" && <ContactUsPage />}
        </div>

        {/* ফুটার সেকশন */}
        <div
          style={{
            background: "#103741",
            color: "white",
            padding: "40px",
            marginTop: "auto",
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
              <p
                onClick={() => setActiveMenu("ContactUs")}
                style={{ cursor: "pointer" }}
              >
                Contact Us
              </p>
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

// ================= স্টাইলস এবং সাব-কম্পোনেন্ট =================
function FacilityCard({ icon, title, color, textColor, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        width: "180px",
        padding: "30px 20px",
        borderRadius: "50%",
        background: color,
        textAlign: "center",
        border: `1px solid ${color}`,
        cursor: "pointer",
        transition: "transform 0.2s",
      }}
      onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.06)")}
      onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      <div style={{ fontSize: "40px", marginBottom: "10px" }}>{icon}</div>
      <h4 style={{ color: textColor, margin: 0 }}>{title}</h4>
    </div>
  );
}

// কমন পেজ লেআউট স্টাইলস
const facilityPageWrapper = {
  padding: "40px",
  maxWidth: "1100px",
  margin: "0 auto",
};
const facilityHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "20px",
  color: "#103741",
};
const backBtnStyle = {
  background: "#103741",
  color: "white",
  border: "none",
  padding: "10px 20px",
  borderRadius: "20px",
  cursor: "pointer",
  fontWeight: "bold",
};
const infoCardStyle = {
  background: "#f9f9f9",
  padding: "20px",
  borderRadius: "12px",
  border: "1px solid #eee",
  boxShadow: "0 2px 5px rgba(0,0,0,0.02)",
};
const thStyle = { padding: "12px" };
const tdStyle = { padding: "12px" };
const trStyle = { borderBottom: "1px solid #eee" };
