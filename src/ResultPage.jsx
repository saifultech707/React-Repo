import React, { useState, useEffect } from "react";

export default function ResultPage() {
  const [userRole, setUserRole] = useState("user");
  
  useEffect(() => {
    setUserRole(localStorage.getItem("userRole") || "user");
  }, []);

  const [results, setResults] = useState([
    { id: 1, name: "Ali Hossain", class: "Class 1", roll: "01", math: 85, english: 90, science: 88, grade: "A+" },
    { id: 2, name: "Sara Islam", class: "Class 1", roll: "02", math: 78, english: 82, science: 80, grade: "A" },
    { id: 3, name: "Rahim Uddin", class: "Class 2", roll: "01", math: 92, english: 88, science: 95, grade: "A+" },
    { id: 4, name: "Fatima Begum", class: "Class 2", roll: "02", math: 65, english: 75, science: 70, grade: "A-" },
    { id: 5, name: "Karim Khan", class: "Class 3", roll: "01", math: 88, english: 85, science: 90, grade: "A+" },
  ]);

  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  const handleEditClick = (result) => {
    setEditingId(result.id);
    setEditFormData(result);
  };

  const handleSaveClick = () => {
    setResults(results.map((r) => (r.id === editingId ? editFormData : r)));
    setEditingId(null);
  };

  const handleCancelClick = () => {
    setEditingId(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  // Get unique classes from results array and sort them
  const uniqueClasses = [...new Set(results.map(r => r.class))].sort();

  return (
    <div style={{ padding: "40px", maxWidth: "1000px", margin: "0 auto", fontFamily: "'Poppins', sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <h2 style={{ color: "#103741", margin: 0, fontSize: "32px" }}>
          Student Results Sheet
        </h2>
        {userRole === "admin" && (
          <div style={{ background: "#FE5D37", color: "white", padding: "8px 16px", borderRadius: "20px", fontSize: "14px", fontWeight: "bold" }}>
            Admin Mode Active
          </div>
        )}
      </div>

      {uniqueClasses.map((className) => (
        <div key={className} style={{ marginBottom: "40px" }}>
          <h3 style={{ color: "#FE5D37", borderBottom: "2px solid #103741", paddingBottom: "10px", marginBottom: "20px" }}>
            {className}
          </h3>
          <div style={{ overflowX: "auto", borderRadius: "10px", boxShadow: "0 4px 15px rgba(0,0,0,0.05)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", minWidth: "800px" }}>
              <thead>
                <tr style={{ background: "#103741", color: "white", textAlign: "left" }}>
                  <th style={{ padding: "15px", borderBottom: "2px solid #FE5D37" }}>Roll</th>
                  <th style={{ padding: "15px", borderBottom: "2px solid #FE5D37" }}>Name</th>
                  <th style={{ padding: "15px", borderBottom: "2px solid #FE5D37" }}>Class</th>
                  <th style={{ padding: "15px", borderBottom: "2px solid #FE5D37" }}>Math</th>
                  <th style={{ padding: "15px", borderBottom: "2px solid #FE5D37" }}>English</th>
                  <th style={{ padding: "15px", borderBottom: "2px solid #FE5D37" }}>Science</th>
                  <th style={{ padding: "15px", borderBottom: "2px solid #FE5D37" }}>Grade</th>
                  {userRole === "admin" && (
                    <th style={{ padding: "15px", borderBottom: "2px solid #FE5D37", textAlign: "center" }}>Action</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {results.filter(r => r.class === className).map((result) => (
                  <tr key={result.id} style={{ borderBottom: "1px solid #eee", transition: "background 0.3s", cursor: "default" }} onMouseOver={(e) => e.currentTarget.style.background = "#f9f9f9"} onMouseOut={(e) => e.currentTarget.style.background = "transparent"}>
                    {editingId === result.id ? (
                      <>
                        <td style={{ padding: "10px 15px" }}><input type="text" name="roll" value={editFormData.roll} onChange={handleChange} style={inputStyle} /></td>
                        <td style={{ padding: "10px 15px" }}><input type="text" name="name" value={editFormData.name} onChange={handleChange} style={inputStyle} /></td>
                        <td style={{ padding: "10px 15px" }}><input type="text" name="class" value={editFormData.class} onChange={handleChange} style={inputStyle} /></td>
                        <td style={{ padding: "10px 15px" }}><input type="number" name="math" value={editFormData.math} onChange={handleChange} style={inputStyle} /></td>
                        <td style={{ padding: "10px 15px" }}><input type="number" name="english" value={editFormData.english} onChange={handleChange} style={inputStyle} /></td>
                        <td style={{ padding: "10px 15px" }}><input type="number" name="science" value={editFormData.science} onChange={handleChange} style={inputStyle} /></td>
                        <td style={{ padding: "10px 15px" }}><input type="text" name="grade" value={editFormData.grade} onChange={handleChange} style={inputStyle} /></td>
                        <td style={{ padding: "10px 15px", textAlign: "center", display: "flex", gap: "5px", justifyContent: "center" }}>
                          <button onClick={handleSaveClick} style={saveBtnStyle}>Save</button>
                          <button onClick={handleCancelClick} style={cancelBtnStyle}>Cancel</button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td style={{ padding: "15px", color: "#555" }}>{result.roll}</td>
                        <td style={{ padding: "15px", fontWeight: "500", color: "#333" }}>{result.name}</td>
                        <td style={{ padding: "15px", color: "#555" }}>{result.class}</td>
                        <td style={{ padding: "15px", color: "#555" }}>{result.math}</td>
                        <td style={{ padding: "15px", color: "#555" }}>{result.english}</td>
                        <td style={{ padding: "15px", color: "#555" }}>{result.science}</td>
                        <td style={{ padding: "15px", fontWeight: "bold", color: result.grade.includes("A") ? "#10b981" : "#FE5D37" }}>{result.grade}</td>
                        {userRole === "admin" && (
                          <td style={{ padding: "15px", textAlign: "center" }}>
                            <button onClick={() => handleEditClick(result)} style={editBtnStyle}>Edit</button>
                          </td>
                        )}
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}

const inputStyle = { width: "100%", padding: "8px", boxSizing: "border-box", borderRadius: "4px", border: "1px solid #ccc", outline: "none", fontFamily: "inherit" };
const editBtnStyle = { background: "#FE5D37", color: "white", border: "none", padding: "6px 15px", borderRadius: "20px", cursor: "pointer", fontWeight: "bold", fontSize: "13px" };
const saveBtnStyle = { background: "#10b981", color: "white", border: "none", padding: "6px 12px", borderRadius: "4px", cursor: "pointer", fontWeight: "bold", fontSize: "13px" };
const cancelBtnStyle = { background: "#ef4444", color: "white", border: "none", padding: "6px 12px", borderRadius: "4px", cursor: "pointer", fontWeight: "bold", fontSize: "13px" };