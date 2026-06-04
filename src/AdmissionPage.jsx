import { useState } from "react";
import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";

export default function AdmissionPage() {
  const [formData, setFormData] = useState({
    studentName: "",
    dob: "",
    parentName: "",
    phone: "",
    email: "",
    applyClass: "",
    address: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Firestore-এ ডাটা সেভ করা
      await addDoc(collection(db, "applications"), {
        ...formData,
        status: "pending", // ডিফল্ট স্ট্যাটাস পেন্ডিং থাকবে
        createdAt: new Date(),
      });

      // অটো ডাউনলোড (CSV ফাইল হিসেবে)
      const content = Object.entries(formData)
        .map(([k, v]) => `${k}: ${v}`)
        .join("\n");
      const blob = new Blob([content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${formData.studentName}_Application.txt`;
      link.click();

      alert(
        "🎉 Application Submitted Successfully! It is now pending for Admin approval.",
      );
    } catch (err) {
      alert("Error submitting: " + err.message);
    }
  };

  return (
    <div
      style={{
        padding: "40px 20px",
        background: "#f9fafb",
        minHeight: "80vh",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "40px",
          borderRadius: "16px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
          width: "100%",
          maxWidth: "800px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <h2
            style={{ fontSize: "32px", color: "#103741", margin: "0 0 10px 0" }}
          >
            📝 Student Admission Form
          </h2>
          <p style={{ color: "#666", fontSize: "16px" }}>
            Fill out the form below to apply for the 2026 academic year.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "20px" }}
        >
          {/* রো ১: স্টুডেন্ট নাম এবং জন্ম তারিখ */}
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            <div
              style={{
                flex: "1 1 300px",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <label
                style={{ fontWeight: "600", color: "#333", fontSize: "14px" }}
              >
                Student Full Name *
              </label>
              <input
                type="text"
                name="studentName"
                value={formData.studentName}
                onChange={handleChange}
                placeholder="e.g. Ayman Khan"
                required
                style={inputStyle}
              />
            </div>
            <div
              style={{
                flex: "1 1 300px",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <label
                style={{ fontWeight: "600", color: "#333", fontSize: "14px" }}
              >
                Date of Birth *
              </label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>
          </div>

          {/* রো ২: অভিভাবকের নাম এবং ফোন নম্বর */}
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            <div
              style={{
                flex: "1 1 300px",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <label
                style={{ fontWeight: "600", color: "#333", fontSize: "14px" }}
              >
                Parent/Guardian Name *
              </label>
              <input
                type="text"
                name="parentName"
                value={formData.parentName}
                onChange={handleChange}
                placeholder="Parent's Name"
                required
                style={inputStyle}
              />
            </div>
            <div
              style={{
                flex: "1 1 300px",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <label
                style={{ fontWeight: "600", color: "#333", fontSize: "14px" }}
              >
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+880 1XXX-XXXXXX"
                required
                style={inputStyle}
              />
            </div>
          </div>

          {/* রো ৩: ইমেইল এবং ক্লাস সিলেক্ট */}
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            <div
              style={{
                flex: "1 1 300px",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <label
                style={{ fontWeight: "600", color: "#333", fontSize: "14px" }}
              >
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="email@example.com"
                style={inputStyle}
              />
            </div>
            <div
              style={{
                flex: "1 1 300px",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <label
                style={{ fontWeight: "600", color: "#333", fontSize: "14px" }}
              >
                Applying For Class *
              </label>
              <select
                name="applyClass"
                value={formData.applyClass}
                onChange={handleChange}
                required
                style={inputStyle}
              >
                <option value="">-- Select Class --</option>
                <option value="Play">Play Group</option>
                <option value="Nursery">Nursery</option>
                <option value="KG">Kindergarten (KG)</option>
                <option value="Class 1">Class 1</option>
                <option value="Class 2">Class 2</option>
                <option value="Class 3">Class 3</option>
                <option value="Class 4">Class 4</option>
                <option value="Class 5">Class 5</option>
              </select>
            </div>
          </div>

          {/* রো ৪: ঠিকানা */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label
              style={{ fontWeight: "600", color: "#333", fontSize: "14px" }}
            >
              Present Address *
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="House no, Street, Area, City"
              rows="3"
              required
              style={{ ...inputStyle, resize: "vertical" }}
            ></textarea>
          </div>

          {/* সাবমিট বাটন */}
          <div style={{ textAlign: "center", marginTop: "10px" }}>
            <button
              type="submit"
              style={{
                background: "#FE5D37",
                color: "white",
                border: "none",
                padding: "14px 40px",
                borderRadius: "30px",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: "pointer",
                width: "100%",
                maxWidth: "300px",
                boxShadow: "0 4px 15px rgba(254, 93, 55, 0.3)",
              }}
            >
              Submit Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ইনপুট ফিল্ডের কমন স্টাইল
const inputStyle = {
  padding: "12px 15px",
  borderRadius: "8px",
  border: "1px solid #ddd",
  fontSize: "15px",
  outline: "none",
  fontFamily: "inherit",
  width: "100%",
  boxSizing: "border-box",
  background: "#fafafa",
};
