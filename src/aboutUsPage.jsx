

import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, getDocs, addDoc, updateDoc, doc } from "firebase/firestore";

export default function AboutUsPage() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Auth State from localStorage
  const [role, setRole] = useState(localStorage.getItem("userRole") || "guest"); // admin, teacher, guest
  const [currentTeacherId, setCurrentTeacherId] = useState(""); // Optionally link to Firebase auth UID later

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({ id: "", name: "", sub: "", edu: "", img: "" });

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "teachers"));
      const teachersList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTeachers(teachersList);
    } catch (error) {
      console.error("Error fetching teachers:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleOpenEdit = (teacher) => {
    setEditFormData(teacher || { id: "", name: "", sub: "", edu: "", img: "https://i.pravatar.cc/150" });
    setIsEditModalOpen(true);
  };

  const handleSaveTeacher = async () => {
    try {
      if (editFormData.id) {
        // Update existing teacher
        const teacherRef = doc(db, "teachers", editFormData.id);
        await updateDoc(teacherRef, {
          name: editFormData.name,
          sub: editFormData.sub,
          edu: editFormData.edu,
          img: editFormData.img,
        });
      } else {
        // Add new teacher
        await addDoc(collection(db, "teachers"), {
          name: editFormData.name,
          sub: editFormData.sub,
          edu: editFormData.edu,
          img: editFormData.img,
        });
      }
      setIsEditModalOpen(false);
      fetchTeachers();
    } catch (error) {
      console.error("Error saving teacher:", error);
      alert("Failed to save. Check console for details.");
    }
  };

  const canEdit = (teacherId) => {
    return role === "admin" || (role === "teacher" && currentTeacherId === teacherId);
  };

  // Seed dummy data if empty (for testing)
  const seedData = async () => {
    const dummyTeachers = [
      { name: "Ms. Fatema Khatun", sub: "English", edu: "M.A in English, DU", img: "https://i.pravatar.cc/150?u=f1", gender: "mam" },
      { name: "Mr. Rafiqul Islam", sub: "Mathematics", edu: "M.Sc in Math, BUET", img: "https://i.pravatar.cc/150?u=m1", gender: "sir" }
    ];
    for (let t of dummyTeachers) {
      await addDoc(collection(db, "teachers"), t);
    }
    fetchTeachers();
  };

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
        <img src="https://i.pravatar.cc/150?u=head" style={{ width: "150px", height: "150px", borderRadius: "50%", border: "5px solid #FE5D37" }} alt="Head Teacher" />
        <h2 style={{ color: "#103741", marginTop: "15px" }}>Mr. Abdur Rahman</h2>
        <p style={{ color: "#FE5D37", fontWeight: "bold" }}>Head Teacher</p>
        <p style={{ maxWidth: "600px", margin: "10px auto", color: "#666" }}>
          "আমাদের লক্ষ্য শিক্ষার্থীদের নৈতিক ও মানসম্মত শিক্ষায় গড়ে তোলা।"
        </p>
      </div>

      {/* ২. শিক্ষকদের তালিকা (Grid) */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <h2 style={{ color: "#103741", borderLeft: "5px solid #FE5D37", paddingLeft: "15px", margin: 0 }}>Our Expert Teachers</h2>
        {role === "admin" && (
          <button onClick={() => handleOpenEdit(null)} style={{ padding: "10px 20px", background: "#103741", color: "white", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "bold" }}>
            ➕ Add Teacher
          </button>
        )}
      </div>

      {loading ? (
        <p>Loading teachers...</p>
      ) : teachers.length === 0 ? (
        <div>
          <p>No teachers found in database.</p>
          {role === "admin" && <button onClick={seedData} style={{ padding: "10px", cursor: "pointer" }}>Seed Dummy Data</button>}
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "25px", marginBottom: "60px" }}>
          {teachers.map((t) => (
            <div key={t.id} style={{ background: "#f9f9f9", padding: "20px", borderRadius: "15px", textAlign: "center", boxShadow: "0 4px 10px rgba(0,0,0,0.05)", position: "relative" }}>
              {canEdit(t.id) && (
                <button 
                  onClick={() => handleOpenEdit(t)} 
                  style={{ position: "absolute", top: "10px", right: "10px", background: "#FE5D37", color: "white", border: "none", borderRadius: "4px", padding: "5px 10px", cursor: "pointer", fontSize: "12px" }}
                >
                  ✏️ Edit
                </button>
              )}
              <img src={t.img || "https://i.pravatar.cc/150"} style={{ width: "80px", height: "80px", borderRadius: "50%", marginBottom: "10px", objectFit: "cover" }} alt={t.name} />
              <h4 style={{ margin: "5px 0", color: "#103741" }}>{t.name}</h4>
              <p style={{ margin: "0", color: "#FE5D37", fontSize: "14px", fontWeight: "bold" }}>{t.sub}</p>
              <p style={{ margin: "5px 0", color: "#888", fontSize: "12px" }}>{t.edu}</p>
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

      {/* Teacher Edit/Add Modal */}
      {isEditModalOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.6)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}>
          <div style={{ background: "white", padding: "30px", borderRadius: "12px", width: "90%", maxWidth: "400px" }}>
            <h3 style={{ marginTop: 0, color: "#103741" }}>{editFormData.id ? "Edit Teacher" : "Add Teacher"}</h3>
            
            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px", color: "#666" }}>Name</label>
              <input type="text" value={editFormData.name} onChange={(e) => setEditFormData({...editFormData, name: e.target.value})} style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }} />
            </div>
            
            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px", color: "#666" }}>Subject</label>
              <input type="text" value={editFormData.sub} onChange={(e) => setEditFormData({...editFormData, sub: e.target.value})} style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }} />
            </div>
            
            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px", color: "#666" }}>Education</label>
              <input type="text" value={editFormData.edu} onChange={(e) => setEditFormData({...editFormData, edu: e.target.value})} style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }} />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "5px", color: "#666" }}>Image URL</label>
              <input type="text" value={editFormData.img} onChange={(e) => setEditFormData({...editFormData, img: e.target.value})} style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }} />
            </div>

            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button onClick={() => setIsEditModalOpen(false)} style={{ padding: "10px 15px", border: "none", background: "#ccc", borderRadius: "4px", cursor: "pointer" }}>Cancel</button>
              <button onClick={handleSaveTeacher} style={{ padding: "10px 15px", border: "none", background: "#FE5D37", color: "white", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>Save</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

const statBox = { flex: 1, background: "rgba(255,255,255,0.1)", padding: "20px", borderRadius: "10px", textAlign: "center", color: "white" };
const tdStyle = { padding: "15px", border: "none" };