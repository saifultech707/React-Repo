import { useState } from "react";

export default function ContactUsPage() {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message Sent Successfully! Thank you.");
    setFormData({ fullName: "", company: "", email: "", phone: "", address: "", message: "" });
  };

  return (
    <div style={containerStyle}>
      <div style={contentWrapperStyle}>
        
        {/* ================= বাম পাশ (Contact Info) ================= */}
        <div style={leftColumnStyle}>
          <h1 style={mainTitleStyle}>Contact Us</h1>
          <p style={subTextStyle}>
            Not sure what you need? The team at Square Events will be happy to listen to you and suggest event ideas you hadn't considered.
          </p>
          
          <div style={infoListStyle}>
            <div style={infoItemStyle}>
              <span style={iconStyle}>✉️</span>
              <a href="mailto:info@squareevents.com" style={linkStyle}>info@squareevents.com</a>
            </div>
            <div style={infoItemStyle}>
              <span style={iconStyle}>📞</span>
              <span style={linkStyle}>Support: (+21) 123 456 586</span>
            </div>
          </div>
        </div>

        {/* ================= ডান পাশ (White Contact Card) ================= */}
        <div style={rightColumnStyle}>
          <div style={cardStyle}>
            
            {/* কোণায় থাকা ডেকোরেটিভ সার্কেল ব্যাকগ্রাউন্ড */}
            <div style={circleDecorStyle}></div>

            <h2 style={cardTitleStyle}>We'd love to hear from you!</h2>
            <p style={cardSubTitleStyle}>Let's get in touch</p>

            <form onSubmit={handleSubmit} style={formStyle}>
              {/* রো ১: Full Name & Company */}
              <div style={rowStyle}>
                <div style={inputGroupStyle}>
                  <label style={labelStyle}>Full Name</label>
                  <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Your name" style={inputStyle} required />
                </div>
                <div style={inputGroupStyle}>
                  <label style={labelStyle}>Company</label>
                  <input type="text" name="company" value={formData.company} onChange={handleChange} placeholder="Company name" style={inputStyle} />
                </div>
              </div>

              {/* রো ২: Email & Phone number */}
              <div style={rowStyle}>
                <div style={inputGroupStyle}>
                  <label style={labelStyle}>Email</label>
                  <div style={inputIconWrapperStyle}>
                    <span style={inputInsideIconStyle}>✉️</span>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="olivia@untitledui.com" style={inputWithIconStyle} required />
                  </div>
                </div>
                <div style={inputGroupStyle}>
                  <label style={labelStyle}>Phone number</label>
                  <div style={phoneWrapperStyle}>
                    <select style={selectStyle}>
                      <option>US ⌵</option>
                      <option>BD ⌵</option>
                    </select>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 (555) 000-0000" style={phoneInputStyle} />
                  </div>
                </div>
              </div>

              {/* রো ৩: Address */}
              <div style={inputGroupFullStyle}>
                <label style={labelStyle}>Address</label>
                <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Your address" style={inputStyle} />
              </div>

              {/* রো ৪: Your Message */}
              <div style={inputGroupFullStyle}>
                <label style={labelStyle}>Your Message</label>
                <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Type your message here..." style={textareaStyle} rows="4" required></textarea>
              </div>

              {/* সাবমিট বাটন */}
              <button type="submit" style={buttonStyle}>Send Message</button>
            </form>

          </div>
        </div>

      </div>
    </div>
  );
}

// ================= CSS-in-JS Styles =================
const containerStyle = {
  background: "#43365d", // ছবির মতো চমৎকার ডার্ক পার্পল ব্যাকগ্রাউন্ড
  minHeight: "calc(100vh - 70px)", // টপ নববার বাদে পুরো স্ক্রিন কভার করবে
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "40px 20px",
  boxSizing: "border-box"
};

const contentWrapperStyle = {
  display: "flex",
  width: "100%",
  maxWidth: "1100px",
  gap: "50px",
  flexWrap: "wrap",
  alignItems: "center"
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
  color: "#c3bcda",
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
  background: "#43365d",
  color: "white",
  border: "none",
  padding: "12px",
  borderRadius: "8px",
  fontSize: "16px",
  fontWeight: "bold",
  cursor: "pointer",
  marginTop: "10px",
  transition: "background 0.2s"
};