

import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function AboutUsPage() {
  const [teachers, setTeachers] = useState([]);
  const [headTeacher, setHeadTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // Auth State from localStorage
  const [userRole, setUserRole] = useState(localStorage.getItem("userRole") || "guest"); // admin, teacher, guest

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "profiles"));
      const profilesList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Separate Admin (Head Teacher) and Teachers
      const admins = profilesList.filter(p => p.role === "admin" || p.email === "admin@gmail.com"); // Fallback to email if role not set
      const regularTeachers = profilesList.filter(p => p.role !== "admin" && p.email !== "admin@gmail.com");

      if (admins.length > 0) {
        setHeadTeacher(admins[0]);
      }
      setTeachers(regularTeachers);

    } catch (error) {
      console.error("Error fetching profiles:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  // সেরা ১০ ছাত্রের ডাটা
  const topStudents = Array.from({ length: 10 }, (_, i) => ({
    name: `Student Name ${i + 1}`,
    pos: i + 1,
    marks: 600 - i * 5,
    year: "2025"
  }));

  return (
    <div style={{ padding: "40px", background: "#fff" }}>
      
      {/* ১. হেড টিচার সেকশন */}
      <div style={{ textAlign: "center", marginBottom: "60px", background: "#FFF5F3", padding: "40px", borderRadius: "20px" }}>
        <img 
          src={headTeacher?.picture || "https://i.pravatar.cc/150?u=head"} 
          style={{ width: "150px", height: "150px", borderRadius: "50%", border: "5px solid #FE5D37", objectFit: "cover" }} 
          alt={headTeacher?.name || "Head Teacher"} 
        />
        <h2 style={{ color: "#103741", marginTop: "15px" }}>{headTeacher?.name || "Mr. Abdur Rahman"}</h2>
        <p style={{ color: "#FE5D37", fontWeight: "bold" }}>Head Teacher</p>
        <p style={{ maxWidth: "600px", margin: "10px auto", color: "#666" }}>
          "আমাদের লক্ষ্য শিক্ষার্থীদের নৈতিক ও মানসম্মত শিক্ষায় গড়ে তোলা।"
        </p>
        {userRole === "admin" && headTeacher && (
          <button 
            onClick={() => navigate(`/profile/${headTeacher.id}`)}
            style={{ marginTop: "10px", padding: "5px 15px", background: "#103741", color: "white", borderRadius: "5px", border: "none", cursor: "pointer" }}
          >
            Edit Profile
          </button>
        )}
      </div>

      {/* ২. শিক্ষকদের তালিকা (Grid) */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <h2 style={{ color: "#103741", borderLeft: "5px solid #FE5D37", paddingLeft: "15px", margin: 0 }}>Our Expert Teachers</h2>
      </div>

      {loading ? (
        <p>Loading teachers...</p>
      ) : teachers.length === 0 ? (
        <div>
          <p>No teachers found in database.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "25px", marginBottom: "60px" }}>
          {teachers.map((t) => (
            <div key={t.id} style={{ background: "#f9f9f9", padding: "20px", borderRadius: "15px", textAlign: "center", boxShadow: "0 4px 10px rgba(0,0,0,0.05)", position: "relative" }}>
              <img src={t.picture || "https://i.pravatar.cc/150"} style={{ width: "80px", height: "80px", borderRadius: "50%", marginBottom: "10px", objectFit: "cover" }} alt={t.name} />
              <h4 style={{ margin: "5px 0", color: "#103741" }}>{t.name || "Unnamed Teacher"}</h4>
              <p style={{ margin: "0", color: "#FE5D37", fontSize: "14px", fontWeight: "bold" }}>{t.email}</p>
              
              <div style={{ marginTop: "15px", display: "flex", justifyContent: "center", gap: "10px" }}>
                <button 
                  onClick={() => navigate(`/profile/${t.id}?view=true`)} 
                  style={{ background: "#FE5D37", color: "white", border: "none", borderRadius: "4px", padding: "5px 10px", cursor: "pointer", fontSize: "12px" }}
                >
                  View
                </button>
                {userRole === "admin" && (
                  <button 
                    onClick={() => navigate(`/profile/${t.id}`)} 
                    style={{ background: "#103741", color: "white", border: "none", borderRadius: "4px", padding: "5px 10px", cursor: "pointer", fontSize: "12px" }}
                  >
                    Edit
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ৩. অ্যাচিভমেন্ট সেকশন (Class 5 Result) */}
      <div style={{ background: "#103741", color: "#white", padding: "40px", borderRadius: "20px", marginBottom: "60px" }}>
        <h2 style={{ color: "#fff" }}>School Achievements (Class 5)</h2>
        <div style={{ display: "flex", gap: "20px", marginTop: "20px", flexWrap: "wrap" }}>
            <div style={statBox}><h3>100%</h3><p>Passing Rate</p></div>
            <div style={statBox}><h3>45</h3><p>GPA 5.00 (2025)</p></div>
            <div style={statBox}><h3>12</h3><p>Scholarships</p></div>
        </div>
      </div>

      {/* ৪. সেরা ১০ ছাত্রের তালিকা */}
      <h2 style={{ color: "#103741", marginBottom: "20px" }}>Top 10 Students (Class 5 - 2025)</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#FE5D37", color: "white", textAlign: "left" }}>
            <th style={tdStyle}>Rank</th>
            <th style={tdStyle}>Student Name</th>
            <th style={tdStyle}>Total Marks</th>
            <th style={tdStyle}>Year</th>
          </tr>
        </thead>
        <tbody>
          {topStudents.map((s, i) => (
            <tr key={i} style={{ borderBottom: "1px solid #eee" }}>
              <td style={tdStyle}>#{s.pos}</td>
              <td style={tdStyle}>{s.name}</td>
              <td style={tdStyle}>{s.marks}</td>
              <td style={tdStyle}>{s.year}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}

const statBox = { flex: 1, background: "rgba(255,255,255,0.1)", padding: "20px", borderRadius: "10px", textAlign: "center", color: "white" };
const tdStyle = { padding: "15px", border: "none" };