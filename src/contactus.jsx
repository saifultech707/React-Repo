import React, { useState, useEffect } from "react";
import { collection, addDoc, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "./firebase";

export default function ContactUsPage() {
  const userRole = localStorage.getItem("userRole") || "user";
  const [showInbox, setShowInbox] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    company: "",
    email: "",
    phone: "",
    address: "",
    message: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, "messages"), {
        ...formData,
        createdAt: new Date().toISOString()
      });
      alert("Message Sent Successfully! Thank you.");
      setFormData({ fullName: "", company: "", email: "", phone: "", address: "", message: "" });
    } catch (error) {
      console.error("Error sending message: ", error);
      alert("Failed to send message. Please check your internet connection.");
    }
    setLoading(false);
  };

  const fetchMessages = async () => {
    try {
      const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const msgs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
    } catch (error) {
      console.error("Error fetching messages: ", error);
    }
  };

  useEffect(() => {
    if (userRole === "admin" && showInbox) {
      fetchMessages();
    }
  }, [userRole, showInbox]);

  // ================= ADMIN INBOX VIEW =================
  if (showInbox && userRole === "admin") {
    return (
      <div style={{ padding: "40px", maxWidth: "1000px", margin: "0 auto", fontFamily: "'Poppins', sans-serif" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
          <h2 style={{ color: "#103741", margin: 0, fontSize: "32px" }}>Admin Inbox</h2>
          <button onClick={() => setShowInbox(false)} style={backBtnStyle}>
            ← Back to Contact Form
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {messages.length === 0 ? (
            <p style={{ textAlign: "center", color: "#666", fontSize: "18px", marginTop: "40px" }}>No messages found in the inbox.</p>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} style={messageCardStyle}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "15px", flexWrap: "wrap", gap: "10px" }}>
                  <div>
                    <h3 style={{ margin: "0 0 5px 0", color: "#1d1c22", fontSize: "20px" }}>
                      {msg.fullName} <span style={{ fontWeight: "normal", fontSize: "16px", color: "#666" }}>{msg.company && `(${msg.company})`}</span>
                    </h3>
                    <p style={{ margin: 0, color: "#444", fontSize: "14px", fontWeight: "500" }}>
                      ✉️ {msg.email} &nbsp;|&nbsp; 📞 {msg.phone}
                    </p>
                    <p style={{ margin: "5px 0 0 0", color: "#888", fontSize: "12px" }}>
                      📍 {msg.address} &nbsp;•&nbsp; 🕒 {new Date(msg.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <a 
                    href={`mailto:${msg.email}?subject=Reply from Our School`} 
                    style={replyBtnStyle}
                  >
                    Reply via Email
                  </a>
                </div>
                <div style={{ background: "#f9fafb", padding: "20px", borderRadius: "8px", border: "1px solid #eaeaea", color: "#333", whiteSpace: "pre-wrap", fontSize: "15px", lineHeight: "1.6" }}>
                  <strong>Message:</strong><br />
                  {msg.message}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  // ================= NORMAL CONTACT FORM VIEW =================
  return (
    <div style={containerStyle}>
      {/* Admin Inbox Toggle Button at the top */}
      {userRole === "admin" && (
        <div style={{ position: "absolute", top: "20px", right: "40px", zIndex: 10 }}>
          <button onClick={() => setShowInbox(true)} style={inboxToggleBtnStyle}>
            📥 Open Admin Inbox
          </button>
        </div>
      )}

      <div style={contentWrapperStyle}>
        
        {/* ================= বাম পাশ (Contact Info) ================= */}
        <div style={leftColumnStyle}>
          <h1 style={mainTitleStyle}>Contact Us</h1>
          <p style={subTextStyle}>
            Not sure what you need? Our team will be happy to listen to you and suggest the best learning path for your child.
          </p>
          
          <div style={infoListStyle}>
            <div style={infoItemStyle}>
              <span style={iconStyle}>✉️</span>
              <a href="mailto:info@ourschool.com" style={linkStyle}>info@ourschool.com</a>
            </div>
            <div style={infoItemStyle}>
              <span style={iconStyle}>📞</span>
              <span style={linkStyle}>Support: (+880) 123 456 789</span>
            </div>
          </div>
        </div>

        {/* ================= ডান পাশ (White Contact Card) ================= */}
        <div style={rightColumnStyle}>
          <div style={cardStyle}>
            
            <div style={circleDecorStyle}></div>

            <h2 style={cardTitleStyle}>We'd love to hear from you!</h2>
            <p style={cardSubTitleStyle}>Let's get in touch</p>

            <form onSubmit={handleSubmit} style={formStyle}>
              <div style={rowStyle}>
                <div style={inputGroupStyle}>
                  <label style={labelStyle}>Full Name</label>
                  <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Your name" style={inputStyle} required />
                </div>
                <div style={inputGroupStyle}>
                  <label style={labelStyle}>Subject / Grade</label>
                  <input type="text" name="company" value={formData.company} onChange={handleChange} placeholder="Class 1" style={inputStyle} />
                </div>
              </div>

              <div style={rowStyle}>
                <div style={inputGroupStyle}>
                  <label style={labelStyle}>Email</label>
                  <div style={inputIconWrapperStyle}>
                    <span style={inputInsideIconStyle}>✉️</span>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="example@email.com" style={inputWithIconStyle} required />
                  </div>
                </div>
                <div style={inputGroupStyle}>
                  <label style={labelStyle}>Phone number</label>
                  <div style={phoneWrapperStyle}>
                    <select style={selectStyle}>
                      <option>BD ⌵</option>
                      <option>US ⌵</option>
                    </select>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+880 1XXX-XXXXXX" style={phoneInputStyle} required />
                  </div>
                </div>
              </div>

              <div style={inputGroupFullStyle}>
                <label style={labelStyle}>Address</label>
                <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Your address" style={inputStyle} />
              </div>

              <div style={inputGroupFullStyle}>
                <label style={labelStyle}>Your Message</label>
                <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Type your message here..." style={textareaStyle} rows="4" required></textarea>
              </div>

              <button type="submit" disabled={loading} style={{ ...buttonStyle, opacity: loading ? 0.7 : 1 }}>
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>

          </div>
        </div>

      </div>
    </div>
  );
}

// ================= CSS-in-JS Styles =================
const containerStyle = {
  background: "#103741", // Matches the school dashboard theme color
  minHeight: "calc(100vh - 70px)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "60px 20px",
  boxSizing: "border-box",
  position: "relative"
};

const contentWrapperStyle = {
  display: "flex",
  width: "100%",
  maxWidth: "1100px",
  gap: "50px",
  flexWrap: "wrap",
  alignItems: "center",
  zIndex: 1
};

const leftColumnStyle = {
  flex: "1 1 400px",
  color: "white",
  paddingRight: "20px"
};

const mainTitleStyle = {
  fontSize: "46px",
  fontWeight: "bold",
  margin: "0 0 15px 0",
  letterSpacing: "-1px"
};

const subTextStyle = {
  fontSize: "16px",
  lineHeight: "1.6",
  color: "#e2e8f0",
  marginBottom: "40px"
};

const infoListStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "20px"
};

const infoItemStyle = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  fontSize: "16px"
};

const iconStyle = {
  fontSize: "18px"
};

const linkStyle = {
  color: "white",
  textDecoration: "none"
};

const rightColumnStyle = {
  flex: "1.2 1 500px",
  display: "flex",
  justifyContent: "center"
};

const cardStyle = {
  background: "white",
  padding: "40px",
  borderRadius: "16px",
  width: "100%",
  boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
  position: "relative",
  overflow: "hidden",
  boxSizing: "border-box"
};

const circleDecorStyle = {
  position: "absolute",
  top: "-30px",
  right: "-30px",
  width: "120px",
  height: "120px",
  border: "1px solid #eaeaea",
  borderRadius: "50%",
  boxShadow: "0 0 0 15px transparent, 0 0 0 30px #fdfdfd, 0 0 0 45px transparent, 0 0 0 60px #f9f9f9",
  opacity: 0.7,
  pointerEvents: "none"
};

const cardTitleStyle = {
  fontSize: "26px",
  color: "#1d1c22",
  margin: "0 0 5px 0",
  fontWeight: "600"
};

const cardSubTitleStyle = {
  fontSize: "16px",
  color: "#666",
  margin: "0 0 30px 0"
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "20px"
};

const rowStyle = {
  display: "flex",
  gap: "20px",
  flexWrap: "wrap"
};

const inputGroupStyle = {
  flex: "1 1 200px",
  display: "flex",
  flexDirection: "column",
  gap: "6px"
};

const inputGroupFullStyle = {
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: "6px"
};

const labelStyle = {
  fontSize: "14px",
  fontWeight: "500",
  color: "#344054"
};

const inputStyle = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: "8px",
  border: "1px solid #D0D5DD",
  fontSize: "14px",
  outline: "none",
  boxSizing: "border-box",
  color: "#333"
};

const inputIconWrapperStyle = {
  position: "relative",
  display: "flex",
  alignItems: "center"
};

const inputInsideIconStyle = {
  position: "absolute",
  left: "12px",
  color: "#667085",
  fontSize: "14px"
};

const inputWithIconStyle = {
  width: "100%",
  padding: "10px 14px 10px 35px",
  borderRadius: "8px",
  border: "1px solid #D0D5DD",
  fontSize: "14px",
  outline: "none",
  boxSizing: "border-box"
};

const phoneWrapperStyle = {
  display: "flex",
  border: "1px solid #D0D5DD",
  borderRadius: "8px",
  overflow: "hidden"
};

const selectStyle = {
  border: "none",
  background: "#f9fafb",
  padding: "0 10px",
  fontSize: "14px",
  outline: "none",
  borderRight: "1px solid #D0D5DD",
  cursor: "pointer"
};

const phoneInputStyle = {
  flex: 1,
  border: "none",
  padding: "10px 14px",
  fontSize: "14px",
  outline: "none"
};

const textareaStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: "8px",
  border: "1px solid #D0D5DD",
  fontSize: "14px",
  outline: "none",
  fontFamily: "inherit",
  resize: "vertical",
  boxSizing: "border-box"
};

const buttonStyle = {
  background: "#FE5D37", // Matches the school brand color
  color: "white",
  border: "none",
  padding: "14px",
  borderRadius: "8px",
  fontSize: "16px",
  fontWeight: "bold",
  cursor: "pointer",
  marginTop: "10px",
  transition: "background 0.2s"
};

const inboxToggleBtnStyle = {
  background: "#FE5D37",
  color: "white",
  border: "2px solid white",
  padding: "10px 20px",
  borderRadius: "30px",
  fontWeight: "bold",
  cursor: "pointer",
  boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
};

const backBtnStyle = {
  background: "#103741",
  color: "white",
  border: "none",
  padding: "10px 20px",
  borderRadius: "30px",
  fontWeight: "bold",
  cursor: "pointer",
};

const messageCardStyle = {
  background: "white",
  padding: "25px",
  borderRadius: "12px",
  boxShadow: "0 5px 20px rgba(0,0,0,0.05)",
  border: "1px solid #eee",
};

const replyBtnStyle = {
  background: "#0d6efd",
  color: "white",
  padding: "8px 16px",
  borderRadius: "20px",
  textDecoration: "none",
  fontSize: "14px",
  fontWeight: "bold",
  display: "inline-block"
};
