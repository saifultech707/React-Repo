import { useState, useEffect } from "react";
import { db } from "./firebase";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  getDoc,
  setDoc,
  addDoc,
  deleteDoc,
} from "firebase/firestore";

export default function ResultPage() {
  const [userRole] = useState(() => localStorage.getItem("userRole") || "user");

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  // --- New states for SSC Board Results ---
  const [sscData, setSscData] = useState([]);
  const [editingSscIndex, setEditingSscIndex] = useState(null);
  const [tempSscData, setTempSscData] = useState([]);
  const [editingTopStudent, setEditingTopStudent] = useState(null);

  const [expandedYears, setExpandedYears] = useState({});
  const toggleYear = (yearIndex) => {
    setExpandedYears((prev) => ({ ...prev, [yearIndex]: !prev[yearIndex] }));
  };

  useEffect(() => {
    setLoading(true);
    const unsub = onSnapshot(collection(db, "results"), (snapshot) => {
      const fetchedResults = snapshot.docs.map((d) => ({
        ...d.data(),
        id: d.id,
      }));
      setResults(fetchedResults);
      setLoading(false);
    });

    const fetchSscData = async () => {
      try {
        const sscSnap = await getDoc(doc(db, "settings", "aboutUsSSC"));
        if (sscSnap.exists() && sscSnap.data().data) {
          setSscData(sscSnap.data().data);
        }
      } catch (error) {
        console.error("Error fetching SSC data:", error);
      }
    };
    fetchSscData();

    return unsub; // Cleanup subscription on unmount
  }, []);

  const handleEditClick = (result) => {
    setIsAdding(false);
    setEditingId(result.id);
    setEditFormData(result);
    setIsEditModalOpen(true);
  };

  const handleSaveClick = async () => {
    const dataToSave = { ...editFormData };
    // Convert subject marks to numbers
    Object.keys(dataToSave).forEach((key) => {
      if (
        !["id", "name", "class", "roll", "group"].includes(key) &&
        dataToSave[key] !== "" &&
        dataToSave[key] !== null &&
        dataToSave[key] !== undefined
      ) {
        dataToSave[key] = Number(dataToSave[key]);
      }
    });
    delete dataToSave.id;

    try {
      if (isAdding) {
        await addDoc(collection(db, "results"), dataToSave);
        alert("Result added successfully!");
      } else {
        if (!editingId) return;
        const docRef = doc(db, "results", editingId);
        await updateDoc(docRef, dataToSave);
        alert("Result updated successfully!");
      }
      setIsEditModalOpen(false);
      setEditingId(null);
      setIsAdding(false);
    } catch (error) {
      console.error("Error saving result: ", error);
      alert("Failed to save result.");
    }
  };

  const handleCancelClick = () => {
    setIsEditModalOpen(false);
    setEditingId(null);
    setIsAdding(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  const handleAddNewResult = () => {
    setIsAdding(true);
    setEditFormData({
      name: "",
      roll: "",
      class: "Class 6",
      group: "Science",
      bangla: "",
      english: "",
      math: "",
      religion: "",
      bgs: "",
      ict: "",
      physics: "",
      chemistry: "",
      biology: "",
      history: "",
      civics: "",
      economics: "",
      accounting: "",
      finance: "",
      businessEnt: "",
    });
    setIsEditModalOpen(true);
  };

  const handleDeleteResult = async (id) => {
    if (window.confirm("Are you sure you want to delete this result?")) {
      try {
        await deleteDoc(doc(db, "results", id));
      } catch (error) {
        console.error("Error deleting result: ", error);
        alert("Failed to delete result.");
      }
    }
  };

  const handleSscChange = (yearIndex, field, value) => {
    const newData = [...tempSscData];
    newData[yearIndex][field] = value;
    setTempSscData(newData);
  };

  const handleTopStudentChange = (yearIndex, studentIndex, field, value) => {
    const newData = [...tempSscData];
    newData[yearIndex].topStudents[studentIndex][field] = value;
    setTempSscData(newData);
  };

  const addNewSscStudent = (yearIndex) => {
    const newData = [...tempSscData];
    newData[yearIndex].topStudents.push({
      name: "New Student",
      roll: "",
      group: "Science",
    });
    setTempSscData(newData);
  };

  const removeSscStudent = (yearIndex, studentIndex) => {
    const newData = [...tempSscData];
    newData[yearIndex].topStudents.splice(studentIndex, 1);
    setTempSscData(newData);
  };

  const handleAddNewYear = async () => {
    const newYear = {
      year: new Date().getFullYear(),
      passingRate: "100%",
      gpa5: "0",
      topStudents: [],
    };
    const updated = [newYear, ...sscData];
    try {
      await setDoc(doc(db, "settings", "aboutUsSSC"), { data: updated });
      setSscData(updated);
      alert("New Year added successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to add new year");
    }
  };

  const removeSscYear = async (yearIndex) => {
    if (
      window.confirm("Are you sure you want to remove this year's results?")
    ) {
      const newData = [...sscData];
      newData.splice(yearIndex, 1);
      try {
        await setDoc(doc(db, "settings", "aboutUsSSC"), { data: newData });
        setSscData(newData);
        alert("Year removed successfully!");
      } catch (err) {
        console.error(err);
        alert("Failed to remove year");
      }
    }
  };

  const saveSscData = async () => {
    try {
      // Convert subject marks to numbers for database integrity
      const dataToSave = tempSscData.map((year) => ({
        ...year,
        topStudents: year.topStudents.map((st) => {
          const cleanedStudent = { ...st };
          [
            "bangla",
            "english",
            "math",
            "physics",
            "chemistry",
            "biology",
            "religion",
            "bgs",
            "ict",
            "history",
            "civics",
            "economics",
            "accounting",
            "finance",
            "businessEnt",
          ].forEach((sub) => {
            if (
              cleanedStudent[sub] !== undefined &&
              cleanedStudent[sub] !== ""
            ) {
              cleanedStudent[sub] = Number(cleanedStudent[sub]);
            }
          });
          return cleanedStudent;
        }),
      }));
      await setDoc(doc(db, "settings", "aboutUsSSC"), { data: dataToSave });
      setSscData(dataToSave);
      setEditingSscIndex(null);
      alert("SSC Data saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to save SSC data");
    }
  };

  const getGPA = (marks) => {
    const m = Number(marks) || 0;
    if (m >= 80) return 5.0;
    if (m >= 70) return 4.0;
    if (m >= 60) return 3.5;
    if (m >= 50) return 3.0;
    if (m >= 40) return 2.0;
    if (m >= 33) return 1.0;
    return 0.0;
  };

  const calculateResult = (student) => {
    if (student.bangla === undefined && student.marks !== undefined) {
      return { cgpa: "N/A", grade: "N/A", totalMarks: student.marks };
    }

    const commonSubjects = [
      "bangla",
      "english",
      "math",
      "religion",
      "bgs",
      "ict",
    ];
    const groupSubjects = {
      Science: ["physics", "chemistry", "biology"],
      Arts: ["history", "civics", "economics"],
      Commerce: ["accounting", "finance", "businessEnt"],
    };

    const studentSubjects = [
      ...commonSubjects,
      ...(groupSubjects[student.group] || []),
    ];

    let totalGPA = 0;
    let failed = false;
    let subjectCount = 0;
    let totalMarks = 0;

    studentSubjects.forEach((sub) => {
      const marks = student[sub];
      if (marks !== undefined && marks !== null && marks !== "") {
        const m = Number(marks);
        totalMarks += m;
        const gpa = getGPA(m);
        if (gpa === 0) failed = true;
        totalGPA += gpa;
        subjectCount++;
      }
    });

    if (failed || subjectCount === 0)
      return { cgpa: "0.00", grade: "F", totalMarks };
    const cgpa = (totalGPA / subjectCount).toFixed(2);

    let grade = "F";
    if (cgpa >= 5.0) grade = "A+";
    else if (cgpa >= 4.0) grade = "A";
    else if (cgpa >= 3.5) grade = "A-";
    else if (cgpa >= 3.0) grade = "B";
    else if (cgpa >= 2.0) grade = "C";
    else if (cgpa >= 1.0) grade = "D";
    return { cgpa, grade, totalMarks };
  };

  // Get unique classes from results array and sort them based on the numeric value
  const uniqueClasses = [...new Set(results.map((r) => r.class))].sort(
    (a, b) => {
      const classA = parseInt(String(a || "").replace(/\D/g, "")) || 0;
      const classB = parseInt(String(b || "").replace(/\D/g, "")) || 0;
      return classA - classB;
    },
  );

  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        Loading Results...
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "40px",
        maxWidth: "1200px",
        margin: "0 auto",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <h2 style={{ color: "#103741", margin: 0 }}>Student Results Sheet</h2>
        {userRole === "admin" && (
          <div
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                background: "#FE5D37",
                color: "white",
                padding: "8px 16px",
                borderRadius: "20px",
                fontSize: "14px",
                fontWeight: "bold",
              }}
            >
              Admin Mode Active
            </div>
            <button
              onClick={handleAddNewResult}
              style={{
                ...editBtnStyle,
                background: "#3b82f6",
                padding: "8px 16px",
              }}
            >
              + Add Student Result
            </button>
          </div>
        )}
      </div>

      {uniqueClasses.length === 0 && (
        <p style={{ color: "#666" }}>No internal exam results found.</p>
      )}
      {uniqueClasses.map((className) => (
        <div key={className} style={{ marginBottom: "40px" }}>
          <h3
            style={{
              color: "#FE5D37",
              borderBottom: "2px solid #103741",
              paddingBottom: "10px",
              marginBottom: "20px",
            }}
          >
            {className}
          </h3>
          <div
            style={{
              overflowX: "auto",
              borderRadius: "10px",
              boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                background: "#fff",
                minWidth: "1000px",
              }}
            >
              <thead>
                <tr
                  style={{
                    background: "#103741",
                    color: "white",
                    textAlign: "left",
                  }}
                >
                  <th
                    style={{
                      padding: "15px",
                      borderBottom: "2px solid #FE5D37",
                    }}
                  >
                    Roll
                  </th>
                  <th
                    style={{
                      padding: "15px",
                      borderBottom: "2px solid #FE5D37",
                    }}
                  >
                    Name
                  </th>
                  <th
                    style={{
                      padding: "15px",
                      borderBottom: "2px solid #FE5D37",
                    }}
                  >
                    Class
                  </th>
                  <th
                    style={{
                      padding: "15px",
                      borderBottom: "2px solid #FE5D37",
                    }}
                  >
                    Group
                  </th>
                  <th
                    style={{
                      padding: "15px",
                      borderBottom: "2px solid #FE5D37",
                    }}
                  >
                    Ben
                  </th>
                  <th
                    style={{
                      padding: "15px",
                      borderBottom: "2px solid #FE5D37",
                    }}
                  >
                    Eng
                  </th>
                  <th
                    style={{
                      padding: "15px",
                      borderBottom: "2px solid #FE5D37",
                    }}
                  >
                    Math
                  </th>
                  <th
                    style={{
                      padding: "15px",
                      borderBottom: "2px solid #FE5D37",
                    }}
                  >
                    Phy
                  </th>
                  <th
                    style={{
                      padding: "15px",
                      borderBottom: "2px solid #FE5D37",
                    }}
                  >
                    Chem
                  </th>
                  <th
                    style={{
                      padding: "15px",
                      borderBottom: "2px solid #FE5D37",
                    }}
                  >
                    Bio
                  </th>
                  {/* Arts Subjects */}
                  <th
                    style={{
                      padding: "15px",
                      borderBottom: "2px solid #FE5D37",
                    }}
                  >
                    His
                  </th>
                  <th
                    style={{
                      padding: "15px",
                      borderBottom: "2px solid #FE5D37",
                    }}
                  >
                    Civ
                  </th>
                  <th
                    style={{
                      padding: "15px",
                      borderBottom: "2px solid #FE5D37",
                    }}
                  >
                    Eco
                  </th>
                  {/* Commerce Subjects */}
                  <th
                    style={{
                      padding: "15px",
                      borderBottom: "2px solid #FE5D37",
                    }}
                  >
                    Acc
                  </th>
                  <th
                    style={{
                      padding: "15px",
                      borderBottom: "2px solid #FE5D37",
                    }}
                  >
                    Fin
                  </th>
                  <th
                    style={{
                      padding: "15px",
                      borderBottom: "2px solid #FE5D37",
                      minWidth: "70px",
                    }}
                  >
                    Bus.Ent
                  </th>
                  <th
                    style={{
                      padding: "15px",
                      borderBottom: "2px solid #FE5D37",
                    }}
                  >
                    Rel
                  </th>
                  <th
                    style={{
                      padding: "15px",
                      borderBottom: "2px solid #FE5D37",
                    }}
                  >
                    BGS
                  </th>
                  <th
                    style={{
                      padding: "15px",
                      borderBottom: "2px solid #FE5D37",
                    }}
                  >
                    ICT
                  </th>
                  <th
                    style={{
                      padding: "15px",
                      borderBottom: "2px solid #FE5D37",
                    }}
                  >
                    CGPA
                  </th>
                  <th
                    style={{
                      padding: "15px",
                      borderBottom: "2px solid #FE5D37",
                    }}
                  >
                    Grade
                  </th>
                  {userRole === "admin" && (
                    <th
                      style={{
                        padding: "15px",
                        borderBottom: "2px solid #FE5D37",
                        textAlign: "center",
                      }}
                    >
                      Action
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {results
                  .filter((r) => r.class === className)
                  .map((result) => {
                    const { cgpa, grade } = calculateResult(result);
                    return (
                      <tr
                        key={result.id}
                        style={{
                          borderBottom: "1px solid #eee",
                          transition: "background 0.3s",
                          cursor: "default",
                        }}
                        onMouseOver={(e) =>
                          (e.currentTarget.style.background = "#f9f9f9")
                        }
                        onMouseOut={(e) =>
                          (e.currentTarget.style.background = "transparent")
                        }
                      >
                        <td style={{ padding: "15px", color: "#555" }}>
                          {result.roll}
                        </td>
                        <td
                          style={{
                            padding: "15px",
                            fontWeight: "500",
                            color: "#333",
                          }}
                        >
                          {result.name}
                        </td>
                        <td style={{ padding: "15px", color: "#555" }}>
                          {result.class}
                        </td>
                        <td style={{ padding: "15px", color: "#555" }}>
                          {result.group}
                        </td>
                        <td style={{ padding: "15px", color: "#555" }}>
                          {result.bangla}
                        </td>
                        <td style={{ padding: "15px", color: "#555" }}>
                          {result.english}
                        </td>
                        <td style={{ padding: "15px", color: "#555" }}>
                          {result.math}
                        </td>
                        <td style={{ padding: "15px", color: "#555" }}>
                          {result.physics}
                        </td>
                        <td style={{ padding: "15px", color: "#555" }}>
                          {result.chemistry}
                        </td>
                        <td style={{ padding: "15px", color: "#555" }}>
                          {result.biology}
                        </td>
                        <td style={{ padding: "15px", color: "#555" }}>
                          {result.religion}
                        </td>
                        <td style={{ padding: "15px", color: "#555" }}>
                          {result.bgs}
                        </td>
                        <td style={{ padding: "15px", color: "#555" }}>
                          {result.history || "-"}
                        </td>
                        <td style={{ padding: "15px", color: "#555" }}>
                          {result.civics || "-"}
                        </td>
                        <td style={{ padding: "15px", color: "#555" }}>
                          {result.economics || "-"}
                        </td>
                        <td style={{ padding: "15px", color: "#555" }}>
                          {result.accounting || "-"}
                        </td>
                        <td style={{ padding: "15px", color: "#555" }}>
                          {result.finance || "-"}
                        </td>
                        <td style={{ padding: "15px", color: "#555" }}>
                          {result.businessEnt || "-"}
                        </td>
                        <td style={{ padding: "15px", color: "#555" }}>
                          {result.ict}
                        </td>
                        <td
                          style={{
                            padding: "15px",
                            fontWeight: "bold",
                            color: "#10b981",
                          }}
                        >
                          {cgpa}
                        </td>
                        <td
                          style={{
                            padding: "15px",
                            fontWeight: "bold",
                            color: grade.includes("A") ? "#10b981" : "#FE5D37",
                          }}
                        >
                          {grade}
                        </td>
                        {userRole === "admin" && (
                          <td
                            style={{
                              padding: "15px",
                              textAlign: "center",
                              minWidth: "120px",
                            }}
                          >
                            <button
                              onClick={() => handleEditClick(result)}
                              style={editBtnStyle}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteResult(result.id)}
                              style={{
                                ...editBtnStyle,
                                background: "#ef4444",
                                marginLeft: "5px",
                              }}
                            >
                              Delete
                            </button>
                          </td>
                        )}
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {/* Internal Exam Edit Modal */}
      {isEditModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={handleCancelClick}
        >
          <div
            style={{
              background: "white",
              padding: "30px",
              borderRadius: "15px",
              maxWidth: "750px",
              width: "90%",
              maxHeight: "90vh",
              overflowY: "auto",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              style={{
                color: "#103741",
                marginTop: 0,
                borderBottom: "2px solid #eee",
                paddingBottom: "15px",
              }}
            >
              {isAdding ? "Add Student Result" : "Edit Student Result"}
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
                marginBottom: "20px",
              }}
            >
              <div>
                <label style={labelStyle}>Student Name</label>
                <input
                  type="text"
                  name="name"
                  value={editFormData.name || ""}
                  onChange={handleChange}
                  style={{ ...inputStyle, textAlign: "left" }}
                />
              </div>
              <div>
                <label style={labelStyle}>Roll Number</label>
                <input
                  type="text"
                  name="roll"
                  value={editFormData.roll || ""}
                  onChange={handleChange}
                  style={{ ...inputStyle, textAlign: "left" }}
                />
              </div>
              <div>
                <label style={labelStyle}>Class</label>
                <select
                  name="class"
                  value={editFormData.class || "Class 6"}
                  onChange={handleChange}
                  style={{ ...inputStyle, textAlign: "left" }}
                >
                  {["Class 6", "Class 7", "Class 8", "Class 9", "Class 10"].map(
                    (cls) => (
                      <option key={cls} value={cls}>
                        {cls}
                      </option>
                    ),
                  )}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Group</label>
                <select
                  name="group"
                  value={editFormData.group || "Science"}
                  onChange={handleChange}
                  style={{ ...inputStyle, textAlign: "left" }}
                >
                  <option value="Science">Science</option>
                  <option value="Arts">Arts</option>
                  <option value="Commerce">Commerce</option>
                </select>
              </div>
            </div>

            <h4
              style={{
                color: "#FE5D37",
                borderBottom: "2px solid #eee",
                paddingBottom: "5px",
                marginBottom: "15px",
              }}
            >
              Subject Marks
            </h4>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
                gap: "15px",
              }}
            >
              {["bangla", "english", "math", "religion", "bgs", "ict"].map(
                (sub) => (
                  <div key={sub}>
                    <label
                      style={{ ...labelStyle, textTransform: "capitalize" }}
                    >
                      {sub}
                    </label>
                    <input
                      type="number"
                      name={sub}
                      value={editFormData[sub] || ""}
                      onChange={handleChange}
                      style={{ ...inputStyle, textAlign: "left" }}
                    />
                  </div>
                ),
              )}

              {/* Group specific subjects */}
              {(editFormData.group === "Science" || !editFormData.group) &&
                ["physics", "chemistry", "biology"].map((sub) => (
                  <div key={sub}>
                    <label
                      style={{ ...labelStyle, textTransform: "capitalize" }}
                    >
                      {sub}
                    </label>
                    <input
                      type="number"
                      name={sub}
                      value={editFormData[sub] || ""}
                      onChange={handleChange}
                      style={{ ...inputStyle, textAlign: "left" }}
                    />
                  </div>
                ))}
              {editFormData.group === "Arts" &&
                ["history", "civics", "economics"].map((sub) => (
                  <div key={sub}>
                    <label
                      style={{ ...labelStyle, textTransform: "capitalize" }}
                    >
                      {sub}
                    </label>
                    <input
                      type="number"
                      name={sub}
                      value={editFormData[sub] || ""}
                      onChange={handleChange}
                      style={{ ...inputStyle, textAlign: "left" }}
                    />
                  </div>
                ))}
              {editFormData.group === "Commerce" &&
                ["accounting", "finance", "businessEnt"].map((sub) => (
                  <div key={sub}>
                    <label
                      style={{
                        ...labelStyle,
                        textTransform: "capitalize",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {sub === "businessEnt" ? "Bus. Ent." : sub}
                    </label>
                    <input
                      type="number"
                      name={sub}
                      value={editFormData[sub] || ""}
                      onChange={handleChange}
                      style={{ ...inputStyle, textAlign: "left" }}
                    />
                  </div>
                ))}
            </div>

            <div
              style={{
                display: "flex",
                gap: "10px",
                marginTop: "30px",
                borderTop: "1px solid #eee",
                paddingTop: "20px",
                justifyContent: "flex-end",
              }}
            >
              <button onClick={handleCancelClick} style={cancelBtnStyle}>
                Cancel
              </button>
              <button onClick={handleSaveClick} style={saveBtnStyle}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SSC Board Results Section */}
      <div style={{ marginTop: "60px", marginBottom: "60px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
            flexWrap: "wrap",
            gap: "10px",
          }}
        >
          <h2
            style={{
              color: "#103741",
              borderLeft: "5px solid #FE5D37",
              paddingLeft: "15px",
              margin: 0,
            }}
          >
            SSC Board Results
          </h2>
          {userRole === "admin" && (
            <button
              onClick={handleAddNewYear}
              style={{ ...editBtnStyle, background: "#3b82f6" }}
            >
              + Add New Year
            </button>
          )}
        </div>

        <div>
          {sscData.length === 0 && (
            <p style={{ color: "#666" }}>No SSC data available.</p>
          )}
          {sscData.map((yearData, i) => (
            <div
              key={i}
              style={{
                marginBottom: "20px",
                border: "1px solid #eee",
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 4px 15px rgba(0,0,0,0.03)",
              }}
            >
              <div
                onClick={() => toggleYear(i)}
                style={{
                  background: "#103741",
                  color: "white",
                  padding: "20px",
                  display: "flex",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "15px",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <span style={{ fontSize: "14px" }}>
                    {expandedYears[i] ? "▼" : "▶"}
                  </span>
                  <h3 style={{ margin: 0, fontSize: "18px" }}>
                    📅 Year: {yearData.year}
                  </h3>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "15px",
                    flexWrap: "wrap",
                    alignItems: "center",
                  }}
                >
                  <h3 style={{ margin: 0, color: "#FE5D37", fontSize: "16px" }}>
                    📈 Passing Rate: {yearData.passingRate}
                  </h3>
                  <h3 style={{ margin: 0, fontSize: "16px" }}>
                    🏆 GPA 5.00: {yearData.gpa5}
                  </h3>
                  {userRole === "admin" && editingSscIndex !== i && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setTempSscData(JSON.parse(JSON.stringify(sscData)));
                        setEditingSscIndex(i);
                        setExpandedYears((prev) => ({ ...prev, [i]: true }));
                      }}
                      style={editBtnStyle}
                    >
                      ✏️ Edit
                    </button>
                  )}
                  {userRole === "admin" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeSscYear(i);
                      }}
                      style={{ ...editBtnStyle, background: "#ef4444" }}
                    >
                      🗑️ Delete Year
                    </button>
                  )}
                </div>
              </div>

              {(expandedYears[i] || editingSscIndex === i) &&
                (editingSscIndex === i ? (
                  <div style={{ padding: "20px", background: "#f8fafc" }}>
                    <div
                      style={{
                        display: "flex",
                        gap: "15px",
                        marginBottom: "20px",
                        flexWrap: "wrap",
                      }}
                    >
                      <div style={{ flex: "1 1 150px" }}>
                        <label style={labelStyle}>Year</label>
                        <input
                          type="number"
                          value={tempSscData[i].year}
                          onChange={(e) =>
                            handleSscChange(i, "year", e.target.value)
                          }
                          style={inputStyle}
                        />
                      </div>
                      <div style={{ flex: "1 1 150px" }}>
                        <label style={labelStyle}>Passing Rate</label>
                        <input
                          type="text"
                          value={tempSscData[i].passingRate}
                          onChange={(e) =>
                            handleSscChange(i, "passingRate", e.target.value)
                          }
                          style={inputStyle}
                        />
                      </div>
                      <div style={{ flex: "1 1 150px" }}>
                        <label style={labelStyle}>GPA 5.00 Count</label>
                        <input
                          type="text"
                          value={tempSscData[i].gpa5}
                          onChange={(e) =>
                            handleSscChange(i, "gpa5", e.target.value)
                          }
                          style={inputStyle}
                        />
                      </div>
                    </div>

                    <h4
                      style={{
                        color: "#103741",
                        marginBottom: "10px",
                        marginTop: "10px",
                      }}
                    >
                      All Students
                    </h4>
                    <div style={{ display: "grid", gap: "10px" }}>
                      {tempSscData[i].topStudents.map(
                        (student, studentIndex) => {
                          const { cgpa, totalMarks } = calculateResult(student);
                          return (
                            <div
                              key={studentIndex}
                              style={{
                                display: "flex",
                                gap: "10px",
                                alignItems: "center",
                                background: "#fff",
                                padding: "10px",
                                borderRadius: "8px",
                                border: "1px solid #ddd",
                                flexWrap: "wrap",
                              }}
                            >
                              <span
                                style={{
                                  fontWeight: "bold",
                                  width: "30px",
                                  color: "#FE5D37",
                                }}
                              >
                                #{studentIndex + 1}
                              </span>
                              <input
                                type="text"
                                placeholder="Name"
                                value={student.name}
                                onChange={(e) =>
                                  handleTopStudentChange(
                                    i,
                                    studentIndex,
                                    "name",
                                    e.target.value,
                                  )
                                }
                                style={{ ...inputStyle, flex: 2 }}
                              />
                              <input
                                type="text"
                                placeholder="Roll"
                                value={student.roll || ""}
                                onChange={(e) =>
                                  handleTopStudentChange(
                                    i,
                                    studentIndex,
                                    "roll",
                                    e.target.value,
                                  )
                                }
                                style={{ ...inputStyle, flex: 1 }}
                              />
                              <div
                                style={{
                                  flex: 1,
                                  fontSize: "13px",
                                  color: "#555",
                                  textAlign: "center",
                                  minWidth: "120px",
                                }}
                              >
                                <strong>Marks:</strong> {totalMarks} <br />{" "}
                                <strong>CGPA:</strong> {cgpa}
                              </div>
                              <button
                                onClick={() =>
                                  setEditingTopStudent({
                                    yearIndex: i,
                                    studentIndex,
                                  })
                                }
                                style={{
                                  ...editBtnStyle,
                                  padding: "8px 12px",
                                  background: "#3b82f6",
                                }}
                              >
                                📝 Details
                              </button>
                              <button
                                onClick={() =>
                                  removeSscStudent(i, studentIndex)
                                }
                                style={{
                                  ...editBtnStyle,
                                  padding: "8px 12px",
                                  background: "#ef4444",
                                }}
                              >
                                ❌
                              </button>
                            </div>
                          );
                        },
                      )}
                    </div>

                    <button
                      onClick={() => addNewSscStudent(i)}
                      style={{
                        ...editBtnStyle,
                        background: "#3b82f6",
                        marginTop: "15px",
                        padding: "10px 15px",
                      }}
                    >
                      + Add Student
                    </button>

                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        marginTop: "20px",
                        borderTop: "1px solid #eee",
                        paddingTop: "15px",
                      }}
                    >
                      <button onClick={saveSscData} style={saveBtnStyle}>
                        Save Changes
                      </button>
                      <button
                        onClick={() => setEditingSscIndex(null)}
                        style={cancelBtnStyle}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ overflowX: "auto" }}>
                    <table
                      style={{
                        width: "100%",
                        borderCollapse: "collapse",
                      }}
                    >
                      <thead>
                        <tr>
                          <th style={thStyle}>Rank</th>
                          <th style={thStyle}>Roll</th>
                          <th style={thStyle}>Student Name</th>
                          <th style={thStyle}>Group</th>
                          <th style={thStyle}>Total Marks</th>
                          <th style={thStyle}>CGPA</th>
                        </tr>
                      </thead>
                      <tbody>
                        {yearData.topStudents.map((s, idx) => {
                          const { cgpa, totalMarks } = calculateResult(s);
                          return (
                            <tr
                              key={idx}
                              style={{
                                borderBottom: "1px solid #eee",
                                background: idx % 2 === 0 ? "white" : "#fafafa",
                              }}
                            >
                              <td
                                style={{
                                  ...tdStyle,
                                  fontWeight: "bold",
                                  color: "#FE5D37",
                                }}
                              >
                                #{idx + 1}
                              </td>
                              <td style={tdStyle}>{s.roll || "-"}</td>
                              <td
                                style={{
                                  ...tdStyle,
                                  fontWeight: "500",
                                  textAlign: "left",
                                }}
                              >
                                {s.name}
                              </td>
                              <td style={tdStyle}>{s.group || "Science"}</td>
                              <td style={{ ...tdStyle, fontWeight: "bold" }}>
                                {totalMarks}
                              </td>
                              <td
                                style={{
                                  ...tdStyle,
                                  fontWeight: "bold",
                                  color: "#10b981",
                                }}
                              >
                                {cgpa}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>

      {/* Edit SSC Student Details Modal */}
      {editingTopStudent &&
        tempSscData[editingTopStudent.yearIndex] &&
        tempSscData[editingTopStudent.yearIndex].topStudents[
          editingTopStudent.studentIndex
        ] && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "rgba(0,0,0,0.6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
            }}
            onClick={() => setEditingTopStudent(null)}
          >
            <div
              style={{
                background: "white",
                padding: "30px",
                borderRadius: "15px",
                maxWidth: "650px",
                width: "90%",
                maxHeight: "90vh",
                overflowY: "auto",
                position: "relative",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 style={{ color: "#103741", marginTop: 0 }}>
                Edit Student Details
              </h2>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "15px",
                  marginBottom: "20px",
                }}
              >
                <div>
                  <label style={labelStyle}>Roll Number</label>
                  <input
                    type="text"
                    value={
                      tempSscData[editingTopStudent.yearIndex].topStudents[
                        editingTopStudent.studentIndex
                      ].roll || ""
                    }
                    onChange={(e) =>
                      handleTopStudentChange(
                        editingTopStudent.yearIndex,
                        editingTopStudent.studentIndex,
                        "roll",
                        e.target.value,
                      )
                    }
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Group</label>
                  <select
                    value={
                      tempSscData[editingTopStudent.yearIndex].topStudents[
                        editingTopStudent.studentIndex
                      ].group || "Science"
                    }
                    onChange={(e) =>
                      handleTopStudentChange(
                        editingTopStudent.yearIndex,
                        editingTopStudent.studentIndex,
                        "group",
                        e.target.value,
                      )
                    }
                    style={inputStyle}
                  >
                    <option value="Science">Science</option>
                    <option value="Arts">Arts</option>
                    <option value="Commerce">Commerce</option>
                  </select>
                </div>
              </div>

              <h4
                style={{
                  color: "#FE5D37",
                  borderBottom: "2px solid #eee",
                  paddingBottom: "5px",
                  marginBottom: "15px",
                }}
              >
                Subject Marks
              </h4>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
                  gap: "15px",
                }}
              >
                {["bangla", "english", "math", "religion", "bgs", "ict"].map(
                  (sub) => (
                    <div key={sub}>
                      <label
                        style={{ ...labelStyle, textTransform: "capitalize" }}
                      >
                        {sub}
                      </label>
                      <input
                        type="number"
                        value={
                          tempSscData[editingTopStudent.yearIndex].topStudents[
                            editingTopStudent.studentIndex
                          ][sub] || ""
                        }
                        onChange={(e) =>
                          handleTopStudentChange(
                            editingTopStudent.yearIndex,
                            editingTopStudent.studentIndex,
                            sub,
                            e.target.value,
                          )
                        }
                        style={inputStyle}
                      />
                    </div>
                  ),
                )}

                {/* Group specific subjects */}
                {(tempSscData[editingTopStudent.yearIndex].topStudents[
                  editingTopStudent.studentIndex
                ].group === "Science" ||
                  !tempSscData[editingTopStudent.yearIndex].topStudents[
                    editingTopStudent.studentIndex
                  ].group) &&
                  ["physics", "chemistry", "biology"].map((sub) => (
                    <div key={sub}>
                      <label
                        style={{ ...labelStyle, textTransform: "capitalize" }}
                      >
                        {sub}
                      </label>
                      <input
                        type="number"
                        value={
                          tempSscData[editingTopStudent.yearIndex].topStudents[
                            editingTopStudent.studentIndex
                          ][sub] || ""
                        }
                        onChange={(e) =>
                          handleTopStudentChange(
                            editingTopStudent.yearIndex,
                            editingTopStudent.studentIndex,
                            sub,
                            e.target.value,
                          )
                        }
                        style={inputStyle}
                      />
                    </div>
                  ))}
                {tempSscData[editingTopStudent.yearIndex].topStudents[
                  editingTopStudent.studentIndex
                ].group === "Arts" &&
                  ["history", "civics", "economics"].map((sub) => (
                    <div key={sub}>
                      <label
                        style={{ ...labelStyle, textTransform: "capitalize" }}
                      >
                        {sub}
                      </label>
                      <input
                        type="number"
                        value={
                          tempSscData[editingTopStudent.yearIndex].topStudents[
                            editingTopStudent.studentIndex
                          ][sub] || ""
                        }
                        onChange={(e) =>
                          handleTopStudentChange(
                            editingTopStudent.yearIndex,
                            editingTopStudent.studentIndex,
                            sub,
                            e.target.value,
                          )
                        }
                        style={inputStyle}
                      />
                    </div>
                  ))}
                {tempSscData[editingTopStudent.yearIndex].topStudents[
                  editingTopStudent.studentIndex
                ].group === "Commerce" &&
                  ["accounting", "finance", "businessEnt"].map((sub) => (
                    <div key={sub}>
                      <label
                        style={{
                          ...labelStyle,
                          textTransform: "capitalize",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {sub === "businessEnt" ? "Bus. Ent." : sub}
                      </label>
                      <input
                        type="number"
                        value={
                          tempSscData[editingTopStudent.yearIndex].topStudents[
                            editingTopStudent.studentIndex
                          ][sub] || ""
                        }
                        onChange={(e) =>
                          handleTopStudentChange(
                            editingTopStudent.yearIndex,
                            editingTopStudent.studentIndex,
                            sub,
                            e.target.value,
                          )
                        }
                        style={inputStyle}
                      />
                    </div>
                  ))}
              </div>

              <button
                onClick={() => setEditingTopStudent(null)}
                style={{
                  ...saveBtnStyle,
                  marginTop: "25px",
                  width: "100%",
                  padding: "12px",
                  fontSize: "16px",
                }}
              >
                Close & Keep Editing Year
              </button>
            </div>
          </div>
        )}
    </div>
  );
}

const inputStyle = {
  width: "100%",
  minWidth: "50px",
  padding: "8px 4px",
  boxSizing: "border-box",
  borderRadius: "4px",
  border: "1px solid #ccc",
  outline: "none",
  fontFamily: "inherit",
  textAlign: "left",
};
const thStyle = {
  padding: "8px 10px",
  border: "1px solid #ddd",
  background: "#103741",
  color: "white",
  fontWeight: "600",
  fontSize: "13px",
  textAlign: "center",
  whiteSpace: "nowrap",
};
const tdStyle = {
  padding: "6px 8px",
  border: "1px solid #ddd",
  fontSize: "13px",
  textAlign: "center",
  color: "#333",
};
const labelStyle = {
  display: "block",
  fontSize: "13px",
  fontWeight: "bold",
  color: "#555",
  marginBottom: "5px",
};
const editBtnStyle = {
  background: "#FE5D37",
  color: "white",
  border: "none",
  padding: "6px 15px",
  borderRadius: "20px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "13px",
};
const saveBtnStyle = {
  background: "#10b981",
  color: "white",
  border: "none",
  padding: "10px 20px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "14px",
};
const cancelBtnStyle = {
  background: "#ef4444",
  color: "white",
  border: "none",
  padding: "10px 20px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "14px",
};
