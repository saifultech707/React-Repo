import { useState } from "react";

export default function ProjectsPage() {
  // ১. ডামি ডাটা জেনারেট করা
  const generateInitialData = () => {
    const data = {};
    const names = ["Abir", "Bina", "Cayan", "Dipa", "Emon", "Fariha", "Galib", "Hia", "Irfan", "Jui", "Kamal", "Lina", "Mitu", "Nabil", "Opu", "Pia", "Rifat", "Sagor", "Tisha", "Zayan"];
    const subjects = ["Bangla", "English", "Math", "Science", "Religion"];
    
    const getGrade = (mark) => {
      if (mark >= 80) return "A+";
      if (mark >= 70) return "A";
      if (mark >= 60) return "A-";
      if (mark >= 50) return "B";
      return "C";
    };

    for (let cls = 1; cls <= 5; cls++) {
      data[cls] = Array.from({ length: 20 }, (_, i) => ({
        name: `${names[i]}`,
        roll: i + 1,
        fatherName: `Mr. ${names[i]} Senior`,
        address: `${i + 10}/A, Road ${cls + 5}, Saidpur, Nilphamari`,
        image: `https://i.pravatar.cc/150?u=${cls}${i}`,
        results: subjects.map(sub => {
          const mark = Math.floor(Math.random() * 60) + 40;
          return { subject: sub, mark: mark, grade: getGrade(mark) };
        })
      }));
    }
    return data;
  };

  const [allClasses, setAllClasses] = useState(generateInitialData());
  const [selectedClass, setSelectedClass] = useState(1);
  const [view, setView] = useState("list"); // 'list', 'details', 'add'
  const [selectedStudent, setSelectedStudent] = useState(null);
  
  // নতুন স্টুডেন্ট ইনপুট স্টেট
  const [newStudent, setNewStudent] = useState({ name: "", roll: "", fatherName: "", address: "", image: "" });

  const handleStudentClick = (st) => {
    setSelectedStudent(st);
    setView("details");
  };

  const handleSaveStudent = () => {
    if (newStudent.name && newStudent.roll) {
      // নতুন স্টুডেন্টের জন্য অটো মার্কস তৈরি করা
      const subjects = ["Bangla", "English", "Math", "Science", "Religion"];
      const generatedResults = subjects.map(sub => ({
        subject: sub, mark: 0, grade: "N/A" 
      }));

      const studentToAdd = { ...newStudent, results: generatedResults };
      
      // নতুন স্টুডেন্টকে বর্তমান লিস্টের শেষে যোগ করা
      setAllClasses({
        ...allClasses,
        [selectedClass]: [...allClasses[selectedClass], studentToAdd]
      });

      setNewStudent({ name: "", roll: "", fatherName: "", address: "", image: "" });
      setView("list"); // সেভ করার পর আবার লিস্টে ফিরে যাবে
    }
  };

  return (
    <div style={{ width: "100%", padding: "20px", fontFamily: "'Poppins', sans-serif", display: "flex", flexDirection: "column", alignItems: "center" }}>
      
      {/* ================= ১. লিস্ট ভিউ ================= */}
      {view === "list" && (
        <div style={{ width: "100%", maxWidth: "800px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h1 style={{ fontSize: "28px", color: "#103741" }}>Class {selectedClass} Dashboard</h1>
            <button onClick={() => setView("add")} style={{ background: "#10b981", color: "white", border: "none", padding: "10px 20px", borderRadius: "30px", cursor: "pointer", fontWeight: "bold" }}>
              + Add Student
            </button>
          </div>

          {/* ক্লাস বাটন */}
          <div style={{ display: "flex", gap: "10px", marginBottom: "20px", justifyContent: "center" }}>
            {[1, 2, 3, 4, 5].map((cls) => (
              <button key={cls} onClick={() => setSelectedClass(cls)} style={{
                padding: "8px 18px", borderRadius: "20px", border: "none", cursor: "pointer",
                background: selectedClass === cls ? "#FE5D37" : "#eee", color: selectedClass === cls ? "white" : "#333"
              }}>Cls {cls}</button>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {allClasses[selectedClass].map((st, index) => (
              <div key={index} onClick={() => handleStudentClick(st)} style={listItemStyle}>
                <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                    <span style={{color: '#999', width: '25px'}}>{index + 1}.</span>
                    <img src={st.image} style={{ width: "40px", height: "40px", borderRadius: "50%" }} />
                    <span style={{ fontWeight: "600" }}>{st.name}</span>
                </div>
                <span style={{ fontSize: "14px", color: "#666" }}>Roll: {st.roll} ›</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= ২. অ্যাড স্টুডেন্ট UI ================= */}
      {view === "add" && (
        <div style={formContainerStyle}>
          <h2 style={{ color: "#103741", marginBottom: "20px" }}>Add Student to Class {selectedClass}</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <input placeholder="Student Full Name" style={inputStyle} value={newStudent.name} onChange={(e) => setNewStudent({...newStudent, name: e.target.value})} />
            <input placeholder="Roll Number" style={inputStyle} value={newStudent.roll} onChange={(e) => setNewStudent({...newStudent, roll: e.target.value})} />
            <input placeholder="Father's Name" style={inputStyle} value={newStudent.fatherName} onChange={(e) => setNewStudent({...newStudent, fatherName: e.target.value})} />
            <input placeholder="Complete Address" style={inputStyle} value={newStudent.address} onChange={(e) => setNewStudent({...newStudent, address: e.target.value})} />
            <input placeholder="Profile Image Link" style={inputStyle} value={newStudent.image} onChange={(e) => setNewStudent({...newStudent, image: e.target.value})} />
            
            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <button onClick={handleSaveStudent} style={{ flex: 2, background: "#FE5D37", color: "white", border: "none", padding: "12px", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}>Save Student</button>
                <button onClick={() => setView("list")} style={{ flex: 1, background: "#ddd", border: "none", padding: "12px", borderRadius: "8px", cursor: "pointer" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ================= ৩. ডিটেইলস ভিউ ================= */}
      {view === "details" && (
        <div style={detailsContainerStyle}>
          <button onClick={() => setView("list")} style={backButtonStyle}>← Back</button>
          <div style={{ display: "flex", gap: "25px", marginBottom: "20px" }}>
            <img src={selectedStudent.image} style={{ width: "100px", height: "100px", borderRadius: "15px" }} />
            <div>
              <h2 style={{ margin: 0 }}>{selectedStudent.name}</h2>
              <p style={{ margin: "5px 0", color: "#FE5D37" }}>Class: {selectedClass} | Roll: {selectedStudent.roll}</p>
              <p style={{ fontSize: "14px", margin: 0 }}><strong>Address:</strong> {selectedStudent.address}</p>
            </div>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr style={{ background: "#f1f1f1" }}><th style={thStyle}>Subject</th><th style={thStyle}>Marks</th><th style={thStyle}>Grade</th></tr></thead>
            <tbody>
              {selectedStudent.results.map((res, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={tdStyle}>{res.subject}</td>
                  <td style={tdStyle}>{res.mark}</td>
                  <td style={{ ...tdStyle, fontWeight: "bold" }}>{res.grade}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// Styles
const listItemStyle = {
    background: "white", padding: "15px", borderRadius: "10px", boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
    display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", border: "1px solid #f0f0f0"
};
const formContainerStyle = { background: "white", padding: "30px", borderRadius: "15px", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", width: "100%", maxWidth: "500px" };
const detailsContainerStyle = { background: "white", padding: "30px", borderRadius: "15px", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", width: "100%", maxWidth: "600px" };
const inputStyle = { padding: "12px", borderRadius: "8px", border: "1px solid #ddd", outline: "none" };
const backButtonStyle = { background: "#eee", border: "none", padding: "8px 15px", borderRadius: "20px", cursor: "pointer", marginBottom: "15px" };
const thStyle = { padding: "10px", textAlign: "left", color: "#666" };
const tdStyle = { padding: "10px", color: "#333" };